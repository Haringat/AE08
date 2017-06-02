import test from "ava";
import Color from "./Color";

test("can be generated from rgb hex", async spec => {
    spec.plan(4);

    const rgbHexColor = new Color("#3264C8");
    spec.is(rgbHexColor.red, 50);
    spec.is(rgbHexColor.green, 100);
    spec.is(rgbHexColor.blue, 200);
    spec.is(rgbHexColor.alpha, 1);
});

test("can be generated from rgb css function", async spec => {
    spec.plan(4);

    const rgbFuncColor = new Color("rgb(50,100,200)");
    spec.is(rgbFuncColor.red, 50);
    spec.is(rgbFuncColor.green, 100);
    spec.is(rgbFuncColor.blue, 200);
    spec.is(rgbFuncColor.alpha, 1);
});

test("can be generated from rgba css function", async spec => {
    spec.plan(4);

    const rgbaFuncColor = new Color("rgba(50,100,200,.5)");
    spec.is(rgbaFuncColor.red, 50);
    spec.is(rgbaFuncColor.green, 100);
    spec.is(rgbaFuncColor.blue, 200);
    spec.is(rgbaFuncColor.alpha, .5);
});

test("can be generated from rgb css function with percent values", async spec => {
    spec.plan(4);

    const rgbFuncPercentColor = new Color("rgb(20%,60%,80%)");
    spec.is(rgbFuncPercentColor.red, 51);
    spec.is(rgbFuncPercentColor.green, 153);
    spec.is(rgbFuncPercentColor.blue, 204);
    spec.is(rgbFuncPercentColor.alpha, 1);
});

test("can be generated from rgba css function with percent values", async spec => {
    spec.plan(4);

    const rgbFuncPercentColor = new Color("rgba(20%,60%,80%,50%)");
    spec.is(rgbFuncPercentColor.red, 51);
    spec.is(rgbFuncPercentColor.green, 153);
    spec.is(rgbFuncPercentColor.blue, 204);
    spec.is(rgbFuncPercentColor.alpha, .5);
});

test("can be generated from rgb values", async spec => {
    spec.plan(4);

    const rgbConstructorColor = new Color(50, 100, 200);
    spec.is(rgbConstructorColor.red, 50);
    spec.is(rgbConstructorColor.green, 100);
    spec.is(rgbConstructorColor.blue, 200);
    spec.is(rgbConstructorColor.alpha, 1);
});

test("can be generated from rgba values", async spec => {
    spec.plan(4);

    const rgbaConstructorColor = new Color(50, 100, 200, .5);
    spec.is(rgbaConstructorColor.red, 50);
    spec.is(rgbaConstructorColor.green, 100);
    spec.is(rgbaConstructorColor.blue, 200);
    spec.is(rgbaConstructorColor.alpha, .5);
});

test("can be generated from hsl css function", async spec => {
    spec.plan(4);

    const hslColor = new Color("hsl(220,60%,49%)");

    // hsl->rgb is precise, but the exact same color as above would have led to odd values in hsl notation
    // aside from that for common use-cases this is close enough

    spec.is(hslColor.red, 49);
    spec.is(hslColor.green, 99);
    spec.is(hslColor.blue, 199);
    spec.is(hslColor.alpha, 1);
});

test("can be generated from hsla css function", async spec => {
    spec.plan(4);

    const hslaColor = new Color("hsla(220,60%,49%,.5)");
    // hsla->rgba is precise, but the exact same color as above would have led to odd values in hsl notation
    // aside from that for common use-cases this is close enough

    spec.is(hslaColor.red, 49);
    spec.is(hslaColor.green, 99);
    spec.is(hslaColor.blue, 199);
    spec.is(hslaColor.alpha, .5);
});

test("can be generated from cmyk css function", async spec => {
    spec.plan(4);

    const cmykColor = new Color("cmyk(75%,50%,0%,22%)");

    // cmyk -> rgb conversion tends to be inprecise but for common use-cases this is close enough

    spec.is(cmykColor.red, 49);
    spec.is(cmykColor.green, 99);
    spec.is(cmykColor.blue, 198);
    spec.is(cmykColor.alpha, 1);
});

test("can be rotated", async spec => {
    spec.plan(3);

    let color = new Color(255, 0, 0);
    color.rotate(150);
    spec.is(color.red, 0);
    spec.is(color.green, 255);
    spec.is(color.blue, 21);
});