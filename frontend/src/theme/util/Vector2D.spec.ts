import test from "ava";
import Vector2D, {angleBetweenVectors, radToDeg, toPrecision} from "./Vector2D";
import Color3D from "./Color3D";

test("can create 2D vectors", async spec => {
    new Color3D();
    spec.plan(2);
    let v = new Vector2D(1,2);
    spec.is(v.x, 1);
    spec.is(v.y, 2);
});

test("length can be determined", async spec => {
    spec.plan(1);
    let v = new Vector2D(3, 4);
    spec.is(v.length, 5);
});

test("can be rotated", async spec => {
    spec.plan(2);
    let v = new Vector2D(10, 0);
    v.rotate(30);
    spec.is(v.x, Math.cos(30 / 180 * Math.PI) * 10);
    spec.is(v.y, Math.sin(30 / 180 * Math.PI) * 10);
});

test("can be added to one another", async spec => {
    spec.plan(2);
    let v = new Vector2D(2, 4);
    v.add(new Vector2D(1.5, .2));
    v.add(new Vector2D(.1, 0));
    spec.is(v.x, 3.6);
    spec.is(v.y, 4.2);
});


test("can be scaled", async spec => {

    spec.plan(2);

    const VX = 3;
    const VY = 4;

    let v1 = new Vector2D(VX, VY);
    v1.normalize();
    // ignore floating point precision errors
    const v1Length = toPrecision(Math.sqrt(v1.x * v1.x + v1.y * v1.y), 10);
    spec.is(v1Length, 1);

    let v2 = new Vector2D(VX, VY);
    v2.scale(2);
    // ignore floating point precision errors
    const v2Length = toPrecision(Math.sqrt(v2.x * v2.x + v2.y * v2.y), 10);
    spec.is(v2Length, 10);

});

test("can calculate angle between vectors", async spec => {
    spec.plan(2);

    let v1 = new Vector2D(2, 4);
    let v2 = new Vector2D(3, 1);
    spec.is(toPrecision(angleBetweenVectors(v1, v2), 10), 45);

    v1 = new Vector2D(-2, -4);
    spec.is(toPrecision(angleBetweenVectors(v1, v2), 10), 135);
});