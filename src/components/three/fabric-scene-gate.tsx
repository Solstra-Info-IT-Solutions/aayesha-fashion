"use client";

import dynamic from "next/dynamic";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useWebGLSupported } from "@/hooks/use-scroll-velocity";

/*
 * Code-split via next/dynamic({ ssr: false }) per the design bible — the
 * 3D scene never needs to render on the server and pulls in three.js.
 */
const FabricDrapeScene = dynamic(
  () => import("@/components/three/fabric-drape-scene").then((mod) => mod.FabricDrapeScene),
  { ssr: false },
);

/**
 * Gates the 3D hero scene behind prefers-reduced-motion + a WebGL
 * capability check. Falls back to a slow-shifting CSS gradient in the same
 * position/size — never a flat static image.
 */
export function FabricSceneGate({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const webGLSupported = useWebGLSupported();

  const showScene = !prefersReducedMotion && webGLSupported;

  return (
    <div className={className} aria-hidden="true">
      {showScene ? (
        <FabricDrapeScene />
      ) : (
        <div className="drape-fallback-gradient h-full w-full" />
      )}
    </div>
  );
}
