'use strict';
/* eslint-disable no-eval */
var assert = require('simple-assert');
var eql = require('..');
var emptyFunction = Function.prototype;
var symbolExists = typeof Symbol === 'function';
var setExists = typeof Set === 'function';
var mapExists = typeof Map === 'function';
var symbolAndMapExist = symbolExists && mapExists;
var symbolAndSetExist = symbolExists && setExists;
var supportGenerators = false;
var supportArrows = false;
try {
  eval('function * foo () {}; foo');
  supportGenerators = true;
} catch (error) {
  supportGenerators = false;
}
try {
  eval('() => {}');
  supportArrows = true;
} catch (error) {
  supportArrows = false;
}

function describeIf(condition) {
  return condition ? describe : describe.skip;
}
describe('ES2015 Specific', function () {

  describeIf(symbolExists && typeof String.prototype[Symbol.iterator] === 'function')('string iterator', function () {

    it('returns true for Strings with same entries', function () {
      assert(eql('abc'[Symbol.iterator](), 'abc'[Symbol.iterator]()),
        'eql("abc"[Symbol.iterator](), "abc"[Symbol.iterator]())');
    });

    it('returns false for Strings with different entries', function () {
      assert(eql('abc'[Symbol.iterator](), 'def'[Symbol.iterator]()) === false,
        'eql("abc"[Symbol.iterator](), "def"[Symbol.iterator]()) === false');
    });

  });

  describeIf(symbolExists && typeof Array.prototype[Symbol.iterator] === 'function')('array iterator', function () {

    it('returns true for Arrays with same entries', function () {
      assert(eql([ 1, 2, 3 ][Symbol.iterator](), [ 1, 2, 3 ][Symbol.iterator]()),
        'eql([ 1, 2, 3 ][Symbol.iterator](), [ 1, 2, 3 ][Symbol.iterator]())');
    });

    it('returns false for Arrays with different entries', function () {
      assert(eql([ 1, 2, 3 ][Symbol.iterator](), [ 4, 5, 6 ][Symbol.iterator]()) === false,
        'eql([ 1, 2, 3 ][Symbol.iterator](), [ 4, 5, 6 ][Symbol.iterator]()) === false');
    });

  });

  describeIf(typeof Array.prototype.entries === 'function')('array iterator (entries)', function () {

    it('returns true for Arrays with same entries', function () {
      assert(eql([ 1, 2, 3 ].entries(), [ 1, 2, 3 ].entries()),
        'eql([ 1, 2, 3 ].entries(), [ 1, 2, 3 ].entries())');
    });

    it('returns false for Arrays with different entries', function () {
      assert(eql([ 1, 2, 3 ].entries(), [ 4, 5, 6 ].entries()) === false,
        'eql([ 1, 2, 3 ].entries(), [ 4, 5, 6 ].entries()) === false');
    });

  });

  describeIf(mapExists)('maps', function () {

    it('returns true for Maps with same entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapA.set('b', 2);
      mapA.set('c', 3);
      mapB.set('c', 3);
      mapB.set('b', 2);
      mapB.set('a', 1);
      assert(eql(mapA, mapB), 'eql(Map { a => 1, b => 2, c => 3 }, Map { a => 1, b => 2, c => 3 })');
    });

    it('returns false for Maps with different entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapB.set('a', 1);
      mapA.set('b', 2);
      mapB.set('b', 2);
      mapA.set('c', 3);
      mapB.set('c', 3);
      assert(eql(mapA, mapB), 'eql(Map { a => 1, b => 2, c => 3 }, Map { a => 1, b => 2, c => 3 })');
    });

  });

  describeIf(symbolAndMapExist && typeof Map.prototype[Symbol.iterator] === 'function')('map iterator', function () {

    it('returns true for Map iterators with same entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapB.set('a', 1);
      mapA.set('b', 2);
      mapB.set('b', 2);
      mapA.set('c', 3);
      mapB.set('c', 3);
      assert(eql(mapA[Symbol.iterator](), mapB[Symbol.iterator]()),
        'eql(Map { a => 1, b => 2, c => 3 }[Symbol.iterator](), Map { a => 1, b => 2, c => 3 }[Symbol.iterator]())');
    });

    it('returns false for Map iterators with different entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapB.set('a', 2);
      mapA.set('b', 3);
      mapB.set('b', 4);
      mapA.set('c', 5);
      mapB.set('c', 6);
      assert(eql(mapA[Symbol.iterator](), mapB[Symbol.iterator]()) === false,
        'eql(Map { a => 1, b => 3, c => 5 }[Symbol.iterator](), ' +
        'Map { a => 2, b => 4, c => 6 }[Symbol.iterator]()) === false');
    });

  });

  describeIf(mapExists && typeof Map.prototype.entries === 'function')('map iterator (entries)', function () {

    it('returns true for Map iterators with same entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapB.set('a', 1);
      mapA.set('b', 2);
      mapB.set('b', 2);
      mapA.set('c', 3);
      mapB.set('c', 3);
      assert(eql(mapA.entries(), mapB.entries()),
        'eql(Map { a => 1, b => 2, c => 3 }.entries(), Map { a => 1, b => 2, c => 3 }.entries())');
    });

    it('returns false for Map iterators with different entries', function () {
      var mapA = new Map();
      var mapB = new Map();
      mapA.set('a', 1);
      mapB.set('a', 2);
      mapA.set('b', 3);
      mapB.set('b', 4);
      mapA.set('c', 5);
      mapB.set('c', 6);
      assert(eql(mapA.entries(), mapB.entries()) === false,
        'eql(Map { a => 1, b => 3, c => 5 }.entries(), ' +
        'Map { a => 2, b => 4, c => 6 }.entries()) === false');
    });

  });

  describeIf(typeof WeakMap === 'function')('weakmaps', function () {

    it('returns true for same WeakMaps', function () {
      var weakMap = new WeakMap();
      assert(eql(weakMap, weakMap), 'eql(weakMap, weakMap)');
    });

    it('returns false for different WeakMaps', function () {
      assert(eql(new WeakMap(), new WeakMap()) === false,
        'eql(new WeakMap(), new WeakMap()) === false');
    });

  });

  describeIf(setExists)('sets', function () {

    it('returns true for Sets with same entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('a');
      setB.add('b');
      setB.add('c');
      assert(eql(setA, setB), 'eql(Set { "a", "b", "c" }, Set { "a", "b", "c" })');
    });

    it('returns true for Sets with same entries in different order', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('b');
      setB.add('c');
      setB.add('a');
      assert(eql(setA, setB), 'eql(Set { "a", "b", "c" }, Set { "b", "c", "a" })');
    });

    it('returns true for Sets with nested entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add([ [], [], [] ]);
      setB.add([ [], [], [] ]);
      assert(eql(setA, setB) === true, 'eql(Set [ [], [], [] ], Set [ [], [], [] ]) === true');
    });

    it('returns true for Sets with same circular references', function () {
      var setA = new Set();
      var setB = new Set();
      var setC = new Set();
      setA.add(setC);
      setB.add(setC);
      setC.add(setA);
      setC.add(setB);
      assert(eql(setA, setB) === true, 'eql(Set { setC }, Set { setC }) === true');
    });

    it('returns false for Sets with different entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('d');
      setB.add('e');
      setB.add('f');
      assert(eql(setA, setB) === false, 'eql(Set { "a", "b", "c" }, Set { "d", "e", "f" }) === false');
    });

    it('returns true for circular Sets', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add(setB);
      setB.add(setA);
      assert(eql(setA, setB) === true, 'eql(Set { -> }, Set { <- }) === true');
    });

  });

  describeIf(symbolAndSetExist && typeof Set.prototype[Symbol.iterator] === 'function')('set iterator', function () {

    it('returns true for Sets with same entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('c');
      setB.add('b');
      setB.add('a');
      assert(eql(setA[Symbol.iterator](), setB[Symbol.iterator]()),
        'eql(Set { "a", "b", "c" }[Symbol.iterator](), Set { "a", "b", "c" }[Symbol.iterator]())');
    });

    it('returns false for Sets with different entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('d');
      setB.add('e');
      setB.add('f');
      assert(eql(setA[Symbol.iterator](), setB[Symbol.iterator]()) === false,
        'eql(Set { "a", "b", "c" }[Symbol.iterator](), Set { "d", "e", "f" }[Symbol.iterator]()) === false');
    });

  });

  describeIf(setExists && typeof Set.prototype.entries === 'function')('set iterator (entries)', function () {

    it('returns true for Sets with same entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('c');
      setB.add('b');
      setB.add('a');
      assert(eql(setA.entries(), setB.entries()),
        'eql(Set { "a", "b", "c" }.entries(), Set { "a", "b", "c" }.entries())');
    });

    it('returns false for Sets with different entries', function () {
      var setA = new Set();
      var setB = new Set();
      setA.add('a');
      setA.add('b');
      setA.add('c');
      setB.add('d');
      setB.add('e');
      setB.add('f');
      assert(eql(setA.entries(), setB.entries()) === false,
        'eql(Set { "a", "b", "c" }.entries(), Set { "d", "e", "f" }.entries()) === false');
    });

  });

  describeIf(typeof WeakSet === 'function')('weaksets', function () {

    it('returns true for same WeakSets', function () {
      var weakSet = new WeakSet();
      assert(eql(weakSet, weakSet), 'eql(weakSet, weakSet)');
    });

    it('returns false for different WeakSets', function () {
      assert(eql(new WeakSet(), new WeakSet()) === false,
        'eql(new WeakSet(), new WeakSet()) === false');
    });

  });

  describeIf(typeof Symbol === 'function')('symbol', function () {

    it('returns true for the same symbols', function () {
      var sym = Symbol();
      assert(eql(sym, sym), 'eql(sym, sym)');
      assert(eql(Symbol.iterator, Symbol.iterator), 'eql(Symbol.iterator, Symbol.iterator)');
    });

    it('returns false for different symbols', function () {
      assert(eql(Symbol(), Symbol()) === false, 'eql(Symbol(), Symbol()) === false');
    });

  });

  describeIf(typeof Promise === 'function')('promise', function () {

    it('returns true for the same promises', function () {
      var promiseResolve = Promise.resolve();
      var promiseReject = Promise.reject();
      var promisePending = new Promise(emptyFunction);
      assert(eql(promiseResolve, promiseResolve), 'eql(promiseResolve, promiseResolve)');
      assert(eql(promiseReject, promiseReject), 'eql(promiseReject, promiseReject)');
      assert(eql(promisePending, promisePending), 'eql(promisePending, promisePending)');

      promiseReject.catch(function () {});
    });


    it('returns false for different promises', function () {
      assert(eql(Promise.resolve(), Promise.resolve()) === false,
        'eql(Promise.resolve(), Promise.resolve()) === false');

      var promiseRejectA = Promise.reject();
      var promiseRejectB = Promise.reject();
      assert(eql(promiseRejectA, promiseRejectB) === false,
        'eql(Promise.reject(), Promise.reject()) === false');

      promiseRejectA.catch(function () {});
      promiseRejectB.catch(function () {});

      assert(eql(new Promise(emptyFunction), new Promise(emptyFunction)) === false,
        'eql(new Promise(emptyFunction), new Promise(emptyFunction)) === false');
    });

  });

  describeIf(typeof Int8Array === 'function')('int8array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Int8Array(1, 2, 3, 4), new Int8Array(1, 2, 3, 4)),
        'eql(new Int8Array(1, 2, 3, 4), new Int8Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Int8Array(1, 2, 3, 4), new Int8Array(5, 6, 7, 8)) === false,
        'eql(new Int8Array(1, 2, 3, 4), new Int8Array(5, 6, 7, 8)) === false');
      assert(eql(new Int8Array(1, 2, 3, 4), new Int8Array(4, 2, 3, 4)) === false,
        'eql(new Int8Array(1, 2, 3, 4), new Int8Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Uint8Array === 'function')('uint8array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(1, 2, 3, 4)),
        'eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(5, 6, 7, 8)) === false,
        'eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(5, 6, 7, 8)) === false');
      assert(eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(4, 2, 3, 4)) === false,
        'eql(new Uint8Array(1, 2, 3, 4), new Uint8Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Uint8ClampedArray === 'function')('uint8clampedarray', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(1, 2, 3, 4)),
        'eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(5, 6, 7, 8)) === false,
        'eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(5, 6, 7, 8)) === false');
      assert(eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(4, 2, 3, 4)) === false,
        'eql(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Int16Array === 'function')('int16array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Int16Array(1, 2, 3, 4), new Int16Array(1, 2, 3, 4)),
        'eql(new Int16Array(1, 2, 3, 4), new Int16Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Int16Array(1, 2, 3, 4), new Int16Array(5, 6, 7, 8)) === false,
        'eql(new Int16Array(1, 2, 3, 4), new Int16Array(5, 6, 7, 8)) === false');
      assert(eql(new Int16Array(1, 2, 3, 4), new Int16Array(4, 2, 3, 4)) === false,
        'eql(new Int16Array(1, 2, 3, 4), new Int16Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Uint16Array === 'function')('uint16array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(1, 2, 3, 4)),
        'eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(5, 6, 7, 8)) === false,
        'eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(5, 6, 7, 8)) === false');
      assert(eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(4, 2, 3, 4)) === false,
        'eql(new Uint16Array(1, 2, 3, 4), new Uint16Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Int32Array === 'function')('int32array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Int32Array(1, 2, 3, 4), new Int32Array(1, 2, 3, 4)),
        'eql(new Int32Array(1, 2, 3, 4), new Int32Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Int32Array(1, 2, 3, 4), new Int32Array(5, 6, 7, 8)) === false,
        'eql(new Int32Array(1, 2, 3, 4), new Int32Array(5, 6, 7, 8)) === false');
      assert(eql(new Int32Array(1, 2, 3, 4), new Int32Array(4, 2, 3, 4)) === false,
        'eql(new Int32Array(1, 2, 3, 4), new Int32Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Uint32Array === 'function')('uint32array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(1, 2, 3, 4)),
        'eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(5, 6, 7, 8)) === false,
        'eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(5, 6, 7, 8)) === false');
      assert(eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(4, 2, 3, 4)) === false,
        'eql(new Uint32Array(1, 2, 3, 4), new Uint32Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Float32Array === 'function')('float32array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Float32Array(1, 2, 3, 4), new Float32Array(1, 2, 3, 4)),
        'eql(new Float32Array(1, 2, 3, 4), new Float32Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Float32Array(1, 2, 3, 4), new Float32Array(5, 6, 7, 8)) === false,
        'eql(new Float32Array(1, 2, 3, 4), new Float32Array(5, 6, 7, 8)) === false');
      assert(eql(new Float32Array(1, 2, 3, 4), new Float32Array(4, 2, 3, 4)) === false,
        'eql(new Float32Array(1, 2, 3, 4), new Float32Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof Float64Array === 'function')('float64array', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new Float64Array(1, 2, 3, 4), new Float64Array(1, 2, 3, 4)),
        'eql(new Float64Array(1, 2, 3, 4), new Float64Array(1, 2, 3, 4))');
    });

    it('returns false for arrays with different values', function () {
      assert(eql(new Float64Array(1, 2, 3, 4), new Float64Array(5, 6, 7, 8)) === false,
        'eql(new Float64Array(1, 2, 3, 4), new Float64Array(5, 6, 7, 8)) === false');
      assert(eql(new Float64Array(1, 2, 3, 4), new Float64Array(4, 2, 3, 4)) === false,
        'eql(new Float64Array(1, 2, 3, 4), new Float64Array(4, 2, 3, 4)) === false');
    });

  });

  describeIf(typeof DataView === 'function')('dataview', function () {

    it('returns true for arrays with same values', function () {
      var dataViewA = new DataView(new ArrayBuffer(4));
      dataViewA.setUint8(0, 1);
      dataViewA.setUint8(1, 2);
      dataViewA.setUint8(2, 3);
      dataViewA.setUint8(3, 4);
      var dataViewB = new DataView(new ArrayBuffer(4));
      dataViewB.setUint8(0, 1);
      dataViewB.setUint8(1, 2);
      dataViewB.setUint8(2, 3);
      dataViewB.setUint8(3, 4);
      assert(eql(dataViewA, dataViewB),
        'eql(dataViewA, dataViewB)');
    });

    it('returns false for arrays with different lengths', function () {
      assert(eql(new DataView(new ArrayBuffer(4)), new DataView(new ArrayBuffer(1))) === false,
        'eql(new DataView(new ArrayBuffer(4)), new DataView(new ArrayBuffer(1))) === false');
    });

    it('returns false for arrays with different values', function () {
      var dataViewA = new DataView(new ArrayBuffer(4));
      dataViewA.setUint8(0, 1);
      dataViewA.setUint8(1, 2);
      dataViewA.setUint8(2, 3);
      dataViewA.setUint8(3, 4);
      var dataViewB = new DataView(new ArrayBuffer(4));
      dataViewB.setUint8(0, 5);
      dataViewB.setUint8(1, 6);
      dataViewB.setUint8(2, 7);
      dataViewB.setUint8(3, 8);
      assert(eql(dataViewA, dataViewB) === false,
        'eql(dataViewA, dataViewB) === false');
    });

  });

  describeIf(typeof ArrayBuffer === 'function')('arraybuffer', function () {

    it('returns true for arrays with same values', function () {
      assert(eql(new ArrayBuffer(1), new ArrayBuffer(1)),
        'eql(new ArrayBuffer(1), new ArrayBuffer(1)))');
    });

    it('returns false for arrays with different lengths', function () {
      assert(eql(new ArrayBuffer(1), new ArrayBuffer(4)) === false,
        'eql(new ArrayBuffer(1), new ArrayBuffer(4)) === false');
    });

    it('returns false for arrays with different values', function () {
      var dataViewA = new DataView(new ArrayBuffer(4));
      dataViewA.setUint8(0, 1);
      dataViewA.setUint8(1, 2);
      dataViewA.setUint8(2, 3);
      dataViewA.setUint8(3, 4);
      var dataViewB = new DataView(new ArrayBuffer(4));
      dataViewB.setUint8(0, 5);
      dataViewB.setUint8(1, 6);
      dataViewB.setUint8(2, 7);
      dataViewB.setUint8(3, 8);
      assert(eql(dataViewA.buffer, dataViewB.buffer) === false,
        'eql(dataViewA.buffer, dataViewB.buffer) === false');
    });

  });

  describeIf(supportArrows)('arrow function', function () {

    it('returns true for same arrow functions', function () {
      var arrow = eval('() => {}');
      assert(eql(arrow, arrow),
        'eql(arrow, arrow)');
    });

    it('returns false for different arrow functions', function () {
      assert(eql(eval('() => {}'), eval('() => {}')) === false,
        'eql(() => {}, () => {}) === false');
    });

  });

  describeIf(supportGenerators)('generator function', function () {

    it('returns true for same arrow functions', function () {
      var generator = eval('function * generator() {}; generator');
      assert(eql(generator, generator),
        'eql(generator, generator)');
    });

    it('returns false for different arrow functions', function () {
      assert(eql(eval('function * generator() {}; generator'), eval('function * generator() {}; generator')) === false,
        'eql(function * generator() {}, function * generator() {}) === false');
    });

  });

  describeIf(supportGenerators)('generator', function () {

    it('returns true for same generator function calls', function () {
      var generator = eval('function * generator() { yield 1; yield 2; }; generator');
      assert(eql(generator(), generator()),
        'eql(generator(), generator())');
    });

    it('returns true for different generator function calls that return same results', function () {
      var generatorA = eval('function * generatorA() { yield 1; yield 2; }; generatorA');
      var generatorB = eval('function * generatorB() { yield 1; yield 2; }; generatorB');
      assert(eql(generatorA(), generatorB()),
        'eql(generatorA(), generatorB())');
    });

    it('returns true for different generator function calls are at level of iteration with same results', function () {
      var generatorA = eval('function * generatorA() { yield 1; yield 2; yield 3; }; generatorA');
      var generatorB = eval('function * generatorB() { yield 6; yield 2; yield 3; }; generatorB');
      var generatorAIterator = generatorA();
      var generatorBIterator = generatorB();
      generatorAIterator.next();
      generatorBIterator.next();
      assert(eql(generatorAIterator, generatorBIterator),
        'eql(generatorAIterator, generatorBIterator');
    });

    it('returns false for same generator function calls that return different results', function () {
      var generator = eval('var set = 0; function * generator() { yield set++; }; generator');
      assert(eql(generator(), generator()) === false,
        'eql(generator(), generator()) === false');
    });

    it('returns false for generators at different stages of iteration', function () {
      var generatorA = eval('function * generatorA() { yield 1; yield 2; }; generatorA');
      var generatorB = eval('function * generatorB() { yield 1; yield 2; }; generatorB');
      var generatorBIterator = generatorB();
      generatorBIterator.next();
      assert(eql(generatorA(), generatorBIterator) === false,
        'eql(generatorA(), generatorBIterator) === false');
    });

    it('returns false for generators if one is done', function () {
      var generatorA = eval('function * generatorA() { yield 1; yield 2; }; generatorA');
      var generatorB = eval('function * generatorB() { yield 1; yield 2; }; generatorB');
      var generatorBIterator = generatorB();
      generatorBIterator.next();
      generatorBIterator.next();
      generatorBIterator.next();
      assert(eql(generatorA(), generatorBIterator) === false,
        'eql(generatorA(), generatorBIterator) === false');
    });

  });

});
