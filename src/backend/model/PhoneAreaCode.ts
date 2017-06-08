import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Country from "./Country";
import City from "./City";

export interface IPhoneAreaCode extends IModel {
    city: string;
    areaCode: string;
}

@Table({
    name: "phoneAreaCodes"
})
export default class PhoneAreaCode extends ModelTable<IPhoneAreaCode> implements IPhoneAreaCode {

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
        columnName: "areaCode",
        type: DataType.VARCHAR
    })
    public areaCode: string;

}