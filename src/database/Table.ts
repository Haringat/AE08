import {IColumnModel, ITableModel, registerTable} from "./Model";
import "reflect-metadata";

export enum ChangeType {
    UPDATE,
    DElETE
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
    change: IUpdate | IDeletion;
}

const tableMetadataKey: string = "AE08.database.table";

class TableModel implements ITableModel {
    name: string;
    columns: Array<IColumnModel>;
    stack: Array<IChange>;

    getDataSet(column: string, value: any) {
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

let tables = {};

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

export interface ITableMetadata {
    name: string;
}

export interface IColumnMetadata {
    columnName?: string;
    references?: Function;
    type: DataType,
    // only for char, varchar, int and float type.
    size?: number
}

export function Table(metadata: ITableMetadata): ClassDecorator {
    return function (tableClass: Function) {
        let tableModel = Reflect.hasOwnMetadata(tableMetadataKey, tableClass.prototype) ? Reflect.getOwnMetadata(tableMetadataKey, tableClass.prototype) : new TableModel();
        tableModel.name = metadata.name || tableClass.prototype.constructor.name;
        Reflect.defineMetadata(tableMetadataKey, tableModel, tableClass.prototype);
        registerTable(tableModel);
    };
}

export function Column(metadata: IColumnMetadata): PropertyDecorator {
    return function (target, propertyKey: string) {
        let tableModel = Reflect.hasOwnMetadata(tableMetadataKey, target) ? Reflect.getOwnMetadata(tableMetadataKey, target) : new TableModel();
        Reflect.defineMetadata(tableMetadataKey, tableModel, target);
        tableModel.addColumn({
            target: target,
            propertyKey: propertyKey,
            metadata: metadata
        });
    };
}


let tableDecorator: ClassDecorator = Table;