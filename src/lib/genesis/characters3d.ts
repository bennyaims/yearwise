/**
 * Higher-detail procedural creature meshes for Genesis Lab roles.
 * Parts are named (leg*, arm*, head, tool, …) for the complex animation layer.
 */
import * as THREE from "three";
import { tagCreatureParts } from "./animate3d";
import type { OrganismTraits } from "./dna";
import type { Organism } from "./simulate";

function skinMat(color: THREE.Color, opts?: { metal?: number; rough?: number }) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts?.rough ?? 0.48,
    metalness: opts?.metal ?? 0.12,
    flatShading: false,
  });
}

function addShadow(mesh: THREE.Mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Build a richer character group from organism traits + role */
export function buildDetailedCreature(org: Organism): THREE.Group {
  const g = new THREE.Group();
  const t = org.expression.traits;
  const s = Math.max(0.45, t.size);
  const role = org.role;
  const col = new THREE.Color().setHSL(t.hue / 360, 0.58, 0.44);
  const dark = col.clone().offsetHSL(0, 0.05, -0.12);
  const light = col.clone().offsetHSL(0, -0.05, 0.12);

  switch (role) {
    case "human":
      buildHuman(g, t, s, col, dark, light, org);
      break;
    case "intelligent":
      buildIntelligent(g, t, s, col, dark, light);
      break;
    case "predator":
      buildPredator(g, t, s, col, dark);
      break;
    case "flora-morph":
      buildFloraMorph(g, t, s, col);
      break;
    case "scavenger":
      buildScavenger(g, t, s, col, dark);
      break;
    case "herbivore":
      buildHerbivore(g, t, s, col, light);
      break;
    default:
      buildOmnivore(g, t, s, col, dark, light);
  }

  g.userData.role = role;
  g.userData.behaviour = org.behaviour;
  tagCreatureParts(g, org);
  return g;
}

/** Human inhabitant — biped with clothing, optional tool, behaviour cue */
function buildHuman(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  dark: THREE.Color,
  light: THREE.Color,
  org: Organism,
) {
  const skinTone = new THREE.Color().setHSL(0.08, 0.35, 0.42 + (t.hue % 40) / 200);
  const skin = skinMat(skinTone, { rough: 0.55, metal: 0.04 });
  const cloth = skinMat(dark, { rough: 0.7, metal: 0.05 });
  const hair = skinMat(new THREE.Color().setHSL(0.08, 0.4, 0.15), { rough: 0.9 });

  let li = 0;
  for (const side of [-1, 1]) {
    const leg = addShadow(
      new THREE.Mesh(new THREE.CapsuleGeometry(0.065 * s, 0.34 * s, 4, 8), skin),
    );
    leg.name = `leg${li++}`;
    leg.position.set(side * 0.1 * s, 0.3 * s, 0);
    g.add(leg);
  }
  const pelvis = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 10, 10), cloth),
  );
  pelvis.name = "pelvis";
  pelvis.position.y = 0.52 * s;
  pelvis.scale.set(1.1, 0.7, 0.85);
  g.add(pelvis);

  const torso = addShadow(
    new THREE.Mesh(new THREE.CapsuleGeometry(0.12 * s, 0.28 * s, 6, 10), cloth),
  );
  torso.name = "torso";
  torso.position.y = 0.78 * s;
  g.add(torso);

  let ai = 0;
  for (const side of [-1, 1]) {
    const arm = addShadow(
      new THREE.Mesh(new THREE.CapsuleGeometry(0.045 * s, 0.28 * s, 4, 8), skin),
    );
    arm.name = `arm${ai++}`;
    arm.position.set(side * 0.18 * s, 0.82 * s, 0);
    arm.rotation.z = side * 0.15;
    g.add(arm);
  }

  const head = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 12, 12), skin),
  );
  head.name = "head";
  head.position.y = 1.12 * s;
  g.add(head);

  const hairCap = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.125 * s, 10, 10), hair),
  );
  hairCap.name = "hair";
  hairCap.position.y = 1.18 * s;
  hairCap.scale.set(1, 0.7, 1);
  g.add(hairCap);

  // Always attach tool bone — visibility/pose driven by animation
  const tool = addShadow(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.02 * s, 0.025 * s, 0.45 * s, 6),
      skinMat(new THREE.Color("#8b6914"), { rough: 0.8 }),
    ),
  );
  tool.name = "tool0";
  tool.position.set(0.22 * s, 0.75 * s, 0.05 * s);
  tool.rotation.z = -0.4;
  const beh = org.behaviour;
  tool.visible =
    beh === "farm" ||
    beh === "build" ||
    beh === "hunt" ||
    beh === "craft" ||
    beh === "defend";
  g.add(tool);

  // Culture halo
  if (org.culture > 0.2) {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.22 * s, 0.015 * s, 6, 16),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55, 0.7, 0.6),
        transparent: true,
        opacity: 0.35 + org.culture * 0.4,
      }),
    );
    halo.name = "fx-halo";
    halo.position.y = 1.35 * s;
    halo.rotation.x = Math.PI / 2;
    g.add(halo);
  }

  if (org.age < 8) {
    g.scale.multiplyScalar(0.65);
  }
}

function buildIntelligent(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  dark: THREE.Color,
  light: THREE.Color,
) {
  const skin = skinMat(col, { rough: 0.42, metal: 0.08 });
  const cloth = skinMat(dark, { rough: 0.65, metal: 0.05 });

  // Legs
  let li = 0;
  for (const side of [-1, 1]) {
    const leg = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.07 * s, 0.32 * s, 4, 8),
        skin,
      ),
    );
    leg.name = `leg${li++}`;
    leg.position.set(side * 0.11 * s, 0.28 * s, 0);
    g.add(leg);
  }
  // Pelvis
  g.add(
    addShadow(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.14 * s, 12, 10),
        cloth,
      ),
    ),
  );
  g.children[g.children.length - 1]!.position.y = 0.42 * s;

  // Torso
  const torso = addShadow(
    new THREE.Mesh(
      new THREE.CapsuleGeometry(0.16 * s, 0.28 * s, 6, 12),
      skin,
    ),
  );
  torso.position.y = 0.72 * s;
  g.add(torso);

  // Shoulders
  const shoulders = addShadow(
    new THREE.Mesh(
      new THREE.CapsuleGeometry(0.06 * s, 0.28 * s, 4, 8),
      skin,
    ),
  );
  shoulders.rotation.z = Math.PI / 2;
  shoulders.position.y = 0.92 * s;
  g.add(shoulders);

  // Arms + hands
  let ai = 0;
  for (const side of [-1, 1]) {
    const arm = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.05 * s, 0.28 * s, 4, 8),
        skin,
      ),
    );
    arm.name = `arm${ai++}`;
    arm.position.set(side * 0.28 * s, 0.72 * s, 0);
    arm.rotation.z = side * 0.25;
    g.add(arm);
    const hand = addShadow(
      new THREE.Mesh(new THREE.SphereGeometry(0.06 * s, 8, 8), skin),
    );
    hand.position.set(side * 0.32 * s, 0.5 * s, 0.05 * s);
    g.add(hand);
  }

  // Head
  const head = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.15 * s, 16, 14), skin),
  );
  head.name = "head";
  head.position.y = 1.12 * s;
  g.add(head);

  // Eyes
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.035 * s, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xeef6ff,
        emissive: 0x223344,
        emissiveIntensity: 0.35,
      }),
    );
    eye.position.set(side * 0.055 * s, 1.14 * s, 0.12 * s);
    g.add(eye);
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.016 * s, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x111122 }),
    );
    pupil.position.set(side * 0.055 * s, 1.14 * s, 0.145 * s);
    g.add(pupil);
  }

  // Mind aura
  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(0.28 * s, 20, 16),
    new THREE.MeshBasicMaterial({
      color: 0x88ddff,
      transparent: true,
      opacity: 0.12 + t.intelligence * 0.18,
      wireframe: true,
    }),
  );
  aura.position.y = 1.12 * s;
  g.add(aura);

  // Staff / tool
  const staff = addShadow(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.02 * s, 0.025 * s, 0.55 * s, 6),
      new THREE.MeshStandardMaterial({
        color: 0xc9b896,
        metalness: 0.35,
        roughness: 0.4,
      }),
    ),
  );
  staff.name = "tool0";
  staff.position.set(0.38 * s, 0.7 * s, 0);
  staff.rotation.z = -0.35;
  g.add(staff);
  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.06 * s),
    new THREE.MeshStandardMaterial({
      color: 0x66eeff,
      emissive: 0x2288aa,
      emissiveIntensity: 0.6,
      metalness: 0.7,
    }),
  );
  gem.position.set(0.48 * s, 0.98 * s, 0);
  g.add(gem);
}

function buildPredator(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  dark: THREE.Color,
) {
  const bodyMat = skinMat(col.clone().offsetHSL(0, 0.08, -0.08), {
    rough: 0.4,
    metal: 0.15,
  });
  const belly = skinMat(dark, { rough: 0.55 });

  // Low body
  const torso = addShadow(
    new THREE.Mesh(
      new THREE.CapsuleGeometry(0.22 * s, 0.55 * s, 6, 12),
      bodyMat,
    ),
  );
  torso.rotation.z = Math.PI / 2;
  torso.position.set(0, 0.28 * s, 0);
  g.add(torso);

  const under = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.18 * s, 12, 10), belly),
  );
  under.position.set(0, 0.2 * s, 0);
  under.scale.set(1.4, 0.7, 1);
  g.add(under);

  // Head / snout
  const head = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.16 * s, 12, 10), bodyMat),
  );
  head.name = "head";
  head.position.set(0.38 * s, 0.34 * s, 0);
  g.add(head);
  const snout = addShadow(
    new THREE.Mesh(new THREE.ConeGeometry(0.09 * s, 0.28 * s, 8), bodyMat),
  );
  snout.rotation.z = -Math.PI / 2;
  snout.position.set(0.58 * s, 0.3 * s, 0);
  g.add(snout);

  // Fangs
  for (const side of [-1, 1]) {
    const fang = new THREE.Mesh(
      new THREE.ConeGeometry(0.025 * s, 0.1 * s, 5),
      new THREE.MeshStandardMaterial({ color: 0xffeecc, metalness: 0.3 }),
    );
    fang.position.set(0.62 * s, 0.22 * s, side * 0.04 * s);
    fang.rotation.x = Math.PI;
    g.add(fang);
  }

  // Eyes (glow)
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 * s, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0xff4422,
        emissive: 0xff2200,
        emissiveIntensity: 0.7,
      }),
    );
    eye.position.set(0.48 * s, 0.4 * s, side * 0.09 * s);
    g.add(eye);
  }

  // Legs
  const legN = Math.max(4, Math.min(6, 2 + t.limbCount));
  for (let i = 0; i < legN; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const along = (Math.floor(i / 2) - 0.5) * 0.28 * s;
    const leg = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.045 * s, 0.28 * s, 4, 6),
        bodyMat,
      ),
    );
    leg.name = "leg1";
    leg.position.set(along, 0.16 * s, side * 0.2 * s);
    leg.rotation.x = side * 0.35;
    g.add(leg);
  }

  // Tail
  const tail = addShadow(
    new THREE.Mesh(
      new THREE.ConeGeometry(0.08 * s, 0.45 * s, 6),
      bodyMat,
    ),
  );
  tail.name = "tail1";
  tail.rotation.z = Math.PI / 2.5;
  tail.position.set(-0.45 * s, 0.28 * s, 0);
  g.add(tail);

  // Spikes if armored
  if (t.armor > 0.4) {
    for (let i = 0; i < 4; i++) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.04 * s, 0.16 * s, 5),
        skinMat(dark, { metal: 0.4, rough: 0.35 }),
      );
      spike.position.set((i - 1.5) * 0.12 * s, 0.42 * s, 0);
      g.add(spike);
    }
  }
}

function buildFloraMorph(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
) {
  const stem = addShadow(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.08 * s, 0.12 * s, 0.55 * s, 8),
      new THREE.MeshStandardMaterial({ color: 0x3d6b38, roughness: 0.7 }),
    ),
  );
  stem.position.y = 0.28 * s;
  g.add(stem);

  // Layered petals
  for (let i = 0; i < 5; i++) {
    const petal = addShadow(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.22 * s, 10, 8),
        new THREE.MeshStandardMaterial({
          color: col.clone().offsetHSL(i * 0.03, 0, 0.05 * i),
          emissive: 0x113308,
          emissiveIntensity: 0.15 + t.lightUse * 0.25,
          roughness: 0.55,
        }),
      ),
    );
    const a = (i / 5) * Math.PI * 2;
    petal.position.set(
      Math.cos(a) * 0.18 * s,
      0.62 * s,
      Math.sin(a) * 0.18 * s,
    );
    petal.scale.set(1, 0.55, 0.7);
    g.add(petal);
  }
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.16 * s, 1),
    new THREE.MeshStandardMaterial({
      color: 0xffee88,
      emissive: 0x886600,
      emissiveIntensity: 0.4 + t.lightUse * 0.3,
    }),
  );
  core.name = "canopy";
  core.position.y = 0.65 * s;
  g.add(core);

  // Leaves
  for (const side of [-1, 1]) {
    const leaf = addShadow(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.2 * s, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x2f8a44 }),
      ),
    );
    leaf.scale.set(1.4, 0.25, 0.7);
    leaf.position.set(side * 0.25 * s, 0.35 * s, 0);
    leaf.rotation.z = side * 0.5;
    g.add(leaf);
  }
}

function buildHerbivore(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  light: THREE.Color,
) {
  const bodyMat = skinMat(col, { rough: 0.55 });
  const body = addShadow(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.32 * s, 16, 12),
      bodyMat,
    ),
  );
  body.scale.set(1.35, 0.95, 1.1);
  body.position.y = 0.35 * s;
  g.add(body);

  const head = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.16 * s, 12, 10), bodyMat),
  );
  head.name = "head";
  head.position.set(0.32 * s, 0.42 * s, 0);
  g.add(head);

  // Soft ears / antennae
  for (const side of [-1, 1]) {
    const ear = addShadow(
      new THREE.Mesh(
        new THREE.ConeGeometry(0.05 * s, 0.14 * s, 6),
        skinMat(light),
      ),
    );
    ear.name = "ear1";
    ear.position.set(0.28 * s, 0.58 * s, side * 0.1 * s);
    ear.rotation.x = side * 0.3;
    g.add(ear);
  }

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.035 * s, 8, 8),
      new THREE.MeshStandardMaterial({
        color: 0x224422,
        emissive: 0x112211,
        emissiveIntensity: 0.2,
      }),
    );
    eye.position.set(0.42 * s, 0.48 * s, side * 0.08 * s);
    g.add(eye);
  }

  const legs = Math.max(4, Math.min(6, t.limbCount || 4));
  for (let i = 0; i < legs; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const along = (Math.floor(i / 2) - 0.3) * 0.22 * s;
    const leg = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.04 * s, 0.22 * s, 4, 6),
        bodyMat,
      ),
    );
    leg.name = "leg1";
    leg.position.set(along, 0.14 * s, side * 0.18 * s);
    g.add(leg);
  }

  if (t.armor > 0.35) {
    const shell = addShadow(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.34 * s, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        skinMat(col.clone().offsetHSL(0, 0, -0.15), { metal: 0.35, rough: 0.4 }),
      ),
    );
    shell.position.y = 0.4 * s;
    g.add(shell);
  }
}

function buildScavenger(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  dark: THREE.Color,
) {
  const bodyMat = skinMat(col.clone().offsetHSL(0.02, 0, -0.05), { rough: 0.6 });
  const body = addShadow(
    new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 * s, 0), bodyMat),
  );
  body.position.y = 0.28 * s;
  g.add(body);

  // Beak
  const beak = addShadow(
    new THREE.Mesh(
      new THREE.ConeGeometry(0.08 * s, 0.22 * s, 6),
      skinMat(dark, { rough: 0.45 }),
    ),
  );
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.32 * s, 0.3 * s, 0);
  g.add(beak);

  // Wings / fins
  for (const side of [-1, 1]) {
    const wing = addShadow(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.2 * s, 8, 6),
        skinMat(col, { rough: 0.5 }),
      ),
    );
    wing.name = "wing1";
    wing.scale.set(0.35, 0.15, 1.1);
    wing.position.set(0, 0.32 * s, side * 0.28 * s);
    wing.rotation.y = side * 0.4;
    g.add(wing);
  }

  for (let i = 0; i < 4; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const leg = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.03 * s, 0.18 * s, 3, 5),
        bodyMat,
      ),
    );
    leg.name = "leg1";
    leg.position.set((Math.floor(i / 2) - 0.3) * 0.15 * s, 0.12 * s, side * 0.14 * s);
    g.add(leg);
  }
}

function buildOmnivore(
  g: THREE.Group,
  t: OrganismTraits,
  s: number,
  col: THREE.Color,
  dark: THREE.Color,
  light: THREE.Color,
) {
  const bodyMat = skinMat(col);
  const body = addShadow(
    new THREE.Mesh(new THREE.IcosahedronGeometry(0.32 * s, 1), bodyMat),
  );
  body.position.y = 0.32 * s;
  g.add(body);

  const head = addShadow(
    new THREE.Mesh(new THREE.SphereGeometry(0.15 * s, 12, 10), bodyMat),
  );
  head.name = "head";
  head.position.set(0.28 * s, 0.4 * s, 0);
  g.add(head);

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.03 * s, 8, 8),
      new THREE.MeshStandardMaterial({
        color: light,
        emissive: 0x333322,
        emissiveIntensity: 0.25,
      }),
    );
    eye.position.set(0.38 * s, 0.45 * s, side * 0.07 * s);
    g.add(eye);
  }

  if (t.armor > 0.3) {
    const ring = addShadow(
      new THREE.Mesh(
        new THREE.TorusGeometry(0.36 * s, 0.05 * s, 8, 20),
        skinMat(dark, { metal: 0.45, rough: 0.35 }),
      ),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.32 * s;
    g.add(ring);
  }

  if (t.lightUse > 0.35) {
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.48 * s, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0x88ff66,
        transparent: true,
        opacity: 0.1 + t.lightUse * 0.12,
        wireframe: true,
      }),
    );
    halo.position.y = 0.32 * s;
    g.add(halo);
  }

  const limbs = Math.max(2, Math.min(8, t.limbCount || 4));
  for (let i = 0; i < limbs; i++) {
    const a = (i / limbs) * Math.PI * 2;
    const leg = addShadow(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.04 * s, 0.24 * s, 4, 6),
        bodyMat,
      ),
    );
    leg.name = "leg1";
    leg.position.set(Math.cos(a) * 0.28 * s, 0.14 * s, Math.sin(a) * 0.28 * s);
    leg.rotation.z = Math.cos(a) * 0.4;
    leg.rotation.x = Math.sin(a) * 0.4;
    g.add(leg);
  }

  if (t.chemoUse > 0.4) {
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12 * s),
      new THREE.MeshStandardMaterial({
        color: 0x66ccee,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x113344,
        emissiveIntensity: 0.3,
      }),
    );
    crystal.position.y = 0.55 * s;
    g.add(crystal);
  }
}

/** @deprecated use animateCreatureComplex from animate3d — kept for API compat */
export function animateCharacter(
  g: THREE.Group,
  org: Organism,
  frame: number,
  weatherWind: number,
) {
  // Thin wrapper — full system lives in GenesisWorld3D + animate3d
  const time = frame * 0.016;
  const phase = (g.userData.phase as number) || 0;
  const gait = time * (6 + org.expression.traits.speed * 4) + phase;
  g.position.y =
    ((g.userData.baseY as number) || 0.05) + Math.sin(gait) * 0.02;
  if (org.role === "flora-morph") {
    g.rotation.z = Math.sin(time + weatherWind) * 0.05 * weatherWind;
  }
}
