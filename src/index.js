import AlienCreator from './AlienCreator';
import Controls from './Controls';
import Stats from 'stats.js';
import Scene from './Scene';
import Shooter from './Shooter';
import * as env from './env';

const world = new CANNON.World();
const scene = new Scene(world);
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});

if (!env.isMobile) {
  scene.add(new Controls(camera));
}
scene.add(new AlienCreator(world));
scene.add(new Shooter(world));

let stats;
if (!env.isMobile) {
  stats = new Stats();
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
 * Animates next frame
 */
function animate() {
  requestAnimationFrame(animate);

  scene.animate();
  renderer.render(scene, camera);
  if (stats) {
    stats.update();
  }
}

animate();
