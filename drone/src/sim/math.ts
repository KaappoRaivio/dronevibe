export class Vec3 {
  static ZERO = new Vec3(0, 0, 0);
  x: number;
  y: number;
  z: number;
  _isVector: true;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    if (z != null) {
      this.z = z;
    } else {
      this.z = 1;
    }

    this._isVector = true;
  }

  add(other: Vec3): Vec3 {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  scale(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  dot(other: Vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  mul(other: Mat3): Vec3 {
    const xVector = new Vec3(other.x1, other.x2, other.x3).dot(this);
    const yVector = new Vec3(other.y1, other.y2, other.y3).dot(this);
    const zVector = new Vec3(other.z1, other.z2, other.z3).dot(this);

    return new Vec3(xVector, yVector, zVector);
  }

  hadamard(other: Vec3) {
    return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  neg(): Vec3 {
    return this.scale(-1);
  }

  sub(other: Vec3): Vec3 {
    return this.add(other.neg());
  }

  normalize(): Vec3 {
    return this.scale(1 / Math.hypot(this.x, this.y, this.z));
  }

  length(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.x * other.z - this.z * other.x,
      this.x * other.y - this.y * other.x,
    );
  }

  angle(other: Vec3): number {
    let angle = Math.acos(this.dot(other));

    if (this.cross(other).dot(new Vec3(0, 0, 1)) > 0) {
      angle *= -1;
    }

    return angle;
  }

  at(row_zeroBased: number): number {
    switch (row_zeroBased) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("Out of bounds for Vec3");
    }
  }

  abs(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  toString(): string {
    return `(${this.x} ${this.y} ${this.z}) ^ T`;
  }
}

export class Mat3 {
  x1: number;
  x2: number;
  x3: number;
  y1: number;
  y2: number;
  y3: number;
  z1: number;
  z2: number;
  z3: number;
  _isMatrix: true;

  static IDENTITY = new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);

  static fromQuaternion({
    x,
    y,
    z,
    w,
  }: {
    x: number;
    y: number;
    z: number;
    w: number;
  }) {
    const a = w;
    const b = x;
    const c = y;
    const d = z;

    return new Mat3(
      a * a + b * b - c * c - d * d,
      2 * b * c - 2 * a * d,
      2 * b * d + 2 * a * c,
      2 * b * c + 2 * a * d,
      a * a - b * b + c * c - d * d,
      2 * c * d - 2 * a * b,
      2 * b * d - 2 * a * c,
      2 * c * d + 2 * a * b,
      a * a - b * b - c * c + d * d,
    );
  }

  static fromDiagonal(x1: number, y2: number, z3: number) {
    return new Mat3(x1, 0, 0, 0, y2, 0, 0, 0, z3);
  }

  static fromDiagonalV(v: Vec3) {
    return this.fromDiagonal(v.x, v.y, v.z);
  }

  constructor(
    x1: number,
    x2: number,
    x3: number,
    y1: number,
    y2: number,
    y3: number,
    z1: number,
    z2: number,
    z3: number,
  ) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;

    this._isMatrix = true;
  }

  mul(other: Mat3) {
    return new Mat3(
      this.x1 * other.x1 + this.x2 * other.y1 + this.x3 * other.z1,
      this.x1 * other.x2 + this.x2 * other.y2 + this.x3 * other.z2,
      this.x1 * other.x3 + this.x2 * other.y3 + this.x3 * other.z3,
      this.y1 * other.x1 + this.y2 * other.y1 + this.y3 * other.z1,
      this.y1 * other.x2 + this.y2 * other.y2 + this.y3 * other.z2,
      this.y1 * other.x3 + this.y2 * other.y3 + this.y3 * other.z3,
      this.z1 * other.x1 + this.z2 * other.y1 + this.z3 * other.z1,
      this.z1 * other.x2 + this.z2 * other.y2 + this.z3 * other.z2,
      this.z1 * other.x3 + this.z2 * other.y3 + this.z3 * other.z3,
    );
  }

  scale(other: number): Mat3 {
    return new Mat3(
      this.x1 * other,
      this.x2 * other,
      this.x3 * other,
      this.y1 * other,
      this.y2 * other,
      this.y3 * other,
      this.z1 * other,
      this.z2 * other,
      this.z3 * other,
    );
  }

  transpose(): Mat3 {
    return new Mat3(
      this.x1,
      this.y1,
      this.z1,
      this.x2,
      this.y2,
      this.z2,
      this.x3,
      this.y3,
      this.z3,
    );
  }
  // translate(x: number, y: number) {
  //     return this.mul(new Mat3(
  //         1, 0, x,
  //         0, 1, y,
  //         0, 0, 1
  //     ))
  // }

  // translateV(vector: Vector3): Mat3 {
  //     return this.translate(vector.x, vector.y)
  // }

  // rotate(radians: number): Mat3 {
  //     const cos = Math.cos(radians)
  //     const sin = Math.sin(radians)
  //     return this.mul(new Mat3(
  //         cos, -sin, 0,
  //         sin, cos, 0,
  //         0, 0, 1
  //     ))
  // }

  at(column_zeroBased: number): Vec3 {
    switch (column_zeroBased) {
      case 0:
        return new Vec3(this.x1, this.y1, this.z1);
      case 1:
        return new Vec3(this.x2, this.y2, this.z2);
      case 2:
        return new Vec3(this.x3, this.y3, this.z3);
      default:
        throw new Error("Out of bounds for Mat3");
    }
  }

  scaleXYZ(factor: number) {
    return this.mul(new Mat3(factor, 0, 0, 0, factor, 0, 0, 0, factor));
  }

  trace(): number {
    return this.x1 + this.y2 + this.z3;
  }

  add(other: Mat3): Mat3 {
    return new Mat3(
      this.x1 + other.x1,
      this.x2 + other.x2,
      this.x3 + other.x3,
      this.y1 + other.y1,
      this.y2 + other.y2,
      this.y3 + other.y3,
      this.z1 + other.z1,
      this.z2 + other.z2,
      this.z3 + other.z3,
    );
  }

  sub(other: Mat3): Mat3 {
    return this.add(other.scale(-1));
  }

  toString(): string {
    return `${this.x1.toFixed(2)} ${this.x2.toFixed(2)} ${this.x3.toFixed(2)}
${this.y1.toFixed(2)} ${this.y2.toFixed(2)} ${this.y3.toFixed(2)}
${this.z1.toFixed(2)} ${this.z2.toFixed(2)} ${this.z3.toFixed(2)}`;
  }

  toAxisAngleVector(): Vec3 {
    const cosTheta = Math.max(-1, Math.min(1.0, (this.trace() - 1) / 2));
    const theta = Math.acos(cosTheta);

    if (Math.abs(theta) < 0.1) {
      const S = this.sub(this.transpose()).scale(0.5);
      return new Vec3(S.at(1).at(2), S.at(2).at(0), S.at(0).at(1));
    } else {
      const u = new Vec3(
        this.at(1).at(2) - this.at(2).at(1),
        this.at(2).at(0) - this.at(0).at(2),
        this.at(0).at(1) - this.at(1).at(0),
      ).scale(1 / (2 * Math.sin(theta)));

      return u.scale(theta);
    }
  }

  toDiagonal(): Vec3 {
    return new Vec3(this.x1, this.y2, this.z3);
  }
}
