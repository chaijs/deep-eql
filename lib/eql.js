/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = require('type-detect');

/*!
 * Buffer.isBuffer browser shim
 */

var Buffer;
try { Buffer = require('buffer').Buffer; }
catch(ex) {
  Buffer = {};
  Buffer.isBuffer = function() { return false; }
}

/*!
 * For browsers that don't support Object.getPrototypeOf (IE8?)
 */

function _getProto(object) {
  if (typeof Object.getPrototypeOf === 'function') {
    return Object.getPrototypeOf(object);
  } else if (''.__proto__ === String.prototype) {
    return object.__proto__;
  } else {
    return object.constructor.prototype;
  }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert super-strict (egal) equality between
 * two objects of any type.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @param {Array} memoised (optional)
 * @return {Boolean} equal match
 */

function deepEqual(a, b, m) {
  if (sameValue(a, b)) {
    return true;
  }
  var type_a = type(a)
  var type_b = type(b)
  if (type_a !== type_b) {
    return false
  }
  switch (type_a) {
    case 'arguments': return argumentsEqual(a, b, m);
    case 'date':      return dateEqual(a, b);
    case 'error':     return sameValue(a.message, b.message);
    case 'map':       return mapEquals(a, b);
    case 'object':    return objectEqual(a, b, m);
    case 'regexp':    return regexpEqual(a, b);
    case 'set':       return setEquals(a, b);

    case 'array':
    case 'uint8array': // and Buffer
    case 'uint8clampedarray':
    case 'int8array':
    case 'uint16array':
    case 'int16array':
    case 'uint32array':
    case 'int32array':
    case 'float32array':
    case 'float64array':
      return iterableEqual(a, b);
    case 'arraybuffer':
      return iterableEqual(new Uint8Array(a),
                           new Uint8Array(b));
    case 'dataview':
      return iterableEqual(new Uint8Array(a.buffer),
                           new Uint8Array(b.buffer));
    case 'promise': // would require an async API
    case 'weakmap': // not enumerable.  Weak.
    case 'weakset': // not enumerable.  Weak.
      throw new Error('Unsupported deep-equal type: ' + type_a);

    default:
      return false;
  }
}

/*!
 * Compare two Set objects by asserting that
 * the values are the same.
 *
 * @param {Set} a
 * @param {Set} b
 * @return {Boolean} result
 */

function setEquals(a, b) {
  if (a.size != b.size) return false;
  var ret = true;
  a.forEach(function(ai) {
    var found = false;
    b.forEach(function(bi) {
      if (deepEqual(ai, bi)) found = true;
    });
    if (!found) ret = false;
  });
  return ret;
}

/*!
 * Compare two Set objects by asserting that
 * the values are the same.
 *
 * @param {Set} a
 * @param {Set} b
 * @return {Boolean} result
 */

function mapEquals(a, b) {
  if (a.size != b.size) return false;
  var ret = true;
  a.forEach(function(ak,av) {
    var found = false;
    b.forEach(function(bk,bv) {
      if (deepEqual(ak, bk) && deepEqual(av, bv)) found = true;
    });
    if (!found) ret = false;
  });
  return ret;
}

/*!
 * Strict (egal) equality test. Ensures that NaN always
 * equals NaN and `-0` does not equal `+0`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} equal match
 */

function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(a, b) {
  return sameValue(a.getTime(), b.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(a, b) {
  return sameValue(a.toString(), b.toString());
}

/*!
 * Assert deep equality of two `arguments` objects.
 * Unfortunately, these must be sliced to arrays
 * prior to test to ensure no bad behavior.
 *
 * @param {Arguments} a
 * @param {Arguments} b
 * @param {Array} memoize (optional)
 * @return {Boolean} result
 */

function argumentsEqual(a, b, m) {
  a = [].slice.call(a);
  b = [].slice.call(b);
  return deepEqual(a, b, m);
}

/*!
 * Get enumerable properties of a given object.
 *
 * @param {Object} a
 * @return {Array} property names
 */

function enumerable(a) {
  var res = [];
  for (var key in a) res.push(key);
  return res;
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays or Node.js buffers.
 *
 * @param {Iterable} a
 * @param {Iterable} b
 * @return {Boolean} result
 */

function iterableEqual(a, b) {
  if (a.length !==  b.length) return false;

  var i = 0;
  var match = true;

  for (; i < a.length; i++) {
    if (!deepEqual(a[i], b[i])) {
      match = false;
      break;
    }
  }

  return match;
}

/*!
 * Block for `objectEqual` ensuring non-existing
 * values don't get in.
 *
 * @param {Mixed} object
 * @return {Boolean} result
 */

function isValue(a) {
  return a !== null && a !== undefined;
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

function objectEqual(a, b, m) {
  if (!isValue(a) || !isValue(b)) {
    return false;
  }

  if (_getProto(a) !== _getProto(b)) {
    return false;
  }

  var i;
  if (m) {
    for (i = 0; i < m.length; i++) {
      if ((m[i][0] === a && m[i][1] === b)
      ||  (m[i][0] === b && m[i][1] === a)) {
        return true;
      }
    }
  } else {
    m = [];
  }

  try {
    var ka = enumerable(a);
    var kb = enumerable(b);
  } catch (ex) {
    return false;
  }

  ka.sort();
  kb.sort();

  if (!iterableEqual(ka, kb)) {
    return false;
  }

  m.push([ a, b ]);

  var key;
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], m)) {
      return false;
    }
  }

  return true;
}
