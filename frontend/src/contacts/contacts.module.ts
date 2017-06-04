import {Inject, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import ContactListComponent from "./components/contactList/contactList.component";
import ContactProvider from "./services/contactsManager.service";
import FormModule from "../formFields/Form.module";
import ThemeManager, {IThemeManager} from "../theme/services/ThemeManager.service";
import ThemeModule from "../theme/Theme.module";

@NgModule({
    imports: [
        BrowserModule,
        FormModule,
        ThemeModule
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
    constructor(@Inject(ThemeManager) themeManager: IThemeManager) {
        themeManager.setTheme("rgb(255,128,128)");
    }
}