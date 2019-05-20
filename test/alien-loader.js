const assert = require('assert');
const {contentToArrays} = require('../src/alien-loader');

describe('Alien loader', () => {
  it('returns lines', () => {
    const arrays = contentToArrays(' 11   11');
    assert.strictEqual(arrays.length, 1);
    assert.strictEqual(arrays[0].length, 8);
  });
});
