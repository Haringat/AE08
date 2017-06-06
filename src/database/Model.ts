export interface ITableModel {
    name: string;
    columns: Array<IColumnModel>;
}

export interface IColumnModel {
    name: string;
    foreignKey?: boolean;
    references?: string;
}

export function registerTable(name: string, columns: Array<IColumnModel>);
export function registerTable(model: ITableModel);
export function registerTable(tableModel: string | ITableModel, columns?: Array<IColumnModel>) {
    
}