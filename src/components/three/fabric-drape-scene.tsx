"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   FABRIC SHADER
   A plane mesh displaced by a few octaves of simplex-style
   noise, driven by a time uniform, textured with a procedural
   sindoor-rust / aged-brass / kohl-umber gradient (no fabric
   texture asset exists in public/images, so this is procedural
   per the design bible's explicit fallback allowance).

   Implemented with vanilla three.js (no @react-three/fiber /
   react-reconciler) because this Next.js build resolves client
   components against its own bundled React copy, which uses the
   React 19 internals shape (__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN
   _USERS_THEY_CANNOT_UPGRADE) instead of the pre-19 shape every
   react-reconciler release still expects
   (__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) — react-
   reconciler crashes at import time regardless of version. A
   purely decorative, non-interactive scene like this one doesn't
   need React's declarative scene-graph bridge, so driving three.js
   directly sidesteps the incompatibility entirely.
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

export function FabricDrapeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf2e9dc, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf2e9dc, 1.1);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb5472b, 0.6);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color("#b5472b") }, // sindoor-rust
        uColorB: { value: new THREE.Color("#8a7b4e") }, // aged-brass
        uColorC: { value: new THREE.Color("#1c1410") }, // kohl-umber
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const viewportHeightAt = (distance: number) =>
      2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const viewportHeight = viewportHeightAt(camera.position.z);
      const viewportWidth = viewportHeight * camera.aspect;
      mesh.scale.set(viewportWidth * 0.9, viewportHeight * 0.9, 1);
    };
    resize();

    const pointer = { x: 0, y: 0 };
    const targetPointer = new THREE.Vector2(0, 0);

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const t = clock.elapsedTime;

      material.uniforms.uTime.value += delta;
      targetPointer.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.05);
      material.uniforms.uPointer.value.copy(targetPointer);

      // Idle sway on an 8-12s cycle.
      group.rotation.z = Math.sin(t / 9) * 0.03;

      // Mousemove-driven parallax tilt, max ~6 degrees.
      const maxTilt = THREE.MathUtils.degToRad(6);
      const targetY = pointer.x * maxTilt;
      const targetX = -0.1 + pointer.y * maxTilt * 0.5;
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.04);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.04);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default FabricDrapeScene;
