import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Address from "./Address";

export interface IPerson extends IModel {
    forename: string;
    surname: string;
    address: string;
}

@Table({
    name: "persons"
})
export default class Person extends ModelTable implements IPerson {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "forename",
        type: DataType.VARCHAR
    })
    public forename: string;

    @Column({
        columnName: "surname",
        type: DataType.VARCHAR
    })
    public surname: string;

    @Column({
        columnName: "address",
        references: Address,
        type: DataType.UUID
    })
    public address: string;

    public constructor(model: IPerson) {
        super(model);
    }

}