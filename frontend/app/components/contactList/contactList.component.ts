import {Component, Inject, OnInit, AfterViewChecked} from "@angular/core";
import ContactProvider, {IContactProvider, IContact} from "../../services/contactProvider/contactProvider.service";

@Component({
    selector: "x-cts-contact-list",
    styleUrls: ["app/components/contactList/contactList.style.css"],
    templateUrl: "app/components/contactList/contactList.view.html"
})
export default class ContactList implements OnInit, AfterViewChecked {

    public contacts: Array<IContact> = [];
    public mode: HTMLSelectElement;

    private _contactProvider: IContactProvider;

    constructor(@Inject(ContactProvider) contactProvider: IContactProvider) {
        this._contactProvider = contactProvider;
    }

    ngOnInit() {
        this.contacts = this._contactProvider.getContacts();
    }

    ngAfterViewChecked() {
        console.log(this.mode);
    }

    stringify(any: any) {
        return "{\n" + Object.getOwnPropertyNames(Object.getPrototypeOf(any)).map((name) => {
            return `    ${name}: ${Object.getPrototypeOf(any)[name]},\n`;
        }) + "}\n";
    }

}