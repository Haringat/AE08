import {NgModule} from "@angular/core";
import SelectComponent from "./components/select/select.component";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
    id: "form-fields",
    imports: [
        BrowserModule
    ],
    exports: [SelectComponent],
    declarations: [SelectComponent]
})
export default class FormModule {

}