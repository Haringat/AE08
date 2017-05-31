import {Injectable} from "@angular/core";
import {IColor} from "../util/Color";


export enum ThemeType {
    ANALOGOUS,
    TRIAD,
    TETRAD
}

export interface IThemeManager {
    setTheme(primaryColor: string, type: ThemeType): void;
}

@Injectable()
export default class ThemeManager implements IThemeManager{

    private colors: Array<string>;

    setTheme(primaryColor: string, type: ThemeType = ThemeType.ANALOGOUS) {
        switch (type) {
            case ThemeType.ANALOGOUS:

        }
    }

    private static _rotate(color: IColor): IColor {

    }

    private static _hexToDec(hex: string) {
        return Number(`0x${hex}`);
    }

    private static _parseColor(color: string) {
        if (REGEX_RGBA_HEX_NON_CAP.test(color)) {
            let matches = color.match(REGEX_RGBA_HEX);
            return {
                red: this._hexToDec(matches[1]),
                green: this._hexToDec(matches[2]),
                blue: this._hexToDec(matches[3]),
                alpha: this._hexToDec(matches[4])
            };
        } else if (REGEX_RGB_HEX_NON_CAP.test(color)) {
            let matches = color.match(REGEX_RGB_HEX);
            return {
                red: this._hexToDec(matches[1]),
                green: this._hexToDec(matches[2]),
                blue: this._hexToDec(matches[3]),
                alpha: 1
            };
        } else if (REGEX_RGBA_FUNC_NON_CAP.test(color)) {
            let matches = color.match(REGEX_RGBA_FUNC);
            return {
                red: parseInt(matches[1]),
                green: parseInt(matches[2]),
                blue: parseInt(matches[3]),
                alpha: parseFloat(matches[4])
            };
        } else if (REGEX_RGB_FUNC_NON_CAP.test(color)) {
            let matches = color.match(REGEX_RGB_FUNC);
            return {
                red: parseInt(matches[1]),
                green: parseInt(matches[2]),
                blue: parseInt(matches[3]),
                alpha: 1
            };
        } else {
            throw new Error(`string "${color}" is not a known color format.`);
        }
    }

}