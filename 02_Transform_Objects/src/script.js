import './style.css'
import * as THREE from 'three'

//! Canvas
const canvas = document.querySelector('canvas.webgl')

//! Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//!Group object to manipulate all at once
const group = new THREE.Group()

scene.add(group)
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0060 })
)
cube2.position.x = 2
cube3.position.x = -2
group.add(cube1,cube2,cube3)

//!Manipulating whole group
group.position.x = 1
// group.scale.y = 2 
group.rotation.y = 1

//!Position
// mesh.position.set(0.7, -0.6, 1)

//!Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

//!Scale
// mesh.scale.set(2, 0.5, 0.5)

//!Rotations
// mesh.rotation.x =1
// mesh.rotation.y = 0
// mesh.rotation.z = 1
//!Rotation using quaternions
// mesh.quaternion.x = 1

/**
 * Sizes
*/
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

//! Look at to focus at specific part of the scene
// camera.lookAt(mesh.position)
/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)