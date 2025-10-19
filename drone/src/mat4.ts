export class Mat4 {
  x1: number;
  x2: number;
  x3: number;
  x4: number; // row 1
  y1: number;
  y2: number;
  y3: number;
  y4: number; // row 2
  z1: number;
  z2: number;
  z3: number;
  z4: number; // row 3
  w1: number;
  w2: number;
  w3: number;
  w4: number; // row 4
  _isMatrix: true;

  static IDENTITY = new Mat4(
    1,
    0,
    0,
    0, // row 1
    0,
    1,
    0,
    0, // row 2
    0,
    0,
    1,
    0, // row 3
    0,
    0,
    0,
    1, // row 4
  );

  constructor(
    x1: number,
    x2: number,
    x3: number,
    x4: number,
    y1: number,
    y2: number,
    y3: number,
    y4: number,
    z1: number,
    z2: number,
    z3: number,
    z4: number,
    w1: number,
    w2: number,
    w3: number,
    w4: number,
  ) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.x4 = x4;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.y4 = y4;
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;
    this.z4 = z4;
    this.w1 = w1;
    this.w2 = w2;
    this.w3 = w3;
    this.w4 = w4;
    this._isMatrix = true;
  }

  mul(other: Mat4): Mat4 {
    return new Mat4(
      // row 1
      this.x1 * other.x1 +
        this.x2 * other.y1 +
        this.x3 * other.z1 +
        this.x4 * other.w1,
      this.x1 * other.x2 +
        this.x2 * other.y2 +
        this.x3 * other.z2 +
        this.x4 * other.w2,
      this.x1 * other.x3 +
        this.x2 * other.y3 +
        this.x3 * other.z3 +
        this.x4 * other.w3,
      this.x1 * other.x4 +
        this.x2 * other.y4 +
        this.x3 * other.z4 +
        this.x4 * other.w4,

      // row 2
      this.y1 * other.x1 +
        this.y2 * other.y1 +
        this.y3 * other.z1 +
        this.y4 * other.w1,
      this.y1 * other.x2 +
        this.y2 * other.y2 +
        this.y3 * other.z2 +
        this.y4 * other.w2,
      this.y1 * other.x3 +
        this.y2 * other.y3 +
        this.y3 * other.z3 +
        this.y4 * other.w3,
      this.y1 * other.x4 +
        this.y2 * other.y4 +
        this.y3 * other.z4 +
        this.y4 * other.w4,

      // row 3
      this.z1 * other.x1 +
        this.z2 * other.y1 +
        this.z3 * other.z1 +
        this.z4 * other.w1,
      this.z1 * other.x2 +
        this.z2 * other.y2 +
        this.z3 * other.z2 +
        this.z4 * other.w2,
      this.z1 * other.x3 +
        this.z2 * other.y3 +
        this.z3 * other.z3 +
        this.z4 * other.w3,
      this.z1 * other.x4 +
        this.z2 * other.y4 +
        this.z3 * other.z4 +
        this.z4 * other.w4,

      // row 4
      this.w1 * other.x1 +
        this.w2 * other.y1 +
        this.w3 * other.z1 +
        this.w4 * other.w1,
      this.w1 * other.x2 +
        this.w2 * other.y2 +
        this.w3 * other.z2 +
        this.w4 * other.w2,
      this.w1 * other.x3 +
        this.w2 * other.y3 +
        this.w3 * other.z3 +
        this.w4 * other.w3,
      this.w1 * other.x4 +
        this.w2 * other.y4 +
        this.w3 * other.z4 +
        this.w4 * other.w4,
    );
  }

  transpose(): Mat4 {
    return new Mat4(
      this.x1,
      this.y1,
      this.z1,
      this.w1,
      this.x2,
      this.y2,
      this.z2,
      this.w2,
      this.x3,
      this.y3,
      this.z3,
      this.w3,
      this.x4,
      this.y4,
      this.z4,
      this.w4,
    );
  }

  scale(s: number): Mat4 {
    return new Mat4(
      this.x1 * s,
      this.x2 * s,
      this.x3 * s,
      this.x4 * s,
      this.y1 * s,
      this.y2 * s,
      this.y3 * s,
      this.y4 * s,
      this.z1 * s,
      this.z2 * s,
      this.z3 * s,
      this.z4 * s,
      this.w1 * s,
      this.w2 * s,
      this.w3 * s,
      this.w4 * s,
    );
  }

  add(other: Mat4): Mat4 {
    return new Mat4(
      this.x1 + other.x1,
      this.x2 + other.x2,
      this.x3 + other.x3,
      this.x4 + other.x4,
      this.y1 + other.y1,
      this.y2 + other.y2,
      this.y3 + other.y3,
      this.y4 + other.y4,
      this.z1 + other.z1,
      this.z2 + other.z2,
      this.z3 + other.z3,
      this.z4 + other.z4,
      this.w1 + other.w1,
      this.w2 + other.w2,
      this.w3 + other.w3,
      this.w4 + other.w4,
    );
  }

  sub(other: Mat4): Mat4 {
    return this.add(other.scale(-1));
  }

  invert(): Mat4 {
    const m = [
      this.x1,
      this.x2,
      this.x3,
      this.x4,
      this.y1,
      this.y2,
      this.y3,
      this.y4,
      this.z1,
      this.z2,
      this.z3,
      this.z4,
      this.w1,
      this.w2,
      this.w3,
      this.w4,
    ];

    const inv = new Array(16);

    inv[0] =
      m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];
    inv[1] =
      -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];
    inv[2] =
      m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];
    inv[3] =
      -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];

    inv[4] =
      -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];
    inv[5] =
      m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];
    inv[6] =
      -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];
    inv[7] =
      m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];

    inv[8] =
      m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];
    inv[9] =
      -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];
    inv[10] =
      m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];
    inv[11] =
      -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];

    inv[12] =
      -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];
    inv[13] =
      m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];
    inv[14] =
      -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];
    inv[15] =
      m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det === 0) throw new Error("Matrix is singular and cannot be inverted");

    det = 1.0 / det;
    for (let i = 0; i < 16; i++) inv[i] *= det;

    return new Mat4(
      inv[0],
      inv[1],
      inv[2],
      inv[3],
      inv[4],
      inv[5],
      inv[6],
      inv[7],
      inv[8],
      inv[9],
      inv[10],
      inv[11],
      inv[12],
      inv[13],
      inv[14],
      inv[15],
    );
  }

  toString(): string {
    return (
      `${this.x1} ${this.x2} ${this.x3} ${this.x4}\n` +
      `${this.y1} ${this.y2} ${this.y3} ${this.y4}\n` +
      `${this.z1} ${this.z2} ${this.z3} ${this.z4}\n` +
      `${this.w1} ${this.w2} ${this.w3} ${this.w4}`
    );
  }
}
