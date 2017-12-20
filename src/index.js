import AlienCreator from './AlienCreator';
import Controls from './Controls';
import Stats from 'stats.js';
import Scene from './Scene';
import env from './env';

/**
 * Helper function to prevent default behavour from any event.
 * @param {Event} e
 */
function preventDefault(e) {
  e.preventDefault();
}

const scene = new Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

if (!env.isMobile) {
  scene.add(new Controls(camera));
}
scene.add(new AlienCreator());

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
renderer.domElement.addEventListener('touchstart', preventDefault, false);

/**
 * Animates next frame
 */
function animate() {
  requestAnimationFrame(animate);

  scene.animate();
  renderer.render(scene, camera);
  stats.update();
}

animate();
