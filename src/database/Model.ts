import {v4} from "uuid";
import {
    DataType, datasetMetadataKey, tableMetadataKey, TableModel, ChangeType, IDeletion, IInsertion
} from "./Table";
import "reflect-metadata";

export interface ITableMetadata {
    name: string;
}

export interface IColumnMetadata {
    columnName?: string;
    references?: Function;
    primaryKey?: boolean;
    type: DataType;
    // only for char, varchar, int and float type.
    size?: number;
}


export interface ITableModel extends ITableMetadata{
    columns: Array<IColumnModel>;
}

export interface IColumnModel extends IColumnMetadata {
    name: string;
    foreignKey?: boolean;
}

export interface IModel {
    uuid?: string;
}

export abstract class ModelTable<T extends IModel> implements IModel {

    public uuid: string;

    public constructor(model: T) {
        model.uuid = model.uuid || v4();
        let tableModel: TableModel<T> = Reflect.getOwnMetadata(tableMetadataKey, Object.getPrototypeOf(this));
        //noinspection JSMismatchedCollectionQueryUpdate
        let rows: Array<ModelTable<T>> = Reflect.getOwnMetadata(datasetMetadataKey, Object.getPrototypeOf(this));
        tableModel.columns.map((col) => {
            return col.propertyName;
        }).forEach((prop) => {
            this["_" + prop] = model[prop];
        });
        this.validate();
        const newValues = tableModel.columns.map(col => {
            return {
                column: col.propertyName,
                value: model[col.propertyName]
            };
        });
        rows.push(this);
        TableModel.stack.push({
            type: ChangeType.INSERT,
            table: tableModel.name,
            change: <IInsertion> {
                values: newValues
            }
        });
    }

    public validate() {
        const tableModel: TableModel<any> = Reflect.getOwnMetadata(tableMetadataKey, Object.getPrototypeOf(this));
        tableModel.verify(this);
    }

    public static where<T>(constraints: Array<{column: string, value: any}>): Array<ModelTable<T>> {
        const dataSets: Array<ModelTable<T>> = Reflect.getOwnMetadata(datasetMetadataKey, this.prototype);
        return dataSets.filter(dataSet => constraints.every(constraint => dataSet[constraint.column] === constraint.value));
    }

    public static deserialize<T>(model: T) {
        let tableModel: TableModel<T> = Reflect.getOwnMetadata(tableMetadataKey, this.prototype);
        tableModel.columns.map(col => {
            return col.propertyName;
        }).forEach((prop) => {
            model[`_${prop}`] = model[prop];
        });
        const transformedModel: ModelTable<T> = Object.setPrototypeOf(model, Object.getPrototypeOf(this));
        transformedModel.validate();
        //noinspection JSMismatchedCollectionQueryUpdate
        let dataSets: Array<ModelTable<T>> = Reflect.getOwnMetadata(datasetMetadataKey, this.prototype);
        dataSets.push(transformedModel);
        return transformedModel;
    }

    public static getDataSet<T extends IModel>(where: Array<{column: string, value: any}>): T {
        let dataSets: Array<T> = Reflect.getOwnMetadata(datasetMetadataKey, this.prototype);
        return dataSets.find(dataSet => {
            return where.every(constraint => dataSet[constraint.column] === constraint.value);
        });
    }

    public static deleteDataSet<T extends IModel>(dataSet: T) {
        let dataSets: Array<T> = Reflect.getOwnMetadata(datasetMetadataKey, this.prototype);
        let tableModel: TableModel<T> = Reflect.getOwnMetadata(tableMetadataKey, this.prototype);
        let primaryKey = tableModel.primaryKey;
        let index = dataSets.findIndex((storedDataSet) => {
            return primaryKey.every((pk) => {
                return storedDataSet[pk] === dataSet[pk];
            });
        });
        let dataSetBackup = dataSets[index];
        let oldValues = Object.getOwnPropertyNames(dataSetBackup).map(prop => {
            // remove the leading "_"
            return prop.slice(1);
        }).map(prop => {
            return {
                column: prop,
                value: dataSetBackup[prop]
            }
        });

        dataSets.splice(index, 1);
        TableModel.stack.push({
            table: tableModel.name,
            type: ChangeType.DELETE,
            change: <IDeletion> {
                where: oldValues
            }
        });
    }
}
