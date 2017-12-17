import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/OutlinePass';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import Controls from './Controls';
import Alien from './Alien';
import aliensData from './data';

const aliens = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const controls = new Controls(camera);

const renderer = new THREE.WebGLRenderer({antialias: true});

// post processing
const composer = new THREE.EffectComposer(renderer);

const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const windowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
const outlinePass = new THREE.OutlinePass(windowSize, scene, camera);
outlinePass.edgeStrength = 1;
outlinePass.pulsePeriod = 2;
outlinePass.visibleEdgeColor.set(0xa5ff00);
composer.addPass(outlinePass);

const effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);

/**
 * Updates canvas and camera to match new window resolution.
 */
function onWindowResize() {
  const {innerWidth, innerHeight} = window;

  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  effectFXAA.uniforms.resolution.value.set(1 / innerWidth, 1 / innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

onWindowResize();
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.z = -25;

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

outlinePass.selectedObjects = aliens.slice(0, aliens.length / 10)
  .reduce((a, b) => a.concat(b.children), []);
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
  composer.render();

  time = newTime;
}

animate();
