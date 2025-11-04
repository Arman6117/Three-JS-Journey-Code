import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import GUI from "lil-gui";

/**
 * Base
 */
const gui = new GUI();
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

// doorColorTexture. colorSpace = THREE.SRGBColorSpace
// matcapTexture.colorSpace = THREE.SRGBColorSpace
/**
 * Materials and geometries
 */

//!MeshBasicMaterial
// const material =new THREE.MeshBasicMaterial({map:doorColorTexture});

//!MeshNormalMaterial
// const material =new THREE.MeshNormalMaterial();
// material.flatShading = true

//!MeshMatCapMaterial
// const material =new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture

//  //!MeshLambertCapMaterial (Uses lights)
// const material =new THREE.MeshLambertMaterial();

//!MeshPhongCapMaterial (Uses lights)
// const material =new THREE.MeshPhongMaterial();
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

//  //!MeshToonMaterial (Not realistic)
// const material =new THREE.MeshToonMaterial();
// gradientTexture.minFilter= THREE.NearestFilter
// gradientTexture.magFilter= THREE.NearestFilter
// material.gradientMap = gradientTexture

//  //!MeshStandandardMaterial
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0
material.roughness = 0
// material.metalness = 1
// material. roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material. roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.transparent= true
// material.alphaMap = doorAlphaTexture

// Clearcoat
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
//Sheen

// Iridescence
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [ 100, 800 ]

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material. iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission' ).min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

/**
 * Environment Map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMaps/environmentMap3.hdr', (environmentMapTexture)=>{
    environmentMapTexture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMapTexture

    scene.environment = environmentMapTexture
})
// Scene
const scene = new THREE.Scene();
// scene.add(pointLight, ambientLight);
scene.add(plane, sphere, torus);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
