import {NgModule} from "@angular/core";
import SelectComponent from "./components/select/select.component";
import {BrowserModule} from "@angular/platform-browser";
import ThemeModule from "../theme/Theme.module";

@NgModule({
    id: "form-fields",
    imports: [
        BrowserModule,
        ThemeModule
    ],
    exports: [SelectComponent],
    declarations: [SelectComponent]
})
export default class FormModule {

}