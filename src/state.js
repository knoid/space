const pointsElem = document.getElementById('points');

let points = 0;

/**
 * @param {number} morePoints
 */
export function addPoints(morePoints) {
  points += morePoints;
  pointsElem.innerText = points;
}
