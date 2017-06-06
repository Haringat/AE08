import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Country from "./Country";

export interface IPhoneAreaCode extends IModel {
    country: string;
    areaCode: string;
}

@Table({
    name: "phoneAreaCodes"
})
export default class PhoneAreaCode extends ModelTable implements IPhoneAreaCode {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "country",
        references: Country,
        type: DataType.UUID
    })
    public country: string;

    @Column({
        columnName: "areaCode",
        type: DataType.VARCHAR
    })
    public areaCode: string;

    public constructor(model: IPhoneAreaCode) {
        super(model);
    }
}