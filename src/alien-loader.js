/**
 * Converts file alien file content to arrays.
 * @param {string} content
 * @return {Array<number[]>}
 */
function contentToArrays(content) {
  const data = content.replace(/\n+$/, '').split('\n').map(function(line) {
    return line.replace(/\s+$/, '').split('').map(function(char) {
      return +(char !== ' ');
    });
  });

  const rows = [];
  data.forEach((line) => {
    const streaks = [];
    if (line[0]) {
      streaks.push(0);
    }
    for (let i = 0, nextHole = 0, n = line.length; i < n; i = nextHole) {
      nextHole = i + 1;
      while (line[i] === line[nextHole] && nextHole < n) {
        nextHole++;
      }
      streaks.push(nextHole - i);
    }
    rows.push(streaks);
  });

  return rows;
}

module.exports = function(data) {
  const arrays = contentToArrays(data);
  return [
    data.split('\n').map(function(line) {
      return '// ' + line;
    }).join('\n'),
    'export default ' + JSON.stringify(arrays, null, 2),
  ].join('\n');
};

module.exports.contentToArrays = contentToArrays;
