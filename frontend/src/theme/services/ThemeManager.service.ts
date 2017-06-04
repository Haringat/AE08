import {Injectable} from "@angular/core";
import Color from "../util/Color";

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
    setTheme(primaryColor: string, type?: ThemeType, hue?: number, outerHue?: number): void;
}

@Injectable()
export default class ThemeManager implements IThemeManager {

    private colors = [];

    /**
     *
     * @param {string} primaryColor the primary color of the scheme
     * @param {number} type
     * @param {number=} hue rotation for left and right colors (only for analogous
     * @param {number=} outerHue
     */
    setTheme(primaryColor: string, type: ThemeType = ThemeType.ACCENTEDANALOGOUS, hue: number = 30, outerHue: number = 60) {
        let primary = new Color(primaryColor);
        switch (type) {
            case ThemeType.ACCENTEDANALOGOUS:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(hue));
                this.colors.push(primary.clone().rotate(-hue));
                this.colors.push(primary.clone().rotate(180));
                break;
            case ThemeType.MONOCHROMATIC:
                primary.key = 0;
                for (let i = 0; i <= 10; i++) {
                    let color = primary.clone();
                    color.key = i * 10;
                    this.colors.push(color);
                }
                break;
            case ThemeType.COMPLEMENTARY:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(180));
                break;
            case ThemeType.ANALOGOUS:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(hue));
                this.colors.push(primary.clone().rotate(-hue));
                break;
            case ThemeType.TRIAD:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(120));
                this.colors.push(primary.clone().rotate(240));
                break;
            case ThemeType.SPLITCOMPLEMENTARY:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(180 + hue));
                this.colors.push(primary.clone().rotate(180 - hue));
                break;
            case ThemeType.TETRADIC:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(hue));
                this.colors.push(primary.clone().rotate(-hue));
                this.colors.push(primary.clone().rotate(outerHue));
                this.colors.push(primary.clone().rotate(-outerHue));
                break;
            case ThemeType.SQUARE:
                this.colors.push(primary);
                this.colors.push(primary.clone().rotate(90));
                this.colors.push(primary.clone().rotate(-90));
                this.colors.push(primary.clone().rotate(180));
        }
    }

}