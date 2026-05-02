//simple Three.js program :)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* SETUP */

//Scene + Camera + Renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({antialias:true})
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor("#0b0020") //background color
document.body.appendChild(renderer.domElement)
camera.position.z = 5

//resize canvas on resize window
window.addEventListener('resize', () => {
    let width = window.innerWidth
    let height = window.innerHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
})

//gltf loader
loader.load(
    './models/umbrella.gltf',
    function (gltf){
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0);
        scene.add(gltf.scene);
        scene.remove(cube);
    },
    undefined,
    function(error){
        console.error(error);
    }
);

/* CANVAS */

//cube
var geometry = new THREE.BoxGeometry(1, 1, 1)
var material = new THREE.MeshStandardMaterial({color:'#8000ff'})
var cube = new THREE.Mesh(geometry, material)
scene.add(cube)

//wireframe cube
var geometry2 = new THREE.BoxGeometry(3, 3, 3)
var material2 = new THREE.MeshBasicMaterial({
    color:"#4aa4ff", 
    wireframe: true,
    transparent: true
})
var wireframeCube = new THREE.Mesh(geometry2, material2)
scene.add(wireframeCube)

//ambient light
var ambientLight = new THREE.AmbientLight('#ffd896', 0.5)
scene.add(ambientLight)
//point light
var pointLight = new THREE.PointLight('#b7eaff', 1.0);
pointLight.position.set(5, 5, 5);
pointLight.intensity = 2;
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

//animation function
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01; //radians
    cube.rotation.y += 0.01;
    wireframeCube.rotation.x -= 0.005;
    wireframeCube.rotation.y -= 0.005;
    renderer.render(scene, camera)
}
animate()

