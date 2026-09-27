"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BikeModel } from "./BikeModel";
import type { Bike, PartId } from "@/lib/types";

const DEFAULT_POS = new THREE.Vector3(1.95, 0.95, 2.25);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.55, 0);

function CameraRig({
  focus,
  resetSignal,
}: {
  focus: [number, number, number] | null;
  resetSignal: number;
}) {
  const controls = useThree((s) => s.controls) as {
    target: THREE.Vector3;
    update: () => void;
  } | null;
  const camera = useThree((s) => s.camera);
  const target = useRef(DEFAULT_TARGET.clone());

  useEffect(() => {
    if (focus) target.current.set(focus[0], focus[1], focus[2]);
  }, [focus]);

  useEffect(() => {
    if (resetSignal === 0) return;
    camera.position.copy(DEFAULT_POS);
    target.current.copy(DEFAULT_TARGET);
    controls?.update();
  }, [resetSignal, camera, controls]);

  useFrame(() => {
    if (!controls) return;
    controls.target.lerp(target.current, 0.09);
    controls.update();
  });
  return null;
}

class ViewerBoundary extends Component<
  { fallback: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-neutral-500">
          {this.props.fallback}
        </div>
      );
    }
    return this.props.children;
  }
}

export function BikeViewer({
  bike,
  selected,
  onSelect,
  anchors,
  onAnchors,
  resetSignal,
  fallbackText,
  dark,
}: {
  bike: Bike;
  selected: PartId | null;
  onSelect: (id: PartId) => void;
  anchors: Partial<Record<PartId, [number, number, number]>>;
  onAnchors: (a: Partial<Record<PartId, [number, number, number]>>) => void;
  resetSignal: number;
  fallbackText: string;
  dark: boolean;
}) {
  const focus = selected ? (anchors[selected] ?? null) : null;
  return (
    <ViewerBoundary fallback={fallbackText}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: DEFAULT_POS.toArray(), fov: 40 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[dark ? "#17181b" : "#eceef1"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} />
        <directionalLight position={[-3, 2.5, -2]} intensity={0.5} />
        <hemisphereLight args={[dark ? "#3a3d45" : "#ffffff", dark ? "#101114" : "#9aa0a6", 0.5]} />
        <Suspense fallback={null}>
          <BikeModel bike={bike} selected={selected} onSelect={onSelect} onAnchors={onAnchors} />
          <ContactShadows position={[0, 0, 0]} opacity={0.42} scale={6} blur={2.4} far={2} />
          <Environment resolution={64}>
            <Lightformer intensity={1.4} position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
            <Lightformer intensity={0.8} position={[-4, 1.5, -2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 2, 1]} />
            <Lightformer intensity={0.8} position={[4, 1.5, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 2, 1]} />
          </Environment>
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan
          minDistance={1.1}
          maxDistance={6}
          minPolarAngle={0.12}
          maxPolarAngle={Math.PI * 0.52}
        />
        <CameraRig focus={focus} resetSignal={resetSignal} />
      </Canvas>
    </ViewerBoundary>
  );
}
