import {Component, Inject, OnInit, AfterViewChecked} from "@angular/core";
import ContactProvider, {IContactProvider, IContact} from "../../services/contactsManager.service";
import {IValue} from "../../../formFields/components/select/select.component";

@Component({
    selector: "x-cts-contact-list",
    styleUrls: ["src/contacts/components/contactList/contactList.style.css"],
    templateUrl: "src/contacts/components/contactList/contactList.view.html"
})
export default class ContactList implements OnInit {

    public contacts: Array<IContact> = [];
    public views: Array<IValue> = [{
        modelValue: "table",
        displayValue: "Tabellenansicht",
        selected: true
    }, {
        modelValue: "list",
        displayValue: "Listenansicht",
        selected: false
    }];
    public view: string;
    public JSON: typeof JSON = JSON;

    private _contactProvider: IContactProvider;

    constructor(@Inject(ContactProvider) contactProvider: IContactProvider) {
        this._contactProvider = contactProvider;
    }

    public setView(value: IValue | Event) {
       if (value instanceof Event) {
           value.stopPropagation();
       } else {
           this.view = value.modelValue;
       }
       console.log(this.view);
    }

    ngOnInit() {
        this.contacts = this._contactProvider.getContacts();
        this.view = "table";
    }


}