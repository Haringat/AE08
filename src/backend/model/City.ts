import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface ICity extends IModel {
    uuid?: string;
    name: string;
}

@Table({
    name: "cities"
})
export default class City extends ModelTable implements ICity {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "name",
        type: DataType.VARCHAR
    })
    public name: string;

    constructor(model: ICity) {
        super(model);
    }

}