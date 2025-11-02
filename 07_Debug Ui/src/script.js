import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

//Debug

const gui = new GUI();
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const guiObj = {};
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#e66bff" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("horizontal");
gui.add(mesh.position, "z").min(-3).max(3).step(0.01).name("depth");
gui
  .add(mesh.rotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("rotationY");
gui
  .add(mesh.rotation, "z")
  .min(0)
  .max(Math.PI * 2)
  .step(0.01)
  .name("rotationZ");
gui.add(material, "wireframe");
gui.addColor(material, "color");

guiObj.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(guiObj, "spin");

//Tweaking geometry
guiObj.subdivision = 2;
gui

  .add(guiObj, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      guiObj.subdivision,
      guiObj.subdivision,
      guiObj.subdivision
    );
  });
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enabled = false;

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
