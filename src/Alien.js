const defaultColor = new THREE.Color(0x1fd017);
const diffColors = 6;

/**
 * Alien
 */
export default class Alien extends THREE.Group {
  /**
   * Creates an alien from the data provided.
   * @param {CANNON.World} world
   * @param {Array.<Array.<boolean>>} data
   */
  constructor(world, data) {
    super();

    this.material = new THREE.MeshBasicMaterial({
      color: defaultColor.clone(),
      side: THREE.DoubleSide,
    });

    const geometries = {};
    const width = data.reduce((width, line) => {
      return Math.max(line.length, width);
    }, 0);
    const height = data.length;

    data.forEach((line, row) => {
      for (let i = 0, nextHole = 0, n = line.length; i < n; i = nextHole) {
        nextHole = i + 1;
        if (line[i]) {
          while (line[nextHole] && nextHole < n) {
            nextHole++;
          }
          const planeWidth = nextHole - i;
          if (!geometries[planeWidth]) {
            geometries[planeWidth] = new THREE.PlaneGeometry(planeWidth);
          }
          const plane = new THREE.Mesh(geometries[planeWidth], this.material);

          plane.position.y = height / 2 - row - 0.5;
          plane.position.x = -width / 2 + i + planeWidth / 2;

          this.add(plane);
        }
      }
    });

    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, .5)),
    });
    world.addBody(this.body);

    this.reposition();
  }

  /**
   * Find new values for X and Y and color.
   */
  reposition() {
    const colorNumber = THREE.Math.randInt(0, diffColors);
    const hue = colorNumber / diffColors;
    this.material.color.offsetHSL(hue, 0, 0);

    this.body.mass = 10 * (colorNumber + 1);
    this.body.updateMassProperties();

    this.body.position.set(
      THREE.Math.randInt(-20, 20) * 13,
      THREE.Math.randInt(-20, 20) * 8,
      -2000 + 1000 * Math.random()
    );

    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);

    this.body.velocity.set(0, 0, 75);
  }

  /**
   * Gets called on each frame.
   * @param {number} timeDiff
   */
  animate(timeDiff) {
    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);

    if (this.position.z > 0) {
      this.reposition();
    }
  }
}
