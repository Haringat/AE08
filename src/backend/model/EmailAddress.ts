import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Person from "./Person";

export interface IEmailAddress extends IModel {
    email: string;
    person: string;
}

@Table({
    name: "emailAddresses"
})
export default class EmailAddress extends ModelTable<IEmailAddress> implements IEmailAddress {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "email",
        type: DataType.VARCHAR
    })
    email: string;

    @Column({
        columnName: "person",
        references: Person,
        type: DataType.UUID
    })
    person: string;

}