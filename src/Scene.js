/**
 * Custom scene that calls animate on each child.
 */
export default class Scene extends THREE.Scene {
  /**
   * Initializes variables.
   */
  constructor() {
    super();

    this._lastTime = new Date();
    this.animatable = [];
  }

  /**
   * Overwrites add so child gets animated if possible.
   * @param {object} child
   */
  add(child) {
    if (child.animate) {
      this.animatable.push(child);
    }
    if (child instanceof THREE.Object3D) {
      super.add(child);
    }
  }

  /**
   * Removes a child.
   * @param {object} child
   */
  remove(child) {
    const pos = this.animatable.indexOf(child);
    if (pos >= 0) {
      this.animatable.splice(pos, 1);
    }
    super.remove(child);
  }

  /**
   * Calculates time difference between frames and calls animate on each child.
   * @param {number?} timeDiff
   */
  animate(timeDiff) {
    if (!timeDiff) {
      const newTime = new Date();
      timeDiff = (newTime - this._lastTime) / 1000;
      this._lastTime = newTime;
    }

    this.animatable.forEach((c) => {
      c.animate(timeDiff);
    });
  }
}
