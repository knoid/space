/**
 * Manages all Shooter related things.
 */
export default class Shooter extends THREE.Group {
  /**
   * Adds event listenrs to shoot.
   */
  constructor() {
    super();

    this.lastShot = Date.now();
    this.mouseEvent = null;
    this.shooting = false;

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener('mousedown', this.onStart, false);
    window.addEventListener('touchstart', this.onStart, false);
    window.addEventListener('mousemove', this.onMove, false);
    window.addEventListener('touchmove', this.onMove, false);
    window.addEventListener('mouseup', this.onEnd, false);
    window.addEventListener('touchend', this.onEnd, false);
    window.addEventListener('keydown', this.onKeyDown, false);
    window.addEventListener('keyup', this.onKeyUp, false);
  }

  /**
   * onKeyDown
   * @param {Event} e
   */
  onKeyDown(e) {
    // SPACE pressed
    if (e.keyCode === 32) {
      this.onStart(e);
    }
  }

  /**
   * onKeyUp
   * @param {Event} e
   */
  onKeyUp(e) {
    // SPACE pressed
    if (e.keyCode === 32) {
      this.onEnd(e);
    }
  }

  /**
   * onStart
   * @param {Event} e
   */
  onStart(e) {
    this.updateMouseEvent(e);
    this.shooting = true;
  }

  /**
   * onMove
   * @param {Event} e
   */
  onMove(e) {
    this.updateMouseEvent(e);
  }

  /**
   * onEnd
   * @param {Event} e
   */
  onEnd(e) {
    this.shooting = false;
  }

  /**
   * Saves the last mouse event for later.
   * @param {Event} e
   */
  updateMouseEvent(e) {
    const mouseEvent = e.changedTouches ? e.changedTouches[0] : e;
    if (mouseEvent.clientX && mouseEvent.clientY) {
      this.mouseEvent = mouseEvent;
    }
  }

  /**
   * Creates a ball and defines its velocity vector.
   * @param {Event} event
   */
  shoot(event) {
    const geometry = new THREE.SphereGeometry(5, 8, 8);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const sphere = new THREE.Mesh(geometry, material);

    const velocity = new THREE.Vector3();
    velocity.x = (event.clientX / window.innerWidth) * 2 - 1;
    velocity.y = -(event.clientY / window.innerHeight) * 2 + 1;
    velocity.z = -1;

    sphere.userData.velocity = velocity.normalize();
    sphere.position.y = -10;

    this.add(sphere);
  }

  /**
   * Animates every ball in scene.
   * @param {number} timeDiff
   */
  animate(timeDiff) {
    const now = Date.now();
    if (this.shooting && now - this.lastShot > 150) {
      this.shoot(this.mouseEvent);
      this.lastShot = now;
    }

    this.children.forEach((ball) => {
      const velocity = ball.userData.velocity.clone();
      ball.position.add(velocity.multiplyScalar(timeDiff * 1000));
      if (ball.position.z < -1000) {
        this.remove(ball);
      }
    });
  }
}
