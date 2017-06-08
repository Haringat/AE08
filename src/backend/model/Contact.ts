import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import User from "./User";
import Person from "./Person";

export interface IContact extends IModel {
    user: string;
    contactPerson: string;
}

@Table({
    name: "contacts"
})
export default class Contact extends ModelTable<IContact> implements IContact {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "user",
        references: User,
        type: DataType.UUID
    })
    public user: string;

    @Column({
        columnName: "contactPerson",
        references: Person,
        type: DataType.UUID
    })
    public contactPerson: string;

}