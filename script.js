import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  getMouseVector2,
  checkRayIntersections,
} from "./helpers/RayCastHelper";
import { getMeshColor } from "./helpers/ColorsHelper";
import { Messages } from "./constants";
import { createLabelRenderer, HideLabel, showLabel } from "./helpers/LabelBox";

const HOVER_INTENSITY = 0.3;
const CLICK_INTENSITY = 0.8;

const interactiveMeshes = [
  "aorta",
  "apex",
  "right_atrium",
  "left_atrium",
  "right_ventricle",
  "left_ventricle",
  "superior_vena_cava",
  "pulmonary_trunk",
  "right_pulmonary_artery",
  "left_pulmonary_artery",
];

let hoveredMesh = null;
let selectedMesh = null;
let currentLabel = null;
let heartMeshes = [];
const selectedMeshRef = { current: selectedMesh };

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const rayCaster = new THREE.Raycaster();
let mousePointer = new THREE.Vector2();
scene.background = new THREE.Color(0xe3e3e3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
document.body.appendChild(renderer.domElement);

const labelRenderer = createLabelRenderer();

const loader = new GLTFLoader();
async function loadModel() {
    const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}heart.glb`);
    scene.add(gltf.scene);

    gltf.scene.traverse((child) => {
        if (child.isMesh) heartMeshes.push(child);
    });
}

loadModel();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const fillLight = new THREE.DirectionalLight(0xf29683, 1.3);
scene.add(fillLight);
fillLight.position.set(0, 5, -10);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 1, 0);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, 3, -6);
scene.add(rimLight);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 2);
controls.enableDamping = true;
controls.update();

function onClick(event) {
  mousePointer = getMouseVector2(event, renderer);
  const intersect = checkRayIntersections(
    mousePointer,
    camera,
    rayCaster,
    heartMeshes
  );

  if (intersect) {
    const intersectedObject = intersect.object;

    if (selectedMeshRef.current !== intersectedObject) {
      if (selectedMeshRef.current) {
        selectedMeshRef.current.material.emissive.set(0x000000);
      }

      selectedMeshRef.current = intersectedObject;
      selectedMeshRef.current.material.emissive.set(
        getMeshColor(intersectedObject.name)
      );
      selectedMeshRef.current.material.emissiveIntensity = CLICK_INTENSITY;

      if (interactiveMeshes.includes(intersectedObject.name)) {
        currentLabel = showLabel(
          scene,
          intersect,
          currentLabel,
          Messages,
          selectedMeshRef
        );
      } else {
        currentLabel = HideLabel(currentLabel);
      }
    }
  }
}

window.addEventListener("click", onClick);

document.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  camera.updateMatrixWorld();
  mousePointer = getMouseVector2(event, renderer);
  const intersections = checkRayIntersections(
    mousePointer,
    camera,
    rayCaster,
    heartMeshes
  );

  if (intersections) {
    const intersected = intersections.object;

    if (hoveredMesh !== intersected) {
      if (hoveredMesh && hoveredMesh !== selectedMeshRef.current) {
        hoveredMesh.material.emissive.set(0x000000);
      }

      hoveredMesh = intersected;
      document.body.style.cursor = interactiveMeshes.includes(hoveredMesh.name)
        ? "pointer"
        : "default";
      if (hoveredMesh !== selectedMeshRef.current) {
        hoveredMesh.material.emissive.set(getMeshColor(hoveredMesh.name));
        hoveredMesh.material.emissiveIntensity = HOVER_INTENSITY;
      }
    }
  } else {
    if (hoveredMesh && hoveredMesh !== selectedMeshRef.current) {
      hoveredMesh.material.emissive.set(0x000000);
      hoveredMesh = null;
      document.body.style.cursor = "default";
    }
  }
}

function animate() {
  controls.update();

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
