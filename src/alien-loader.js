module.exports = function(data) {
  const arrays = data.replace(/\n+$/, '').split('\n').map(function(line) {
    return line.replace(/\s+$/, '').split('').map(function(char) {
      return +(char !== ' ');
    });
  });
  return [
    data.split('\n').map(function(line) {
      return '// ' + line;
    }).join('\n'),
    'export default ' + JSON.stringify(arrays, null, 2),
  ].join('\n');
};
