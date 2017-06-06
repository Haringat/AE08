import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import City from "./City";

export interface IPostalCode extends IModel {
    postalCode: string;
    city: string;
}

@Table({
    name: "postalCodes"
})
export default class PostalCode extends ModelTable implements IPostalCode {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "postalCode",
        size: 10,
        type: DataType.VARCHAR,
    })
    public postalCode: string;

    @Column({
        columnName: "city",
        references: City,
        type: DataType.UUID
    })
    public city: string;

    constructor(model: IPostalCode) {
        super(model);
    }
}