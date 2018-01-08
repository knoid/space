import Alien from './Alien';
import aliensData from './data';
import Scene from './Scene';

/**
 * Aliens CRUD
 */
export default class AlienCreator extends Scene {
  /**
   * Constructor
   * @param {CANNON.World} world
   */
  constructor(world) {
    super();
    this.world = world;
  }

  /**
   * Creates aliens if FPS allows it.
   * @param {number} delta
   */
  animate(delta) {
    if (delta * 60 < 1 && this.children.length < 100) {
      const data = aliensData[Math.floor(Math.random() * aliensData.length)];
      const alien = new Alien(this.world, data);
      this.add(alien);
    }
    super.animate(delta);
  }
}
