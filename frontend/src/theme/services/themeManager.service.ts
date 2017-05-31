import {Injectable} from "@angular/core";
import Color, {IColor} from "../util/Color";


export enum ThemeType {
    ACCENTEDANALOGOUS,
    MONOCHROMATIC,
    COMPLEMENTARY,
    ANALOGOUS,
    TRIAD,
    SPLITCOMPLEMENTARY,
    TETRADIC,
    SQUARE
}

export interface IThemeManager {
    setTheme(primaryColor: string, type: ThemeType): void;
}

@Injectable()
export default class ThemeManager implements IThemeManager{

    private harmonyColors: Array<IColor> = [];
    private complementaryColors: Array<IColor> = [];

    /**
     *
     * @param {string} primaryColor the primary color of the scheme
     * @param {number} type
     * @param {number=} hue rotation for left and right colors (only for
     * @param {number=} outerHue
     */
    setTheme(primaryColor: string, type: ThemeType = ThemeType.ANALOGOUS, hue?: number, outerHue?: number) {
        let primary = new Color(primaryColor);
        switch (type) {
            case ThemeType.MONOCHROMATIC:
                this.harmonyColors = [
                    primary.
                ]
                break;
            case ThemeType.ANALOGOUS:
                primary
        }
    }

    private static _hexToDec(hex: string) {
        return Number(`0x${hex}`);
    }

}