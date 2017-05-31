//language=RegExp
const NUM_0_255 = "\s*(?:[0-1]?[0-9]{1,2}|2(?:[0-4][0-9]|5[0-5]))\s*";
//language=RegExp
const NUM_0_360 = "\s*(?:[0-2]?[0-9]{1,2}|3(?:[0-5][0-9]|60))\s*";
//language=RegExp
const PERCENT = "\s*(?:[0-9]{1,2}|100)%\s*";
//language=RegExp
const FLOAT_0_1 = "\s*(?:0|0?\.\d+|1(?:\.0+))\s*";

const REGEX_RGBA_HEX_NON_CAP = /^[0-9a-f]{8}$/i;
const REGEX_RGB_HEX_NON_CAP = /^[0-9a-f]{6}$/i;
//language=RegExp
const REGEX_RGB_FUNC_NON_CAP = new RegExp(`^\s*rgb\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2}\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC_NON_CAP = new RegExp(`^\s*rgba\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2},(?:${FLOAT_0_1}|${PERCENT})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSL_FUNC_NON_CAP = new RegExp(`^\s*hsl\(${NUM_0_360},${PERCENT},${PERCENT}\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSLA_FUNC_NON_CAP = new RegExp(`^\s*hsla\(${NUM_0_255}(?:,${NUM_0_255}){2},${FLOAT_0_1}\)\s*;?\s*$`, "i");

const REGEX_RGBA_HEX = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
const REGEX_RGB_HEX = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
//language=RegExp
const REGEX_RGB_FUNC = new RegExp(`^\s*rgb\((${NUM_0_255}),(${NUM_0_255}),(${NUM_0_255})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC = new RegExp(`^\s*rgba\((${NUM_0_255}),(${NUM_0_255}),(${NUM_0_255}),(${FLOAT_0_1})\)\s*;?\s*$`, "i");

export interface IColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export default class Color implements IColor {

    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    public set red(newRed: number) {
        if (newRed < 0 || newRed > 255 || newRed % 1 !== 0) {
            throw new Error("the red channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._red = newRed;
        }
    }

    public get red() {
        return this._red;
    }

    public set green(newGreen: number) {
        if (newGreen < 0 || newGreen > 255 || newGreen % 1 !== 0) {
            throw new Error("the green channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._green = newGreen;
        }
    }

    public get green() {
        return this._green;
    }

    public set blue(newBlue: number) {
        if (newBlue < 0 || newBlue > 255 || newBlue % 1 !== 0) {
            throw new Error("the blue channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._blue = newBlue;
        }
    }

    public get blue() {
        return this._blue;
    }

    public set alpha(newAlpha: number) {
        if (newAlpha < 0 || newAlpha > 1) {
            throw new Error("the alpha channel of a color must be a number between 0 and 1 (inclusive)");
        } else {
            this._alpha = newAlpha;
        }
    }

    public get alpha() {
        return this._alpha;
    }

    public set h(newH: number) {

    }

    constructor(red: number, green: number, blue: number, alpha?: number);
    constructor(color: string);
    constructor(red: number | string, green?: number, blue?: number, alpha: number = 1) {
        if (typeof red === "string") {

        }
    }

    public clone() {
        return new Color(this._red, this._green, this._blue, this._alpha);
    }

    private _hexToDec(hex: string) {
        return Number(`0x${hex}`);
    }

    private _parseColorString(colorString: string) {
        if (REGEX_RGBA_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_HEX);
            this._red = this._hexToDec(matches[1]);
            this._green = this._hexToDec(matches[2]);
            this._blue = this._hexToDec(matches[3]);
            this._alpha = this._hexToDec(matches[4]);
        } else if (REGEX_RGB_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_HEX);
            this._red = this._hexToDec(matches[1]);
            this._green = this._hexToDec(matches[2]);
            this._blue = this._hexToDec(matches[3]);
            this._alpha = 1;
        } else if (REGEX_RGBA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_FUNC);
            this._red = parseInt(matches[1]);
            this._green = parseInt(matches[2]);
            this._blue = parseInt(matches[3]);
            this._alpha = parseFloat(matches[4]);
        } else if (REGEX_RGB_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_FUNC);
            this._red = parseInt(matches[1]);
            this._green = parseInt(matches[2]);
            this._blue = parseInt(matches[3]);
            this._alpha = 1;
        } else {
            throw new Error(`string "${colorString}" is not a known color format.`);
        }
    }
}