export default class Vector2D {

    public x: number;
    public y: number;

    public get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public constructor();
    public constructor(x: number, y: number);
    public constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

}