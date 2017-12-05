import * as THREE from 'three';

/**
 * Alien
 */
export default class Alien extends THREE.Group {
  /**
   * Creates an alien from the data provided.
   * @param {Array.<Array.<boolean>>} data
   */
  constructor(data) {
    super();

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00, side: THREE.DoubleSide,
    });

    const geometries = {};

    data.forEach((line, row) => {
      for (let i = 0, nextHole = 0, n = line.length; i < n; i = nextHole) {
        nextHole = i + 1;
        if (line[i]) {
          while (line[nextHole] && nextHole < n) {
            nextHole++;
          }
          const width = nextHole - i;
          if (!geometries[width]) {
            geometries[width] = new THREE.PlaneGeometry(width);
          }
          const plane = new THREE.Mesh(geometries[width], material);

          plane.position.y = -row;
          plane.position.x = i + width / 2;

          this.add(plane);
        }
      }
    });

    this.reposition();
  }

  /**
   * Find new values for X and Y.
   */
  reposition() {
    this.position.x = Math.round(-20 + Math.random() * 40) * 13;
    this.position.y = Math.round(-20 + Math.random() * 40) * 8;
  }

  /**
   * Gets called on each frame.
   * @param {number} timeDiff
   */
  animate(timeDiff) {
    const newZ = this.position.z + timeDiff * 50;

    if (newZ > 0) {
      this.reposition();
    }

    this.position.z = (1000 + newZ) % 1000 - 1000;
  }
}
