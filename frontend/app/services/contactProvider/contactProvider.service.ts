import {Injectable} from "@angular/core";
export interface IContact {
    firstName: string;
    lastName: string;
    phone: string;
}

export interface IContactProvider {
    getContacts(): Array<IContact>;
}

@Injectable()
export default class ContactProvider {
    public getContacts(): Array<IContact> {
        return [{
            firstName: "Hans",
            lastName: "Meier",
            phone: "01234/56789"
        }];
    }
}