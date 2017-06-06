import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import PhoneAreaCode from "./PhoneAreaCode";

export interface IPhoneNumber extends IModel {
    areaCode: string;
    number: string;
    person: string;
}

@Table({
    name: "phoneNumbers"
})
export default class PhoneNumber extends ModelTable implements IPhoneNumber {

    @Column({
        columnName: "uuid",
        type: DataType.UUID
    })
    public uuid: string;

    @Column({
        columnName: "areaCode",
        references: PhoneAreaCode,
        type: DataType.UUID
    })
    public areaCode: string;

    @Column({
        columnName: "number",
        type: DataType.VARCHAR
    })
    public number: string;

    @Column({
        columnName: "person",
        type: DataType.UUID
    })
    public person: string;

    constructor(model: IPhoneNumber) {
        super(model);
    }
}