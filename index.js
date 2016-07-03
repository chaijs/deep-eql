'use strict';
/* globals Symbol: true, Uint8Array: true */
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

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert deeply nested sameValue equality between two objects of any type.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Array} [comparator] (optional) - Override default algo, determening custom equality
 * @param {Array} [memoize] (optional) - Memoize the results of complex objects for a speed boost
 * @return {Boolean} equal match
 */

function deepEqual(leftHandOperand, rightHandOperand, comparatorOrMemoize, memoizeObject) {
  memoizeObject = memoizeObject || [];
  var comparator = comparatorOrMemoize;
  if (type(comparatorOrMemoize) !== 'function') {
    memoizeObject = comparatorOrMemoize || [];
    comparator = false;
  }

  if (comparator) {
    return comparator(leftHandOperand, rightHandOperand);
  }

  var sameValue = objectIs(leftHandOperand, rightHandOperand);
  if (sameValue) {
    return true;
  }

  var leftHandType = type(leftHandOperand);
  if (leftHandType !== type(rightHandOperand)) {
    return false;
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
      return sameValue;
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
      return iterableEqual(leftHandOperand, rightHandOperand, memoizeObject);
    case 'date':
      return dateEqual(leftHandOperand, rightHandOperand);
    case 'regexp':
      return regexpEqual(leftHandOperand, rightHandOperand);
    case 'generator':
      return generatorEqual(leftHandOperand, rightHandOperand, memoizeObject);
    case 'dataview':
      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer));
    case 'arraybuffer':
      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand));
    case 'set':
      return setEqual(leftHandOperand, rightHandOperand, memoizeObject);
    default:
      return objectEqual(leftHandOperand, rightHandOperand, memoizeObject);
  }
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

function setEqual(leftHandOperand, rightHandOperand) {
  var leftHandItems = [];
  var rightHandItems = [];
  leftHandOperand.forEach(function gatherSetEntries(entry) {
    leftHandItems.push(entry);
  });
  rightHandOperand.forEach(function gatherSetEntries(entry) {
    rightHandItems.push(entry);
  });
  return iterableEqual(leftHandItems.sort(), rightHandItems.sort());
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays, TypedArrays or Node.js buffers.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @return {Boolean} result
 */

function iterableEqual(leftHandOperand, rightHandOperand, memoizeObject) {
  var length = leftHandOperand.length;
  if (length !== rightHandOperand.length) {
    return false;
  }
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[i], rightHandOperand[i], memoizeObject) === false) {
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

function generatorEqual(leftHandOperand, rightHandOperand, memoizeObject) {
  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), memoizeObject);
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
function keysEqual(leftHandOperand, rightHandOperand, keys) {
  var length = keys.length;
  for (var i = 0; i < length; i += 1) {
    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]]) === false) {
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

function objectEqual(leftHandOperand, rightHandOperand) {
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
    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys);
  }

  var leftHandEntries = getIteratorEntries(leftHandOperand);
  var rightHandEntries = getIteratorEntries(rightHandOperand);
  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
    leftHandEntries.sort();
    rightHandEntries.sort();
    return iterableEqual(leftHandEntries, rightHandEntries);
  }

  if (leftHandKeys.length === 0 &&
      leftHandEntries.length === 0 &&
      rightHandKeys.length === 0 &&
      rightHandEntries.length === 0) {
    return true;
  }

  return false;
}
