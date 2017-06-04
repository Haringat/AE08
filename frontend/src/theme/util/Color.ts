import Vector2D, {angleBetweenVectors, degToRad, toPrecision} from "./Vector2D";
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

export interface IColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    clone(): IColor;
    rotate(degrees: number): IColor;
}

export default class Color implements IColor {

    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    public set red(red: number) {
        if (red < 0 || red > 255) {
            throw new Error("the red channel of a color must be a number between 0 and 255 (inclusive)");
        } else {
            this._red = red | 0;
        }
    }

    public get red() {
        return this._red;
    }

    public set green(green: number) {
        if (green < 0 || green > 255) {
            throw new Error("the green channel of a color must be a number between 0 and 255 (inclusive)");
        } else {
            this._green = green | 0;
        }
    }

    public get green() {
        return this._green;
    }

    public set blue(blue: number) {
        if (blue < 0 || blue > 255) {
            throw new Error("the blue channel of a color must be a number between 0 and 255 (inclusive)");
        } else {
            this._blue = blue | 0;
        }
    }

    public get blue() {
        return this._blue;
    }

    public set alpha(alpha: number) {
        if (alpha < 0 || alpha > 1) {
            throw new Error("the alpha channel of a color must be a number between 0 and 1 (inclusive)");
        } else {
            this._alpha = alpha;
        }
    }

    public get alpha() {
        return this._alpha;
    }

    public set cyan(cyan: number) {
        this._red = 255 - cyan;
    }

    public get cyan() {
        return 255 - this._red;
    }

    public set magenta(magenta: number) {
        this._green = 255 - magenta;
    }

    public get magenta() {
        return 255 - this._green;
    }

    public set yellow(yellow: number) {
        this._blue = 255 - yellow;
    }

    public get yellow() {
        return 255 - this._blue;
    }

    public set key(key: number) {
        this._red *= key / 100;
        this._blue *= key / 100;
        this._green *= key / 100;
    }

    public get key() {
        return Math.min(this.r, this.g, this.b) * 100;
    }

    public set saturation(saturation: number) {
        let hsl = this._toHSL();
        hsl.saturation = saturation;
        const c = Color.fromHSLA(hsl.hue, hsl.saturation, hsl.lightness, this.alpha);
        this.red = toPrecision(c.red, 10);
        this.green = toPrecision(c.green, 10);
        this.blue = toPrecision(c.blue, 10);
    }

    public get saturation() {
        return this._toHSL().saturation;
    }

    public set lightness(lightness: number) {
        let hsl = this._toHSL();
        hsl.lightness = lightness;
        const c = Color.fromHSLA(hsl.hue, hsl.saturation, hsl.lightness, this.alpha);
        this.red = toPrecision(c.red, 10);
        this.green = toPrecision(c.green, 10);
        this.blue = toPrecision(c.blue, 10);
    }

    public get lightness() {
        return this._toHSL().lightness;
    }

    public set hue(degrees: number) {
        let hsl = this._toHSL();
        hsl.hue = degrees;
        let c = Color.fromHSLA(hsl.hue, hsl.saturation, hsl.lightness, this.alpha);
        this.red = toPrecision(c.red, 10);
        this.green = toPrecision(c.green, 10);
        this.blue = toPrecision(c.blue, 10);
    }

    public get hue() {
        return this._toHSL().hue;
    }

    private get r() {
        return this._red / 255;
    }

    private get g() {
        return this._green / 255;
    }

    private get b() {
        return this._blue / 255;
    }

    public constructor(red: number, green: number, blue: number, alpha?: number);
    public constructor(color: string);
    public constructor(red: number | string, green?: number, blue?: number, alpha: number = 1) {
        if (typeof red === "string") {
            this._parseColorString(red);
        } else {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = alpha;
        }
    }

    public static fromHSLA(hue: number, saturation: number, light: number, alpha: number) {
        saturation /= 100;
        light /= 100;
        // formula taken from http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
        const c = (1 - Math.abs(2 * light - 1)) * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = light - c / 2;
        let rgb = {
            red: 0,
            green: 0,
            blue: 0
        };
        if (hue >= 0 && hue < 60) {
            rgb.red = c;
            rgb.green = x;
        } else if (hue >= 60 && hue < 120) {
            rgb.red = x;
            rgb.green = c;
        } else if (hue >= 120 && hue < 180) {
            rgb.green = c;
            rgb.blue = x;
        } else if (hue >= 180 && hue < 240) {
            rgb.green = x;
            rgb.blue = c;
        } else if (hue >= 24 && hue < 300) {
            rgb.red = x;
            rgb.blue = c;
        } else if (hue >= 300 && hue < 360) {
            rgb.red = c;
            rgb.blue = x;
        }
        return new Color((rgb.red + m) * 255, (rgb.green + m) * 255, (rgb.blue + m) * 255, 1);
    }

    public static fromCMYK(cyan: number, magenta: number, yellow: number, key: number) {
        if (cyan > 100 || cyan < 0) {
            throw new RangeError("cyan value must be between 0% and 100% inclusive");
        }
        if (magenta > 100 || magenta < 0) {
            throw new RangeError("cyan value must be between 0% and 100% inclusive");
        }
        if (yellow > 100 || yellow < 0) {
            throw new RangeError("cyan value must be between 0% and 100% inclusive");
        }
        if (key > 100 || key < 0) {
            throw new RangeError("cyan value must be between 0% and 100% inclusive");
        }
        let RGB = {
            red: 255 * (100 - cyan) / 100,
            green: 255 * (100 - magenta) / 100,
            blue: 255 * (100 - yellow) / 100
        };
        RGB.red -= RGB.red * key / 100;
        RGB.green -= RGB.green * key / 100;
        RGB.blue -= RGB.blue * key / 100;
        return new Color(RGB.red, RGB.green, RGB.blue, 1);
    }

    public rotate(degrees: number) {
        this.hue += degrees;
        /*let red = Vector2D.fromLengthAndRotation(this.red, degrees);
        let green = Vector2D.fromLengthAndRotation(this.green, 120 + degrees);
        let blue = Vector2D.fromLengthAndRotation(this.blue, 240 + degrees);
        this.red = Math.cos(degToRad(degrees)) * red.length + Math.cos(degToRad(120 + degrees)) * green.length + Math.cos(degToRad(240 + degrees)) * blue.length;
        this.green = Math.cos(degToRad(120 - degrees)) * red.length + Math.cos(degToRad(degrees)) * green.length + Math.cos(degToRad(120 + degrees)) * blue.length;
        this.red = Math.cos(degToRad(240 - degrees)) * red.length + Math.cos(degToRad(120 - degrees)) * green.length + Math.cos(degToRad(degrees)) * blue.length;*/
        return this;
    }

    public clone() {
        return new Color(this._red, this._green, this._blue, this._alpha);
    }

    private _parseColorString(colorString: string) {
        if (REGEX_RGB_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_HEX);
            this._red = hexToDec(matches[1]);
            this._green = hexToDec(matches[2]);
            this._blue = hexToDec(matches[3]);
            this._alpha = 1;
        } else if (REGEX_RGB_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_FUNC);
            this._red = matches[1].includes("%") ? (parseInt(matches[1]) / 100 * 255) | 0 : parseInt(matches[1]);
            this._green = matches[2].includes("%") ? (parseInt(matches[2]) / 100 * 255) | 0 : parseInt(matches[2]);
            this._blue = matches[3].includes("%") ? (parseInt(matches[3]) / 100 * 255) | 0 : parseInt(matches[3]);
            this._alpha = 1;
        } else if (REGEX_RGBA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_FUNC);
            this._red = matches[1].includes("%") ? (parseInt(matches[1]) / 100 * 255) | 0 : parseInt(matches[1]);
            this._green = matches[2].includes("%") ? (parseInt(matches[2]) / 100 * 255) | 0 : parseInt(matches[2]);
            this._blue = matches[3].includes("%") ? (parseInt(matches[3]) / 100 * 255) | 0 : parseInt(matches[3]);
            this._alpha = matches[4].includes("%") ? parseInt(matches[4]) / 100 : parseFloat(matches[4]);
        } else if (REGEX_HSL_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_HSL_FUNC);
            const c = Color.fromHSLA(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 0);
            this.red = c.red;
            this.green = c.green;
            this.blue = c.blue;
            this.alpha = 1;
        } else if (REGEX_HSLA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_HSLA_FUNC);
            const c = Color.fromHSLA(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 0);
            this.red = c.red;
            this.green = c.green;
            this.blue = c.blue;
            this.alpha = matches[4].includes("%") ? parseInt(matches[4]) / 100 : parseFloat(matches[4]);
        } else if (REGEX_CMYK_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_CMYK_FUNC);
            const c = Color.fromCMYK(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4]));
            this.red = c.red;
            this.green = c.green;
            this.blue = c.blue;
            this.alpha = 1;
        } else {
            throw new Error(`string "${colorString}" is not a known color format.`);
        }
    }

    private _toHSL() {
        const r = this._red / 255;
        const g = this._green / 255;
        const b = this._blue / 255;
        const min = Math.min(r,g,b);
        const max = Math.max(r,g,b);
        const delta = max - min;
        let hsl = {
            hue: 0,
            saturation: 0,
            lightness: (max + min) / 2
        };
        if (delta !== 0) {
            if (max === r) {
                hsl.hue = 60 * (((g - b) / delta) % 6);
            } else if (max === g) {
                hsl.hue = 60 * ((b - r) / delta + 2);
            } else if (max === b) {
                hsl.hue = 60 * ((r - g) / delta + 4);
            }
            hsl.saturation = delta / (1 - Math.abs(2 * hsl.lightness - 1));
        }
        hsl.lightness *= 100;
        hsl.saturation *= 100;
        return hsl;
    }
}