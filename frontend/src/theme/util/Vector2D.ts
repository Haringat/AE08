export interface IVector2D {
    x: number;
    y: number;
    readonly length: number;
    clone(): IVector2D;
    rotate(degrees: number): IVector2D;
    normalize(): IVector2D;
    add(other: IVector2D): IVector2D;
    subtract(other: IVector2D): IVector2D;
    cross(other: IVector2D): number;

    multiply(scalar: number): IVector2D;
    multiply(vector: IVector2D): IVector2D;
}

export function degToRad(degrees: number) {
    return degrees / 180 * Math.PI;
}

export function radToDeg(rads: number) {
    return rads / Math.PI * 180;
}

export default class Vector2D implements IVector2D {

    public x: number;
    public y: number;

    public get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public get ratation() {
        return Vector2D.angleBetweenVectors(this, new Vector2D(1,0));
    }

    public constructor();
    public constructor(x: number, y: number);
    public constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public rotate(degrees: number) {
        let alpha = Math.acos(this.x) + (degrees / 180 * Math.PI);
        let length = this.length;
        this.x = Math.cos(alpha) * length;
        this.y = Math.sin(alpha) * length;
        return this;
    }

    public normalize() {
        let length = this.length;
        this.x /= length;
        this.y /= length;
        return this;
    }

    public clone() {
        return new Vector2D(this.x, this.y);
    }

    public static fromLengthAndRotation(length: number, degrees: number) {
        let alpha = degToRad(degrees);
        let x = Math.cos(alpha) * length;
        let y = Math.sin(alpha) * length;
        return new Vector2D(x, y);
    }

    public cross(other: IVector2D) {
        return this.x * other.y - this.y * other.x;
    }

    public multiply(scalar: number);
    public multiply(vector: IVector2D);
    public multiply(other: number | IVector2D) {
        if (typeof other === "number") {
            this.x *= other;
            this.y *= other;
        } else if (typeof other === "object" && other.hasOwnProperty("x") && other.hasOwnProperty("y")) {
            return this.x * other.x + this.y * other.y;
        }
    }

    public add(other: IVector2D) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    public subtract(other: IVector2D) {
        this.add(other.clone().multiply(-1));
        return this;
    }

    public static angleBetweenVectors(a: IVector2D, b: IVector2D) {
        let c = a.clone().subtract(b);
        return radToDeg(Math.acos((c.length * c.length - a.length * a.length - b.length * b.length) / ( 2 * a.length * b.length)));
    }
}