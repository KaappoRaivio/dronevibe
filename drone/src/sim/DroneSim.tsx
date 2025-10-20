import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, type RapierRigidBody, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Mat3, Vec3 } from "./math.ts";
import loop from "./sim.ts";
import { COPTER_HEIGHT, COPTER_LENGTH, COPTER_MASS, COPTER_WIDTH } from "../constants.ts";

type Props = {
	targetPitch: number;
	targetRoll: number;
	targetYaw: number;
};

const Drone = ({ targetPitch, targetRoll, targetYaw }: Props) => {
	const body = useRef<RapierRigidBody | null>(null);

	const motorOffsets = [
		new THREE.Vector3(-0.5, 0, -0.5), // asd
		new THREE.Vector3(0.5, 0, -0.5), // asd
		new THREE.Vector3(-0.5, 0, 0.5), // asd
		new THREE.Vector3(0.5, 0, 0.5), // asd
	];

	const c = useRef(0);

	const [thrusts, setThrusts] = useState([0, 0, 0, 0]);

	useFrame((_, dt) => {
		if (body.current != null) {
			c.current++;

			const attitude_target = Mat3.IDENTITY.rotate(new Vec3(0, 1, 0), (targetYaw / 180) * Math.PI)
				.rotate(new Vec3(1, 0, 0), (targetPitch / 180) * Math.PI)
				.rotate(new Vec3(0, 0, 1), (targetRoll / 180) * Math.PI);

			const rot = body.current.rotation();
			const pos = body.current.translation();

			let attitude_current = Mat3.fromQuaternion(rot);
			const forces = loop(attitude_current, attitude_target, pos.y, 3, dt);
			const thrusts = [forces.x, forces.y, forces.z, forces.w];
			setThrusts(thrusts);

			// console.log(forces);

			motorOffsets.forEach((offset, i) => {
				// Transform offset to world coordinates
				const worldPoint = new THREE.Vector3(pos.x, pos.y, pos.z).add(offset);

				const up = new Vec3(offset.x * 0.1, 1, 0).scale(thrusts[i]).scale(dt);
				const rotated = up.mul(attitude_current);

				// Apply upward force at each motor
				body.current.applyImpulseAtPoint(rotated, worldPoint, false);
			});

			body.current.wakeUp();
		}
	});

	return (
		<>
			<RigidBody ref={body} colliders={false} restitution={0.3} position={[0, 3, 0]} rotation={[0, 0.0, 0]} angularVelocity={[0.0, 0, -0]}>
				<CuboidCollider mass={COPTER_MASS} args={[COPTER_WIDTH, COPTER_HEIGHT, COPTER_LENGTH]} />
				<mesh castShadow receiveShadow>
					<boxGeometry args={[COPTER_WIDTH * 2, COPTER_HEIGHT * 2, COPTER_LENGTH * 2]} />
					<meshStandardMaterial color="#0077ff" />
				</mesh>
				<mesh position={[0, 0, COPTER_LENGTH + 0.1]} rotation={[Math.PI / 2, 0, 0]}>
					<coneGeometry args={[0.05, 0.2, 8]} />
					<meshStandardMaterial color="red" />
				</mesh>
				{motorOffsets.map((offset, i) => (
					<primitive key={i} object={new THREE.ArrowHelper(new THREE.Vector3(offset.x, 1, 0), offset, thrusts[i] * 5, 0xff0000)} />
				))}
			</RigidBody>
		</>
	);
};

export default function DroneSim() {
	const [targetPitch, setTargetPitch] = useState(0);
	const [targetRoll, setTargetRoll] = useState(0);
	const [targetYaw, setTargetYaw] = useState(0);
	useEffect(() => {
		console.log(targetYaw);
	}, [targetYaw]);

	const ref = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		const onKey = (e) => {
			if (e.type === "keydown") {
				switch (e.key) {
					case "w":
						setTargetPitch(20);
						break;
					case "s":
						setTargetPitch(-20);
						break;
					case "a":
						setTargetRoll(-20);
						break;
					case "d":
						setTargetRoll(20);
						break;
					case "e":
						setTargetYaw((x) => x - 1);
						break;
					case "q":
						setTargetYaw((x) => x + 1);
						break;
					default:
						break;
				}
			} else {
				switch (e.key) {
					case "w":
						setTargetPitch(0);
						break;
					case "s":
						setTargetPitch(0);
						break;
					case "a":
						setTargetRoll(0);
						break;
					case "d":
						setTargetRoll(0);
						break;
				}
			}
		};
		document.addEventListener("keydown", onKey);
		document.addEventListener("keyup", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("keyupddf", onKey);
		};
	}, []);

	return (
		<div ref={ref}>
			<Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
				<ambientLight intensity={0.3} />
				<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

				<Physics gravity={[0, -9.81, 0]}>
					<Drone targetPitch={targetPitch} targetRoll={targetRoll} targetYaw={targetYaw} />
					<RigidBody type="fixed">
						<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
							<planeGeometry args={[20, 20]} />
							<meshStandardMaterial color="#999" />
						</mesh>
					</RigidBody>
				</Physics>
				<OrbitControls />
			</Canvas>
		</div>
	);
}
