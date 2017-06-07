import {ITableModel} from "./database/Model";

export interface IAdapter {
    validateModel(model: Array<ITableModel>): Promise<void>
}