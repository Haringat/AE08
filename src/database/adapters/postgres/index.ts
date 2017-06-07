import {ITableModel} from "../../Model";
import * as pgPromiseLib from "pg-promise";

const pgPromise: pgPromiseLib.IMain = pgPromiseLib();

export default class Connection {

    private _connection: pgPromiseLib.IDatabase<any>;

    public constructor(connectionParams: pgPromiseLib.IConfig) {
        this._connection = pgPromise(connectionParams);
    }

    public async validateModel(model: Array<ITableModel>) {
        let tables = await this._connection.manyOrNone("\\d");
        await model.forEachAsync(async (tableModel) => {
            if (!~tables.indexOf(tableModel.name)) {
                throw new Error(`Table ${tableModel.name} from model is not present in the database.`);
            }
            let columns = await this._connection.manyOrNone(`\\d+ "${tableModel.name}"`);

        });
    }
}