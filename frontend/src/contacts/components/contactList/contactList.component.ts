import {Component, Inject, OnInit, AfterViewChecked} from "@angular/core";
import ContactProvider, {IContactProvider, IContact} from "../../services/contactProvider/contactProvider.service";

@Component({
    selector: "x-cts-contact-list",
    styleUrls: ["src/contacts/components/contactList/contactList.style.css"],
    templateUrl: "src/contacts/components/contactList/contactList.view.html"
})
export default class ContactList implements OnInit {

    public contacts: Array<IContact> = [];
    public view: string = "table";
    public JSON: typeof JSON = JSON;

    private _contactProvider: IContactProvider;

    constructor(@Inject(ContactProvider) contactProvider: IContactProvider) {
        this._contactProvider = contactProvider;
    }

    ngOnInit() {
        this.contacts = this._contactProvider.getContacts();
    }


}