import './style.css'
import * as THREE from 'three'
import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Cursor
const cursor ={
    x:0,
    y:0
}

window.addEventListener('mousemove', (event)=> {
    cursor.x = event.clientX/sizes.width -0.5;
    cursor.y =-(event.clientY /sizes.height -0.5)
})
// Animate
const clock = new THREE.Clock()

//Orbit Controls 
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true //!Makes the movement smoother 
const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;
    
    //Moving camera 
    //Moving camera in all direction
    //  camera.position.x =Math.sin(cursor.x *Math.PI *2) * 3
    //  camera.position.z =Math.cos(cursor.x *Math.PI *2) * 3
    //  camera.position.y = cursor.y * 10
    //  camera.lookAt(mesh.position)
    //Updating controls
    controls.update()
    // Render

    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()