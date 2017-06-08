import {ITableModel} from "../Model";
import {IChange} from "../Table";

export default abstract class Connection {

    constructor(config: {
        host: string,
        port: number,
        database: string,
        username: string,
        password: string,
    }) {
    }
    public abstract async validateModel(model: Array<ITableModel>): Promise<void>;
    public abstract async commitChanges(changes: Array<IChange>): Promise<void>;
    public abstract async getAll(model: Array<ITableModel>): Promise<Array<{name: string, values: Array<any>}>>;
}