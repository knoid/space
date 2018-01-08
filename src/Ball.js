import Points from './Points';
import {settings} from './env';

const origin = new THREE.Vector3();

/**
 * Ball with its physics.
 */
export default class Ball extends THREE.Mesh {
  /**
   * Creates a new projectile with the given velocity.
   * @param {CANNON.World} world
   * @param {Scene} scene
   * @param {CANNON.Vec3} velocity
   */
  constructor(world, scene, velocity) {
    const radius = settings.ball.radius;
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    super(geometry, material);

    this.onCollition = this.onCollition.bind(this);

    velocity.normalize();
    const body = new CANNON.Body({
       mass: settings.ball.mass, // kg
       position: new CANNON.Vec3(0, -10, 0), // m
       shape: new CANNON.Sphere(radius),
       velocity: velocity.scale(500),
    });
    world.addBody(body);
    body.addEventListener('collide', this.onCollition);

    this.body = body;
    this.hits = 0;
    this.possibleHit = null;
    this.scene = scene;
    this.world = world;
  }

  /**
   * animate
   */
  animate() {
    if (this.possibleHit) {
      if (this.possibleHit.body.angularVelocity.length() > 0) {
        this.hits += 1;

        const color = this.possibleHit.material.color;
        const points = new Points(this.scene, this.hits, color);
        points.position.copy(this.possibleHit.body.position);
        this.scene.add(points);
      }
      this.possibleHit = null;
    }

    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
    if (this.position.distanceTo(origin) > 1000) {
      this.destroy();
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.body.removeEventListener('collide', this.onCollition);
    this.world.removeBody(this.body);
    this.scene.remove(this);
  }

  /**
   * onCollition
   * @param {CANNON.Event} e
   */
  onCollition(e) {
    this.possibleHit = e.body._self;
  }
}
