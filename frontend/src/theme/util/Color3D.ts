import Vector3D from "./Vector3D";

const ANGLE_RED_GREEN = 120;
const ANGLE_RED_BLUE = 240;
const Y_AXIS_1 = new Vector3D(0, 1, 0);

const redVector = new Vector3D(Math.cos(Math.asin((100 / 255) / 3)), 0, (100 / 255) / 3);
const greenVector = redVector.clone().rotate(ANGLE_RED_GREEN, Y_AXIS_1);
const blueVector = redVector.clone().rotate(ANGLE_RED_BLUE, Y_AXIS_1);
//const greenVector = new Vector3D(Math.cos(Math.asin((100 / 255) / 3)), 0, (100 / 255) / 3);
//const blueVector = new Vector3D(Math.cos(Math.asin((100 / 255) / 3)), 0, (100 / 255) / 3);

export default class Color3D {

}