import { Mat3, Vec3 } from "./math.ts";
import { Mat4 } from "../mat4.ts";
import { Vec4 } from "../vec4.ts";
import { COPTER_HEIGHT, COPTER_LENGTH, COPTER_MASS, COPTER_WIDTH } from "../constants.ts";

let R_previous = Mat3.IDENTITY;
let e_i = Vec3.ZERO;

const J = Mat3.fromDiagonal((1 / 12) * COPTER_MASS * (Math.pow(COPTER_HEIGHT, 2) + Math.pow(COPTER_LENGTH, 2)), (1 / 12) * COPTER_MASS * (Math.pow(COPTER_WIDTH, 2) + Math.pow(COPTER_LENGTH, 2)), (1 / 12) * COPTER_MASS * (Math.pow(COPTER_HEIGHT, 2) + Math.pow(COPTER_WIDTH, 2)));

const wn = new Vec3(15, 10, 15);
const zeta = 0.7;

const Kp = Mat3.fromDiagonalV(J.toDiagonal().hadamard(wn.hadamard(wn)));
const Kd = Mat3.fromDiagonalV(
	J.toDiagonal()
		.hadamard(wn)
		.scale(2 * zeta),
);

const km = 1;
const L = Math.sqrt(2) / 2;
const mixer = new Mat4(
	...[-L / Math.sqrt(2), -L / Math.sqrt(2), L / Math.sqrt(2), L / Math.sqrt(2)], // roll  (haha in your face prettier)
	...[-km, km, km, -km], // yaw
	...[L / Math.sqrt(2), -L / Math.sqrt(2), L / Math.sqrt(2), -L / Math.sqrt(2)], // pitch
	...[1, 1, 1, 1], // total
).scale(1 / 4);
const mixer_inv = mixer.invert();

let eh_i = 0;
let eh_prev = 0;

const H_res = 1;

const alt_gains = new Vec3(COPTER_MASS * H_res * H_res, 0.1, H_res * COPTER_MASS * 2 * zeta);

const outer = (h: number, ht: number, dt: number) => {
	const eh = ht - h;

	eh_i += eh * dt;
	const eh_d = (eh - eh_prev) / dt;

	eh_prev = eh;

	return alt_gains.dot(new Vec3(eh, eh_i, eh_d));
};

const loop = (R: Mat3, Rt: Mat3, h: number, ht: number, dt: number) => {
	const T = outer(h, ht, dt);
	const G = (COPTER_MASS / 4) * 9.81;
	// const G = 0;

	const Re = Rt.mul(R.transpose());
	const e = Re.toAxisAngleVector();
	const omega = R_previous.mul(R.transpose())
		.toAxisAngleVector()
		.scale(1 / dt);

	const e_p = e;
	e_i = e_i.add(e.scale(dt));

	const e_d = omega;

	const tau = e_p
		.mul(Kp)
		.neg()
		.add(e_d.mul(Kd).neg())
		.add(omega.cross(omega.mul(J)));
	const forces = new Vec4(tau.x, tau.y, tau.z, T + G).mul(mixer_inv);

	R_previous = R;

	return forces;
};

export default loop;
