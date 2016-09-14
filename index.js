'use strict';
/* globals Symbol: true, Uint8Array: true, WeakMap: true */
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = require('type-detect');
var objectIs = Object.is || require('object-is'); // eslint-disable-line

function FakeMap() {
  this.clear();
}
FakeMap.prototype = {
  clear: function clearMap() {
    this.keys = [];
    this.values = [];
    return this;
  },
  set: function setMap(key, value) {
    var index = this.keys.indexOf(key);
    if (index >= 0) {
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }
    return this;
  },
  get: function getMap(key) {
    return this.values[this.keys.indexOf(key)];
  },
  delete: function deleteMap(key) {
    var index = this.keys.indexOf(key);
    if (index >= 0) {
      this.values = this.values.slice(0, index).concat(this.values.slice(index + 1));
      this.keys = this.keys.slice(0, index).concat(this.keys.slice(index + 1));
    }
    return this;
  },
};

var MemoizeMap = null;
if (typeof WeakMap === 'function') {
  MemoizeMap = WeakMap;
} else {
  MemoizeMap = FakeMap;
}

function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    var result = leftHandMap.get(rightHandOperand);
    if (typeof result === 'boolean') {
      return result;
    }
  }
  return null;
}

function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
  if (!memoizeMap) {
    return;
  }
  var leftHandMap = memoizeMap.get(leftHandOperand);
  if (leftHandMap) {
    leftHandMap.set(rightHandOperand, result);
  } else {
    leftHandMap = new MemoizeMap();
    leftHandMap.set(rightHandOperand, result);
    memoizeMap.set(leftHandOperand, leftHandMap);
  }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;
module.exports.MemoizeMap = MemoizeMap;

/**
 * Assert deeply nested sameValue equality between two objects of any type.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Array} [comparator] (optional) - Override default algo, determening custom equality
 * @param {Array} [memoize] (optional) - Memoize the results of complex objects for a speed boost
 * @return {Boolean} equal match
 */

function deepEqual(leftHandOperand, rightHandOperand, options) {
  options = options || {};
  options = {
    comparator: options.comparator || objectIs,
    memoize: options.memoize || true,
  };
  if (options.memoize === true) {
    options.memoize = new MemoizeMap();
  }

  var result = objectIs(leftHandOperand, rightHandOperand);
  if (result) {
    return true;
  }

  var memoizeResult = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
  if (typeof memoizeResult === 'boolean') {
    return memoizeResult;
  }

  if (options.comparator.call(null, leftHandOperand, rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
    memoizeSet(rightHandOperand, leftHandOperand, options.memoize, true);
    return true;
  }

  var leftHandType = type(leftHandOperand);
  if (leftHandType !== type(rightHandOperand)) {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
    memoizeSet(rightHandOperand, leftHandOperand, options.memoize, false);
    return false;
  }

  // Temporarily set the operands in the memoize object to prevent blowing the stack
  if (typeof leftHandOperand === 'object') {
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
    memoizeSet(rightHandOperand, leftHandOperand, options.memoize, result);
  }
  switch (leftHandType) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'promise':
    case 'symbol':
    case 'function':
    case 'weakmap':
    case 'weakset':
    case 'error':
      return result;
    case 'arguments':
    case 'int8array':
    case 'uint8array':
    case 'uint8clampedarray':
    case 'int16array':
    case 'uint16array':
    case 'int32array':
    case 'uint32array':
    case 'float32array':
    case 'float64array':
    case 'array':
      result = iterableEqual(leftHandOperand, rightHandOperand, options);
      break;
    case 'date':
      result = dateEqual(leftHandOperand, rightHandOperand);
      break;
    case 'regexp':
      result = regexpEqual(leftHandOperand, rightHandOperand);
      break;
    case 'generator':
      result = generatorEqual(leftHandOperand, rightHandOperand, options);
      break;
    case 'dataview':
      result = iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
      break;
    case 'arraybuffer':
      result = iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
      break;
    case 'set':
      result = setEqual(leftHandOperand, rightHandOperand, options);
      break;
    default:
      result = objectEqual(leftHandOperand, rightHandOperand, options);
  }
  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
  memoizeSet(rightHandOperand, leftHandOperand, options.memoize, result);
  return result;
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(leftHandOperand, rightHandOperand) {
  return objectIs(leftHandOperand.getTime(), rightHandOperand.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(leftHandOperand, rightHandOperand) {
  return objectIs(leftHandOperand.toString(), rightHandOperand.toString());
}

/*!
 * Compare two sets by forEaching over them,
 * and comparing the resulting array.
 *
 * Needed because IE11 doesn't support Set#entries or Set#@@iterator
 *
 * @param {Set} a
 * @param {Set} b
 * @return {Boolean} result
 */

function setEqual(leftHandOperand, rightHandOperand, options) {
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(function gatherSetEntries(entry) {
    leftHandItems.push(entry);
  });
  rightHandOperand.forEach(function gatherSetEntries(entry) {
    rightHandItems.push(entry);
  });
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays, TypedArrays or Node.js buffers.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @return {Boolean} result
 */

function iterableEqual(leftHandOperand, rightHandOperand, options) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[i], rightHandOperand[i], options) === false) {
      return false;
    }
  }
  return true;
}

/*!
 * Simple equality for generator objects
 * such as those returned by generator functions.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @return {Boolean} result
 */

function generatorEqual(leftHandOperand, rightHandOperand, options) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}

/*!
 *
 *
 *
 */
function getEnumerableKeys(target) {
  try {
    return Object.keys(target);
  } catch (keysError) {
    return [];
  }
}

/*!
 *
 *
 *
 */
function hasIteratorFunction(target) {
  return typeof Symbol !== 'undefined' &&
    typeof target === 'object' &&
    typeof Symbol.iterator !== 'undefined' &&
    typeof target[Symbol.iterator] === 'function';
}

/*!
 *
 *
 *
 */
function getIteratorEntries(target) {
  if (hasIteratorFunction(target)) {
    try {
      return getGeneratorEntries(target[Symbol.iterator]());
    } catch (iteratorError) {
      return [];
    }
  }
  return [];
}

function getGeneratorEntries(generator) {
  var generatorResult = generator.next();
  var accumulator = [ generatorResult.value ];
  while (generatorResult.done === false) {
    generatorResult = generator.next();
    accumulator.push(generatorResult.value);
  }
  return accumulator;
}

/*!
 *
 *
 *
 */
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
  var length = keys.length;
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
      return false;
    }
  }
  return true;
}

/*!
 * Recursively check the equality of two objects.
 * Once basic sameness has been established it will
 * defer to `deepEqual` for each enumerable key
 * in the object.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function objectEqual(leftHandOperand, rightHandOperand, options) {
  if (Object.getPrototypeOf(leftHandOperand) !== Object.getPrototypeOf(rightHandOperand)) {
    return false;
  }

  var leftHandKeys = getEnumerableKeys(leftHandOperand);
  var rightHandKeys = getEnumerableKeys(rightHandOperand);
  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
    leftHandKeys.sort();
    rightHandKeys.sort();
    if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
      return false;
    }
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
  }

  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries, options);
  }

  if (leftHandKeys.length === 0 &&
      leftHandEntries.length === 0 &&
      rightHandKeys.length === 0 &&
      rightHandEntries.length === 0) {
    return true;
  }

  return false;
}
