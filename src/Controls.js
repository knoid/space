/**
 * Creates a function that returns values between bounds.
 * @param {number} min
 * @param {number} max
 * @return {range~between}
 */
function range(min, max) {
  /**
   * @param {number} value
   * @return {number}
   */
  return function between(value) {
    return min + (1 - value) * (max - min);
  };
}

const rotation = range(-Math.PI / 6, Math.PI / 6);

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

    this._x = 0;
    this._y = 0;

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
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
  update() {
    this.camera.rotation.x = rotation(this._x);
    this.camera.rotation.y = rotation(this._y);
  }
}
