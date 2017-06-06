import {Column, DataType, Table} from "../../database/Table";
import {IModel, ModelTable} from "../../database/Model";
import Country from "./Country";
import PostalCode from "./PostalCode";
import City from "./City";

export interface ICityPostalCodeCountry extends IModel {
    country: string;
    postalCode: string;
    city: string;
}

@Table({
    name: "citiesPostalCodesCountries"
})
export default class CityPostalCodeCountry extends ModelTable implements ICityPostalCodeCountry {
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
        columnName: "postalCode",
        references: PostalCode,
        type: DataType.UUID
    })
    public postalCode: string;

    @Column({
        columnName: "city",
        references: City,
        type: DataType.UUID
    })
    public city: string;

    constructor(model: ICityPostalCodeCountry) {
        super(model);
    }
}