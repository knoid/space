/**
 * Converts file alien file content to arrays.
 * @param {string} data
 * @return {Array<number[]>}
 */
function contentToArrays(data) {
  return data.replace(/\n+$/, '').split('\n').map(function(line) {
    return line.replace(/\s+$/, '').split('').map(function(char) {
      return +(char !== ' ');
    });
  });
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
