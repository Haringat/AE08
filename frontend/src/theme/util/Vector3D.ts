import {IVector, IVector2D, radToDeg, toPrecision, degToRad} from "./Vector2D";
import Matrix33 from "./Matrix33";

/**
 * @typedef IVector3D
 * @interface
 * @property {number} x
 * @property {number} y
 * @property {number} length
 * @property {number} rotation
 * @property {function():IVector3D} clone
 * @property {function(degrees:number, axis: IVector3D):IVector3D} rotate
 * @property {function(scale:number):IVector3D} scale
 * @property {function():IVector3D} normalize
 * @property {function(other:IVector3D):IVector3D} add
 * @property {function(other:IVector3D):IVector3D} subtract
 * @property {function(other:IVector3D):number} cross
 * @property {function(other:IVector3D):number} angleToVector
 * @property {function(other:IVector3D):number} angleFromVector
 * @property {function(other:IVector3D):number} multiply
 * @property {function(other:number):IVector3D} multiply
 */
export interface IVector3D extends IVector {
    x: number;
    y: number;
    z: number;
    rotation: number;
    clone(): IVector3D;
    scale(scale: number): IVector3D;
    cross(other: IVector3D | Matrix33): IVector3D;
    rotate(degrees: number, axis: IVector3D);
    normalize(): IVector3D;
    add(other: IVector3D): IVector3D;
    subtract(other: IVector3D): IVector3D;
    angleToVector(other: IVector3D): number;
    multiply(scalar: number): IVector3D;
    multiply(vector: IVector3D): number;
}

export function angleBetweenVectors(a: IVector3D, b: IVector3D) {
    if (a.length === 0 || b.length === 0) {
        return 0;
    }
    let c = b.clone().add(a);
    return radToDeg(Math.acos((c.length * c.length - a.length * a.length - b.length * b.length) / ( 2 * a.length * b.length)));
}

export default class Vector3D implements IVector {

    public x: number;
    public y: number;
    public z: number;

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

    public constructor();
    public constructor(x: number, y: number, z: number);
    public constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
     * returns the smallest angle from this vector to another vector
     * @param {IVector3D} other
     * @return {number}
     */
    public angleToVector(other: IVector3D) {
        return angleBetweenVectors(this, other);
    }

    public scale(length: number): IVector3D {
        this.x *= length;
        this.y *= length;
        this.z *= length;
        return this;
    }

    rotate(degrees: number, axis: IVector3D) {
        axis = axis.clone().normalize();
        const angle = degToRad(degrees);
        const sin_alpha = Math.sin(angle);
        const cos_alpha = Math.cos(angle);
        let rotationMatrix = new Matrix33([
            [axis.x ** 2 *     (1 - cos_alpha) + cos_alpha,          axis.x * axis.y * (1 - cos_alpha) - axis.z * sin_alpha, axis.x * axis.z * (1 - cos_alpha) + axis.y * sin_alpha],
            [axis.x * axis.y * (1 - cos_alpha) + axis.z * sin_alpha, axis.y ** 2 *     (1 - cos_alpha) + cos_alpha,          axis.y * axis.z * (1 - cos_alpha) - axis.x * sin_alpha],
            [axis.x * axis.z * (1 - cos_alpha) - axis.y * sin_alpha, axis.y * axis.z * (1 - cos_alpha) + axis.x * sin_alpha, axis.z ** 2 *     (1 - cos_alpha) + cos_alpha]
        ]);
        return this.cross(rotationMatrix);
    }

    public normalize(): IVector3D {
        return this.scale(1 / this.length);
    }

    public clone(): IVector3D {
        return new Vector3D(this.x, this.y, this.z);
    }

    public cross(other: IVector3D | Matrix33): IVector3D {
        if (other.hasOwnProperty("x") && other.hasOwnProperty("y") && other.hasOwnProperty("z")) {
            let otherVector: IVector3D = <IVector3D> other;
            return new Vector3D(this.y * otherVector.z - otherVector.y - this.z, this.z * otherVector.x - otherVector.z - this.x, this.x * otherVector.y - this.y - otherVector.x);
        } else {
            let matrix: Matrix33 = <Matrix33> other;
            let x = matrix.rows[0][0] * this.x + matrix.rows[0][1] * this.y + matrix.rows[0][2] * this.z;
            let y = matrix.rows[1][0] * this.x + matrix.rows[1][1] * this.y + matrix.rows[1][2] * this.z;
            let z = matrix.rows[2][0] * this.x + matrix.rows[2][1] * this.y + matrix.rows[2][2] * this.z;
            return new Vector3D(x, y, z);
        }
    }

    public multiply(scalar: number): IVector3D;
    public multiply(vector: IVector3D): number;
    public multiply(other: number | IVector3D): IVector3D | number {
        if (typeof other === "number") {
            this.x *= other;
            this.y *= other;
            this.z *= other;
            return this;
        } else if (typeof other === "object" && other.hasOwnProperty("x") && other.hasOwnProperty("y")) {
            return this.x * other.x + this.y * other.y;
        }
    }

    public add(other: IVector3D): IVector3D {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    public subtract(other: IVector3D): IVector3D {
        this.add(other.clone().multiply(-1));
        return this;
    }

    public toString() {
        return `(${this.x}|${this.y}|${this.z})`;
    }

    public toJSON() {
        return `{"x":${this.x},"y":${this.y},"z":${this.z}`;
    }
}