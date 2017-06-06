import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";

export interface ICountry extends IModel {
    code: string;
    phoneCode: number;
}

@Table({
    name: "countries"
})
export default class Country extends ModelTable implements ICountry {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "code",
        type: DataType.VARCHAR
    })
    public code: string;

    @Column({
        columnName: "code",
        type: DataType.VARCHAR
    })
    public phoneCode: number;

    constructor(model: ICountry) {
        super(model);
    }
}