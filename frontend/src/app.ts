import "reflect-metadata";
import "zone.js";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import ContactsModule from "./contacts/contacts.module";
import bailout from "./loader/bailout";
//noinspection ES6UnusedImports
import {enableProdMode} from "@angular/core";

// TODO: uncomment for production mode
//enableProdMode();
console.log("bootstrapping app...");
platformBrowserDynamic().bootstrapModule(ContactsModule).then(() => {
    document.querySelector("link[rel=\"stylesheet\"][href=\"./loading.css\"]").remove();
    console.log("app running");
}, (cause) => {
    bailout("App bootstrap failed.", cause);
});