import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface ICountry extends IModel {
    code: string;
    phoneCode: number;
}

@Table({
    name: "countries"
})
export default class Country extends ModelTable<ICountry> implements ICountry {

    @Column({
        columnName: "uuid",
        type: DataType.UUID,
        primaryKey: true
    })
    public uuid: string;

    @Column({
        columnName: "code",
        type: DataType.VARCHAR
    })
    public code: string;

    @Column({
        columnName: "phoneCode",
        type: DataType.VARCHAR
    })
    public phoneCode: number;
}