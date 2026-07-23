import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.querySelector("#scene-container");
const loading = document.querySelector("#loading");
const errorCard = document.querySelector("#error");
const tooltip = document.querySelector("#object-tooltip");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeae5e2);
scene.fog = new THREE.Fog(0xeae5e2, 260, 520);

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.screenSpacePanning = true;
controls.minDistance = 65;
controls.maxDistance = 430;
controls.maxPolarAngle = Math.PI * 0.98;

const ambient = new THREE.HemisphereLight(0xfffbf4, 0x806f87, 2.45);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xfff4e8, 4.1);
keyLight.position.set(-90, 170, -110);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -110;
keyLight.shadow.camera.right = 110;
keyLight.shadow.camera.top = 150;
keyLight.shadow.camera.bottom = -40;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xc5dfff, 1.65);
fillLight.position.set(120, 90, -20);
scene.add(fillLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(190, 80),
  new THREE.MeshStandardMaterial({ color: 0xded7d2, roughness: 1, transparent: true, opacity: 0.6 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.36;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(300, 30, 0xb9abbc, 0xd7cdd4);
grid.position.y = -0.35;
grid.material.transparent = true;
grid.material.opacity = 0.22;
scene.add(grid);

const groups = {
  structure: new THREE.Group(),
  furniture: new THREE.Group(),
  available: new THREE.Group(),
  future: new THREE.Group(),
  dimensions: new THREE.Group()
};
Object.values(groups).forEach((group) => scene.add(group));

const levelObjects = new Map();
const interactives = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let houseData;
const urlParams = new URLSearchParams(window.location.search);
const requestedView = urlParams.get("view");
const viewAliases = { front: "frontPerspective", top: "topPlan", materials: "materialsOverview" };
const requestedLayers = new Set((urlParams.get("layers") || "").split(",").filter(Boolean));
let activeView = viewAliases[requestedView] || "frontPerspective";
let cameraAnimation = null;

function materialFrom(definition) {
  const params = {
    color: new THREE.Color(definition.color || "#cccccc"),
    roughness: definition.roughness ?? 0.75,
    metalness: definition.metalness ?? 0,
    transparent: (definition.opacity ?? 1) < 1,
    opacity: definition.opacity ?? 1,
    side: THREE.DoubleSide
  };
  if (definition.emissive) {
    params.emissive = new THREE.Color(definition.emissive);
    params.emissiveIntensity = definition.emissiveIntensity ?? 1;
  }
  return new THREE.MeshStandardMaterial(params);
}

function geometryFor(element) {
  if (element.type === "box") return new THREE.BoxGeometry(...element.size);
  if (element.type === "cylinder") return new THREE.CylinderGeometry(element.radius, element.radius, element.height, 32);
  return null;
}

function register(mesh, element) {
  mesh.name = element.name;
  mesh.userData.element = element;
  mesh.position.set(...element.position);
  if (element.rotation) mesh.rotation.set(...element.rotation);
  mesh.castShadow = element.id !== "base";
  mesh.receiveShadow = true;
  interactives.push(mesh);

  const levels = element.level === "all"
    ? ["nivel-1", "nivel-2", "nivel-3"]
    : [element.level];
  mesh.userData.levels = levels;
  for (const level of levels) {
    if (!levelObjects.has(level)) levelObjects.set(level, new Set());
    levelObjects.get(level).add(mesh);
  }
  return mesh;
}

function registerComposite(group, element) {
  group.name = element.name;
  group.userData.element = element;
  group.position.set(...element.position);
  if (element.rotation) group.rotation.set(...element.rotation);
  const levels = element.level === "all" ? ["nivel-1", "nivel-2", "nivel-3"] : [element.level];
  group.userData.levels = levels;
  group.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.userData.element = element;
    interactives.push(child);
  });
  for (const level of levels) {
    if (!levelObjects.has(level)) levelObjects.set(level, new Set());
    levelObjects.get(level).add(group);
  }
  return group;
}

function buildOpenChannel(element, material) {
  const group = new THREE.Group();
  const thickness = element.profile.displayThickness;
  const width = element.profile.base;
  const sideHeight = element.profile.sideHeight;
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(element.length, thickness, width), material);
  bottom.position.y = thickness / 2;
  group.add(bottom);
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(element.length, sideHeight, thickness), material);
    wall.position.set(0, sideHeight / 2, side * (width / 2 - thickness / 2));
    group.add(wall);
  }
  return registerComposite(group, element);
}

function buildOpenChannelHelix(element, material) {
  const group = new THREE.Group();
  const segments = 88;
  const thickness = element.profile.displayThickness;
  const width = element.profile.base;
  const sideHeight = element.profile.sideHeight;
  for (let i = 0; i < segments; i += 1) {
    const pointAt = (index) => {
      const t = index / segments;
      const angle = t * Math.PI * 2 * element.turns;
      return new THREE.Vector3(Math.cos(angle) * element.radius, element.height * (1 - t), Math.sin(angle) * element.radius);
    };
    const start = pointAt(i);
    const end = pointAt(i + 1);
    const midpoint = start.clone().lerp(end, 0.5);
    const direction = end.clone().sub(start);
    const segment = new THREE.Group();
    segment.position.copy(midpoint);
    segment.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.clone().normalize());
    const length = direction.length() * 1.05;
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(length, thickness, width), material);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(length, sideHeight, thickness), material);
    const rightWall = leftWall.clone();
    bottom.position.y = thickness / 2;
    leftWall.position.set(0, sideHeight / 2, -(width / 2 - thickness / 2));
    rightWall.position.set(0, sideHeight / 2, width / 2 - thickness / 2);
    segment.add(bottom, leftWall, rightWall);
    group.add(segment);
  }
  return registerComposite(group, element);
}

function buildStack(element, material) {
  const group = new THREE.Group();
  const [length, thickness, width] = element.sheetSize;
  for (let i = 0; i < element.quantity; i += 1) {
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(length, thickness, width), material);
    sheet.position.y = i * (thickness + 0.35);
    group.add(sheet);
  }
  return registerComposite(group, element);
}

function buildPoolOutline(element, material) {
  const group = new THREE.Group();
  const [width, displayHeight, depth] = element.size;
  const water = new THREE.Mesh(new THREE.BoxGeometry(width - 1.4, displayHeight / 2, depth - 1.4), material);
  water.position.y = displayHeight / 4;
  group.add(water);
  const rimMaterial = material.clone();
  rimMaterial.opacity = 0.9;
  for (const z of [-depth / 2, depth / 2]) {
    const rim = new THREE.Mesh(new THREE.BoxGeometry(width, displayHeight, 0.8), rimMaterial);
    rim.position.set(0, displayHeight / 2, z);
    group.add(rim);
  }
  for (const x of [-width / 2, width / 2]) {
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.8, displayHeight, depth), rimMaterial);
    rim.position.set(x, displayHeight / 2, 0);
    group.add(rim);
  }
  return registerComposite(group, element);
}

function buildMarker(element, material) {
  const group = new THREE.Group();
  const marker = new THREE.Mesh(new THREE.OctahedronGeometry(4.5), material);
  const label = makeLabel(element.name, "#9b6321");
  label.position.y = 8;
  group.add(marker, label);
  return registerComposite(group, element);
}

function buildStairs(element, material) {
  const stairGroup = new THREE.Group();
  stairGroup.name = element.name;
  stairGroup.userData.element = element;
  const [width, rise, run] = element.stepSize;
  for (let i = 0; i < element.steps; i += 1) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(width, rise, run), material);
    step.position.set(0, i * rise, -i * run);
    step.castShadow = true;
    step.receiveShadow = true;
    step.userData.element = element;
    interactives.push(step);
    stairGroup.add(step);
  }
  stairGroup.position.set(...element.position);
  stairGroup.userData.levels = ["nivel-1", "nivel-2", "nivel-3"];
  for (const level of stairGroup.userData.levels) {
    if (!levelObjects.has(level)) levelObjects.set(level, new Set());
    levelObjects.get(level).add(stairGroup);
  }
  return stairGroup;
}

function makeLabel(text, color = "#4b3b50") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 96;
  context.font = "600 30px DM Sans, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const width = Math.min(context.measureText(text).width + 50, 500);
  context.fillStyle = "rgba(255,253,250,.94)";
  context.beginPath();
  context.roundRect(256 - width / 2, 12, width, 72, 18);
  context.fill();
  context.strokeStyle = "rgba(75,59,80,.2)";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = color;
  context.fillText(text, 256, 49);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(38, 7.2, 1);
  sprite.renderOrder = 20;
  return sprite;
}

function buildDimension(dimension) {
  const start = new THREE.Vector3(...dimension.start);
  const end = new THREE.Vector3(...dimension.end);
  const color = dimension.status === "reported" ? 0x5e4967 : 0xd19738;
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([start, end]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, depthTest: false })
  );
  line.renderOrder = 10;
  const markerGeometry = new THREE.SphereGeometry(0.8, 12, 12);
  const markerMaterial = new THREE.MeshBasicMaterial({ color, depthTest: false });
  const startMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  const endMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  startMarker.position.copy(start);
  endMarker.position.copy(end);
  startMarker.renderOrder = endMarker.renderOrder = 11;
  const label = makeLabel(dimension.label);
  label.position.copy(start).lerp(end, 0.5).add(new THREE.Vector3(0, 3.6, 0));
  const group = new THREE.Group();
  group.add(line, startMarker, endMarker, label);
  group.userData.views = dimension.views || ["frontPerspective", "topPlan"];
  return group;
}

function populate(data) {
  const materials = Object.fromEntries(
    Object.entries(data.materials).map(([key, value]) => [key, materialFrom(value)])
  );

  const assemblyParents = new Map();
  for (const assembly of data.assemblies || []) {
    for (const groupName of Object.keys(groups)) {
      if (groupName === "dimensions") continue;
      const parent = new THREE.Group();
      parent.name = `${assembly.name} · ${groupName}`;
      parent.position.set(...assembly.position);
      parent.rotation.set(...assembly.rotation);
      groups[groupName].add(parent);
      assemblyParents.set(`${groupName}:${assembly.id}`, parent);
    }
  }

  for (const element of data.elements) {
    const material = materials[element.material];
    let object;
    if (element.type === "openChannel") object = buildOpenChannel(element, material);
    else if (element.type === "openChannelHelix") object = buildOpenChannelHelix(element, material);
    else if (element.type === "stack") object = buildStack(element, material);
    else if (element.type === "poolOutline") object = buildPoolOutline(element, material);
    else if (element.type === "marker") object = buildMarker(element, material);
    else if (element.type === "stairs") object = buildStairs(element, material);
    else object = register(new THREE.Mesh(geometryFor(element), material), element);
    const parent = element.assembly
      ? assemblyParents.get(`${element.group}:${element.assembly}`)
      : groups[element.group];
    parent.add(object);
  }

  for (const dimension of data.dimensions) groups.dimensions.add(buildDimension(dimension));
  groups.future.visible = data.defaultVisibility.future;
  groups.available.visible = data.defaultVisibility.available;
  groups.structure.visible = data.defaultVisibility.structure;
  groups.furniture.visible = data.defaultVisibility.furniture;
  groups.dimensions.visible = data.defaultVisibility.dimensions;
  if (requestedLayers.has("future")) groups.future.visible = true;
  if (requestedLayers.has("available")) groups.available.visible = true;
  document.querySelector("#toggle-future").checked = groups.future.visible;
  document.querySelector("#toggle-available").checked = groups.available.visible;
  createLevelControls(data);
  setView(activeView, false);
}

function createLevelControls(data) {
  const host = document.querySelector("#level-controls");
  for (const level of data.modelAssumptions.levels) {
    const label = document.createElement("label");
    label.className = "switch-row";
    const number = level.id.replace("nivel-", "Nivel ");
    label.innerHTML = `<span><b>${number}</b><small>${level.minY}–${level.maxY} cm · estimado</small></span><input type="checkbox" checked data-level="${level.id}"><i></i>`;
    host.appendChild(label);
    label.querySelector("input").addEventListener("change", updateLevelVisibility);
  }
}

function updateLevelVisibility() {
  const states = new Map(
    [...document.querySelectorAll("[data-level]")].map((input) => [input.dataset.level, input.checked])
  );
  for (const [level, objects] of levelObjects) {
    for (const object of objects) {
      const objectLevels = object.userData.levels || [level];
      object.visible = objectLevels.some((item) => states.get(item) ?? true);
    }
  }
}

function setView(viewName, animate = true) {
  if (!houseData) return;
  activeView = viewName;
  const view = houseData.views[viewName];
  const nextPosition = new THREE.Vector3(...view.camera);
  const nextTarget = new THREE.Vector3(...view.target);
  camera.up.set(0, 1, 0);
  if (viewName === "topPlan") camera.up.set(0, 0, -1);
  updateDimensionVisibility();

  document.querySelector("#view-front").classList.toggle("active", viewName === "frontPerspective");
  document.querySelector("#view-top").classList.toggle("active", viewName === "topPlan");
  document.querySelector("#view-materials").classList.toggle("active", viewName === "materialsOverview");

  if (!animate) {
    camera.position.copy(nextPosition);
    controls.target.copy(nextTarget);
    controls.update();
    return;
  }
  cameraAnimation = {
    start: performance.now(),
    duration: 650,
    fromPosition: camera.position.clone(),
    toPosition: nextPosition,
    fromTarget: controls.target.clone(),
    toTarget: nextTarget
  };
}

function updateDimensionVisibility() {
  const enabled = document.querySelector("#toggle-dimensions").checked;
  groups.dimensions.visible = enabled;
  for (const child of groups.dimensions.children) {
    child.visible = child.userData.views?.includes(activeView) ?? true;
  }
}

function updateCameraAnimation(now) {
  if (!cameraAnimation) return;
  const raw = Math.min((now - cameraAnimation.start) / cameraAnimation.duration, 1);
  const t = 1 - Math.pow(1 - raw, 3);
  camera.position.lerpVectors(cameraAnimation.fromPosition, cameraAnimation.toPosition, t);
  controls.target.lerpVectors(cameraAnimation.fromTarget, cameraAnimation.toTarget, t);
  if (raw >= 1) cameraAnimation = null;
}

function resize() {
  const { clientWidth, clientHeight } = container;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight, false);
}

function updateTooltip(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(interactives, false).find(({ object }) => object.visible && object.parent?.visible);
  if (!hit?.object.userData.element) {
    tooltip.hidden = true;
    return;
  }
  const element = hit.object.userData.element;
  tooltip.textContent = `${element.name}${element.status === "future" ? " · idea futura" : ""}`;
  tooltip.style.left = `${event.clientX - rect.left}px`;
  tooltip.style.top = `${event.clientY - rect.top}px`;
  tooltip.hidden = false;
}

document.querySelector("#toggle-structure").addEventListener("change", (event) => { groups.structure.visible = event.target.checked; });
document.querySelector("#toggle-furniture").addEventListener("change", (event) => { groups.furniture.visible = event.target.checked; });
document.querySelector("#toggle-available").addEventListener("change", (event) => { groups.available.visible = event.target.checked; });
document.querySelector("#toggle-dimensions").addEventListener("change", updateDimensionVisibility);
document.querySelector("#toggle-future").addEventListener("change", (event) => { groups.future.visible = event.target.checked; });
document.querySelector("#view-front").addEventListener("click", () => setView("frontPerspective"));
document.querySelector("#view-top").addEventListener("click", () => setView("topPlan"));
document.querySelector("#view-materials").addEventListener("click", () => {
  groups.available.visible = true;
  document.querySelector("#toggle-available").checked = true;
  setView("materialsOverview");
});
document.querySelector("#reset-view").addEventListener("click", () => setView(activeView));
renderer.domElement.addEventListener("pointermove", updateTooltip);
renderer.domElement.addEventListener("pointerleave", () => { tooltip.hidden = true; });
window.addEventListener("resize", resize);

async function loadModel() {
  try {
    const response = await fetch("../model/casa.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo leer casa.json (${response.status}).`);
    houseData = await response.json();
    populate(houseData);
    loading.hidden = true;
  } catch (error) {
    loading.hidden = true;
    errorCard.hidden = false;
    errorCard.textContent = `${error.message} Abrí el proyecto mediante un servidor web local; el navegador no permite cargar el modelo desde un archivo suelto.`;
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  updateCameraAnimation(now);
  controls.update();
  renderer.render(scene, camera);
}

resize();
loadModel();
requestAnimationFrame(animate);
