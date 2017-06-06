import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Street from "./Street";

export interface IAddress extends IModel {
    uuid?: string;
    street: string;
    houseNumber: number;
    addition: string;
}

@Table({
    name: "addresses"
})
export default class Address extends ModelTable implements IAddress {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "street",
        references: Street,
        type: DataType.UUID
    })
    public street: string;

    @Column({
        columnName: "houseNumber",
        type: DataType.INT
    })
    public houseNumber: number;

    @Column({
        columnName: "addition",
        type: DataType.VARCHAR,
        size: 1
    })
    public addition: string;

    constructor(model: IAddress) {
        super(model);
    }

}