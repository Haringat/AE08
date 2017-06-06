import {v4} from "uuid";
import {DataType, tableMetadataKey, TableModel} from "./Table";

export interface ITableMetadata {
    name: string;
}

export interface IColumnMetadata {
    columnName?: string;
    references?: Function;
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

export function registerTable(name: string, columns: Array<IColumnModel>);
export function registerTable(model: ITableModel);
export function registerTable(tableModel: string | ITableModel, columns?: Array<IColumnModel>) {

}

export interface IModel {
    uuid?: string;
}

export abstract class ModelTable implements IModel {

    uuid: string;

    public constructor(model: IModel) {
        model.uuid = model.uuid || v4();
        Object.setPrototypeOf(model, Object.getPrototypeOf(this));
        const transformedModel: ModelTable = <ModelTable> model;
        transformedModel.validate();
    }

    public validate() {
        const tableModel: TableModel<any> = Reflect.getOwnMetadata(tableMetadataKey, Object.getPrototypeOf(this));
        tableModel.verify(this);
    }
}