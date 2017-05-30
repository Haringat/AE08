import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import ContactListComponent from './components/contactList/contactList.component';
import ContactProvider from "./services/contactProvider/contactProvider.service";

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        ContactListComponent
    ],
    bootstrap: [ ContactListComponent ],
    providers: [ContactProvider]
})
export default class ContactListModule {
}