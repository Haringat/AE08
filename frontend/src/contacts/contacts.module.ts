import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import ContactListComponent from "./components/contactList/contactList.component";
import ContactProvider from "./services/contactsManager.service";
import FormModule from "../formFields/form.module";

@NgModule({
    imports: [
        BrowserModule,
        FormModule
    ],
    declarations: [
        ContactListComponent
    ],
    bootstrap: [
        ContactListComponent
    ],
    providers: [
        ContactProvider
    ]
})
export default class ContactListModule {
}