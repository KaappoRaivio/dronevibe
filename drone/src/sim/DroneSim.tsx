import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, type RapierRigidBody, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Mat3 } from "./math.ts";
import loop from "./sim.ts";
import { COPTER_HEIGHT, COPTER_LENGTH, COPTER_MASS, COPTER_WIDTH } from "../constants.ts";

const Drone = () => {
	const body = useRef<RapierRigidBody | null>(null);

	// Control panel for motor thrusts (in Newtons)
	// const { m1, m2, m3, m4 } = useControls("Motor thrusts", {
	// 	m1: { value: 0, min: 0, max: 1, step: 0.01 },
	// 	m2: { value: 0, min: 0, max: 1, step: 0.01 },
	// 	m3: { value: 0, min: 0, max: 1, step: 0.01 },
	// 	m4: { value: 0, min: 0, max: 1, step: 0.01 },
	// });

	const motorOffsets = [
		new THREE.Vector3(-0.5, 0, -0.5), // asd
		new THREE.Vector3(0.5, 0, -0.5), // asd
		new THREE.Vector3(-0.5, 0, 0.5), // asd
		new THREE.Vector3(0.5, 0, 0.5), // asd
	];

	// const thrusts = [m1, m2, m3, m4];

	const c = useRef(0);

	const [thrusts, setThrusts] = useState([0, 0, 0, 0]);

	// const [singleStep, setSingleStep] = useState(false);

	useFrame((_, dt) => {
		if (body.current != null) {
			c.current++;

			const attitude_target = Mat3.IDENTITY;

			const rot = body.current.rotation();

			const forces = loop(Mat3.fromQuaternion(rot), attitude_target, dt, c.current % 60 === 0);
			const thrusts = [forces.x, forces.y, forces.z, forces.w];
			setThrusts(thrusts);

			// console.log(forces);

			motorOffsets.forEach((offset, i) => {
				// Transform offset to world coordinates
				const pos = body.current.translation();
				const worldPoint = new THREE.Vector3(pos.x, pos.y, pos.z).add(offset);
				// Apply upward force at each motor
				body.current.applyImpulseAtPoint({ x: offset.x * thrusts[i] * dt, y: thrusts[i] * dt, z: 0 }, worldPoint, false);
			});

			body.current.wakeUp();
		}
	});

	return (
		<>
			<RigidBody ref={body} colliders={false} restitution={0.3} position={[0, 0.5, 0]} rotation={[0.1, 0, 0.9]} angularVelocity={[0, 1, 0]}>
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
	return (
		<Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
			<ambientLight intensity={0.3} />
			<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

			<Physics gravity={[0, 0, 0]}>
				<Drone />
				{/* Ground plane */}
				{/*<RigidBody type="fixed">*/}
				{/*	<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>*/}
				{/*		<planeGeometry args={[20, 20]} />*/}
				{/*		<meshStandardMaterial color="#999" />*/}
				{/*	</mesh>*/}
				{/*</RigidBody>*/}
			</Physics>
			<OrbitControls />
		</Canvas>
	);
}
