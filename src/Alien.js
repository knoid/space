import {ALIENS, BALLS} from './collisionIds';

const defaultColor = new THREE.Color(0x1fd017);
const diffColors = 6;

/**
 * Alien
 */
export default class Alien extends THREE.Group {
  /**
   * Creates an alien from the data provided.
   * @param {CANNON.World} world
   * @param {Array.<boolean[]>} data
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
      collisionFilterGroup: ALIENS,
      collisionFilterMask: BALLS,
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, .5)),
    });
    this.body._self = this;
    this.body.addEventListener('collide', this.onCollision.bind(this));
    world.addBody(this.body);

    this.reposition();
  }

  /**
   * Starts the removal process.
   * @param {CANNON.Event} e
   */
  onCollision(e) {
    this.possibleHit = e;
  }

  /**
   * Find new values for X and Y and color.
   */
  reposition() {
    this.dying = false;
    this.possibleHit = null;

    const colorNumber = THREE.Math.randInt(0, diffColors);

    this.body.mass = 10 * (colorNumber + 1);
    this.body.updateMassProperties();

    this.body.position.set(
        THREE.Math.randInt(-20, 20) * 13,
        THREE.Math.randInt(-20, 20) * 8,
        -2000 + 1000 * Math.random()
    );

    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
    this.quaternion.copy(this.body.quaternion);

    this.body.velocity.set(0, 0, 75);

    this.material.color.offsetHSL(colorNumber / diffColors, 0, 0);
    this.material.transparent = false;
    this.material.opacity = 1;
  }

  /**
   * Gets called on each frame.
   * @param {number} delta
   */
  animate(delta) {
    if (this.possibleHit && this.body.angularVelocity.length() > 0) {
      this.dying = true;
      this.possibleHit = null;
      this.material.transparent = true;
    }

    if (this.dying) {
      this.material.opacity -= delta;

      // aliens only rotate when dying.
      this.quaternion.copy(this.body.quaternion);

      if (this.material.opacity <= 0) {
        this.reposition();
      }
    }

    if (this.position.z > 0) {
      this.reposition();
    }

    this.position.copy(this.body.position);
  }
}
