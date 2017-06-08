import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface ICity extends IModel {
    name: string;
}

@Table({
    name: "cities"
})
export default class City extends ModelTable<ICity> implements ICity {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "name",
        type: DataType.VARCHAR
    })
    public name: string;

}