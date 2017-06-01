import Vector2D, {degToRad, IVector2D} from "./Vector2D";

//language=RegExp
const NUM_0_255 = "\s*(?:[0-1]?[0-9]{1,2}|2(?:[0-4][0-9]|5[0-5]))\s*";
//language=RegExp
const NUM_0_360 = "\s*(?:[0-2]?[0-9]{1,2}|3(?:[0-5][0-9]|60))\s*";
//language=RegExp
const PERCENT = "\s*(?:[0-9]{1,2}|100)%\s*";
//language=RegExp
const FLOAT_0_1 = "\s*(?:0|0?\.\d+|1(?:\.0+))\s*";

const REGEX_RGBA_HEX_NON_CAP = /^#[0-9a-f]{8}$/i;
const REGEX_RGB_HEX_NON_CAP = /^#[0-9a-f]{6}$/i;
//language=RegExp
const REGEX_RGB_FUNC_NON_CAP = new RegExp(`^\s*rgb\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2}\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC_NON_CAP = new RegExp(`^\s*rgba\((?:${NUM_0_255}|${PERCENT})(?:,(?:${NUM_0_255}|${PERCENT})){2},(?:${FLOAT_0_1}|${PERCENT})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSL_FUNC_NON_CAP = new RegExp(`^\s*hsl\(${NUM_0_360},${PERCENT},${PERCENT}\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSLA_FUNC_NON_CAP = new RegExp(`^\s*hsla\(${NUM_0_255}(?:,${NUM_0_255}){2},${FLOAT_0_1}\)\s*;?\s*$`, "i");

const REGEX_RGBA_HEX = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
const REGEX_RGB_HEX = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
//language=RegExp
const REGEX_RGB_FUNC = new RegExp(`^\s*rgb\((${NUM_0_255}),(${NUM_0_255}),(${NUM_0_255})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_RGBA_FUNC = new RegExp(`^\s*rgba\((${NUM_0_255}),(${NUM_0_255}),(${NUM_0_255}),(${FLOAT_0_1})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSL_FUNC = new RegExp(`^\s*hsl\((${NUM_0_360}),(${PERCENT}),(${PERCENT})\)\s*;?\s*$`, "i");
//language=RegExp
const REGEX_HSLA_FUNC = new RegExp(`^\s*hsla\((${NUM_0_255}), (${NUM_0_255}), (${NUM_0_255}),(${FLOAT_0_1})\)\s*;?\s*$`, "i");

function vectorToRGB(vector: IVector2D) {

}

export interface IColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    clone(): IColor;
    rotate(degrees: number): IColor;
}

function hexToDec(hex: string) {
    return Number(`0x${hex}`);
}

export default class Color implements IColor {

    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    public set red(red: number) {
        if (red < 0 || red > 255 || red % 1 !== 0) {
            throw new Error("the red channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._red = red;
        }
    }

    public get red() {
        return this._red;
    }

    public set green(green: number) {
        if (green < 0 || green > 255 || green % 1 !== 0) {
            throw new Error("the green channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._green = green;
        }
    }

    public get green() {
        return this._green;
    }

    public set blue(blue: number) {
        if (blue < 0 || blue > 255 || blue % 1 !== 0) {
            throw new Error("the blue channel of a color must be an integer between 0 and 255 (inclusive)");
        } else {
            this._blue = blue;
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
        return (255 - Math.min(this._red, this._blue, this._green) * 100 / 255);
    }

    public set saturation(saturation: number) {
        let oldSaturation = this.saturation;
    }

    public get saturation() {
        let minColor = Math.min(this._red, this._green, this._blue);
        let maxColor = Math.max(this._red, this._green, this._blue);
        return (maxColor - minColor) / 255 * 100;
    }

    public set hue(degrees: number) {
        let colorVector = new Vector2D(this._red, 0).add(new Vector2D(this._green, 0).rotate(120)).add(new Vector2D(this._blue, 0).rotate(240));
        colorVector.rotate(degrees);

    }

    public get hue() {
        let colorVector = new Vector2D(this._red, 0).add(new Vector2D(this._green, 0).rotate(120)).add(new Vector2D(this._blue, 0).rotate(240));
        return Vector2D.angleBetweenVectors(new Vector2D(1,0), colorVector);
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
        let colorVector = new Vector2D(saturation, 0).rotate(hue);
        let angleToGreen = degToRad(Vector2D.angleBetweenVectors(colorVector, new Vector2D(1,0).rotate(120)));
        let angleToBlue = degToRad(Vector2D.angleBetweenVectors(colorVector, new Vector2D(1,0).rotate(240)));
        let red = Math.cos(degToRad(hue)) * colorVector.length;
        let green = Math.cos(angleToGreen) * colorVector.length;
        let blue = Math.cos(angleToBlue) * colorVector.length;
        let relativeLight = light / 100;
        red *= relativeLight;
        green *= relativeLight;
        blue *= relativeLight;
        return new Color(red, green, blue);
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
            red: (255 - (255 * cyan / 100)),
            green: 255 - (255 * magenta / 100),
            blue: 255 - (255 * yellow / 100)
        };
        RGB.red -= RGB.red * key / 100;
        RGB.green -= RGB.green * key / 100;
        RGB.blue -= RGB.blue * key / 100;
        return new Color(RGB.red, RGB.green, RGB.blue, 1);
    }

    public rotate(degrees: number) {
        let red = Vector2D.fromLengthAndRotation(this.red, degrees);
        let green = Vector2D.fromLengthAndRotation(this.green, 120 + degrees);
        let blue = Vector2D.fromLengthAndRotation(this.blue, 240 + degrees);
        this.red = Math.cos(degToRad(degrees)) * red.length + Math.cos(degToRad(120 + degrees)) * green.length + Math.cos(degToRad(240 + degrees)) * blue.length;
        this.green = Math.cos(degToRad(120 - degrees)) * red.length + Math.cos(degToRad(degrees)) * green.length + Math.cos(degToRad(120 + degrees)) * blue.length;
        this.red = Math.cos(degToRad(240 - degrees)) * red.length + Math.cos(degToRad(120 - degrees)) * green.length + Math.cos(degToRad(degrees)) * blue.length;
        return this;
    }

    public clone() {
        return new Color(this._red, this._green, this._blue, this._alpha);
    }

    private _parseColorString(colorString: string) {
        if (REGEX_RGBA_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_HEX);
            this._red = hexToDec(matches[1]);
            this._green = hexToDec(matches[2]);
            this._blue = hexToDec(matches[3]);
            this._alpha = hexToDec(matches[4]);
        } else if (REGEX_RGB_HEX_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_HEX);
            this._red = hexToDec(matches[1]);
            this._green = hexToDec(matches[2]);
            this._blue = hexToDec(matches[3]);
            this._alpha = 1;
        } else if (REGEX_RGBA_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGBA_FUNC);
            this._red = matches[1].includes("%") ? (parseInt(matches[1]) * 255) | 0 : parseInt(matches[1]);
            this._green = matches[2].includes("%") ? (parseInt(matches[2]) * 255) | 0 : parseInt(matches[2]);
            this._blue = matches[3].includes("%") ? (parseInt(matches[3]) * 255) | 0 : parseInt(matches[3]);
            this._alpha = matches[4].includes("%") ? (parseInt(matches[4]) * 255) | 0 : parseInt(matches[4]);
        } else if (REGEX_RGB_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_RGB_FUNC);
            this._red = matches[1].includes("%") ? (parseInt(matches[1]) * 255) | 0 : parseInt(matches[1]);
            this._green = matches[2].includes("%") ? (parseInt(matches[2]) * 255) | 0 : parseInt(matches[2]);
            this._blue = matches[3].includes("%") ? (parseInt(matches[3]) * 255) | 0 : parseInt(matches[3]);
            this._alpha = 1;
        } else if (REGEX_HSL_FUNC_NON_CAP.test(colorString)) {
            let matches = colorString.match(REGEX_HSL_FUNC);
            // TODO: complete hsl parsing and make cmyk parsing
        } else {
            throw new Error(`string "${colorString}" is not a known color format.`);
        }
    }
}