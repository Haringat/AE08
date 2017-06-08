import {IColumnMetadata, IColumnModel, IModel, ITableMetadata, ITableModel, ModelTable} from "./Model";
import "reflect-metadata";
import Connection from "./adapters/Adapter";

export enum ChangeType {
    INSERT,
    UPDATE,
    DELETE
}

export interface IInsertion {
    values: Array<{
        column: string;
        value: any;
    }>
}

export interface IUpdate extends IBaseChange {
    set: Array<{
        column: string;
        value: any;
    }>;
}

export interface IDeletion extends IBaseChange {
}

export interface IBaseChange {
    where: Array<{
        column: string;
        value: any;
    }>;
}

export interface IChange {
    table: string;
    type: ChangeType;
    change: IUpdate | IDeletion | IInsertion;
}

export const tableMetadataKey: string = "AE08.database.table";
export const datasetMetadataKey: string = "AE08.database.datasets";

export interface IExtendedColumnModel extends IColumnModel {
    propertyName: string;
}

export class TableModel<T extends IModel> implements ITableModel {

    private static _tables: Array<Function> = [];

    private static _adapter: Connection;

    public static set adapter(v: Connection) {
        if (this._adapter) {
            throw new Error("adapter was already set.");
        }
        this._adapter = v;
    }

    public name: string;
    public columns: Array<IExtendedColumnModel> = [];
    public static stack: Array<IChange> = [];
    public primaryKey: Array<string> = [];

    verify(model: T) {
        const prototype = Object.getPrototypeOf(model);
        Object.getOwnPropertyNames(prototype)
            .filter(propertyName => typeof prototype[propertyName] !== "function")
            .every(propertyName => {
                const columnMetadata = this.columns.find(column => column.propertyName === propertyName);
                switch (columnMetadata.type) {
                    case DataType.BLOB:
                    case DataType.CHAR:
                    case DataType.VARCHAR:
                        return typeof model[propertyName] === "string" && (!columnMetadata.hasOwnProperty("size") || model[propertyName].length <= columnMetadata.size);
                    case DataType.UUID:
                        return typeof model[propertyName] === "string" && /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(model[propertyName]);
                    case DataType.BOOLEAN:
                        return typeof model[propertyName] === "boolean";
                    case DataType.REAL:
                    case DataType.INT:
                        const size = columnMetadata.size || 4;
                        return typeof model[propertyName] === "number" && (size === 1 && model[propertyName] >= 0 && model[propertyName] < 255 || model[propertyName] < (8 ** size) / 2 && model[propertyName] >= -(8 ** size) / 2);
                    case DataType.FLOAT:
                    case DataType.DOUBLE:
                        return typeof model[propertyName] === "number";
                    case DataType.DATE:
                        return model[propertyName] instanceof Date;
                }
            });
    }

    addColumn(opts: {target: Object, metadata: IColumnMetadata, propertyKey: string}) {
        let tableModel = this;
        this.columns.push({
            name: opts.metadata.columnName,
            type: opts.metadata.type,
            primaryKey: opts.metadata.primaryKey,
            columnName: opts.metadata.columnName,
            size: opts.metadata.size,
            propertyName: opts.propertyKey,
            foreignKey: !!opts.metadata.references,
            references: opts.metadata.references
        })
        const generateUpdate: (model: IModel, updateColumn: string, updateValue: any) => IChange = (model, updateColumn, updateValue) => {
            let currentValues = this.columns.map(c => {
                return {
                    column: c.propertyName,
                    value: model[c.propertyName]
                }
            });
            return <IChange> {
                table: this.name,
                type: ChangeType.UPDATE,
                change: <IUpdate> {
                    where: currentValues,
                    set: [{
                        value: updateValue,
                        column: updateColumn
                    }]
                }
            }
        };
        switch (opts.metadata.type) {
            case DataType.BLOB:
            case DataType.CHAR:
            case DataType.VARCHAR:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: string) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        if (opts.metadata.hasOwnProperty("size")) {
                            if (v.length <= opts.metadata.size) {
                                this["_" + opts.propertyKey] = v;
                            } else {
                                throw new Error(`Field value for field ${opts.propertyKey} too large. Max size is ${opts.metadata.size} characters.`);
                            }
                        } else {
                            this["_" + opts.propertyKey] = v;
                        }
                        TableModel.stack.push(change);
                    }
                });
                break;
            case DataType.UUID:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: string) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        if (/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(v)) {
                            this["_" + opts.propertyKey] = v;
                        } else {
                            throw new Error(`value for UUID field ${opts.propertyKey} does not match UUID pattern.`);
                        }
                        TableModel.stack.push(change);
                    }
                });
                break;
            case DataType.BOOLEAN:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: boolean) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        this["_" + opts.propertyKey] = v;
                        TableModel.stack.push(change);
                    }
                });
                break;
            case DataType.REAL:
            case DataType.INT:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: number) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        if (!opts.metadata.hasOwnProperty("size")) {
                            opts.metadata.size = 4;
                        } else if (opts.metadata.size === 1) {
                            if (v >= 0 && v < 256) {
                                this["_" + opts.propertyKey] = v;
                            } else {
                                throw new Error(`Value for INT field ${opts.propertyKey} does not fit into 1 byte.`);
                            }
                        }
                        if (v < (8 ** opts.metadata.size) / 2 && v >= -(8 ** opts.metadata.size) / 2) {
                            this["_" + opts.propertyKey] = v;
                        } else {
                            throw new Error(`Value for INT field ${opts.propertyKey} does not fit into ${opts.metadata.size} bytes.`);
                        }
                        TableModel.stack.push(change);
                    }
                });
                break;
            case DataType.FLOAT:
            case DataType.DOUBLE:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: number) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        this["_" + opts.propertyKey] = v;
                        TableModel.stack.push(change);
                    }
                });
                break;
            case DataType.DATE:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: Date | string) {
                        const change = generateUpdate(this, opts.propertyKey, v);
                        if (typeof v === "string") {
                            let date = Date.parse(v);
                            if (Number.isNaN(date)) {
                                throw new Error(`Value for DATE field ${opts.propertyKey} must be a date object or a serialized date object.`);
                            }
                            this["_" + opts.propertyKey] = new Date(date);
                        } else if (v instanceof Date) {
                            this["_" + opts.propertyKey] = v;
                        } else {
                            throw new Error(`Value for DATE field ${opts.propertyKey} must be a date object or a serialized date object.`);
                        }
                        TableModel.stack.push(change);
                    }
                });
                break;
        }
    }

    public static registerTable(modelTable: Function) {
        this._tables.push(modelTable);
    }

    public static async getModelData() {
        await this._adapter.validateModel(this._tables.map(table => {
            return Reflect.getOwnMetadata(tableMetadataKey, table.prototype);
        }));
        const modelData = await this._adapter.getAll(this._tables.map(table => {
            return Reflect.getOwnMetadata(tableMetadataKey, table.prototype);
        }));
        modelData.forEach(modelTable => {
            const table: typeof ModelTable = <typeof ModelTable> this._tables.find(table => {
                return (<TableModel<any>> Reflect.getOwnMetadata(tableMetadataKey, table.prototype)).name === modelTable.name;
            });
            const tableRows = modelTable.values.map((row) => {
                return table.deserialize(row);
            });
            Reflect.defineMetadata(datasetMetadataKey, tableRows, table.prototype);
        });
    }

    public static async commit() {
        try {
            await this._adapter.commitChanges(this.stack);
        } catch (e) {
            await this.rollback(this.stack);
        } finally {
            this.stack = [];
        }
    }

    public static async rollback(changes: Array<IChange>) {
        changes.reverse().forEach(change => {
            const table: typeof ModelTable = <typeof ModelTable> this._tables.find(table => {
                return (<TableModel<any>> Reflect.getOwnMetadata(tableMetadataKey, table.prototype)).name === change.table;
            });
            switch (change.type) {
                case ChangeType.UPDATE:
                    const update: IUpdate = <IUpdate> change.change;
                    let dataSet = table.getDataSet(update.set);
                    update.where.map(set => {
                        return set.column;
                    }).forEach(column => {
                        dataSet[column] = update.where[column];
                    });
                    break;
                case ChangeType.INSERT:
                    const insertion: IInsertion = <IInsertion> change.change;

            }
        })
    }
}

export enum DataType {
    CHAR,
    VARCHAR,
    UUID,
    DATE,
    INT,
    BOOLEAN,
    BLOB,
    FLOAT,
    DOUBLE,
    REAL
}

export function Table(metadata: ITableMetadata): ClassDecorator {
    return function (tableClass: typeof TableModel) {
        let tableModel: TableModel<IModel> = Reflect.hasOwnMetadata(tableMetadataKey, tableClass.prototype) ? Reflect.getOwnMetadata(tableMetadataKey, tableClass.prototype) : new TableModel();
        tableModel.name = metadata.name || tableClass.prototype.constructor.name;
        Reflect.defineMetadata(tableMetadataKey, tableModel, tableClass.prototype);
        TableModel.registerTable(tableClass);
    };
}

export function Column(metadata: IColumnMetadata): PropertyDecorator {
    return function (target: IModel, propertyKey: string) {
        let tableModel: TableModel<typeof target> = Reflect.hasOwnMetadata(tableMetadataKey, target) ? Reflect.getOwnMetadata(tableMetadataKey, target) : new TableModel<typeof target>();
        console.log(`pushing on top of ${tableModel.columns.length} columns`);
        if (metadata.primaryKey === true) {
            tableModel.primaryKey.push(propertyKey);
        }
        if (!Reflect.hasOwnMetadata(tableMetadataKey, target)) {
            Reflect.defineMetadata(tableMetadataKey, tableModel, target);
        }
        tableModel.addColumn({
            target: target,
            propertyKey: propertyKey,
            metadata: metadata
        });
    };
}
