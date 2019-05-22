const assert = require('assert');
const {contentToArrays} = require('../src/alien-loader');

describe('Alien loader', () => {
  it('starts empty', () => {
    const arrays = contentToArrays(' 11   11');
    assert.strictEqual(arrays.length, 1);
    assert.strictEqual(arrays[0].length, 4);
    assert.deepStrictEqual(arrays[0], [1, 2, 3, 2]);
  });

  it('starts with value', () => {
    const arrays = contentToArrays('11   11');
    assert.strictEqual(arrays.length, 1);
    assert.strictEqual(arrays[0].length, 4);
    assert.deepStrictEqual(arrays[0], [0, 2, 3, 2]);
  });

  it('has several lines', () => {
    const arrays = contentToArrays(' 11   11\n11   11\n');
    assert.strictEqual(arrays.length, 2);
    assert.strictEqual(arrays[0].length, 4);
    assert.strictEqual(arrays[1].length, 4);
    assert.deepStrictEqual(arrays[0], [1, 2, 3, 2]);
    assert.deepStrictEqual(arrays[1], [0, 2, 3, 2]);
  });
});
