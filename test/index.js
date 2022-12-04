'use strict';

var assert = require('simple-assert');
var eql = require('..');
var MemoizeMap = require('..').MemoizeMap;
function describeIf(condition) {
  return condition ? describe : describe.skip;
}
describe('Generic', function () {

  describe('strings', function () {

    it('returns true for same values', function () {
      assert(eql('x', 'x'), 'eql("x", "x")');
    });

    it('returns true for different instances with same values', function () {
      assert(eql(new String('x'), new String('x')), 'eql(new String("x"), new String("x"))');
    });

    it('returns false for literal vs instance with same value', function () {
      assert(eql('x', new String('x')) === false, 'eql("x", new String("x")) === false');
      assert(eql(new String('x'), 'x') === false, 'eql(new String("x"), "x") === false');
    });

    it('returns false for different instances with different values', function () {
      assert(eql(new String('x'), new String('y')) === false,
        'eql(new String("x"), new String("y")) === false');
    });

    it('returns false for different values', function () {
      assert(eql('x', 'y') === false, 'eql("x", "y") === false');
    });

  });

  describe('booleans', function () {

    it('returns true for same values', function () {
      assert(eql(true, true), 'eql(true, true)');
    });

    it('returns true for instances with same value', function () {
      assert(eql(new Boolean(true), new Boolean(true)), 'eql(new Boolean(true), new Boolean(true))');
    });

    it('returns false for literal vs instance with same value', function () {
      assert(eql(true, new Boolean(true)) === false, 'eql(true, new Boolean(true)) === false');
    });

    it('returns false for literal vs instance with different values', function () {
      assert(eql(false, new Boolean(true)) === false, 'eql(false, new Boolean(true)) === false');
      assert(eql(new Boolean(false), true) === false, 'eql(new Boolean(false), true) === false');
    });

    it('returns false for instances with different values', function () {
      assert(eql(new Boolean(false), new Boolean(true)) === false,
        'eql(new Boolean(false), new Boolean(true)) === false');
      assert(eql(new Boolean(true), new Boolean(false)) === false,
        'eql(new Boolean(true), new Boolean(false)) === false');
    });

    it('returns false for different values', function () {
      assert(eql(true, false) === false, 'eql(true, false) === false');
      assert(eql(true, Boolean(false)) === false, 'eql(true, Boolean(false)) === false');
    });

  });

  describe('null', function () {

    it('returns true for two nulls', function () {
      assert(eql(null, null), 'eql(null, null)');
    });

    it('returns false for null, undefined', function () {
      assert(eql(null, undefined) === false, 'eql(null, undefined) === false');
    });

    it('doesn\'t crash on weakmap key error (#33)', function () {
      assert(eql({}, null) === false, 'eql({}, null) === false');
    });

  });

  describe('undefined', function () {

    it('returns true for two undefineds', function () {
      assert(eql(undefined, undefined), 'eql(undefined, undefined)');
    });

    it('returns false for undefined, null', function () {
      assert(eql(undefined, null) === false, 'eql(undefined, null) === false');
    });

  });

  describe('numbers', function () {

    it('returns true for same values', function () {
      assert(eql(-0, -0), 'eql(-0, -0)');
      assert(eql(+0, +0), 'eql(+0, +0)');
      assert(eql(0, 0), 'eql(0, 0)');
      assert(eql(1, 1), 'eql(1, 1)');
      assert(eql(Infinity, Infinity), 'eql(Infinity, Infinity)');
      assert(eql(-Infinity, -Infinity), 'eql(-Infinity, -Infinity)');
    });

    it('returns false for literal vs instance with same value', function () {
      assert(eql(1, new Number(1)) === false, 'eql(1, new Number(1)) === false');
    });

    it('returns true NaN vs NaN', function () {
      assert(eql(NaN, NaN), 'eql(NaN, NaN)');
    });

    it('returns true for NaN instances', function () {
      assert(eql(new Number(NaN), new Number(NaN)), 'eql(new Number(NaN), new Number(NaN))');
    });

    it('returns false on numbers with different signs', function () {
      assert(eql(-1, 1) === false, 'eql(-1, 1) === false');
      assert(eql(-0, +0) === false, 'eql(-0, +0) === false');
      assert(eql(-Infinity, Infinity) === false, 'eql(-Infinity, +Infinity) === false');
    });

    it('returns false on instances with different signs', function () {
      assert(eql(new Number(-1), new Number(1)) === false, 'eql(new Number(-1), new Number(1)) === false');
      assert(eql(new Number(-0), new Number(+0)) === false, 'eql(new Number(-0), new Number(+0)) === false');
      assert(eql(new Number(-Infinity), new Number(Infinity)) === false,
        'eql(new Number(-Infinity), new Number(+Infinity)) === false');
    });

  });

  describe('dates', function () {

    it('returns true given two dates with the same time', function () {
      var dateA = new Date();
      assert(eql(dateA, new Date(dateA.getTime())), 'eql(dateA, new Date(dateA.getTime()))');
    });

    it('returns true given two invalid dates', function () {
      assert(eql(new Date(NaN), new Date(NaN)), 'eql(new Date(NaN), new Date(NaN))');
    });

    it('returns false given two dates with the different times', function () {
      var dateA = new Date();
      assert(eql(dateA, new Date(dateA.getTime() + 1)) === false,
        'eql(dateA, new Date(dateA.getTime() + 1)) === false');
    });

  });

  describe('regexp', function () {

    it('returns true given two regexes with the same source', function () {
      assert(eql(/\s/, /\s/), 'eql(/\\s/, /\\s/)');
      assert(eql(/\s/, new RegExp('\\s')), 'eql(/\\s/, new RegExp("\\s"))');
    });

    it('returns false given two regexes with different source', function () {
      assert(eql(/^$/, /^/) === false, 'eql(/^$/, /^/) === false');
      assert(eql(/^$/, new RegExp('^')) === false, 'eql(/^$/, new RegExp("^"))');
    });

    it('returns false given two regexes with different flags', function () {
      assert(eql(/^/m, /^/i) === false, 'eql(/^/m, /^/i) === false');
    });

  });

  describe('empty types', function () {

    it('returns true on two empty objects', function () {
      assert(eql({}, {}), 'eql({}, {})');
    });

    it('returns true on two empty arrays', function () {
      assert(eql([], []), 'eql([], [])');
    });

    it('returns false on different types', function () {
      assert(eql([], {}) === false, 'eql([], {}) === false');
    });

  });

  describe('class instances', function () {

    it('returns true given two empty class instances', function () {
      function BaseA() {}
      assert(eql(new BaseA(), new BaseA()), 'eql(new BaseA(), new BaseA())');
    });

    it('returns true given two class instances with same properties', function () {
      function BaseA(prop) {
        this.prop = prop;
      }
      assert(eql(new BaseA(1), new BaseA(1)), 'eql(new BaseA(1), new BaseA(1))');
    });

    it('returns true given two class instances with deeply equal bases', function () {
      function BaseA() {}
      function BaseB() {}
      BaseA.prototype.foo = { a: 1 };
      BaseB.prototype.foo = { a: 1 };
      assert(eql(new BaseA(), new BaseB()) === true,
        'eql(new <base with .prototype.foo = { a: 1 }>, new <base with .prototype.foo = { a: 1 }>) === true');
    });

    it('returns false given two class instances with different properties', function () {
      function BaseA(prop) {
        this.prop = prop;
      }
      assert(eql(new BaseA(1), new BaseA(2)) === false, 'eql(new BaseA(1), new BaseA(2)) === false');
    });

    it('returns false given two class instances with deeply unequal bases', function () {
      function BaseA() {}
      function BaseB() {}
      BaseA.prototype.foo = { a: 1 };
      BaseB.prototype.foo = { a: 2 };
      assert(eql(new BaseA(), new BaseB()) === false,
        'eql(new <base with .prototype.foo = { a: 1 }>, new <base with .prototype.foo = { a: 2 }>) === false');
    });

  });

  describe('arguments', function () {
    function getArguments() {
      return arguments;
    }

    it('returns true given two arguments', function () {
      var argumentsA = getArguments();
      var argumentsB = getArguments();
      assert(eql(argumentsA, argumentsB), 'eql(argumentsA, argumentsB)');
    });

    it('returns true given two arguments with same properties', function () {
      var argumentsA = getArguments(1, 2);
      var argumentsB = getArguments(1, 2);
      assert(eql(argumentsA, argumentsB), 'eql(argumentsA, argumentsB)');
    });

    it('returns false given two arguments with different properties', function () {
      var argumentsA = getArguments(1, 2);
      var argumentsB = getArguments(3, 4);
      assert(eql(argumentsA, argumentsB) === false, 'eql(argumentsA, argumentsB) === false');
    });

    it('returns false given an array', function () {
      assert(eql([], arguments) === false, 'eql([], arguments) === false');
    });

    it('returns false given an object', function () {
      assert(eql({}, arguments) === false, 'eql({}, arguments) === false');
    });

  });

  describe('arrays', function () {

    it('returns true with arrays containing same literals', function () {
      assert(eql([ 1, 2, 3 ], [ 1, 2, 3 ]), 'eql([ 1, 2, 3 ], [ 1, 2, 3 ])');
      assert(eql([ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ]), 'eql([ "a", "b", "c" ], [ "a", "b", "c" ])');
    });

    it('returns true given literal or constructor', function () {
      assert(eql([ 1, 2, 3 ], new Array(1, 2, 3)), 'eql([ 1, 2, 3 ], new Array(1, 2, 3))');
    });

    it('returns false with arrays containing literals in different order', function () {
      assert(eql([ 3, 2, 1 ], [ 1, 2, 3 ]) === false, 'eql([ 3, 2, 1 ], [ 1, 2, 3 ]) === false');
    });

    it('returns false for arrays of different length', function () {
      assert(eql(new Array(1), new Array(100)) === false, 'eql(new Array(1), new Array(100)) === false');
    });

  });

  describe('objects', function () {

    it('returns true with objects containing same literals', function () {
      assert(eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), 'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })');
      assert(eql({ foo: 'baz' }, { foo: 'baz' }), 'eql({ foo: "baz" }, { foo: "baz" })');
    });

    it('returns true for deeply nested objects', function () {
      assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'foo' } }),
        'eql({ foo: { bar: "foo" }}, { foo: { bar: "foo" }})');
    });

    it('returns true with objects with same circular reference', function () {
      var objectA = { foo: 1 };
      var objectB = { foo: 1 };
      var objectC = { a: objectA, b: objectB };
      objectA.bar = objectC;
      objectB.bar = objectC;
      assert(eql(objectA, objectB) === true,
        'eql({ foo: 1, bar: objectC }, { foo: 1, bar: objectC }) === true');
    });

    it('returns true with objects with deeply equal prototypes', function () {
      var objectA = Object.create({ foo: { a: 1 } });
      var objectB = Object.create({ foo: { a: 1 } });
      assert(eql(objectA, objectB) === true,
        'eql(Object.create({ foo: { a: 1 } }), Object.create({ foo: { a: 1 } })) === true');
    });

    it('returns false with objects containing different literals', function () {
      assert(eql({ foo: 1, bar: 1 }, { foo: 1, bar: 2 }) === false,
        'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }) === false');
      assert(eql({ foo: 'bar' }, { foo: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
      assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } }) === false,
        'eql({ foo: { bar: "foo" }}, { foo: { bar: "baz" }}) === false');
    });

    it('returns false with objects containing different keys', function () {
      assert(eql({ foo: 1, bar: 1 }, { foo: 1, baz: 2 }) === false,
        'eql({ foo: 1, bar: 2 }, { foo: 1, baz: 2 }) === false');
      assert(eql({ foo: 'bar' }, { bar: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
    });

    it('returns true with circular objects', function () {
      var objectA = { foo: 1 };
      var objectB = { foo: 1 };
      objectA.bar = objectB;
      objectB.bar = objectA;
      assert(eql(objectA, objectB) === true,
        'eql({ foo: 1, bar: -> }, { foo: 1, bar: <- }) === true');
    });

    it('returns true with non-extensible objects', function () {
      var objectA = Object.preventExtensions({ foo: 1 });
      var objectB = Object.preventExtensions({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.preventExtensions({ foo: 1 }), Object.preventExtensions({ foo: 1 })) === true');
    });

    it('returns true with sealed objects', function () {
      var objectA = Object.seal({ foo: 1 });
      var objectB = Object.seal({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.seal({ foo: 1 }), Object.seal({ foo: 1 })) === true');
    });

    it('returns true with frozen objects', function () {
      var objectA = Object.freeze({ foo: 1 });
      var objectB = Object.freeze({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.freeze({ foo: 1 }), Object.freeze({ foo: 1 })) === true');
    });

    it('returns false with objects with deeply unequal prototypes', function () {
      var objectA = Object.create({ foo: { a: 1 } });
      var objectB = Object.create({ foo: { a: 2 } });
      assert(eql(objectA, objectB) === false,
        'eql(Object.create({ foo: { a: 1 } }), Object.create({ foo: { a: 2 } })) === false');
    });

  });

  describe('functions', function () {

    it('returns true for same functions', function () {
      function foo() {}
      assert(eql(foo, foo), 'eql(function foo() {}, function foo() {})');
    });

    it('returns false for different functions', function () {
      assert(eql(function foo() {}, function bar() {}) === false,
        'eql(function foo() {}, function bar() {}) === false');
    });

  });

  describe('Symbols', function () {

    it('returns true for same symbols', function () {
      var symb = Symbol('a');
      var objectA = { [symb]: 'a' };
      var objectB = { [symb]: 'a' };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');
    });

    it('returns false for different values', function () {
      var symb = Symbol('a');
      var objectA = { [symb]: 'a' };
      var objectB = { [symb]: 'b' };
      assert(eql(objectA, objectB) === false, 'eql(obj, obj) === false');
    });

    it('returns false for different symbols', function () {
      var symb = Symbol('a');
      var symb2 = Symbol('b');
      var objectA = { [symb]: 'a' };
      var objectB = { [symb2]: 'a' };
      assert(eql(objectA, objectB) === false, 'eql(obj, obj) === false');
    });

    it('returns true for same nested symbols', function () {
      var symb = Symbol('a');
      var symb2 = Symbol('b');
      var objectA = { [symb]: { [symb2]: 'a' } };
      var objectB = { [symb]: { [symb2]: 'a' } };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');
    });

    it('returns false for different nested symbols', function () {
      var symb = Symbol('a');
      var symb2 = Symbol('b');
      var objectA = { [symb]: { [symb2]: 'a' } };
      var objectB = { [symb]: { [symb]: 'a' } };
      assert(eql(objectA, objectB) === false, 'eql(obj, obj) === false');
    });

    it('handles objects that have both symbol keys and string keys', function () {
      var symb = Symbol('a');
      var objectA = { [symb]: 'a', b: 2 };
      var objectB = { [symb]: 'a', b: 2 };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj) === true');
    });

    it('works for multiple symbols', function () {
      var symb = Symbol('a');
      var symb2 = Symbol('a');
      var objectA = { [symb]: 'a', [symb2]: 'b' };
      var objectB = { [symb]: 'a', [symb2]: 'b' };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');

      objectA = { [symb]: 'a', [symb2]: 'b' };
      objectB = { [symb2]: 'b', [symb]: 'a' };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');

      objectA = { [symb]: 'a', [symb2]: 'b' };
      objectB = { [symb2]: 'a', [symb]: 'b' };
      assert(eql(objectA, objectB) === false, 'eql(obj, obj) === false');

      var symb3 = Symbol();
      objectA = { [symb3]: 'a', [symb2]: 'b' };
      objectB = { [symb3]: 'a', [symb2]: 'b' };
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');
    });

    it('ignores non-enumerable symbols', function () {
      var symb = Symbol('a');
      var symb2 = Symbol('b');
      var objectA = { [symb]: 'a' };
      Object.defineProperty(objectA, symb2, { value: 'b', enumerable: false });
      var objectB = { [symb]: 'a' };
      Object.defineProperty(objectB, symb2, { value: 'c', enumerable: false });
      assert(eql(objectA, objectB) === true, 'eql(obj, obj)');
    });
  });


  describe('errors', function () {

    it('returns true for same errors', function () {
      var error = Error('foo');
      assert(eql(error, error), 'eql(error, error)');
    });

    it('returns true for errors with same name and message', function () {
      assert(eql(Error('foo'), Error('foo')),
        'eql(Error("foo"), Error("foo"))');
    });

    it('returns true for errors with same name and message despite different constructors', function () {
      var err1 = Error('foo');
      var err2 = TypeError('foo');
      err2.name = 'Error';
      assert(eql(err1, err2),
        'eql(Error("foo"), Object.assign(TypeError("foo"), { name: "Error" }))');
    });

    it('returns false for errors with same name but different messages', function () {
      assert(eql(Error('foo'), Error('bar')) === false,
        'eql(Error("foo"), Error("bar")) === false');
    });

    it('returns false for errors with same message but different names', function () {
      assert(eql(Error('foo'), TypeError('foo')) === false,
        'eql(Error("foo"), TypeError("foo")) === false');
    });

    it('returns false for errors with same message but different names despite same constructors', function () {
      var err1 = Error('foo');
      var err2 = Error('foo');
      err2.name = 'TypeError';
      assert(eql(err1, err2) === false,
        'eql(Error("foo"), Object.assign(Error("foo"), { name: "TypeError" })) === false');
    });

    it('returns true for errors with same code', function () {
      var err1 = Error('foo');
      var err2 = Error('foo');
      err1.code = 42;
      err2.code = 42;
      assert(eql(err1, err2),
        'eql(Object.assign(Error("foo"), { code: 42 }), Object.assign(Error("foo"), { code: 42 }))');
    });

    it('returns false for errors with different code', function () {
      var err1 = Error('foo');
      var err2 = Error('foo');
      err1.code = 42;
      err2.code = 13;
      assert(eql(err1, err2) === false,
        'eql(Object.assign(new Error("foo"), { code: 42 }), Object.assign(new Error("foo"), { code: 13 })) === false');
    });

    it('returns true for errors with same name and message despite different otherProp', function () {
      var err1 = Error('foo');
      var err2 = Error('foo');
      err1.otherProp = 42;
      err2.otherProp = 13;
      assert(eql(err1, err2),
        'eql(Object.assign(Error("foo"), { otherProp: 42 }), Object.assign(Error("foo"), { otherProp: 13 }))');
    });

  });

});

describe('Node Specific', function () {

  describeIf(typeof Buffer === 'function')('buffers', function () {

    it('returns true for same buffers', function () {
      assert(eql(Buffer.from([ 1 ]), Buffer.from([ 1 ])) === true,
        'eql(new Buffer([ 1 ]), new Buffer([ 1 ])) === true');
    });

    it('returns false for different buffers', function () {
      assert(eql(Buffer.from([ 1 ]), Buffer.from([ 2 ])) === false,
        'eql(new Buffer([ 1 ]), new Buffer([ 2 ])) === false');
    });

  });

});

describe('Memoize', function () {

  it('returns true if MemoizeMap says so', function () {
    var memoizeMap = new MemoizeMap();
    var valueAMap = new MemoizeMap();
    var valueA = {};
    var valueB = { not: 'equal' };
    valueAMap.set(valueB, true);
    memoizeMap.set(valueA, valueAMap);
    assert(eql(valueA, valueB, { memoize: memoizeMap }) === true,
      'eql({}, {not:"equal"}, <memoizeMap>) === true');
  });

  it('returns false if MemoizeMap says so', function () {
    var memoizeMap = new MemoizeMap();
    var valueAMap = new MemoizeMap();
    var valueA = {};
    var valueB = {};
    valueAMap.set(valueB, false);
    memoizeMap.set(valueA, valueAMap);
    assert(eql(valueA, valueB, { memoize: memoizeMap }) === false,
      'eql({}, {}, <memoizeMap>) === false');
  });

  it('resorts to default behaviour if MemoizeMap has no answer (same objects)', function () {
    var memoizeMap = new MemoizeMap();
    var valueAMap = new MemoizeMap();
    var valueA = {};
    var valueB = {};
    memoizeMap.set(valueA, valueAMap);
    assert(eql(valueA, valueB, { memoize: memoizeMap }) === true,
      'eql({}, {}, <memoizeMap>) === true');
  });

  it('resorts to default behaviour if MemoizeMap has no answer (different objects)', function () {
    var memoizeMap = new MemoizeMap();
    var valueAMap = new MemoizeMap();
    var valueA = {};
    var valueB = { not: 'equal' };
    memoizeMap.set(valueA, valueAMap);
    assert(eql(valueA, valueB, { memoize: memoizeMap }) === false,
      'eql({}, {}, <memoizeMap>) === false');
  });

});

describe('Comparator', function () {
  function specialComparator(left, right) {
    return left['@@specialValue'] === right['@@specialValue'];
  }
  function Matcher(func) {
    this.func = func;
  }
  function matcherComparator(left, right) {
    if (left instanceof Matcher) {
      return left.func(right);
    } else if (right instanceof Matcher) {
      return right.func(left);
    }
    return null;
  }
  function falseComparator() {
    return false;
  }
  function nullComparator() {
    return null;
  }

  it('returns true if Comparator says so', function () {
    var valueA = { '@@specialValue': 1, a: 1 };
    var valueB = { '@@specialValue': 1, a: 2 };
    assert(eql(valueA, valueB, { comparator: specialComparator }) === true,
      'eql({@@specialValue:1,a:1}, {@@specialValue:1,a:2}, <comparator>) === true');
  });

  it('returns true if Comparator says so even on primitives', function () {
    var valueA = {
      a: new Matcher(function (value) {
        return typeof value === 'number';
      }),
    };
    var valueB = { a: 1 };
    assert(eql(valueA, valueB, { comparator: matcherComparator }) === true,
      'eql({a:value => typeof value === "number"}, {a:1}, <comparator>) === true');
  });

  it('returns true if Comparator says so even on primitives (switch arg order)', function () {
    var valueA = { a: 1 };
    var valueB = {
      a: new Matcher(function (value) {
        return typeof value === 'number';
      }),
    };
    assert(eql(valueA, valueB, { comparator: matcherComparator }) === true,
      'eql({a:1}, {a:value => typeof value === "number"}, <comparator>) === true');
  });

  it('returns true if Comparator says so (deep-equality)', function () {
    var valueA = { a: { '@@specialValue': 1, a: 1 }, b: 1 };
    var valueB = { a: { '@@specialValue': 1, a: 2 }, b: 1 };
    assert(eql(valueA, valueB, { comparator: specialComparator }) === true,
      'eql({a:{@@specialValue:1,a:1},b:1}, {a:{@@specialValue:2,a:2},b:1}, <comparator>) === true');
  });

  it('returns false if Comparator returns false (same objects)', function () {
    var valueA = { a: 1 };
    var valueB = { a: 1 };
    assert(eql(valueA, valueB, { comparator: falseComparator }) === false,
      'eql({}, {}, <falseComparator>) === false');
  });

  it('resorts to deep-eql if Comparator returns null (same objects)', function () {
    var valueA = { a: 1 };
    var valueB = { a: 1 };
    assert(eql(valueA, valueB, { comparator: nullComparator }) === true,
      'eql({}, {}, <nullComparator>) === true');
  });

  it('resorts to deep-eql behaviour if Comparator returns null (different objects)', function () {
    var valueA = { a: 1 };
    var valueB = { a: 2 };
    assert(eql(valueA, valueB, { comparator: nullComparator }) === false,
      'eql({}, {}, <nullComparator>) === false');
  });

});
