import { Mat3, Vec3 } from "./math.ts";
import { Mat4 } from "../mat4.ts";
import { Vec4 } from "../vec4.ts";
import { COPTER_HEIGHT, COPTER_LENGTH, COPTER_MASS, COPTER_WIDTH } from "../constants.ts";

let R_previous = Mat3.IDENTITY;
let e_i = Vec3.ZERO;

const J = Mat3.fromDiagonal((1 / 12) * COPTER_MASS * (Math.pow(COPTER_HEIGHT, 2) + Math.pow(COPTER_LENGTH, 2)), (1 / 12) * COPTER_MASS * (Math.pow(COPTER_WIDTH, 2) + Math.pow(COPTER_LENGTH, 2)), (1 / 12) * COPTER_MASS * (Math.pow(COPTER_HEIGHT, 2) + Math.pow(COPTER_WIDTH, 2)));
const wn = new Vec3(3, 0, 3);
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

const T = 0.0;

const loop = (R: Mat3, Rt: Mat3, dt: number, log: boolean = false) => {
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
	const forces = new Vec4(tau.x, tau.y, tau.z, T).mul(mixer_inv);

	R_previous = R;

	return forces;
};

export default loop;
