export interface IVector {
    length: number;
    clone(): IVector;
    scale(scale: number): IVector;
    normalize(): IVector;
    add(other: IVector): IVector;
    subtract(other: IVector): IVector;
    angleToVector(other: IVector): number;
    multiply(scalar: number): IVector;
    multiply(vector: IVector): number;
}

/**
 * @typedef IVector2D
 * @interface
 * @property {number} x
 * @property {number} y
 * @property {number} length
 * @property {number} rotation
 * @property {function():IVector2D} clone
 * @property {function(degrees:number):IVector2D} rotate
 * @property {function(scale:number):IVector2D} scale
 * @property {function():IVector2D} normalize
 * @property {function(other:IVector2D):IVector2D} add
 * @property {function(other:IVector2D):IVector2D} subtract
 * @property {function(other:IVector2D):number} cross
 * @property {function(other:IVector2D):number} angleToVector
 * @property {function(other:IVector2D):number} angleFromVector
 * @property {function(other:IVector2D):number} multiply
 * @property {function(other:number):IVector2D} multiply
 */
export interface IVector2D extends IVector {
    x: number;
    y: number;
    length: number;
    rotation: number;
    clone(): IVector2D;
    rotate(degrees: number): IVector2D;
    scale(scale: number): IVector2D;
    normalize(): IVector2D;
    add(other: IVector2D): IVector2D;
    subtract(other: IVector2D): IVector2D;
    cross(other: IVector2D): number;
    angleToVector(other: IVector2D): number;
    angleFromVector(other: IVector2D): number;
    multiply(scalar: number): IVector2D;
    multiply(vector: IVector2D): number;
}

export function angleBetweenVectors(a: IVector2D, b: IVector2D) {
    if (a.length === 0 || b.length === 0) {
        return 0;
    }
    let c = b.clone().add(a);
    return radToDeg(Math.acos((c.length * c.length - a.length * a.length - b.length * b.length) / ( 2 * a.length * b.length)));
}

export function toPrecision(num: number, precision: number) {
    return Math.round(num * 10 ** precision) / 10 ** precision;
}

export function degToRad(degrees: number) {
    return degrees / 180 * Math.PI;
}

export function radToDeg(rads: number) {
    return rads / Math.PI * 180;
}

export default class Vector2D implements IVector2D{

    public x: number;
    public y: number;

    public get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public set length(length: number) {
        this.scale(length / this.length);
    }

    public get rotation() {
        let alpha = toPrecision(radToDeg(Math.acos(this.x / this.length)), 10);
        if (this.y >= 0) {
            return alpha;
        } else {
            return alpha + 180;
        }
    }

    public set rotation(rotation: number) {
        this.rotate(rotation - this.rotation);
    }

    public constructor();
    public constructor(x: number, y: number);
    public constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public rotate(degrees: number): IVector2D {
        if (this.x === 0 && this.y === 0) {
            return this;
        }
        let alpha: number = degToRad((this.rotation + degrees) % 360);
        let length = this.length;
        this.x = Math.cos(alpha) * length;
        this.y = Math.sin(alpha) * length;
        return this;
    }

    /**
     * returns the mathematically positive angle from this vector to another vector
     * @param {IVector2D} other
     * @return {number}
     */
    public angleToVector(other: IVector2D) {
        if (this.length === 0 || other.length === 0) {
            return 0;
        }
        let delta = other.rotation - this.rotation;
        if (delta >= 0) {
            return delta;
        } else {
            return delta + 360;
        }
    }

    /**
     * returns the mathematically positive angle from another vector to this vector
     * @param other
     * @return {number}
     */
    public angleFromVector(other: IVector2D) {
        if (this.length === 0 || other.length === 0) {
            return 0;
        }
        let delta = this.rotation - other.rotation;
        if (delta >= 0) {
            return delta;
        } else {
            return delta + 360;
        }
    }

    public scale(length: number): IVector2D {
        this.x *= length;
        this.y *= length;
        return this;
    }

    public normalize(): IVector2D {
        return this.scale(1 / this.length);
    }

    public clone(): IVector2D {
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

    public multiply(scalar: number): IVector2D;
    public multiply(vector: IVector2D): number;
    public multiply(other: number | IVector2D): IVector2D | number {
        if (typeof other === "number") {
            this.x *= other;
            this.y *= other;
            return this;
        } else if (typeof other === "object" && other.hasOwnProperty("x") && other.hasOwnProperty("y")) {
            return this.x * other.x + this.y * other.y;
        }
    }

    public add(other: IVector2D): IVector2D {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    public subtract(other: IVector2D): IVector2D {
        this.add(other.clone().multiply(-1));
        return this;
    }

    public toString() {
        return `(${this.x}|${this.y})`;
    }

    public toJSON() {
        return `{"x":${this.x},"y":${this.y}}`;
    }
}