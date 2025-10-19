import type { Mat4 } from "./mat4.ts";

export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  add(other: Vec4): Vec4 {
    return new Vec4(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w,
    );
  }

  sub(other: Vec4): Vec4 {
    return new Vec4(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w,
    );
  }

  scale(s: number): Vec4 {
    return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s);
  }

  dot(other: Vec4): number {
    return (
      this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w
    );
  }

  length(): number {
    return Math.sqrt(this.dot(this));
  }

  normalize(): Vec4 {
    const len = this.length();
    if (len === 0) throw new Error("Cannot normalize zero-length vector");
    return this.scale(1 / len);
  }

  toString(): string {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)})`;
  }

  mul(mat: Mat4): Vec4 {
    return new Vec4(
      this.x * mat.x1 + this.y * mat.x2 + this.z * mat.x3 + this.w * mat.x4,
      this.x * mat.y1 + this.y * mat.y2 + this.z * mat.y3 + this.w * mat.y4,
      this.x * mat.z1 + this.y * mat.z2 + this.z * mat.z3 + this.w * mat.z4,
      this.x * mat.w1 + this.y * mat.w2 + this.z * mat.w3 + this.w * mat.w4,
    );
  }
}
