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

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedUmbrella = null;
let isDragging = false;
let previousMouse = { x: 0, y: 0 };
const DRAG_SENSITIVITY = 2.0;
// Tune responsiveness: 1.0 (subtle), 2.0 (responsive), 3.0 (very reactive)
let momentumY = 0;
let momentumGroup = null;

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
});


function loadUmbrella() {
    return new Promise((resolve, reject) => {
        loader.load(
            './models/umbrella.gltf',
            (gltf) => {
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const targetSize = 2;
                const scale = targetSize / maxDim;
                gltf.scene.scale.set(scale, scale, scale);
                gltf.scene.position.copy(center.clone().multiplyScalar(-scale));
                resolve(gltf.scene);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

function disposeGroup(group) {
  if (group === selectedUmbrella) {
    isDragging = false;
    controls.enabled = true;
    selectedUmbrella = null;
  }
  if (group === momentumGroup) {
    momentumGroup = null;
    momentumY = 0;
  }
  group.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
  scene.remove(group);
}

function updateCounter() {
  const el = document.getElementById('counter');
  if (el) el.textContent = `${umbrellas.length} in scene`;
}

/* CANVAS */
//umbrella array
const umbrellas = [];
const COOL_PALETTE = [
  0x4aa4ff, 0x2196F3, 0x1565C0, 0x0D47A1,  // blues
  0x00BCD4, 0x4DB6AC, 0x009688,             // teals/cyan
  0x7E57C2, 0x5C6BC0, 0x3F51B5,             // purples/indigos
  0x00E5FF, 0x18FFFF,                        // bright cyans
];

//cube
var geometry = new THREE.BoxGeometry(1, 1, 1)
var material = new THREE.MeshStandardMaterial({color:'#8000ff'})
var cube = new THREE.Mesh(geometry, material)
cube.castShadow = true;
cube.receiveShadow = true;
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
var ambientLight = new THREE.AmbientLight('#ffd896', 0.25)
scene.add(ambientLight)
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3a2a1a, 0.8);
scene.add(hemiLight);
//point light
var pointLight = new THREE.PointLight('#b7eaff', 1.0);
pointLight.position.set(5, 5, 5);
pointLight.intensity = 0.5;

// Shadows + warm spotlight from back-top-right
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const spotLight = new THREE.SpotLight(0xffd090, 120);
spotLight.position.set(8, 12, -10);
spotLight.target.position.set(0, 0, 0);
spotLight.angle = Math.PI / 5;
spotLight.penumbra = 0.4;
spotLight.decay = 1;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.bias = -0.001;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 30;
scene.add(spotLight);
scene.add(spotLight.target);

const spotHelper = new THREE.SpotLightHelper(spotLight);
let showHelper = false;

document.getElementById('toggleHelper').addEventListener('click', () => {
  showHelper = !showHelper;
  if (showHelper) {
    scene.add(spotHelper);
  } else {
    scene.remove(spotHelper);
  }
});

function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    wireframeCube.rotation.x -= 0.005;
    wireframeCube.rotation.y -= 0.005;

    // Decaying momentum from drag release
    if (momentumGroup && Math.abs(momentumY) > 0.0001) {
        momentumGroup.rotation.y += momentumY;
        momentumY *= 0.97;
    } else if (momentumGroup) {
        momentumGroup = null;
        momentumY = 0;
    }

    // Rotate each umbrella
    for (const group of umbrellas) {
        if (group === selectedUmbrella) continue;
        group.rotation.y += 0.005;
        group.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
    }

    renderer.render(scene, camera);
}
animate()

//spawn button
document.getElementById('spawnBtn').addEventListener('click', async () => {
  try {
    const umbrella = await loadUmbrella();
    const range = 4;
    const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 6,  // range = 3 → spread = 6
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
    );
    const rot = new THREE.Euler(
        (Math.random() - 0.5) * 0.4,  // x-tilt
        Math.random() * Math.PI * 2,  // y-spin (full 360°)
        (Math.random() - 0.5) * 0.4   // z-tilt
    );
    // Pick one cool colour per umbrella
    const color = COOL_PALETTE[Math.floor(Math.random() * COOL_PALETTE.length)];
    umbrella.traverse((child) => {
    if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color.set(color);
    }
    });

    const group = new THREE.Group();
    group.position.copy(pos);
    group.rotation.copy(rot);    // random initial rotation on the group
    group.add(umbrella);
    scene.add(group);
    if (umbrellas.length >= 50) {
      const oldest = umbrellas.shift();
      disposeGroup(oldest);
    }
    umbrellas.push(group);
    updateCounter();

    group.userData.meshes = [];
    umbrella.traverse((child) => {
    if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.umbrellaParent = group;
        group.userData.meshes.push(child);
    }
    });

    //DEBUG CUBE
    /*const debugMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.5 });
    const debugCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), debugMat);
    debugCube.position.copy(pos);
    debugCube.position.y += 0.5;
    scene.add(debugCube);*/
  } catch (err) {
    console.error('Spawn failed:', err);
  }
});

document.getElementById('removeBtn').addEventListener('click', () => {
  if (umbrellas.length === 0) return;
  const last = umbrellas.pop();
  disposeGroup(last);
  updateCounter();
});

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const allMeshes = [];
  for (const umbrella of umbrellas) {
    allMeshes.push(...umbrella.userData.meshes);
  }
  const intersects = raycaster.intersectObjects(allMeshes);
  if (intersects.length > 0) {
    selectedUmbrella = intersects[0].object.userData.umbrellaParent;
    if (selectedUmbrella) {
      isDragging = true;
      controls.enabled = false;
      previousMouse.x = event.clientX;
      previousMouse.y = event.clientY;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(event.pointerId);
      event.stopPropagation();
    }
  }
}, { capture: true });

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (isDragging && selectedUmbrella) {
    const dx = (event.clientX - previousMouse.x) * 0.01 * DRAG_SENSITIVITY;
    const dy = (event.clientY - previousMouse.y) * 0.01 * DRAG_SENSITIVITY;
    selectedUmbrella.rotation.y += dx;
    selectedUmbrella.rotation.x += dy;
    momentumY = dx;
    previousMouse.x = event.clientX;
    previousMouse.y = event.clientY;
    return;
  }

  // Hover feedback
  raycaster.setFromCamera(pointer, camera);
  const allMeshes = [];
  for (const umbrella of umbrellas) {
    allMeshes.push(...umbrella.userData.meshes);
  }
  const intersects = raycaster.intersectObjects(allMeshes);
  renderer.domElement.style.cursor = intersects.length > 0 ? 'grab' : 'default';
});

window.addEventListener('pointerup', () => {
  if (isDragging) {
    momentumGroup = selectedUmbrella;
    isDragging = false;
    controls.enabled = true;
    selectedUmbrella = null;
    renderer.domElement.style.cursor = 'default';
  }
});