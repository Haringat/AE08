import test from "ava";
import Color from "./Color";

test("Color can be generated from any format", async spec => {
    spec.plan(3);
    let rgbColor = new Color("#224466");
    spec.is(rgbColor.red, 0x22);
    spec.is(rgbColor.green, 0x44);
    spec.is(rgbColor.blue, 0x66);
});