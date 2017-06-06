import {IColumnModel, ITableModel, registerTable} from "./Model";

const tableSymbol: symbol = Symbol("AE08.database.table");

class TableModel implements ITableModel {
    name: string;
    columns: Array<IColumnModel>;

    constructor(name: string) {

    }

    getDataSet(column: string, value: any) {
    }

    addColumn() {
    }
}

let tables = {};

export interface ITableMetadata {
    name: string;
}

export default function Table(metadata: ITableMetadata): ClassDecorator {
    return function(tableClass: Function) {
        let tableModel = new TableModel(metadata.name);
        tableClass.prototype[tableSymbol] = tableModel;
        registerTable(tableModel);
    };
}


let tableDecorator: ClassDecorator = Table;