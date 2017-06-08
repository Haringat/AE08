import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import User from "./User";

export const tokenLifeTime = 24 * 60 * 60 * 1000;

export interface IToken extends IModel {
    user: string;
    token: string;
    expires: Date;
}

@Table({
    name: "tokens"
})
export default class Token extends ModelTable<IToken> implements IToken {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    uuid: string;

    @Column({
        columnName: "user",
        type: DataType.UUID,
        references: User
    })
    user: string;

    @Column({
        columnName: "token",
        size: 128,
        type: DataType.VARCHAR
    })
    token: string;

    @Column({
        columnName: "expires",
        type: DataType.DATE
    })
    expires: Date;

    private _timeoutHandler: NodeJS.Timer;

    constructor(model: IToken) {
        super(model);
        this._setTimeout();
    }

    public refresh() {
        this.expires = new Date(Date.now() + tokenLifeTime);
        this._clearTimeout();
        this._setTimeout();
    }

    private _setTimeout() {
        this._timeoutHandler = setTimeout(() => {
            Token.deleteDataSet(this);
        }, Date.now() - this.expires.valueOf());
    }

    private _clearTimeout() {
        clearTimeout(this._timeoutHandler);
    }
}