import {IColumnMetadata, IColumnModel, IModel, ITableMetadata, ITableModel, registerTable} from "./Model";
import "reflect-metadata";

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
    type: ChangeType;
    change: IUpdate | IDeletion | IInsertion;
}

export const tableMetadataKey: string = "AE08.database.table";

export class TableModel<T extends IModel> implements ITableModel {
    name: string;
    columns: Array<IColumnModel & {propertyName: string}>;
    stack: Array<IChange>;

    getDataSet(column: string, value: any): T {
        return undefined;
    }

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
                    default:
                        throw new Error(`Unmapped data type ${DataType[columnMetadata.type]}`);
                }
            })
    }

    addColumn(opts: {target: Object, metadata: IColumnMetadata, propertyKey: string}) {
        switch (opts.metadata.type) {
            case DataType.BLOB:
            case DataType.CHAR:
            case DataType.VARCHAR:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: string) {
                        if (opts.metadata.hasOwnProperty("size")) {
                            if (v.length <= opts.metadata.size) {
                                this["_" + opts.propertyKey] = v;
                            } else {
                                throw new Error(`Field value for field ${opts.propertyKey} too large. Max size is ${opts.metadata.size} characters.`);
                            }
                        } else {
                            this["_" + opts.propertyKey] = v;
                        }
                    }
                });
                break;
            case DataType.UUID:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: string) {
                        if (/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(v)) {
                            this["_" + opts.propertyKey] = v;
                        } else {
                            throw new Error(`value for UUID field ${opts.propertyKey} does not match UUID pattern.`);
                        }
                    }
                });
                break;
            case DataType.BOOLEAN:
                Object.defineProperty(opts.target, opts.propertyKey, {
                    get() {
                        return this["_" + opts.propertyKey];
                    },
                    set(v: boolean) {
                        this["_" + opts.propertyKey] = v;
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
                        this["_" + opts.propertyKey] = v;
                    }
                });
                break;
            default:
                throw new Error(`Unmapped data type ${DataType[opts.metadata.type]}`);
        }
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
        registerTable(tableModel);
    };
}

export function Column(metadata: IColumnMetadata): PropertyDecorator {
    return function (target: IModel, propertyKey: string) {
        let tableModel: TableModel<typeof target> = Reflect.hasOwnMetadata(tableMetadataKey, target) ? Reflect.getOwnMetadata(tableMetadataKey, target) : new TableModel<typeof target>();
        Reflect.defineMetadata(tableMetadataKey, tableModel, target);
        tableModel.addColumn({
            target: target,
            propertyKey: propertyKey,
            metadata: metadata
        });
    };
}
