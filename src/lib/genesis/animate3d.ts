/**
 * Highest-complexity procedural animation layer for Genesis Lab.
 * Limb cycles, behaviour poses, flora wind, particles, camera cinema.
 */
import * as THREE from "three";
import type { Organism } from "./simulate";
import type { CreatureBehaviour } from "./society";

function findPart(g: THREE.Object3D, name: string): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  g.traverse((c) => {
    if (c.name === name) found = c;
  });
  return found;
}

function allNamed(g: THREE.Object3D, prefix: string): THREE.Object3D[] {
  const out: THREE.Object3D[] = [];
  g.traverse((c) => {
    if (c.name.startsWith(prefix)) out.push(c);
  });
  return out;
}

/** Smooth damp helper */
function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export type AnimContext = {
  frame: number;
  /** seconds */
  time: number;
  dt: number;
  wind: number;
  gravity: number;
  running: boolean;
};

/**
 * Full character animation: locomotion gait + behaviour overlays.
 */
export function animateCreatureComplex(
  g: THREE.Group,
  org: Organism,
  ctx: AnimContext,
  prevPos: { x: number; z: number },
) {
  const { time, dt, wind, gravity, running } = ctx;
  const phase = (g.userData.phase as number) ?? 0;
  const t = org.expression.traits;
  const speed = Math.max(0.15, t.speed);
  const role = org.role;
  const beh = org.behaviour as CreatureBehaviour;

  // Velocity from position delta (for facing + gait intensity)
  const dx = org.x - prevPos.x;
  const dz = org.z - prevPos.z;
  const moveSpd = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
  const locomote = THREE.MathUtils.clamp(moveSpd * 2.2, 0, 1.8);

  // Face movement direction
  if (locomote > 0.08) {
    const targetYaw = Math.atan2(dx, dz);
    const cur = g.rotation.y;
    let diff = targetYaw - cur;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    g.rotation.y = cur + diff * Math.min(1, 8 * dt);
  }

  // Base bob from gravity
  const gScale = 1 / Math.sqrt(Math.max(0.35, gravity));
  const walkFreq = 6 + speed * 4 + (beh === "flee" ? 4 : 0) + (beh === "hunt" ? 2 : 0);
  const walkAmp = 0.018 * t.size * gScale * (0.4 + locomote);
  const gait = time * walkFreq + phase;

  // Vertical hop
  let yOff = Math.sin(gait) * walkAmp;
  let leanZ = 0;
  let leanX = 0;
  let spin = 0;

  // Behaviour-specific body motion
  switch (beh) {
    case "court":
    case "mate-seek":
      yOff += Math.sin(time * 5 + phase) * 0.03;
      spin = Math.sin(time * 3) * 0.15;
      leanZ = Math.sin(time * 4) * 0.08;
      break;
    case "farm":
    case "craft":
    case "build":
      yOff += Math.sin(time * 7) * 0.012;
      leanX = Math.sin(time * 7) * 0.12;
      break;
    case "ritual":
    case "socialize":
      spin = Math.sin(time * 1.2 + phase) * 0.25;
      yOff += Math.sin(time * 2) * 0.02;
      break;
    case "flee":
      yOff += Math.sin(gait * 1.4) * 0.04;
      leanX = -0.15;
      break;
    case "hunt":
      leanX = -0.08;
      yOff += Math.sin(gait) * 0.025;
      break;
    case "parent":
      yOff += Math.sin(time * 2.5) * 0.015;
      leanZ = Math.sin(time * 1.5) * 0.05;
      break;
    case "defend":
      leanX = -0.2;
      spin = Math.sin(time * 8) * 0.1;
      break;
    case "photosynthesize":
      leanZ = Math.sin(time * 0.8 + wind) * 0.06 * wind;
      yOff = Math.sin(time * 0.5) * 0.01;
      break;
    case "rest":
      yOff = Math.sin(time * 1.2) * 0.008;
      leanX = 0.12;
      break;
    case "teach":
    case "trade":
      leanZ = Math.sin(time * 2) * 0.06;
      break;
    case "explore":
    case "migrate":
      yOff += Math.sin(gait) * 0.02;
      break;
    default:
      break;
  }

  // Role flourishes
  if (role === "predator") {
    leanX -= 0.05;
    yOff += Math.sin(gait * 1.3) * 0.015;
  } else if (role === "flora-morph") {
    leanZ += Math.sin(time * 0.7 + wind * 2 + phase) * 0.1 * (0.3 + wind);
    spin = Math.sin(time * 0.3) * 0.05;
  } else if (role === "intelligent" || role === "human") {
    // subtle head-look simulated via lean
    leanZ += Math.sin(time * 0.9 + phase) * 0.03;
  }

  if (!running) {
    yOff *= 0.3;
    spin *= 0.2;
  }

  g.position.y = (g.userData.baseY as number) + yOff;
  g.rotation.z = damp(g.rotation.z, leanZ, 6, dt);
  g.rotation.x = damp(g.rotation.x, leanX, 6, dt);
  if (Math.abs(spin) > 0.001) g.rotation.y += spin * dt;

  // ── Limb / part animation ──────────────────────────
  animateLimbs(g, org, gait, locomote, beh, time, wind, dt);
  animateFxAttachments(g, org, time, beh, locomote);
}

function animateLimbs(
  g: THREE.Group,
  org: Organism,
  gait: number,
  locomote: number,
  beh: CreatureBehaviour,
  time: number,
  wind: number,
  dt: number,
) {
  const legs = allNamed(g, "leg");
  const arms = allNamed(g, "arm");
  const wings = allNamed(g, "wing");
  const tails = allNamed(g, "tail");
  const heads = allNamed(g, "head");
  const tools = allNamed(g, "tool");
  const ears = allNamed(g, "ear");
  const fins = allNamed(g, "fin");

  const swing = locomote * 0.55 + (beh === "flee" ? 0.35 : 0);

  legs.forEach((leg, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const phase = gait + side * Math.PI;
    const target = Math.sin(phase) * swing * 0.7;
    leg.rotation.x = damp(leg.rotation.x, target, 10, dt);
    leg.rotation.z = damp(
      leg.rotation.z,
      side * 0.05 + Math.sin(phase * 0.5) * 0.03,
      8,
      dt,
    );
  });

  arms.forEach((arm, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    let targetX = Math.sin(gait + side * Math.PI) * swing * -0.55;
    let targetZ = side * 0.12;

    if (beh === "farm" || beh === "craft" || beh === "build") {
      targetX = Math.sin(time * 7 + i) * 0.9 - 0.4;
      targetZ = side * 0.35;
    } else if (beh === "court" || beh === "socialize" || beh === "ritual") {
      targetX = -0.6 + Math.sin(time * 3 + i) * 0.25;
      targetZ = side * (0.4 + Math.sin(time * 2) * 0.15);
    } else if (beh === "defend" || beh === "hunt") {
      targetX = -0.9;
      targetZ = side * 0.5;
    } else if (beh === "parent") {
      targetX = -0.5 + Math.sin(time * 2) * 0.1;
      targetZ = side * 0.25;
    } else if (beh === "rest") {
      targetX = 0.2;
    }

    arm.rotation.x = damp(arm.rotation.x, targetX, 9, dt);
    arm.rotation.z = damp(arm.rotation.z, targetZ, 9, dt);
  });

  wings.forEach((wing, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const flap =
      Math.sin(time * (8 + org.expression.traits.speed * 4) + i) *
      (0.5 + locomote * 0.4);
    wing.rotation.z = damp(wing.rotation.z, side * (0.4 + flap), 12, dt);
    wing.rotation.y = damp(wing.rotation.y, side * flap * 0.3, 10, dt);
  });

  tails.forEach((tail) => {
    tail.rotation.y = damp(
      tail.rotation.y,
      Math.sin(time * 4 + gait) * 0.45 * (0.5 + locomote),
      8,
      dt,
    );
    tail.rotation.x = damp(
      tail.rotation.x,
      Math.sin(time * 3) * 0.15,
      8,
      dt,
    );
  });

  heads.forEach((head) => {
    let lookY = Math.sin(time * 0.7) * 0.25;
    let lookX = 0;
    if (beh === "hunt" || beh === "defend") lookX = -0.2;
    if (beh === "court") lookY = Math.sin(time * 2) * 0.5;
    if (beh === "rest") lookX = 0.25;
    head.rotation.y = damp(head.rotation.y, lookY, 5, dt);
    head.rotation.x = damp(head.rotation.x, lookX, 5, dt);
  });

  tools.forEach((tool) => {
    if (beh === "farm" || beh === "craft" || beh === "build") {
      tool.rotation.x = damp(
        tool.rotation.x,
        Math.sin(time * 7) * 1.1 - 0.3,
        12,
        dt,
      );
      tool.rotation.z = damp(tool.rotation.z, Math.sin(time * 7) * 0.2, 10, dt);
    } else if (beh === "defend" || beh === "hunt") {
      tool.rotation.x = damp(tool.rotation.x, -0.8, 8, dt);
      tool.rotation.z = damp(tool.rotation.z, 0.4, 8, dt);
    } else {
      tool.rotation.x = damp(tool.rotation.x, 0.1, 6, dt);
    }
  });

  ears.forEach((ear, i) => {
    ear.rotation.z = damp(
      ear.rotation.z,
      Math.sin(time * 5 + i) * 0.15,
      6,
      dt,
    );
  });

  fins.forEach((fin, i) => {
    fin.rotation.y = damp(
      fin.rotation.y,
      Math.sin(time * 6 + i) * 0.4,
      10,
      dt,
    );
  });

  // Soft body squash for non-limbed morphs
  if (legs.length === 0 && arms.length === 0 && org.role !== "flora-morph") {
    const sq = 1 + Math.sin(gait) * 0.04 * locomote;
    g.scale.y = damp(g.scale.y, (g.userData.baseScaleY as number) * sq, 10, dt);
    g.scale.x = damp(
      g.scale.x,
      (g.userData.baseScaleX as number) / Math.sqrt(sq),
      10,
      dt,
    );
  }

  // Wind on flora-morph canopy
  if (org.role === "flora-morph") {
    const canopy = findPart(g, "canopy");
    if (canopy) {
      canopy.rotation.z = Math.sin(time * 1.5 + wind * 3) * 0.12 * wind;
      canopy.rotation.x = Math.cos(time * 1.2) * 0.08 * wind;
    }
  }
}

function animateFxAttachments(
  g: THREE.Group,
  org: Organism,
  time: number,
  beh: CreatureBehaviour,
  locomote: number,
) {
  const heart = findPart(g, "fx-heart");
  if (heart) {
    const show = beh === "court" || beh === "mate-seek";
    heart.visible = show;
    if (show) {
      const pulse = 1 + Math.sin(time * 8) * 0.25;
      heart.scale.setScalar(pulse);
      heart.position.y = 1.4 * org.expression.traits.size + Math.sin(time * 4) * 0.08;
      heart.rotation.y = time * 2;
    }
  }

  const sweat = findPart(g, "fx-effort");
  if (sweat) {
    sweat.visible =
      beh === "farm" || beh === "build" || beh === "flee" || locomote > 1.2;
    if (sweat.visible) {
      sweat.position.y =
        1.2 * org.expression.traits.size + Math.sin(time * 10) * 0.05;
    }
  }

  const halo = findPart(g, "fx-halo");
  if (halo) {
    halo.rotation.z = time * 0.8;
    const mat = (halo as THREE.Mesh).material as THREE.MeshBasicMaterial;
    if (mat && "opacity" in mat) {
      mat.opacity = 0.25 + org.culture * 0.45 + Math.sin(time * 3) * 0.08;
    }
  }

  const mind = findPart(g, "fx-mind");
  if (mind) {
    mind.rotation.y = time * 1.5;
    mind.position.y =
      1.35 * org.expression.traits.size + Math.sin(time * 2) * 0.04;
  }
}

/** Tag mesh parts for animation; call after build */
export function tagCreatureParts(g: THREE.Group, org: Organism) {
  g.userData.baseScaleX = g.scale.x || 1;
  g.userData.baseScaleY = g.scale.y || 1;
  g.userData.baseScaleZ = g.scale.z || 1;
  g.userData.phase = Math.random() * Math.PI * 2;
  g.userData.prevX = org.x;
  g.userData.prevZ = org.z;
  g.userData.baseY = 0.05;

  // Auto-name untagged children by geometry heuristics if builders set names
  // Add FX nodes
  addFxNodes(g, org);
}

function addFxNodes(g: THREE.Group, org: Organism) {
  // Courtship heart
  if (!findPart(g, "fx-heart")) {
    const heart = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xff4488,
        transparent: true,
        opacity: 0.85,
      }),
    );
    heart.name = "fx-heart";
    heart.visible = false;
    heart.position.y = 1.5;
    g.add(heart);
  }

  // Effort spark
  if (!findPart(g, "fx-effort")) {
    const effort = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshBasicMaterial({
        color: 0xffee88,
        transparent: true,
        opacity: 0.7,
      }),
    );
    effort.name = "fx-effort";
    effort.visible = false;
    g.add(effort);
  }

  // Mind orb for intelligent/human
  if (
    (org.role === "intelligent" || org.role === "human") &&
    !findPart(g, "fx-mind")
  ) {
    const mind = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.07, 0),
      new THREE.MeshBasicMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0.65,
      }),
    );
    mind.name = "fx-mind";
    mind.position.y = 1.4;
    g.add(mind);
  }
}

/** Flora wind + growth pulse animation */
export function animateFloraMesh(
  g: THREE.Object3D,
  time: number,
  wind: number,
  health: number,
  kind: string,
) {
  const phase = (g.userData.phase as number) ?? 0;
  const sway =
    Math.sin(time * (0.9 + (kind === "tree" ? 0.3 : 1.2)) + phase) *
    wind *
    (kind === "tree" ? 0.04 : kind === "kelp" ? 0.12 : 0.07);
  g.rotation.z = sway;
  g.rotation.x = Math.cos(time * 0.7 + phase) * wind * 0.03;
  // Health pulse scale
  const pulse = 1 + Math.sin(time * 0.5 + phase) * 0.02 * health;
  g.scale.setScalar(pulse);
}

/** Settlement ambient animation */
export function animateSettlement(
  g: THREE.Group,
  time: number,
  culture: number,
  size: number,
) {
  const smoke = findPart(g, "smoke");
  if (smoke) {
    smoke.position.y = 1.2 * size + 0.8 + Math.sin(time * 2) * 0.05;
    smoke.scale.setScalar(0.8 + Math.sin(time * 1.5) * 0.15 + culture * 0.3);
    smoke.rotation.y = time * 0.5;
    const m = (smoke as THREE.Mesh).material as THREE.MeshBasicMaterial;
    if (m) m.opacity = 0.2 + culture * 0.25;
  }
  const fire = findPart(g, "fire");
  if (fire) {
    fire.scale.y = 0.8 + Math.sin(time * 12) * 0.25;
    fire.scale.x = 0.9 + Math.sin(time * 15) * 0.15;
    fire.rotation.y = time * 3;
  }
  const banner = findPart(g, "banner");
  if (banner) {
    banner.rotation.z = Math.sin(time * 3) * 0.2;
  }
}

/** Cinematic camera orbit with look-at interest */
export function updateCinematicCamera(
  camera: THREE.PerspectiveCamera,
  time: number,
  gravity: number,
  heat: number,
  interest: THREE.Vector3,
  intensity = 1,
) {
  const radius = 16.5 + Math.sin(time * 0.07) * 1.5 * intensity;
  const elev = 9.5 + gravity * 2.2 + heat + Math.sin(time * 0.11) * 0.8;
  const az = time * 0.12;
  camera.position.x = Math.sin(az) * radius + interest.x * 0.15;
  camera.position.z = Math.cos(az) * radius + interest.z * 0.15;
  camera.position.y = elev;
  camera.lookAt(interest.x * 0.3, 0.6 + heat * 0.3, interest.z * 0.3);
}

/** Build a simple settlement hut group */
export function buildSettlementMesh(opts: {
  name: string;
  size: number;
  culture: number;
}): THREE.Group {
  const g = new THREE.Group();
  const s = 0.6 + opts.size * 1.2;

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2 * s, 1.3 * s, 0.08, 12),
    new THREE.MeshStandardMaterial({ color: 0x6b5a3e, roughness: 0.95 }),
  );
  ground.position.y = 0.04;
  ground.receiveShadow = true;
  g.add(ground);

  // Hut body
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55 * s, 0.65 * s, 0.7 * s, 8),
    new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.85 }),
  );
  wall.position.y = 0.4 * s;
  wall.castShadow = true;
  g.add(wall);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.85 * s, 0.55 * s, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 }),
  );
  roof.position.y = 0.95 * s;
  roof.castShadow = true;
  g.add(roof);

  // Fire pit
  const fire = new THREE.Mesh(
    new THREE.ConeGeometry(0.12 * s, 0.28 * s, 5),
    new THREE.MeshBasicMaterial({
      color: 0xff6622,
      transparent: true,
      opacity: 0.85,
    }),
  );
  fire.name = "fire";
  fire.position.set(0.7 * s, 0.15 * s, 0.5 * s);
  g.add(fire);

  // Smoke
  const smoke = new THREE.Mesh(
    new THREE.SphereGeometry(0.2 * s, 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    }),
  );
  smoke.name = "smoke";
  smoke.position.set(0, 1.4 * s, 0);
  g.add(smoke);

  // Banner pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.1 * s, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4033 }),
  );
  pole.position.set(-0.7 * s, 0.55 * s, -0.5 * s);
  g.add(pole);
  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35 * s, 0.25 * s),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.55 + opts.culture * 0.2, 0.6, 0.5),
      side: THREE.DoubleSide,
    }),
  );
  banner.name = "banner";
  banner.position.set(-0.55 * s, 0.95 * s, -0.5 * s);
  g.add(banner);

  // Culture glow ring
  if (opts.culture > 0.2) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1 * s, 0.03, 6, 24),
      new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.2 + opts.culture * 0.4,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    ring.name = "culture-ring";
    g.add(ring);
  }

  g.userData.phase = Math.random() * Math.PI * 2;
  return g;
}

