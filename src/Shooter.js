import Ball from './Ball';
import Scene from './Scene';
import {isMobile, settings} from './env';

/**
 * Manages all Shooter related things.
 */
export default class Shooter extends Scene {
  /**
   * Adds event listeners to shoot.
   * @param {CANNON.World} world
   */
  constructor(world) {
    super(world);

    this.help = null;
    this.lastShot = 0;
    this.mouseEvent = {
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    };
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

    this.setupHelp(isMobile ? 'mobile' : 'desktop');
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
    if (this.help) {
      this.help.parentElement.removeChild(this.help);
      this.help = null;
    }

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
   * Sets up help message for the appropriate controls.
   * @param {string} env
   */
  setupHelp(env) {
    for (const div of document.getElementsByClassName('help')) {
      if (div.id.endsWith(env)) {
        this.help = div;
      } else {
        div.parentElement.removeChild(div);
      }
    }
  }

  /**
   * Creates a ball and defines its velocity vector.
   * @param {Event} event
   */
  shoot(event) {
    const velocity = new CANNON.Vec3();
    velocity.x = (event.clientX / window.innerWidth) * 2 - 1;
    velocity.y = -(event.clientY / window.innerHeight) * 2 + 1;
    velocity.z = -1;

    this.add(new Ball(this.world, this, velocity));
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
   * Animates every ball in scene.
   * @param {number} delta
   * @param {THREE.Clock} clock
   */
  animate(delta, clock) {
    const now = clock.elapsedTime;
    if (this.shooting && now - this.lastShot > settings.ball.delay) {
      this.shoot(this.mouseEvent);
      this.lastShot = now;
    }

    super.animate(delta, clock);
  }
}
