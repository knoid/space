import Alien from './Alien';
import aliensData from './data';
import Scene from './Scene';

/**
 * Aliens CRUD
 */
export default class AlienCreator extends Scene {
  /**
   * Creates aliens if FPS allows it.
   * @param {number} timeDiff
   */
  animate(timeDiff) {
    if (timeDiff * 60 < 1 && this.children.length < 100) {
      const data = aliensData[Math.floor(Math.random() * aliensData.length)];
      const alien = new Alien(data);
      alien.position.z = -3000 + 1000 * Math.random();
      this.add(alien);
    }
    super.animate(timeDiff);
  }
}
