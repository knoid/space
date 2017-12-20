import Controls from './Controls';
import Alien from './Alien';
import aliensData from './data';
import Stats from 'stats.js';
import env from './env';

const aliens = [];
/**
 * Helper function to prevent default behavour from any event.
 * @param {Event} e
 */
function preventDefault(e) {
  e.preventDefault();
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const controls = new Controls(camera);

const renderer = new THREE.WebGLRenderer({antialias: true});




if (!env.isMobile) {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
}

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

/**
 * Creates an alien in a random location.
 * @return {Alien} said alien.
 */
function createAlien() {
  const data = aliensData[Math.floor(Math.random() * aliensData.length)];
  const alien = new Alien(data);
  alien.position.z = -3000 + 1000 * Math.random();
  scene.add(alien);
  aliens.push(alien);
  return alien;
}
for (let i = 0; i < 100; i++) {
  createAlien();
}

let time = new Date();
renderer.domElement.addEventListener('touchstart', preventDefault, false);

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

  time = newTime;
  renderer.render(scene, camera);
  stats.update();
}

animate();
