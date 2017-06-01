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
                for (let i = 0; i <= 10; i++) {
                    let harmonyColor = primary.clone();
                    harmonyColor.key = i * 10;
                    this.harmonyColors.push(harmonyColor);
                }
                break;
            case ThemeType.ANALOGOUS:
                this.harmonyColors.push(primary);
                this.harmonyColors.push(primary.clone().rotate(30));
                this.harmonyColors.push(primary.clone().rotate(-30));
                break;
        }
    }

    private static _hexToDec(hex: string) {
        return Number(`0x${hex}`);
    }

}