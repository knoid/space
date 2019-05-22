import {ALIENS, BALLS} from './collisionIds';
import {settings} from './env';

const defaultColor = new THREE.Color(0x1fd017);
const diffColors = 6;
const geometries = {};

/**
 * Alien
 */
export default class Alien extends THREE.Group {
  /**
   * Creates an alien from the data provided.
   * @param {CANNON.World} world
   * @param {Array<number[]>} data
   */
  constructor(world, data) {
    super();

    this.material = new THREE.MeshBasicMaterial({
      color: defaultColor.clone(),
      side: THREE.DoubleSide,
    });

    const width = Math.max(...data.map((line) =>
      line.reduce((accum, partWidth) => accum + partWidth, 0)
    ));
    const height = data.length;
    const weight = data.reduce((a1, line) =>
      a1 + line.reduce((a2, partWidth, index) =>
        a2 + (index % 2 ? 0 : partWidth), 0
      ), 0
    );

    data.forEach((line, row) => {
      let left = 0;
      for (let i = 0, n = line.length; i < n; i++) {
        const isAlienPart = i % 2;
        const partWidth = line[i];
        if (isAlienPart) {
          if (!geometries[partWidth]) {
            geometries[partWidth] = new THREE.PlaneGeometry(partWidth);
          }
          const plane = new THREE.Mesh(geometries[partWidth], this.material);

          plane.position.y = height / 2 - row - 0.5;
          plane.position.x = -width / 2 + left + partWidth / 2;

          this.add(plane);
        }
        left += partWidth;
      }
    });

    this.body = new CANNON.Body({
      collisionFilterGroup: ALIENS,
      collisionFilterMask: BALLS,
      mass: weight / 10,
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, .5)),
    });
    this.body._self = this;
    this.body.addEventListener('collide', this.onCollision.bind(this));
    world.addBody(this.body);

    if (settings.debug) {
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(0x00ff00),
        linewidth: 2,
      });
      const geometry = new THREE.WireframeGeometry(
          new THREE.PlaneGeometry(width, height)
      );
      const mesh = new THREE.LineSegments(geometry, material);
      this.add(mesh);
    }

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
