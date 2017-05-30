/// <reference path="../load.ts"/>

import "reflect-metadata";
import "zone.js";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import ContactsModule from "./contacts.module";
import {enableProdMode} from "@angular/core";

enableProdMode();
platformBrowserDynamic().bootstrapModule(ContactsModule).then(() => {
    console.log("app running");
}, (cause) => {
    bailout("app bootstrap failed.", cause);
});