"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  animateCreatureComplex,
  animateFloraMesh,
  animateSettlement,
  buildSettlementMesh,
} from "@/lib/genesis/animate3d";
import { buildDetailedCreature } from "@/lib/genesis/characters3d";
import type { Organism } from "@/lib/genesis/simulate";
import { behaviourLabel, type Settlement } from "@/lib/genesis/society";
import { deriveWeather } from "@/lib/genesis/weather";
import {
  biomeFromEnv,
  deriveClimate,
  generateFlora,
  STAR_PRESETS,
  type FloraNode,
  type FoodPatch,
  type WorldEnv,
} from "@/lib/genesis/world";

type Props = {
  organisms: Organism[];
  env: WorldEnv;
  foodPatches: FoodPatch[];
  flora: FloraNode[];
  settlements?: Settlement[];
  tick: number;
  running: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

/**
 * Interactive 3D world: zoom / orbit / pan + click fauna for attributes.
 */
export function GenesisWorld3D({
  organisms,
  env,
  foodPatches,
  flora,
  settlements = [],
  tick,
  running,
  selectedId = null,
  onSelect,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const orgRef = useRef(organisms);
  const envRef = useRef(env);
  const foodRef = useRef(foodPatches);
  const floraRef = useRef(flora);
  const settleRef = useRef(settlements);
  const tickRef = useRef(tick);
  const runningRef = useRef(running);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const followRef = useRef(true);

  const [follow, setFollow] = useState(true);
  const [zoomHint, setZoomHint] = useState(true);

  orgRef.current = organisms;
  envRef.current = env;
  foodRef.current = foodPatches;
  floraRef.current = flora;
  settleRef.current = settlements;
  tickRef.current = tick;
  runningRef.current = running;
  selectedRef.current = selectedId;
  onSelectRef.current = onSelect;
  followRef.current = follow;

  const selected = useMemo(
    () => organisms.find((o) => o.id === selectedId) ?? null,
    [organisms, selectedId],
  );

  const zoomBy = useCallback((factor: number) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const offset = new THREE.Vector3().subVectors(cam.position, ctrl.target);
    offset.multiplyScalar(factor);
    // clamp distance
    const dist = offset.length();
    const min = 1.2;
    const max = 42;
    if (dist < min) offset.setLength(min);
    if (dist > max) offset.setLength(max);
    cam.position.copy(ctrl.target).add(offset);
    ctrl.update();
  }, []);

  const focusSelected = useCallback(() => {
    const id = selectedRef.current;
    const mesh = id ? meshMapRef.current.get(id) : null;
    const ctrl = controlsRef.current;
    const cam = cameraRef.current;
    if (!mesh || !ctrl || !cam) return;
    const target = new THREE.Vector3(
      mesh.position.x,
      mesh.position.y + 0.6,
      mesh.position.z,
    );
    ctrl.target.lerp(target, 1);
    // Pull camera in close for attribute inspection
    const dir = new THREE.Vector3()
      .subVectors(cam.position, ctrl.target)
      .normalize();
    cam.position.copy(target).add(dir.multiplyScalar(3.2));
    ctrl.minDistance = 0.8;
    ctrl.update();
    setFollow(true);
  }, []);

  const resetView = useCallback(() => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    cam.position.set(0, 13, 19);
    ctrl.target.set(0, 0.5, 0);
    ctrl.minDistance = 0.8;
    ctrl.maxDistance = 45;
    ctrl.update();
    setFollow(false);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 640;
    const h = Math.max(380, mount.clientHeight || 480);

    const scene = new THREE.Scene();
    const biome0 = biomeFromEnv(env, 0);
    scene.background = new THREE.Color(biome0.sky).multiplyScalar(0.35);
    scene.fog = new THREE.FogExp2(biome0.fog, 0.032);

    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 200);
    camera.position.set(0, 13, 19);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    // Zoom / orbit / pan — scroll to zoom in on fauna
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.8;
    controls.maxDistance = 45;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = 0.12;
    controls.target.set(0, 0.5, 0);
    controls.zoomSpeed = 1.35;
    controls.rotateSpeed = 0.85;
    controls.panSpeed = 0.7;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controlsRef.current = controls;

    controls.addEventListener("start", () => {
      renderer.domElement.style.cursor = "grabbing";
      setZoomHint(false);
    });
    controls.addEventListener("end", () => {
      renderer.domElement.style.cursor = "grab";
    });

    // Selection ring under focused creature
    const selectRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.035, 8, 32),
      new THREE.MeshBasicMaterial({
        color: 0x66ddff,
        transparent: true,
        opacity: 0.85,
      }),
    );
    selectRing.rotation.x = -Math.PI / 2;
    selectRing.visible = false;
    scene.add(selectRing);

    // Click / tap to inspect fauna
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function pickOrganism(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes: THREE.Object3D[] = [];
      for (const [, g] of meshMapRef.current) {
        g.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) meshes.push(c);
        });
      }
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length === 0) {
        onSelectRef.current?.(null);
        return;
      }
      let obj: THREE.Object3D | null = hits[0]!.object;
      while (obj && !obj.userData.orgId) obj = obj.parent;
      const id = obj?.userData.orgId as string | undefined;
      if (id) {
        onSelectRef.current?.(id);
        // Auto zoom in on click
        const mesh = meshMapRef.current.get(id);
        if (mesh) {
          const target = new THREE.Vector3(
            mesh.position.x,
            mesh.position.y + 0.55,
            mesh.position.z,
          );
          controls.target.copy(target);
          const dir = new THREE.Vector3()
            .subVectors(camera.position, controls.target)
            .normalize();
          const dist = Math.min(
            4.5,
            Math.max(2.2, camera.position.distanceTo(controls.target) * 0.45),
          );
          camera.position.copy(target).add(dir.multiplyScalar(dist));
          controls.update();
          followRef.current = true;
          setFollow(true);
        }
      }
    }
    const onPointerUp = (ev: PointerEvent) => {
      // ignore drag (moved a lot)
      if ((onPointerUp as unknown as { _down?: { x: number; y: number } })._down) {
        const d = onPointerUp as unknown as {
          _down: { x: number; y: number };
        };
        const dx = ev.clientX - d._down.x;
        const dy = ev.clientY - d._down.y;
        if (dx * dx + dy * dy > 36) return;
      }
      pickOrganism(ev.clientX, ev.clientY);
    };
    const onPointerDown = (ev: PointerEvent) => {
      (onPointerUp as unknown as { _down: { x: number; y: number } })._down = {
        x: ev.clientX,
        y: ev.clientY,
      };
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // Ground with subtle grid
    const groundMat = new THREE.MeshStandardMaterial({
      color: biome0.ground,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 72),
      groundMat,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Water
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a7a9e,
      transparent: true,
      opacity: 0.78,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.15,
    });
    const water = new THREE.Mesh(new THREE.CircleGeometry(1, 64), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.05;
    scene.add(water);

    // Soft cloud dome (billboard-ish spheres)
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 1,
      depthWrite: false,
    });
    for (let i = 0; i < 12; i++) {
      const c = new THREE.Mesh(
        new THREE.SphereGeometry(1.2 + Math.random() * 1.4, 10, 8),
        cloudMat.clone(),
      );
      const a = (i / 12) * Math.PI * 2;
      c.position.set(Math.cos(a) * 9, 6 + Math.random() * 3, Math.sin(a) * 9);
      c.scale.set(1.6, 0.55, 1.1);
      cloudGroup.add(c);
    }

    const hemi = new THREE.HemisphereLight(0xffe8c8, 0x3a4a30, 0.55);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe0a0, 1.1);
    sun.position.set(10, 16, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    scene.add(sun);
    const amb = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(amb);
    // Storm flash light
    const flash = new THREE.PointLight(0xaaccff, 0, 40);
    flash.position.set(0, 12, 0);
    scene.add(flash);

    // Atmospheric haze
    const hazeCount = 400;
    const hazeGeo = new THREE.BufferGeometry();
    const hazePos = new Float32Array(hazeCount * 3);
    for (let i = 0; i < hazeCount; i++) {
      hazePos[i * 3] = (Math.random() - 0.5) * 30;
      hazePos[i * 3 + 1] = Math.random() * 12;
      hazePos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    hazeGeo.setAttribute("position", new THREE.BufferAttribute(hazePos, 3));
    const hazeMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xb8d0d8,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const haze = new THREE.Points(hazeGeo, hazeMat);
    scene.add(haze);

    // Precipitation system
    const precipCount = 1200;
    const precipGeo = new THREE.BufferGeometry();
    const precipPos = new Float32Array(precipCount * 3);
    const precipVel = new Float32Array(precipCount);
    for (let i = 0; i < precipCount; i++) {
      precipPos[i * 3] = (Math.random() - 0.5) * 26;
      precipPos[i * 3 + 1] = Math.random() * 14;
      precipPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      precipVel[i] = 0.08 + Math.random() * 0.2;
    }
    precipGeo.setAttribute("position", new THREE.BufferAttribute(precipPos, 3));
    const precipMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xaad4ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const precip = new THREE.Points(precipGeo, precipMat);
    scene.add(precip);

    // Flora
    const floraGroup = new THREE.Group();
    scene.add(floraGroup);
    let floraBuiltKey = "";

    function clearGroup(g: THREE.Group) {
      while (g.children.length) {
        const c = g.children[0]!;
        g.remove(c);
        c.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material))
              obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
    }

    function buildFloraMesh(f: FloraNode): THREE.Object3D {
      const g = new THREE.Group();
      if (f.kind === "tree") {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.13, f.height * 0.55, 8),
          new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.85 }),
        );
        trunk.position.y = f.height * 0.28;
        trunk.castShadow = true;
        g.add(trunk);
        for (let i = 0; i < 3; i++) {
          const canopy = new THREE.Mesh(
            new THREE.IcosahedronGeometry(f.radius * f.health * (1 - i * 0.15), 1),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(
                0.27 + i * 0.02,
                0.55,
                0.26 + f.health * 0.12 + i * 0.03,
              ),
              roughness: 0.8,
            }),
          );
          canopy.position.y = f.height * (0.55 + i * 0.18);
          canopy.castShadow = true;
          g.add(canopy);
        }
      } else if (f.kind === "shrub") {
        for (let i = 0; i < 3; i++) {
          const bush = new THREE.Mesh(
            new THREE.SphereGeometry(f.radius * (0.7 + i * 0.15), 10, 8),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL(0.3, 0.5, 0.3 + i * 0.04),
            }),
          );
          bush.position.set(
            (i - 1) * 0.12,
            f.radius * 0.65,
            (i % 2) * 0.08,
          );
          bush.scale.y = 0.75;
          bush.castShadow = true;
          g.add(bush);
        }
      } else if (f.kind === "kelp") {
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.055, f.height, 6),
          new THREE.MeshStandardMaterial({ color: 0x2d6b4f }),
        );
        stem.position.y = f.height * 0.5;
        g.add(stem);
        const top = new THREE.Mesh(
          new THREE.SphereGeometry(f.radius * 0.7, 8, 6),
          new THREE.MeshStandardMaterial({ color: 0x3d9a6a }),
        );
        top.position.y = f.height;
        g.add(top);
      } else {
        const moss = new THREE.Mesh(
          new THREE.CylinderGeometry(f.radius, f.radius * 1.15, 0.07, 8),
          new THREE.MeshStandardMaterial({ color: 0x4a7a40 }),
        );
        moss.position.y = 0.035;
        g.add(moss);
      }
      g.position.set(f.x, 0, f.z);
      return g;
    }

    function syncFlora(list: FloraNode[], e: WorldEnv, t: number) {
      const key = `${e.seed}-${list.length}-${Math.floor(t / 30)}-${e.surface.floraCoverage.toFixed(2)}`;
      if (key === floraBuiltKey) {
        // still animate existing
        return;
      }
      floraBuiltKey = key;
      clearGroup(floraGroup);
      const nodes = list.length ? list : generateFlora(e, t);
      for (const f of nodes) {
        const mesh = buildFloraMesh(f);
        mesh.userData.phase = Math.random() * Math.PI * 2;
        mesh.userData.health = f.health;
        mesh.userData.kind = f.kind;
        floraGroup.add(mesh);
      }
    }

    function animateAllFlora(time: number, wind: number) {
      for (const child of floraGroup.children) {
        animateFloraMesh(
          child,
          time,
          wind,
          (child.userData.health as number) || 0.7,
          (child.userData.kind as string) || "tree",
        );
      }
    }

    // Settlements
    const settleGroup = new THREE.Group();
    scene.add(settleGroup);
    let settleKey = "";
    function syncSettlements(list: Settlement[]) {
      const key = list.map((s) => `${s.id}:${s.size.toFixed(2)}`).join("|");
      if (key === settleKey) return;
      settleKey = key;
      clearGroup(settleGroup);
      for (const s of list) {
        const mesh = buildSettlementMesh({
          name: s.name,
          size: s.size,
          culture: s.culture,
        });
        mesh.position.set(s.x, 0, s.z);
        mesh.userData.culture = s.culture;
        mesh.userData.size = s.size;
        settleGroup.add(mesh);
      }
    }

    // Ambient pollen / spores / fireflies
    const ambCount = 400;
    const ambPos = new Float32Array(ambCount * 3);
    const ambVel = new Float32Array(ambCount);
    for (let i = 0; i < ambCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 24;
      ambPos[i * 3 + 1] = Math.random() * 5;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
      ambVel[i] = 0.2 + Math.random() * 0.8;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0xc8f5a0,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ambPoints = new THREE.Points(ambGeo, ambMat);
    scene.add(ambPoints);

    // Mating sparkles (near courting organisms)
    const mateCount = 80;
    const matePos = new Float32Array(mateCount * 3);
    for (let i = 0; i < mateCount; i++) {
      matePos[i * 3 + 1] = -10;
    }
    const mateGeo = new THREE.BufferGeometry();
    mateGeo.setAttribute("position", new THREE.BufferAttribute(matePos, 3));
    const mateMat = new THREE.PointsMaterial({
      color: 0xff66aa,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const matePoints = new THREE.Points(mateGeo, mateMat);
    scene.add(matePoints);

    // Food
    const foodGroup = new THREE.Group();
    scene.add(foodGroup);
    const foodMap = new Map<string, THREE.Mesh>();
    const foodColors: Record<FoodPatch["kind"], number> = {
      photo: 0x44cc66,
      detritus: 0xaa7744,
      mineral: 0x88aacc,
    };

    function syncFood(list: FoodPatch[]) {
      const live = new Set(list.map((f) => f.id));
      for (const [id, mesh] of foodMap) {
        if (!live.has(id)) {
          foodGroup.remove(mesh);
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
          foodMap.delete(id);
        }
      }
      for (const f of list) {
        let mesh = foodMap.get(f.id);
        if (!mesh) {
          mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 0.09, 10),
            new THREE.MeshStandardMaterial({
              color: foodColors[f.kind],
              emissive: foodColors[f.kind],
              emissiveIntensity: 0.15,
              transparent: true,
              opacity: 0.88,
            }),
          );
          foodMap.set(f.id, mesh);
          foodGroup.add(mesh);
        }
        const scale = 0.35 + (f.energy / 2.2) * 1.15;
        mesh.scale.setScalar(scale);
        mesh.position.set(f.x, 0.06, f.z);
        (mesh.material as THREE.MeshStandardMaterial).opacity =
          0.3 + (f.energy / 2.5) * 0.55;
      }
    }

    // Organisms
    const orgGroup = new THREE.Group();
    scene.add(orgGroup);
    const meshMap = meshMapRef.current;

    function syncOrganisms(
      list: Organism[],
      time: number,
      dt: number,
      wind: number,
      gravity: number,
    ) {
      const live = new Set(list.map((o) => o.id));
      for (const [id, mesh] of meshMap) {
        if (!live.has(id)) {
          orgGroup.remove(mesh);
          mesh.traverse((c) => {
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (Array.isArray(c.material))
                c.material.forEach((m) => m.dispose());
              else c.material.dispose();
            }
          });
          meshMap.delete(id);
        }
      }

      let mateSpark = 0;
      const selId = selectedRef.current;

      for (const org of list) {
        let mesh = meshMap.get(org.id);
        if (mesh && mesh.userData.role !== org.role) {
          orgGroup.remove(mesh);
          mesh.traverse((c) => {
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (Array.isArray(c.material))
                c.material.forEach((m) => m.dispose());
              else c.material.dispose();
            }
          });
          meshMap.delete(org.id);
          mesh = undefined;
        }
        if (!mesh) {
          mesh = buildDetailedCreature(org);
          mesh.userData.role = org.role;
          mesh.userData.orgId = org.id;
          mesh.position.set(org.x, 0.05, org.z);
          mesh.userData.prevX = org.x;
          mesh.userData.prevZ = org.z;
          meshMap.set(org.id, mesh);
          orgGroup.add(mesh);
        }
        mesh.userData.orgId = org.id;

        mesh.traverse((c) => {
          if (c.name.startsWith("tool")) {
            c.visible =
              org.behaviour === "farm" ||
              org.behaviour === "build" ||
              org.behaviour === "hunt" ||
              org.behaviour === "craft" ||
              org.behaviour === "defend";
          }
        });
        mesh.userData.behaviour = org.behaviour;

        // Highlight selected (slight scale pulse)
        const isSel = org.id === selId;
        const targetScale = isSel ? 1.12 : 1;
        mesh.scale.x = THREE.MathUtils.damp(mesh.scale.x, targetScale, 8, dt);
        mesh.scale.y = THREE.MathUtils.damp(mesh.scale.y, targetScale, 8, dt);
        mesh.scale.z = THREE.MathUtils.damp(mesh.scale.z, targetScale, 8, dt);

        const baseY =
          0.02 +
          0.2 *
            org.expression.traits.size *
            (1 / Math.sqrt(Math.max(0.3, gravity)));
        mesh.userData.baseY = baseY;

        const prevX = (mesh.userData.prevX as number) ?? org.x;
        const prevZ = (mesh.userData.prevZ as number) ?? org.z;

        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, org.x, 8, dt);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, org.z, 8, dt);

        animateCreatureComplex(
          mesh,
          org,
          {
            frame: Math.floor(time * 60),
            time,
            dt,
            wind,
            gravity,
            running: runningRef.current,
          },
          { x: prevX, z: prevZ },
        );

        mesh.userData.prevX = mesh.position.x;
        mesh.userData.prevZ = mesh.position.z;

        if (isSel) {
          selectRing.visible = true;
          selectRing.position.x = mesh.position.x;
          selectRing.position.z = mesh.position.z;
          selectRing.position.y = 0.06;
          const r =
            0.35 + org.expression.traits.size * 0.25 + Math.sin(time * 4) * 0.04;
          selectRing.scale.setScalar(r / 0.45);
          selectRing.rotation.z = time * 1.5;
        }

        if (
          (org.behaviour === "court" || org.behaviour === "mate-seek") &&
          mateSpark < mateCount
        ) {
          const i = mateSpark++;
          matePos[i * 3] = mesh.position.x + Math.sin(time * 5 + i) * 0.4;
          matePos[i * 3 + 1] =
            mesh.position.y + 1.2 + Math.sin(time * 8 + i) * 0.3;
          matePos[i * 3 + 2] = mesh.position.z + Math.cos(time * 5 + i) * 0.4;
        }
      }

      if (!selId) selectRing.visible = false;

      for (let i = mateSpark; i < mateCount; i++) {
        matePos[i * 3 + 1] = -20;
      }
      mateGeo.attributes.position.needsUpdate = true;
      mateMat.opacity = mateSpark > 0 ? 0.85 : 0;
    }

    let frame = 0;
    let raf = 0;
    let flashTimer = 0;
    let lastTs = performance.now();
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const time = clock.getElapsedTime();

      const e = envRef.current;
      const t = tickRef.current;
      const climate = deriveClimate(e, t);
      const weather = deriveWeather(e, t);
      const b = biomeFromEnv(e, t);

      // Water live
      const waterR = Math.max(0.12, Math.sqrt(e.surface.waterCoverage) * 9.5);
      water.scale.set(waterR, waterR, 1);
      waterMat.opacity = 0.5 + e.atmosphere.humidity * 0.35;
      water.position.y = 0.04 + Math.sin(frame * 0.03) * 0.015 * weather.wind;
      waterMat.color.setHSL(
        0.54,
        0.5,
        0.28 + e.chemicals.acidity * 0.08 - e.atmosphere.particulates * 0.06,
      );

      groundMat.color.set(b.ground);
      const fogDensity =
        0.022 +
        e.atmosphere.toxin * 0.018 +
        e.atmosphere.particulates * 0.035 +
        (1 - climate.airQuality) * 0.022 +
        weather.fogBoost;
      scene.fog = new THREE.FogExp2(b.fog, fogDensity);

      const skyMul =
        (0.18 + climate.lightLevel * 0.32 * climate.dayLengthFactor) *
        weather.lightDim;
      scene.background = new THREE.Color(b.sky).multiplyScalar(skyMul);

      // Sun / orbit
      sun.color.set(STAR_PRESETS[e.star].color);
      sun.intensity =
        (0.55 * climate.lightLevel * climate.dayLengthFactor + 0.1) *
        weather.lightDim;
      const ang = climate.yearPhase * Math.PI * 2;
      sun.position.set(
        Math.cos(ang) * 13,
        7 + Math.sin(ang) * 6 + e.orbit.axialTilt * 0.1,
        Math.sin(ang) * 11,
      );
      hemi.intensity = (0.3 + climate.dayLengthFactor * 0.28) * weather.lightDim;
      amb.intensity = (0.12 + climate.dayLengthFactor * 0.18) * weather.lightDim;

      // Clouds
      cloudGroup.visible = weather.kind !== "clear";
      cloudGroup.rotation.y += 0.0004 + weather.wind * 0.001;
      for (const child of cloudGroup.children) {
        const m = child as THREE.Mesh;
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.opacity =
          weather.kind === "clear"
            ? 0
            : weather.kind === "overcast" || weather.kind === "storm"
              ? 0.55 * weather.intensity
              : 0.28 * weather.intensity;
        mat.color.set(
          weather.kind === "dust"
            ? 0xc4a86a
            : weather.kind === "storm"
              ? 0x667788
              : 0xffffff,
        );
      }

      // Haze
      hazeMat.opacity =
        0.12 +
        e.atmosphere.particulates * 0.45 +
        e.atmosphere.humidity * 0.1 +
        (1 - climate.airQuality) * 0.22 +
        (weather.kind === "fog" ? 0.25 : 0);
      hazeMat.color.set(weather.tint);
      haze.rotation.y += 0.0005 + weather.wind * 0.0015;

      // Precipitation
      const raining =
        weather.precipRate > 0.05 &&
        (weather.kind === "rain" ||
          weather.kind === "storm" ||
          weather.kind === "snow" ||
          weather.kind === "blizzard");
      precipMat.opacity = raining ? 0.55 * weather.intensity : 0;
      precipMat.size =
        weather.kind === "snow" || weather.kind === "blizzard" ? 0.1 : 0.045;
      precipMat.color.set(
        weather.kind === "snow" || weather.kind === "blizzard"
          ? 0xeef4ff
          : weather.tint,
      );
      if (raining) {
        const arr = precipGeo.attributes.position.array as Float32Array;
        const fall =
          (weather.kind === "snow" || weather.kind === "blizzard" ? 0.06 : 0.18) *
          weather.precipRate *
          (1 + weather.intensity);
        const drift = weather.wind * 0.08;
        for (let i = 0; i < precipCount; i++) {
          arr[i * 3]! += drift * (0.5 + Math.random() * 0.5);
          arr[i * 3 + 1]! -= precipVel[i]! * fall * 8;
          if (arr[i * 3 + 1]! < 0) {
            arr[i * 3]! = (Math.random() - 0.5) * 26;
            arr[i * 3 + 1]! = 8 + Math.random() * 6;
            arr[i * 3 + 2]! = (Math.random() - 0.5) * 26;
          }
          if (Math.abs(arr[i * 3]!) > 14) arr[i * 3] = (Math.random() - 0.5) * 26;
        }
        precipGeo.attributes.position.needsUpdate = true;
      }

      // Lightning
      if (weather.kind === "storm") {
        flashTimer--;
        if (flashTimer <= 0 && Math.random() < 0.02 * weather.intensity) {
          flash.intensity = 4 + Math.random() * 6;
          flashTimer = 3 + Math.floor(Math.random() * 8);
        } else {
          flash.intensity *= 0.7;
        }
      } else {
        flash.intensity = 0;
      }

      // Water shimmer waves
      water.rotation.z = Math.sin(time * 0.4) * 0.01;
      waterMat.roughness = 0.1 + Math.sin(time * 2) * 0.04;

      // Ambient pollen / fireflies
      const isNight = climate.dayLengthFactor < 0.55;
      ambMat.color.set(isNight ? 0xaaffcc : 0xd4f0a0);
      ambMat.opacity = isNight ? 0.7 : 0.35 + e.surface.floraCoverage * 0.25;
      ambMat.size = isNight ? 0.09 : 0.055;
      {
        const arr = ambGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < ambCount; i++) {
          arr[i * 3]! +=
            Math.sin(time * 0.7 + i) * 0.01 * weather.wind +
            weather.wind * 0.008;
          arr[i * 3 + 1]! +=
            Math.sin(time * 2 + i * 0.3) * 0.008 * ambVel[i]!;
          if (isNight) arr[i * 3 + 1]! += 0.004;
          arr[i * 3 + 2]! += Math.cos(time * 0.6 + i) * 0.01 * weather.wind;
          if (arr[i * 3 + 1]! > 6) arr[i * 3 + 1] = 0.2;
          if (arr[i * 3 + 1]! < 0) arr[i * 3 + 1] = 4 + Math.random() * 2;
          if (Math.abs(arr[i * 3]!) > 13) arr[i * 3] = (Math.random() - 0.5) * 20;
          if (Math.abs(arr[i * 3 + 2]!) > 13)
            arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        ambGeo.attributes.position.needsUpdate = true;
      }

      syncFlora(floraRef.current, e, t);
      animateAllFlora(time, 0.4 + weather.wind * 1.2);
      syncFood(foodRef.current);
      syncSettlements(settleRef.current);
      for (let i = 0; i < settleGroup.children.length; i++) {
        const child = settleGroup.children[i] as THREE.Group;
        const s = settleRef.current[i];
        if (s) {
          child.userData.culture = s.culture;
          animateSettlement(child, time, s.culture, s.size);
        }
      }

      syncOrganisms(
        orgRef.current,
        time,
        dt,
        0.35 + weather.wind * 1.1,
        e.gravity,
      );

      // Follow selected fauna for close-up attribute viewing
      if (followRef.current && selectedRef.current) {
        const mesh = meshMap.get(selectedRef.current);
        if (mesh) {
          const want = new THREE.Vector3(
            mesh.position.x,
            mesh.position.y + 0.5,
            mesh.position.z,
          );
          controls.target.lerp(want, 1 - Math.exp(-4 * dt));
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = Math.max(380, mount.clientHeight || 480);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // Keyboard zoom
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "=" || ev.key === "+") zoomBy(0.82);
      if (ev.key === "-" || ev.key === "_") zoomBy(1.22);
      if (ev.key === "f" || ev.key === "F") focusSelected();
      if (ev.key === "r" || ev.key === "R") resetView();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      renderer.dispose();
      meshMap.clear();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-[min(68vh,640px)] w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-black/40 shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]"
      data-running={running ? "1" : "0"}
    >
      {/* Camera controls */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1">
        <button
          type="button"
          className="rounded-lg bg-black/55 px-2.5 py-1.5 text-sm font-bold text-white backdrop-blur hover:bg-black/75"
          title="Zoom in (scroll up or +)"
          onClick={() => zoomBy(0.75)}
        >
          +
        </button>
        <button
          type="button"
          className="rounded-lg bg-black/55 px-2.5 py-1.5 text-sm font-bold text-white backdrop-blur hover:bg-black/75"
          title="Zoom out (scroll down or −)"
          onClick={() => zoomBy(1.3)}
        >
          −
        </button>
        <button
          type="button"
          className="rounded-lg bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur hover:bg-black/75"
          title="Focus selected (F)"
          onClick={focusSelected}
        >
          Focus
        </button>
        <button
          type="button"
          className={`rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ${
            follow
              ? "bg-sky-500/70 text-white"
              : "bg-black/55 text-white hover:bg-black/75"
          }`}
          title="Follow selected fauna"
          onClick={() => setFollow((v) => !v)}
        >
          Follow
        </button>
        <button
          type="button"
          className="rounded-lg bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur hover:bg-black/75"
          title="Reset camera (R)"
          onClick={resetView}
        >
          Reset
        </button>
      </div>

      {/* Selected fauna attributes panel */}
      {selected && (
        <div className="absolute left-2 top-2 z-10 max-w-[min(100%,280px)] rounded-xl border border-white/15 bg-black/70 p-3 text-white shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                Fauna inspect
              </p>
              <p className="text-sm font-bold leading-tight">
                {selected.lineage} · gen {selected.generation}
              </p>
            </div>
            <button
              type="button"
              className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] hover:bg-white/20"
              onClick={() => onSelect?.(null)}
            >
              ✕
            </button>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-white/85">
            <li>
              <span className="text-white/50">Role</span> {selected.role}
            </li>
            <li>
              <span className="text-white/50">Sex</span> {selected.sex}
            </li>
            <li className="col-span-2">
              <span className="text-white/50">Behaviour</span>{" "}
              {behaviourLabel(selected.behaviour)}
            </li>
            <li>
              <span className="text-white/50">Energy</span>{" "}
              {selected.energy.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Age</span> {selected.age}
            </li>
            <li>
              <span className="text-white/50">Culture</span>{" "}
              {(selected.culture * 100).toFixed(0)}%
            </li>
            <li>
              <span className="text-white/50">Offspring</span>{" "}
              {selected.kin.offspringCount}
            </li>
            <li>
              <span className="text-white/50">Size</span>{" "}
              {selected.expression.traits.size.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Speed</span>{" "}
              {selected.expression.traits.speed.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Light</span>{" "}
              {selected.expression.traits.lightUse.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Mind</span>{" "}
              {selected.expression.traits.intelligence.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Predation</span>{" "}
              {selected.expression.traits.predation.toFixed(2)}
            </li>
            <li>
              <span className="text-white/50">Armor</span>{" "}
              {selected.expression.traits.armor.toFixed(2)}
            </li>
          </ul>
          {selected.expression.structures.length > 0 && (
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                Structures
              </p>
              <ul className="mt-1 max-h-20 space-y-0.5 overflow-y-auto text-[10px] text-white/80">
                {selected.expression.structures.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    {s.name}{" "}
                    <span className="text-white/45">
                      {(s.score * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-2 break-all font-mono text-[9px] text-white/40">
            AA: {selected.expression.aminoAcidSequence.slice(0, 28)}
            {selected.expression.aminoAcidSequence.length > 28 ? "…" : ""}
          </p>
          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-sky-500/80 py-1 text-[11px] font-semibold hover:bg-sky-400"
            onClick={focusSelected}
          >
            Zoom in close
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-white/70">
          <span className="rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
            Scroll zoom · drag orbit · right-drag pan
          </span>
          <span className="rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
            Click fauna to inspect
          </span>
          <span className="rounded-full bg-black/40 px-2 py-0.5 backdrop-blur">
            {running ? "● live" : "paused"}
          </span>
        </div>
        {zoomHint && (
          <span className="rounded-full bg-sky-500/80 px-2 py-0.5 text-[10px] font-semibold text-white animate-pulse">
            Scroll to zoom in on characters
          </span>
        )}
      </div>
    </div>
  );
}
