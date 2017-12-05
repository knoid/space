import * as THREE from 'three';

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
  }

  /**
   * Calculates time difference between frames and calls animate on each child.
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const newTime = new Date();
    const timeDiff = (newTime - this._lastTime) / 1000;

    this.children.forEach((c) => {
      c.animate(timeDiff);
    });

    this._lastTime = new Date();
  }
}
