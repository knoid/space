import * as env from './env';

const maxAngle = Math.PI / 6;
const rotation = THREE.Math.lerp.bind(null, maxAngle, -maxAngle);

/**
 * Manages mouse controls
 */
export default class Controls {
  /**
   * Sets up listeners
   * @param {THREE.Camera} camera
   * @param {ElementNode} domElement
   */
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement || window;
    this.viewPort = {width: 0, height: 0};

    this._x = 0.5;
    this._y = 0.5;

    if (!env.isMobile) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }
    window.addEventListener('resize', this.onResize.bind(this), false);

    this.onResize();
  }

  /**
   * @param {Event} e
   */
  onMouseMove(e) {
    this._x = e.clientY / this.viewPort.height;
    this._y = e.clientX / this.viewPort.width;
  }

  /**
   * Saves new winwdow size
   */
  onResize() {
    Object.assign(this.viewPort, {
      width: this.domElement.innerWidth,
      height: this.domElement.innerHeight,
    });
  }

  /**
   * Updates camera rotation.
   */
  animate() {
    this.camera.rotation.x = rotation(this._x);
    this.camera.rotation.y = rotation(this._y);
  }
}
