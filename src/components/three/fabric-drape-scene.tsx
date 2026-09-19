"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/* =========================================================
   FABRIC SHADER
   A plane mesh displaced by a few octaves of simplex-style
   noise, driven by a time uniform, textured with a procedural
   sindoor-rust / aged-brass / kohl-umber gradient (no fabric
   texture asset exists in public/images, so this is procedural
   per the design bible's explicit fallback allowance).
========================================================= */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vElevation;

  // Lightweight 2-octave value noise — kept simple per spec.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;

    vec2 p = uv * 3.0 + uTime * 0.06;
    float n = noise(p) * 0.6 + noise(p * 2.0) * 0.3 + noise(p * 4.0) * 0.1;

    // Mousemove-driven parallax tilt is applied on the mesh transform in JS;
    // here we add a subtle pointer-proximity ripple for extra "fabric" feel.
    float pointerInfluence = smoothstep(0.6, 0.0, distance(uv, uPointer * 0.5 + 0.5));

    float elevation = (n - 0.5) * 0.5 + pointerInfluence * 0.12;
    vElevation = elevation;

    vec3 displaced = position + normal * elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 base = mix(uColorC, uColorA, smoothstep(0.0, 1.0, vUv.y));
    base = mix(base, uColorB, smoothstep(0.3, 1.0, vUv.x) * 0.5);

    // Rim-light style highlight riding the displacement crest.
    float highlight = smoothstep(0.05, 0.4, vElevation);
    base += highlight * 0.25;

    gl_FragColor = vec4(base, 1.0);
  }
`;

const FabricMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointer: new THREE.Vector2(0, 0),
    uColorA: new THREE.Color("#b5472b"), // sindoor-rust
    uColorB: new THREE.Color("#8a7b4e"), // aged-brass
    uColorC: new THREE.Color("#1c1410"), // kohl-umber
  },
  vertexShader,
  fragmentShader,
);

extend({ FabricMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fabricMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

/* =========================================================
   DRAPED PLANE
========================================================= */

function DrapedPlane() {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uPointer: THREE.Vector2 }>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uPointer.lerp(
        new THREE.Vector2(pointer.current.x, pointer.current.y),
        0.05,
      );
    }

    if (groupRef.current) {
      // Idle sway on an 8-12s cycle.
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t / 9) * 0.03;
      groupRef.current.rotation.x = Math.sin(t / 11) * 0.02 - 0.1;

      // Mousemove-driven parallax tilt, max ~6 degrees.
      const maxTilt = THREE.MathUtils.degToRad(6);
      const targetY = pointer.current.x * maxTilt;
      const targetX = -0.1 + pointer.current.y * maxTilt * 0.5;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.04,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.04,
      );
    }
  });

  function handlePointerMove(event: { clientX: number; clientY: number }) {
    pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  return (
    <group
      ref={groupRef}
      onPointerMove={handlePointerMove}
    >
      <mesh scale={[viewport.width * 0.9, viewport.height * 0.9, 1]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <fabricMaterial ref={materialRef} />
      </mesh>
    </group>
  );
}

/* =========================================================
   SCENE — lighting + camera rig
========================================================= */

export function FabricDrapeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.35} color="#f2e9dc" />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.1}
        color="#f2e9dc"
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.6}
        color="#b5472b"
      />
      <DrapedPlane />
    </Canvas>
  );
}

export default FabricDrapeScene;
