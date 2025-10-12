import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {Physics, type RapierRigidBody, RigidBody} from "@react-three/rapier";
import { useControls } from "leva";
import * as THREE from "three";

const Drone = () => {
  const body = useRef<RapierRigidBody | null >(null);

  // Control panel for motor thrusts (in Newtons)
  const { m1, m2, m3, m4 } = useControls("Motor thrusts", {
    m1: { value: 0, min: 0, max: 10, step: 0.1 },
    m2: { value: 0, min: 0, max: 10, step: 0.1 },
    m3: { value: 0, min: 0, max: 10, step: 0.1 },
    m4: { value: 0, min: 0, max: 10, step: 0.1 },
  });

  const motorOffsets = [
    new THREE.Vector3(0.5, 0, 0.5),
    new THREE.Vector3(-0.5, 0, 0.5),
    new THREE.Vector3(-0.5, 0, -0.5),
    new THREE.Vector3(0.5, 0, -0.5),
  ];

  const thrusts = [m1, m2, m3, m4];

  useFrame(() => {
    if (!body.current) return;
    motorOffsets.forEach((offset, i) => {
      // Transform offset to world coordinates
      const pos = body.current.translation();
      const worldPoint = new THREE.Vector3(pos.x, pos.y, pos.z).add(offset);
      // Apply upward force at each motor
      body.current.applyImpulseAtPoint(
        { x: 0, y: thrusts[i] * 0.01, z: 0 },
        worldPoint,
        true
      );
    });
  });

  return (
      <RigidBody ref={body} colliders="cuboid" restitution={0.3} position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 1]}/>
          <meshStandardMaterial color="#0077ff"/>
        </mesh>
        <mesh position={[0, 0, 0.6]} rotation={[Math.PI /2, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]}/>
          <meshStandardMaterial color="red"/>
        </mesh>

        {motorOffsets.map((offset, i) => (
            <primitive key={i} object={new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), offset, 0.5, 0xff0000)}/>
        ))}
      </RigidBody>
  );
};

export default function DroneSim() {
  return (
      <Canvas shadows camera={{position: [3, 3, 3], fov: 50}}>
        <ambientLight intensity={0.3}/>
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow/>

        <Physics gravity={[0, -9.81, 0]}>
          <Drone/>
          {/* Ground plane */}
          <RigidBody type="fixed">
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[20, 20]}/>
              <meshStandardMaterial color="#999"/>
            </mesh>
          </RigidBody>
        </Physics>
        <OrbitControls/>
      </Canvas>
  );
}