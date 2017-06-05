import Vector3D, {IVector3D} from "./Vector3D";
import {hexToDec} from "./MathUtil";


//language=RegExp
const NUM_0_255 = "\\s*(?:[0-1]?\\d{1,2}|2(?:[0-4]\\d|5[0-5]))\\s*";
//language=RegExp
const NUM_0_360 = "\\s*(?:[0-2]?\\d{1,2}|3(?:[0-5]\\d|60))\\s*";
//language=RegExp
const PERCENT = "\\s*(?:0{0,2}\\d|0?\\d{2}|100)%\\s*";
//language=RegExp
const FLOAT_0_1 = "\\s*(?:0|0?\.\\d+|1(?:\.0+))\\s*";

const REGEX_RGB_HEX_NON_CAP = /^#[0-9a-f]{6}$/i;
//language=RegExp
const REGEX_RGB_FUNC_NON_CAP = new RegExp(`^\\s*rgb\\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2}\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC_NON_CAP = new RegExp(`^\\s*rgba\\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2},(?:${FLOAT_0_1}|${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_HSL_FUNC_NON_CAP = new RegExp(`^\\s*hsl\\(${NUM_0_360},${PERCENT},${PERCENT}\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_HSLA_FUNC_NON_CAP = new RegExp(`^\\s*hsla\\(${NUM_0_360}(?:,${PERCENT}){2},(?:${FLOAT_0_1}|${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_CMYK_FUNC_NON_CAP = new RegExp(`^\\s*cmyk\\(${PERCENT}(?:,${PERCENT}){3}\\)\\s*;?\\s*$`, "i");

const REGEX_RGB_HEX = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
//language=RegExp
const REGEX_RGB_FUNC = new RegExp(`^\\s*rgb\\((${NUM_0_255}|${PERCENT}),(${NUM_0_255}|${PERCENT}),(${NUM_0_255}|${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC = new RegExp(`^\\s*rgba\\((${NUM_0_255}|${PERCENT}),(${NUM_0_255}|${PERCENT}),(${NUM_0_255}|${PERCENT}),(${FLOAT_0_1}|${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_HSL_FUNC = new RegExp(`^\\s*hsl\\((${NUM_0_360}),(${PERCENT}),(${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_HSLA_FUNC = new RegExp(`^\\s*hsla\\((${NUM_0_360}),(${PERCENT}),(${PERCENT}),(${FLOAT_0_1}|${PERCENT})\\)\\s*;?\\s*$`, "i");
//language=RegExp
const REGEX_CMYK_FUNC = new RegExp(`^\\s*cmyk\\((${PERCENT}),(${PERCENT}),(${PERCENT}),(${PERCENT})\\)\\s*;?\\s*$`, "i");

const ANGLE_RED_GREEN = 120;
const ANGLE_RED_BLUE = 240;
const Z_AXIS_1 = new Vector3D(0, 0, 1);

const redVector: IVector3D = new Vector3D(Math.cos(Math.asin((100 / 255) / 3)), 0, (100 / 255) / 3);
const greenVector: IVector3D = redVector.clone().rotate(ANGLE_RED_GREEN, Z_AXIS_1);
const blueVector: IVector3D = redVector.clone().rotate(ANGLE_RED_BLUE, Z_AXIS_1);

export default class Color3D {

    private _alpha: number;

    public get red() {
        let colorVector = this._vector.clone();
        colorVector.z = 0;
        let r = redVector.clone();
        r.z = 0;
        if (colorVector.angleToVector(r) < 120)
        if (this._vector.angleToVector(redVector) < 120) {

        } else {

        }
        return 0;
    }

    private _vector: IVector3D;

    private _parseColorString(colorString: string) {
        if (REGEX_RGB_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_HEX);
            let red = hexToDec(matches[1]);
            let green = hexToDec(matches[2]);
            let blue = hexToDec(matches[3]);
            this._vector = redVector.clone().multiply(red)
                .add(greenVector.clone().multiply(green))
                .add(blueVector.clone().multiply(blue));
            this._alpha = 1;
        } else if (REGEX_RGB_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_FUNC);
            let red = matches[1].includes("%") ? (parseInt(matches[1]) / 100 * 255) | 0 : parseInt(matches[1]);
            let green = matches[2].includes("%") ? (parseInt(matches[2]) / 100 * 255) | 0 : parseInt(matches[2]);
            let blue = matches[3].includes("%") ? (parseInt(matches[3]) / 100 * 255) | 0 : parseInt(matches[3]);
            this._vector = redVector.clone().multiply(red)
                .add(greenVector.clone().multiply(green))
                .add(blueVector.clone().multiply(blue));
            this._alpha = 1;
        } else if (REGEX_RGBA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_FUNC);
            let red = matches[1].includes("%") ? (parseInt(matches[1]) / 100 * 255) | 0 : parseInt(matches[1]);
            let green = matches[2].includes("%") ? (parseInt(matches[2]) / 100 * 255) | 0 : parseInt(matches[2]);
            let blue = matches[3].includes("%") ? (parseInt(matches[3]) / 100 * 255) | 0 : parseInt(matches[3]);
            this._vector = redVector.clone().multiply(red)
                .add(greenVector.clone().multiply(green))
                .add(blueVector.clone().multiply(blue));
            this._alpha = matches[4].includes("%") ? parseInt(matches[4]) / 100 : parseFloat(matches[4]);
        } else if (REGEX_HSL_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_HSL_FUNC);
            let hue = parseInt(matches[1]);
            let saturation = parseInt(matches[2]);
            let lightness = parseInt(matches[2]);
            let alpha = 1;
            const c = this.parseHSLA(hue, saturation, lightness, alpha);
        } else if (REGEX_HSLA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_HSLA_FUNC);
            let hue = parseInt(matches[1]);
            let saturation = parseInt(matches[2]);
            let lightness = parseInt(matches[2]);
            let alpha = matches[4].includes("%") ? parseInt(matches[4]) / 100 : parseFloat(matches[4]);
            const c = this.parseHSLA(hue, saturation, lightness, alpha);
        } else if (REGEX_CMYK_FUNC_NON_CAP.test(colorString)) {
            const matches = colorString.match(REGEX_CMYK_FUNC);
            const cyan = parseInt(matches[1]);
            const magenta = parseInt(matches[2]);
            const yellow = parseInt(matches[3]);
            const key = parseInt(matches[4]);
            this.parseCMYK(cyan, magenta, yellow, key);
            this._alpha = 1;
        } else {
            throw new Error(`string "${colorString}" is not a known color format.`);
        }
    }

    public parseHSLA(hue: number, saturation: number, lightness: number, alpha: number) {
        saturation /= 100;
        lightness /= 100;
        this._alpha = alpha;
        let c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        let x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        let m = lightness - c / 2;
        let color = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: alpha
        };
        if (hue >= 0 && hue < 60) {
            color.red = c;
            color.green = x;
        } else if (hue >= 60 && hue < 120) {
            color.red = x;
            color.green = c;
        } else if (hue >= 120 && hue < 180) {
            color.green = c;
            color.blue = x;
        } else if (hue >= 180 && hue < 240) {
            color.green = x;
            color.blue = c;
        } else if (hue >= 240 && hue < 300) {
            color.red = x;
            color.blue = c;
        } else if (hue >= 300 && hue < 360) {
            color.red = c;
            color.blue = x;
        }
        color.red = (color.red + m) * 255;
        color.green = (color.green + m) * 255;
        color.blue = (color.blue + m) * 255;
        this._vector = redVector.clone().multiply(color.red)
            .add(greenVector.clone().multiply(color.green))
            .add(blueVector.clone().multiply(color.blue));
    }

    public parseCMYK(cyan: number, magenta: number, yellow: number, key: number) {
        key /= 100;
        this._vector = new Vector3D(0,0,100)
            .subtract(redVector.clone().multiply(cyan))
            .subtract(greenVector.clone().multiply(magenta))
            .subtract(blueVector.clone().multiply(yellow))
            .scale(1 - key);
    }
}