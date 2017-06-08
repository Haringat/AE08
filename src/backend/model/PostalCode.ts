import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import City from "./City";

export interface IPostalCode extends IModel {
    postalCode: string;
}

@Table({
    name: "postalCodes"
})
export default class PostalCode extends ModelTable<IPostalCode> implements IPostalCode {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "postalCode",
        size: 10,
        type: DataType.VARCHAR,
    })
    public postalCode: string;

}