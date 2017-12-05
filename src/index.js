import Controls from './Controls';
import * as THREE from 'three';
import Alien from './Alien';
import aliensData from './data';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const controls = new Controls(camera);
const renderer = new THREE.WebGLRenderer({antialias: true});

/**
 * Updates canvas and camera to match new window resolution.
 */
function onWindowResize() {
  const {innerWidth, innerHeight} = window;

  renderer.setSize(innerWidth, innerHeight);

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);

onWindowResize();
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.z = -25;

let aliens = [];
/**
 * Creates an alien in a random location.
 * @return {Alien} said alien.
 */
function createAlien() {
  const data = aliensData[Math.floor(Math.random() * aliensData.length)];
  const alien = new Alien(data);
  alien.position.z = -1000;
  scene.add(alien);
  aliens.push(alien);
  return alien;
}
for (let i = 0; i < 100; i++) {
  const alien = createAlien();
  alien.position.z *= Math.random();
}


let time = new Date();

/**
 * Animates next frame
 */
function animate() {
  requestAnimationFrame(animate);

  const newTime = new Date();
  const timeDiff = (newTime - time) / 1000;

  aliens.forEach((alien) => {
    alien.animate(timeDiff);
  });

  cube.rotation.x += timeDiff;
  cube.rotation.y += timeDiff;

  controls.update();
  renderer.render(scene, camera);
  time = newTime;
}

animate();
