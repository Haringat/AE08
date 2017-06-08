import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface IUser extends IModel {
    password: string;
    salt: string;
    person: string;
}

@Table({
    name: "users"
})
export default class User extends ModelTable<IUser> implements IUser {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "password",
        type: DataType.VARCHAR
    })
    public password: string;

    @Column({
        columnName: "salt",
        type: DataType.VARCHAR,
        size: 2048
    })
    public salt: string;

    @Column({
        columnName: "person",
        type: DataType.UUID
    })
    public person: string;

}