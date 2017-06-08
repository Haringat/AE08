import "../../../node/index"
import "../../../shim/index"
import {ITableModel} from "../../Model";
import {ChangeType, IChange, IDeletion, IInsertion, IUpdate} from "../../Table";
import AbstractConnection from "../Adapter";
import * as pgPromiseLib from "pg-promise";

const pgPromise: pgPromiseLib.IMain = pgPromiseLib();

export default class Connection extends AbstractConnection {

    private _connection: pgPromiseLib.IDatabase<any>;

    public constructor(connectionParams: {
        host: string,
        port: number,
        database: string,
        username: string,
        password: string,
    }) {
        super(connectionParams);
        this._connection = pgPromise({
            database: connectionParams.database,
            user: connectionParams.username,
            password: connectionParams.password,
            port: connectionParams.port,
            host: connectionParams.host
        });
    }

    //noinspection JSMethodCanBeStatic
    public async validateModel(model: Array<ITableModel>) {
        // todo: implement
        return;
    }

    public async commitChanges(changes: Array<IChange>) {
        await this._connection.tx(async (transaction) => {
            await changes.forEachAsync(async (change) => {
                switch (change.type) {
                    case ChangeType.INSERT: {
                        const insertion: IInsertion = <IInsertion> change.change;
                        const columns = insertion.values.map(v => v.column);
                        const valuePlaceholders = columns.map(c => `\${${c}:value}`).join(', ');
                        await transaction.none(`insert into "\${table~}" (\${columns^}) values (${valuePlaceholders});`, {
                            table: change.table,
                            columns: columns,
                            ...Connection._getValueObject(insertion.values)
                        });
                        break;
                    }
                    case ChangeType.DELETE: {
                        const deletion = <IDeletion> change.change;

                        await transaction.none(`delete from \${table~} where ${Connection._getConstraints(deletion.where)};`, Object.assign({
                            table: change.table,
                            ...Connection._getValueObject(deletion.where)
                        }));
                        break;
                    }
                    case ChangeType.UPDATE: {
                        const update = <IUpdate> change.change;
                        await transaction.none(`update set ${Connection._getSetters(update.set)} where ${Connection._getConstraints(update.where)}`);
                    }
                }
            });
        });
    }

    public async getAll(model: Array<ITableModel>) {
        let all = await model.mapAsync(async (tableModel) => {
            console.log(`select ${tableModel.columns.map(col => col.name)} from "${tableModel.name}";`);
            return {
                name: tableModel.name,
                values: await this._connection.manyOrNone(`select \${columns~} from "${tableModel.name}";`, {
                    columns: tableModel.columns.map(col => col.name)
                })
            };
        });
        all.forEach(some => {
            console.log(some.values);
        });
        return all;
    }

    private static _getValueObject(values: Array<{column: string, value: string}>) {
        return Object.assign({}, ...values.map(v => {
            return {
                [v.column]: v.value
            };
        }));
    }

    private static _getConstraints(where: Array<{column: string, value: string}>) {
        return where.map(v => `"${v.column}" = \${${v.column}:value}`).join(" AND ");
    }

    private static _getSetters(where: Array<{column: string, value: string}>) {
        return where.map(v => `(\${columns^}) = \${${v.column}:value}`).join(" AND ");
    }
}