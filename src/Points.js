import typeface from 'three/examples/fonts/helvetiker_bold.typeface.json';
import {addPoints} from './state';

const cache = {};
const font = new THREE.Font(typeface);

/**
 * @param {number} hits
 * @return {THREE.Geometry}
 */
function getShape(hits) {
  if (!cache[hits]) {
    cache[hits] = new THREE.TextGeometry(`+${hits * 10}`, {
      font,
      size: 10,
      height: 0.1,
    });
  }
  return cache[hits];
}

// cache different scores
for (let i = 1; i < 5; i++) {
  getShape(i);
}

/**
 * Flashy points!
 */
export default class Points extends THREE.Group {
  /**
   * @param {Scene} scene
   * @param {number} hits
   * @param {THREE.Color} color
   */
  constructor(scene, hits, color) {
    super();
    this.scene = scene;

    const material = new THREE.MeshBasicMaterial({color});
    this.mesh = new THREE.Mesh(getShape(hits), material);
    this.mesh.position.y = 10;

    this.add(this.mesh);
    addPoints(hits * 10);
  }

  /**
   * animate
   * @param {number} delta
   */
  animate(delta) {
    this.mesh.position.y += 10 * delta;
    if (this.mesh.position.y > 20) {
      this.destroy();
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.scene.remove(this);
  }
}
