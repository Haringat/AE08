import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import City from "./City";

export interface IStreet extends IModel {
    city: string;
    name: string;
}

@Table({
    name: "streets"
})
export default class Street extends ModelTable implements IStreet {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "city",
        references: City,
        type: DataType.UUID
    })
    public city: string;

    @Column({
        columnName: "name",
        type: DataType.VARCHAR
    })
    public name: string;

    constructor(model: IStreet) {
        super(model);
    }
}