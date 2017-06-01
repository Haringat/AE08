import test from "ava";
import Vector2D from "./Vector2D";

test("can create 2D vectors", async spec => {
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