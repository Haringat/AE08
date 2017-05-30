/// <reference path="../node_modules/@types/systemjs/index.d.ts"/>

let path = require("path");

const {
    normalize,
    sep
} = path;

function bailout(message: string, error: Error) {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("x-cts-contact-list").remove();
        console.log(message);
        console.log(error);
        const body = document.querySelector("body");
        const errorNode = document.createElement("pre");
        errorNode.style.color = "red";
        errorNode.innerHTML = `${message}\n${error}`;
        body.appendChild(errorNode);
    });
}

(async () => {
    let ready = false;
    const timeout = 10;

    function domReady() {
        return new Promise<void>((resolve, reject) => {
            if (ready) {
                resolve();
            }
            const timeoutHandler = setTimeout(() => {
                reject(new Error(`DOM load wait timeout after ${timeout} seconds.`));
            }, timeout * 1000);
            document.addEventListener("DOMContentLoaded", () => {
                clearTimeout(timeoutHandler);
                ready = true;
                resolve();
            });
        });
    }

    try {
        await domReady();
        await domReady();
        SystemJS.config({
            map: {
                "*/": "*/index",
                "@angular/common": "../node_modules/@angular/common/bundles/common.umd",
                "@angular/compiler": "../node_modules/@angular/compiler/bundles/compiler.umd",
                "@angular/core": "../node_modules/@angular/core/bundles/core.umd",
                "@angular/forms": "../node_modules/@angular/forms/bundles/forms.umd",
                "@angular/http": "../node_modules/@angular/http/bundles/http.umd",
                "@angular/router": "../node_modules/@angular/router/bundles/router.umd",
                "@angular/platform-browser": "../node_modules/@angular/platform-browser/bundles/platform-browser.umd",
                "@angular/platform-browser-dynamic": "../node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd",
                "angular-in-memory-web-api": "../node_modules/angular-in-memory-web-api/index",
                "core-js": "../node_modules/core-js/index",
                "rxjs": "../node_modules/rxjs",
                "zone.js": "../node_modules/zone.js/dist/zone",
                "reflect-metadata": "../node_modules/reflect-metadata/Reflect"
            },
            packages: {
                "app": {
                    defaultExtension: "js",
                    format: "cjs"
                },
                "shim": {
                    defaultExtension: "js",
                    format: "cjs"
                },
                [normalize(`${__dirname}${sep}..${sep}node_modules`)]: {
                    defaultExtension: "js"
                }
            }
        });
        await SystemJS.import("./shim/index");
        await SystemJS.import("./app/app");
        console.log("app loaded");
    } catch (error) {
        bailout("App could not be loaded.", error);
    }
})();