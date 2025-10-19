import { Mat3 } from "./math.ts";

const getError = (attitude_current: Mat3, attitude_target: Mat3) => {
  const Re = attitude_target.mul(attitude_current.transpose());

  return Re.toAxisAngleVector();
};

let attitude_previous = Mat3.IDENTITY;

const loop = (attitude_current: Mat3, attitude_target: Mat3, dt: number) => {
  const omega = attitude_previous
    .transpose()
    .mul(attitude_current)
    .toAxisAngleVector()
    .scale(1 / dt);

  console.log(omega.toString());

  attitude_previous = attitude_current;
};

export default loop;
