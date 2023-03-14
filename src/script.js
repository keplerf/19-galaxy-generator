import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const parameters = {};

parameters.count = 4000;
parameters.size = 0.05;

let particulesGeometry = null;
let particulesMaterial = null;
let particules = null;

const generateGalaxy = () => {
  if (particulesGeometry != null) {
    particulesGeometry.dispose();
    particulesMaterial.dispose();
    scene.remove(particules);
  }
  const position = new Float32Array(parameters.count * 3);

  particulesGeometry = new THREE.BufferGeometry();

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    position[i3] = (Math.random() - 0.5) * 10;
    position[i3 + 1] = (Math.random() - 0.5) * 10;
    position[i3 + 2] = (Math.random() - 0.5) * 10;
  }
  particulesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(position, 3)
  );

  particulesMaterial = new THREE.PointsMaterial({ color: "red" });
  particulesMaterial.size = parameters.size;
  particulesMaterial.sizeAttenuation = true;

  particules = new THREE.Points(particulesGeometry, particulesMaterial);

  scene.add(particules);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(10000)
  .step(100)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "size")
  .min(0.001)
  .max(1)
  .step(0.001)
  .onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
