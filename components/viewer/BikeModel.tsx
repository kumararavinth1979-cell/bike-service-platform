"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { Bike, PartId } from "@/lib/types";
import { deriveParams, type BikeParams } from "./params";

const HL_COLOR = "#0f766e";

function Mat({
  color,
  metal = 0.5,
  rough = 0.4,
  hl = false,
  transparent = false,
  opacity = 1,
}: {
  color: string;
  metal?: number;
  rough?: number;
  hl?: boolean;
  transparent?: boolean;
  opacity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metal}
      roughness={rough}
      emissive={hl ? HL_COLOR : "#000000"}
      emissiveIntensity={hl ? 0.5 : 0}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

function quatFromY(x: number, y: number, z: number): THREE.Quaternion {
  const d = new THREE.Vector3(x, y, z).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
}

function quatFromZ(x: number, y: number, z: number): THREE.Quaternion {
  const d = new THREE.Vector3(x, y, z).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
}

function Tube({
  points,
  radius,
  closed = false,
  color,
  metal,
  rough,
  hl,
}: {
  points: [number, number, number][];
  radius: number;
  closed?: boolean;
  color: string;
  metal?: number;
  rough?: number;
  hl?: boolean;
}) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
      closed,
      "catmullrom",
      0.5,
    );
    return new THREE.TubeGeometry(curve, 48, radius, 10, closed);
  }, [points, radius, closed]);
  return (
    <mesh geometry={geo}>
      <Mat color={color} metal={metal} rough={rough} hl={hl} />
    </mesh>
  );
}

function Part({
  id,
  selected,
  onSelect,
  children,
}: {
  id: PartId;
  selected: PartId | null;
  onSelect: (id: PartId) => void;
  children: (hl: boolean) => ReactNode;
}) {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {children(selected === id)}
    </group>
  );
}

export function BikeModel({
  bike,
  selected,
  onSelect,
  onAnchors,
}: {
  bike: Bike;
  selected: PartId | null;
  onSelect: (id: PartId) => void;
  onAnchors: (anchors: Partial<Record<PartId, [number, number, number]>>) => void;
}) {
  const p: BikeParams = useMemo(() => deriveParams(bike), [bike]);
  const body = bike.colors.body;
  const frameC = bike.colors.frame;
  const seatC = bike.colors.seat;
  const F: [number, number, number] = [p.wb / 2, p.rf, 0];
  const R: [number, number, number] = [-p.wb / 2, p.rr, 0];
  const H: [number, number, number] = [p.headX, p.headY, 0];
  const forkDir: [number, number, number] = [-Math.sin(p.rake), Math.cos(p.rake), 0];
  const forkQ = useMemo(() => quatFromY(...forkDir), [forkDir]);
  const engineY = p.engineY;
  const seatH = p.seatH;

  const anchors = useMemo<Partial<Record<PartId, [number, number, number]>>>(
    () => ({
      tyres: [p.wb / 2, p.rf, 0],
      wheel: [p.wb / 2, p.rf, 0],
      "brake-disc": [p.wb / 2, p.rf + 0.12, 0.06],
      "brake-pads": [p.wb / 2, p.rf + 0.14, 0.08],
      "brake-drum": [-p.wb / 2, p.rr, 0.08],
      "brake-fluid": [p.headX, p.headY + 0.08, 0.18],
      chain: [-p.wb / 2 + 0.2, p.rr + 0.1, 0.11],
      sprockets: [-p.wb / 2, p.rr, 0.11],
      "front-fork": [p.wb / 2 - 0.1, p.rf + 0.25, 0.09],
      "rear-shock": [-0.32, p.seatH - 0.12, 0.1],
      exhaust: [-0.35, 0.22, 0.16],
      engine: [0.0, p.engineY, 0],
      "engine-oil": [0.12, p.engineY + 0.06, 0.11],
      "oil-filter": [0.12, p.engineY - 0.02, -0.11],
      "spark-plug": [0.1, p.engineY + 0.26, 0],
      clutch: [0.0, p.engineY - 0.02, 0.11],
      carburetor: [-0.06, p.engineY + 0.16, 0],
      "fuel-filter": [-0.02, p.seatH - 0.1, 0.08],
      "air-filter": [-0.28, p.seatH - 0.1, 0.1],
      battery: [-0.2, p.seatH - 0.16, 0.09],
      radiator: [p.headX - 0.1, p.engineY + 0.18, 0],
      coolant: [p.headX - 0.1, p.engineY + 0.28, 0],
      "cvt-belt": [-p.wb / 2 + 0.16, p.rr, -0.1],
      headlight: [p.headX + 0.08, p.headY + 0.02, 0],
      taillight: [-0.56, p.seatH + 0.08, 0],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p],
  );

  useEffect(() => {
    onAnchors(anchors);
  }, [anchors, onAnchors]);

  const tubes = useMemo(
    () => ({
      frame: [
        [H[0], H[1] - 0.04, 0],
        [H[0] - 0.14, H[1] - 0.24, 0],
        [0.06, engineY + 0.14, 0],
        [-0.14, engineY - 0.04, 0],
        [-0.3, seatH - 0.14, 0],
        [-0.44, seatH - 0.06, 0],
      ] as [number, number, number][],
      railL: [
        [-0.26, seatH - 0.12, -0.08],
        [-0.4, seatH - 0.06, -0.08],
        [-0.5, seatH - 0.02, -0.08],
      ] as [number, number, number][],
      railR: [
        [-0.26, seatH - 0.12, 0.08],
        [-0.4, seatH - 0.06, 0.08],
        [-0.5, seatH - 0.02, 0.08],
      ] as [number, number, number][],
      exhaust: [
        [0.1, engineY + 0.24, 0.06],
        [0.18, engineY - 0.02, 0.1],
        [0.06, 0.14, 0.14],
        [-0.14, 0.16, 0.16],
      ] as [number, number, number][],
      chain: [
        [-0.18, 0.35, 0.11],
        [-0.35, p.rr + 0.1, 0.11],
        [R[0] - 0.1, p.rr, 0.11],
        [-0.35, p.rr - 0.1, 0.11],
        [-0.18, 0.25, 0.11],
        [-0.13, 0.3, 0.11],
      ] as [number, number, number][],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p],
  );

  const isScooter = p.isScooter;
  const isSport = bike.style === "sport";
  const isCruiser = bike.style === "cruiser";
  const isClassic = bike.style === "classic" || bike.style === "modern-classic";
  const liquid = bike.cooling === "liquid";
  const airFins = bike.cooling === "air" || bike.cooling === "oil";
  const carb = bike.fuelSystem === "carburetor";
  const twin = bike.engineConfig === "parallel-twin";
  const spoke = bike.wheelStyle === "spoke";

  return (
    <group position={[0, 0, 0]}>
      {/* ---------------- wheels + tyres ---------------- */}
      <Part id="tyres" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <>
            <mesh position={F}>
              <torusGeometry args={[p.rf - p.sf * 0.42, p.sf * 0.6, 18, 44]} />
              <Mat color="#141414" metal={0.1} rough={0.95} hl={hl} />
            </mesh>
            <mesh position={R}>
              <torusGeometry args={[p.rr - p.sr * 0.42, p.sr * 0.6, 18, 44]} />
              <Mat color="#141414" metal={0.1} rough={0.95} hl={hl} />
            </mesh>
          </>
        )}
      </Part>

      <Part id="wheel" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <>
            {[F, R].map((pos, i) => {
              const rimR = i === 0 ? p.rf - p.sf : p.rr - p.sr;
              const w = i === 0 ? 0.09 : 0.11;
              return (
                <group key={i} position={pos}>
                  <mesh>
                    <torusGeometry args={[rimR, 0.022, 10, 32]} />
                    <Mat color="#8b8f94" metal={0.85} rough={0.3} hl={hl} />
                  </mesh>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, w, 16]} />
                    <Mat color="#6b6f74" metal={0.85} rough={0.3} hl={hl} />
                  </mesh>
                  {spoke
                    ? Array.from({ length: 14 }).map((_, k) => {
                        const a = (k / 14) * Math.PI * 2;
                        return (
                          <mesh
                            key={k}
                            position={[Math.cos(a) * rimR * 0.52, Math.sin(a) * rimR * 0.52, 0]}
                            quaternion={quatFromZ(Math.cos(a), Math.sin(a), 0)}
                          >
                            <cylinderGeometry args={[0.004, 0.004, rimR * 0.95, 6]} />
                            <Mat color="#c9ccd1" metal={0.9} rough={0.25} hl={hl} />
                          </mesh>
                        );
                      })
                    : Array.from({ length: 5 }).map((_, k) => {
                        const a = (k / 5) * Math.PI * 2;
                        return (
                          <mesh
                            key={k}
                            position={[Math.cos(a) * rimR * 0.52, Math.sin(a) * rimR * 0.52, 0]}
                            quaternion={quatFromZ(Math.cos(a), Math.sin(a), 0)}
                          >
                            <boxGeometry args={[0.045, rimR * 0.95, 0.04]} />
                            <Mat color="#8b8f94" metal={0.85} rough={0.3} hl={hl} />
                          </mesh>
                        );
                      })}
                </group>
              );
            })}
          </>
        )}
      </Part>

      {/* ---------------- brakes ---------------- */}
      {bike.brakes.front === "disc" ? (
        <>
          <Part id="brake-disc" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[F[0], F[1], 0.07]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.005, 32]} />
                <Mat color="#b9bdc2" metal={0.9} rough={0.25} hl={hl} />
              </mesh>
            )}
          </Part>
          <Part id="brake-pads" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[F[0], F[1] + 0.14, 0.075]}>
                <boxGeometry args={[0.07, 0.06, 0.05]} />
                <Mat color="#2a2d31" metal={0.6} rough={0.5} hl={hl} />
              </mesh>
            )}
          </Part>
        </>
      ) : null}
      {bike.brakes.rear === "disc" ? (
        <Part id="brake-disc" selected={selected} onSelect={onSelect}>
          {(hl) => (
            <mesh position={[R[0], R[1], 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.005, 32]} />
              <Mat color="#b9bdc2" metal={0.9} rough={0.25} hl={hl} />
            </mesh>
          )}
        </Part>
      ) : bike.brakes.rear === "drum" ? (
        <Part id="brake-drum" selected={selected} onSelect={onSelect}>
          {(hl) => (
            <mesh position={[R[0], R[1], 0.07]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.07, 28]} />
              <Mat color="#6b6f74" metal={0.8} rough={0.4} hl={hl} />
            </mesh>
          )}
        </Part>
      ) : null}

      {/* ---------------- front fork ---------------- */}
      <Part id="front-fork" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <>
            {[-0.09, 0.09].map((z) => (
              <group key={z} position={[0, 0, z]}>
                <mesh
                  position={[F[0] + forkDir[0] * 0.16, F[1] + forkDir[1] * 0.16, 0]}
                  quaternion={forkQ}
                >
                  <cylinderGeometry args={[0.026, 0.026, 0.3, 16]} />
                  <Mat color="#3a3d42" metal={0.8} rough={0.35} hl={hl} />
                </mesh>
                <mesh
                  position={[F[0] + forkDir[0] * 0.36, F[1] + forkDir[1] * 0.36, 0]}
                  quaternion={forkQ}
                >
                  <cylinderGeometry args={[0.02, 0.02, 0.32, 16]} />
                  <Mat color="#c9ccd1" metal={0.9} rough={0.2} hl={hl} />
                </mesh>
              </group>
            ))}
            <mesh position={[H[0], H[1], 0]}>
              <boxGeometry args={[0.08, 0.05, 0.24]} />
              <Mat color={frameC} metal={0.7} rough={0.4} hl={hl} />
            </mesh>
          </>
        )}
      </Part>

      {/* ---------------- handlebar + controls ---------------- */}
      <group position={[H[0] + forkDir[0] * 0.08, H[1] + forkDir[1] * 0.08, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, isSport ? 0.5 : 0.66, 12]} />
          <Mat color="#2a2d31" metal={0.7} rough={0.4} />
        </mesh>
        {[-0.3, 0.3].map((z) => (
          <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.12, 12]} />
            <Mat color="#141414" metal={0.1} rough={0.9} />
          </mesh>
        ))}
        {!isSport &&
          [-0.34, 0.34].map((z) => (
            <group key={z} position={[0.02, 0.03, z]}>
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.09, 8]} />
                <Mat color="#2a2d31" metal={0.7} rough={0.4} />
              </mesh>
              <mesh position={[0.01, 0.1, 0]}>
                <boxGeometry args={[0.012, 0.055, 0.04]} />
                <Mat color="#1a1c1f" metal={0.4} rough={0.5} />
              </mesh>
            </group>
          ))}
        <Part id="brake-fluid" selected={selected} onSelect={onSelect}>
          {(hl) => (
            <mesh position={[0.03, 0.03, 0.2]}>
              <boxGeometry args={[0.05, 0.05, 0.04]} />
              <Mat color="#1a1c1f" metal={0.4} rough={0.5} hl={hl} />
            </mesh>
          )}
        </Part>
      </group>

      {/* ---------------- headlight ---------------- */}
      <Part id="headlight" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <group position={[H[0] + forkDir[0] * 0.14, H[1] + forkDir[1] * 0.14, 0]}>
            {bike.headlight === "round" ? (
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 0.08, 28]} />
                <Mat color="#dfe8ee" metal={0.3} rough={0.15} hl={hl} transparent opacity={0.75} />
              </mesh>
            ) : (
              <mesh>
                <boxGeometry args={[0.08, 0.11, bike.headlight === "angular" ? 0.18 : 0.14]} />
                <Mat color="#dfe8ee" metal={0.3} rough={0.15} hl={hl} transparent opacity={0.75} />
              </mesh>
            )}
            {isSport && (
              <>
                {[-0.1, 0.1].map((z) => (
                  <mesh key={z} position={[-0.04, -0.02, z]} rotation={[z > 0 ? -0.3 : 0.3, 0, 0]}>
                    <boxGeometry args={[0.14, 0.2, 0.02]} />
                    <Mat color={body} metal={0.6} rough={0.35} hl={hl} />
                  </mesh>
                ))}
              </>
            )}
          </group>
        )}
      </Part>

      {/* ---------------- front fender ---------------- */}
      <mesh position={[F[0], F[1], 0]} rotation={[0, 0, Math.PI * 0.22]} scale={[1, 1, 1.4]}>
        <torusGeometry args={[p.rf + 0.025, 0.025, 10, 26, Math.PI * 0.56]} />
        <Mat color={isScooter ? body : frameC} metal={0.5} rough={0.4} />
      </mesh>

      {/* ---------------- frame ---------------- */}
      {!isScooter && (
        <group>
          <Tube points={tubes.frame} radius={0.017} color={frameC} metal={0.7} rough={0.4} />
          <Tube points={tubes.railL} radius={0.012} color={frameC} metal={0.7} rough={0.4} />
          <Tube points={tubes.railR} radius={0.012} color={frameC} metal={0.7} rough={0.4} />
        </group>
      )}

      {/* ---------------- engine ---------------- */}
      <Part id="engine" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <group>
            {isScooter ? (
              <mesh position={[-0.32, 0.24, 0]}>
                <boxGeometry args={[0.26, 0.2, 0.18]} />
                <Mat color="#3a3d42" metal={0.75} rough={0.4} hl={hl} />
              </mesh>
            ) : (
              <>
                <mesh position={[0.0, engineY - 0.04, 0]}>
                  <boxGeometry args={[twin ? 0.36 : 0.3, 0.22, twin ? 0.26 : 0.2]} />
                  <Mat color="#3a3d42" metal={0.75} rough={0.4} hl={hl} />
                </mesh>
                {(twin ? [-0.07, 0.07] : [0]).map((z) => (
                  <group key={z} position={[0.06, engineY + 0.14, z]} quaternion={quatFromY(0.26, 1, 0)}>
                    <mesh>
                      <cylinderGeometry args={[0.075, 0.08, 0.2, 20]} />
                      <Mat color="#4a4d52" metal={0.75} rough={0.4} hl={hl} />
                    </mesh>
                    {airFins &&
                      Array.from({ length: 5 }).map((_, k) => (
                        <mesh key={k} position={[0, -0.07 + k * 0.035, 0]}>
                          <cylinderGeometry args={[0.095, 0.095, 0.01, 20]} />
                          <Mat color="#5a5d62" metal={0.75} rough={0.4} hl={hl} />
                        </mesh>
                      ))}
                    <mesh position={[0, 0.13, 0]}>
                      <boxGeometry args={[0.12, 0.07, 0.14]} />
                      <Mat color="#4a4d52" metal={0.75} rough={0.4} hl={hl} />
                    </mesh>
                  </group>
                ))}
              </>
            )}
          </group>
        )}
      </Part>

      {!isScooter && (
        <>
          <Part id="clutch" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[0.02, engineY - 0.04, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.02, 24]} />
                <Mat color="#6b6f74" metal={0.85} rough={0.3} hl={hl} />
              </mesh>
            )}
          </Part>
          <Part id="engine-oil" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[0.12, engineY + 0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.015, 16]} />
                <Mat color="#c9a227" metal={0.8} rough={0.3} hl={hl} />
              </mesh>
            )}
          </Part>
          <Part id="oil-filter" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[0.12, engineY - 0.02, -0.11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.09, 20]} />
                <Mat color="#1a1c1f" metal={0.6} rough={0.45} hl={hl} />
              </mesh>
            )}
          </Part>
          <Part id="spark-plug" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[0.1, engineY + 0.28, 0]} quaternion={quatFromY(0.26, 1, 0)}>
                <cylinderGeometry args={[0.014, 0.014, 0.05, 10]} />
                <Mat color="#141414" metal={0.3} rough={0.7} hl={hl} />
              </mesh>
            )}
          </Part>
          {carb && (
            <Part id="carburetor" selected={selected} onSelect={onSelect}>
              {(hl) => (
                <mesh position={[-0.06, engineY + 0.16, 0]}>
                  <boxGeometry args={[0.08, 0.1, 0.08]} />
                  <Mat color="#6b6f74" metal={0.8} rough={0.35} hl={hl} />
                </mesh>
              )}
            </Part>
          )}
          <Part id="fuel-filter" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[-0.02, seatH - 0.1, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />
                <Mat color="#dfe8ee" metal={0.2} rough={0.3} hl={hl} transparent opacity={0.7} />
              </mesh>
            )}
          </Part>
          {liquid && (
            <>
              <Part id="radiator" selected={selected} onSelect={onSelect}>
                {(hl) => (
                  <mesh position={[H[0] - 0.12, engineY + 0.18, 0]}>
                    <boxGeometry args={[0.04, 0.2, 0.22]} />
                    <Mat color="#2a2d31" metal={0.7} rough={0.45} hl={hl} />
                  </mesh>
                )}
              </Part>
              <Part id="coolant" selected={selected} onSelect={onSelect}>
                {(hl) => (
                  <mesh position={[H[0] - 0.12, engineY + 0.3, 0.06]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.02, 12]} />
                    <Mat color="#1a1c1f" metal={0.4} rough={0.5} hl={hl} />
                  </mesh>
                )}
              </Part>
            </>
          )}
          <Part id="air-filter" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[-0.28, seatH - 0.1, 0.1]}>
                <boxGeometry args={[0.16, 0.12, 0.02]} />
                <Mat color={body} metal={0.6} rough={0.35} hl={hl} />
              </mesh>
            )}
          </Part>
          <Part id="battery" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <mesh position={[-0.2, seatH - 0.16, 0.09]}>
                <boxGeometry args={[0.1, 0.08, 0.05]} />
                <Mat color="#1a1c1f" metal={0.4} rough={0.5} hl={hl} />
              </mesh>
            )}
          </Part>
        </>
      )}

      {/* ---------------- exhaust ---------------- */}
      <Part id="exhaust" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <group>
            {!isScooter && (
              <Tube points={tubes.exhaust} radius={0.018} color="#b9bdc2" metal={0.9} rough={0.25} hl={hl} />
            )}
            <mesh
              position={[-0.36, isCruiser ? 0.18 : 0.24, 0.16]}
              quaternion={quatFromY(-0.9, 0.25, 0)}
            >
              <cylinderGeometry args={[0.05, 0.055, 0.44, 20]} />
              <Mat color="#8b8f94" metal={0.9} rough={0.25} hl={hl} />
            </mesh>
            {bike.exhaust === "dual" && (
              <mesh position={[-0.36, 0.24, -0.16]} quaternion={quatFromY(-0.9, 0.25, 0)}>
                <cylinderGeometry args={[0.05, 0.055, 0.44, 20]} />
                <Mat color="#8b8f94" metal={0.9} rough={0.25} hl={hl} />
              </mesh>
            )}
          </group>
        )}
      </Part>

      {/* ---------------- tank / seat / tail ---------------- */}
      {!isScooter && (
        <mesh
          position={[0.1, p.tankY, 0]}
          scale={[isCruiser ? 0.26 : 0.23, 0.095, 0.12]}
        >
          <sphereGeometry args={[1, 24, 16]} />
          <Mat color={body} metal={0.65} rough={0.3} />
        </mesh>
      )}
      {isScooter && (
        <>
          <mesh position={[0.34, 0.56, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.1, 0.46, 0.3]} />
            <Mat color={body} metal={0.6} rough={0.35} />
          </mesh>
          <mesh position={[0.02, 0.16, 0]}>
            <boxGeometry args={[0.36, 0.04, 0.26]} />
            <Mat color="#2a2d31" metal={0.4} rough={0.6} />
          </mesh>
          <mesh position={[-0.3, 0.44, 0]}>
            <boxGeometry args={[0.46, 0.3, 0.28]} />
            <Mat color={body} metal={0.6} rough={0.35} />
          </mesh>
        </>
      )}
      <mesh position={[-0.22, seatH + 0.02, 0]}>
        <boxGeometry args={[isCruiser ? 0.62 : 0.5, 0.08, 0.2]} />
        <Mat color={seatC} metal={0.15} rough={0.8} />
      </mesh>
      <mesh position={[-0.3, seatH - 0.12, 0]}>
        <boxGeometry args={[0.26, 0.16, 0.16]} />
        <Mat color={body} metal={0.6} rough={0.35} />
      </mesh>
      <mesh position={[-0.5, seatH + 0.08, 0]} rotation={[0, 0, isSport ? 0.2 : 0]}>
        <boxGeometry args={[0.2, 0.08, 0.14]} />
        <Mat color={body} metal={0.6} rough={0.35} />
      </mesh>
      <Part id="taillight" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <mesh position={[-0.6, seatH + 0.09, 0]}>
            <boxGeometry args={[0.02, 0.05, 0.1]} />
            <Mat color="#b91c1c" metal={0.2} rough={0.3} hl={hl} />
          </mesh>
        )}
      </Part>
      {(isClassic || isCruiser) && (
        <mesh position={[R[0], R[1], 0]} rotation={[0, 0, Math.PI * 0.18]} scale={[1, 1, 1.6]}>
          <torusGeometry args={[p.rr + 0.04, 0.04, 10, 26, Math.PI * 0.64]} />
          <Mat color={body} metal={0.6} rough={0.35} />
        </mesh>
      )}

      {/* ---------------- rear suspension + swingarm ---------------- */}
      <Part id="rear-shock" selected={selected} onSelect={onSelect}>
        {(hl) => (
          <>
            {(bike.suspension.rear === "twin-shock" ? [-0.1, 0.1] : [0]).map((z) => {
              const from = new THREE.Vector3(-0.3, seatH - 0.1, z);
              const to = new THREE.Vector3(R[0] + 0.14, R[1] + 0.05, z);
              const mid = from.clone().lerp(to, 0.5);
              const dir = to.clone().sub(from);
              const len = dir.length();
              return (
                <group key={z}>
                  <mesh position={mid} quaternion={quatFromY(dir.x, dir.y, dir.z)}>
                    <cylinderGeometry args={[0.018, 0.018, len, 12]} />
                    <Mat color="#2a2d31" metal={0.7} rough={0.4} hl={hl} />
                  </mesh>
                  {Array.from({ length: 5 }).map((_, k) => {
                    const t = 0.15 + k * 0.16;
                    const pos = from.clone().lerp(to, t);
                    return (
                      <mesh key={k} position={pos} quaternion={quatFromY(dir.x, dir.y, dir.z)}>
                        <torusGeometry args={[0.035, 0.008, 8, 20]} />
                        <Mat color="#c9a227" metal={0.8} rough={0.3} hl={hl} />
                      </mesh>
                    );
                  })}
                </group>
              );
            })}
          </>
        )}
      </Part>
      {[-0.1, 0.1].map((z) => (
        <mesh
          key={z}
          position={[(-0.24 + R[0]) / 2, (0.3 + R[1]) / 2, z]}
          quaternion={quatFromY(R[0] + 0.24, R[1] - 0.3, 0)}
        >
          <boxGeometry args={[0.05, Math.hypot(R[0] + 0.24, R[1] - 0.3), 0.04]} />
          <Mat color={frameC} metal={0.7} rough={0.4} />
        </mesh>
      ))}

      {/* ---------------- drivetrain ---------------- */}
      {isScooter ? (
        <Part id="cvt-belt" selected={selected} onSelect={onSelect}>
          {(hl) => (
            <group>
              <mesh position={[R[0] + 0.16, R[1], -0.11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.07, 24]} />
                <Mat color="#3a3d42" metal={0.75} rough={0.4} hl={hl} />
              </mesh>
              <mesh
                position={[(R[0] + 0.16 - 0.24) / 2, (R[1] + 0.26) / 2, -0.11]}
                quaternion={quatFromY(R[0] - 0.08, R[1] - 0.26, 0)}
              >
                <boxGeometry args={[0.06, 0.3, 0.05]} />
                <Mat color="#3a3d42" metal={0.75} rough={0.4} hl={hl} />
              </mesh>
            </group>
          )}
        </Part>
      ) : (
        <>
          <Part id="chain" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <Tube
                closed
                points={tubes.chain}
                radius={0.011}
                color="#4a4d52"
                metal={0.85}
                rough={0.35}
                hl={hl}
              />
            )}
          </Part>
          <Part id="sprockets" selected={selected} onSelect={onSelect}>
            {(hl) => (
              <>
                <mesh position={[R[0], R[1], 0.11]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.012, 24]} />
                  <Mat color="#8b8f94" metal={0.9} rough={0.3} hl={hl} />
                </mesh>
                <mesh position={[-0.18, 0.3, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 0.012, 20]} />
                  <Mat color="#8b8f94" metal={0.9} rough={0.3} hl={hl} />
                </mesh>
              </>
            )}
          </Part>
        </>
      )}
    </group>
  );
}
