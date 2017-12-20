const defaultColor = new THREE.Color(0x1fd017);
const diffColors = 6;

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

    this.material = new THREE.MeshBasicMaterial({color: defaultColor.clone()});

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
          const plane = new THREE.Mesh(geometries[width], this.material);

          plane.position.y = -row;
          plane.position.x = i + width / 2;

          this.add(plane);
        }
      }
    });

    this.reposition();
  }

  /**
   * Find new values for X and Y and color.
   */
  reposition() {
    const hue = THREE.Math.randInt(0, diffColors) / diffColors;
    this.material.color.offsetHSL(hue, 0, 0);

    this.position.x = THREE.Math.randInt(-20, 20) * 13;
    this.position.y = THREE.Math.randInt(-20, 20) * 8;
  }

  /**
   * Gets called on each frame.
   * @param {number} timeDiff
   */
  animate(timeDiff) {
    const newZ = this.position.z + timeDiff * 75;

    if (newZ > 0) {
      this.reposition();
    }

    this.position.z = (1000 + newZ) % 1000 - 1000;
  }
}
