import { Mat3, Vec3 } from "./math.ts";
import { Mat4 } from "../mat4.ts";
import { Vec4 } from "../vec4.ts";

const getError = (attitude_current: Mat3, attitude_target: Mat3) => {
	const Re = attitude_target.mul(attitude_current.transpose());

	return Re.toAxisAngleVector();
};

let e_previous = Vec3.ZERO;
let e_i = Vec3.ZERO;

const J = Mat3.fromDiagonal(0.02, 0.025, 0.03);
const wn = new Vec3(10, 10, 6);
const zeta = 0.7;

const Kp = Mat3.fromDiagonalV(J.toDiagonal().hadamard(wn.hadamard(wn)));
const Kd = Mat3.fromDiagonalV(
	J.toDiagonal()
		.hadamard(wn)
		.scale(2 * zeta),
);

const km = 1;
const L = Math.sqrt(2);
const mixer = new Mat4(
	...[-L / Math.sqrt(2), L / Math.sqrt(2), -L / Math.sqrt(2), L / Math.sqrt(2)], // roll (haha in your face prettier)
	...[-km, km, km, -km], // yaw
	...[-L / Math.sqrt(2), -L / Math.sqrt(2), L / Math.sqrt(2), L / Math.sqrt(2)], // pitch
	...[1, 1, 1, 1], // total
);
const mixer_inv = mixer.invert();

const T = 1;

const loop = (attitude_current: Mat3, attitude_target: Mat3, dt: number, log: boolean = false) => {
	const e = attitude_target.mul(attitude_current.transpose()).toAxisAngleVector();

	const e_p = e;
	e_i = e_i.add(e.scale(dt));
	const omega = e_previous.sub(e).scale(1 / dt);
	const e_d = omega;

	// console.log(e_p.abs(), e_i.abs(), e_d.abs());

	const tau = e_p
		.mul(Kp)
		.neg()
		.add(e_d.mul(Kd).neg())
		.add(omega.cross(omega.mul(J)));

	const forces = new Vec4(tau.x, tau.y, tau.z, T).mul(mixer_inv);

	if (log) {
		// console.log(Kp.toString());
		// console.log(Kd.toString());
		// console.log(tau.toString());
	}

	e_previous = e;

	return forces;
};

export default loop;
