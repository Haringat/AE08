import {ITableModel} from "../../Model";
import * as pgPromiseLib from "pg-promise";

const pgPromise: pgPromiseLib.IMain = pgPromiseLib();

abstract class A {

}

export default abstract class Connection {

    private static _connection: pgPromiseLib.IDatabase<any>;

    public static async connect(connectionParams: pgPromiseLib.IConfig) {
        this._connection = pgPromise(connectionParams);
    }

    public static async validateModel(model: Array<ITableModel>) {
        let tables = await this._connection.manyOrNone("\\t");
        await model.forEachAsync(async (tableModel) => {
            if (!~tables.indexOf(tableModel.name)) {

            }
        });
    }
}

export function validateModel(model: Array<ITableModel>) {

}