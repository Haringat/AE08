import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface IUser extends IModel {
    password: string;
    salt: string;
}

@Table({
    name: "users"
})
export default class User extends ModelTable implements IUser {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "password",
        type: DataType.VARCHAR
    })
    public password: string;

    @Column({
        columnName: "salt",
        type: DataType.VARCHAR
    })
    public salt: string;

    constructor(model: IUser) {
        super(model);
    }

}