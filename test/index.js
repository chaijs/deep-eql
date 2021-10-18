import { deepEqual as eql } from '../dist/index.js';

/* eslint-disable prefer-rest-params */

function assert(expr, msg) {
  if (!expr) {
    throw new Error(msg || 'Assertion Failed');
  }
}

function describeIf(condition) {
  return condition ? describe : describe.skip;
}
describe('Generic', () => {

  describe('strings', () => {

    it('returns true for same values', () => {
      assert(eql('x', 'x'), 'eql("x", "x")');
    });

    it('returns true for different instances with same values', () => {
      assert(eql(new String('x'), new String('x')), 'eql(new String("x"), new String("x"))');
    });

    it('returns false for literal vs instance with same value', () => {
      assert(eql('x', new String('x')) === false, 'eql("x", new String("x")) === false');
      assert(eql(new String('x'), 'x') === false, 'eql(new String("x"), "x") === false');
    });

    it('returns false for different instances with different values', () => {
      assert(eql(new String('x'), new String('y')) === false,
        'eql(new String("x"), new String("y")) === false');
    });

    it('returns false for different values', () => {
      assert(eql('x', 'y') === false, 'eql("x", "y") === false');
    });

  });

  describe('booleans', () => {

    it('returns true for same values', () => {
      assert(eql(true, true), 'eql(true, true)');
    });

    it('returns true for instances with same value', () => {
      assert(eql(new Boolean(true), new Boolean(true)), 'eql(new Boolean(true), new Boolean(true))');
    });

    it('returns false for literal vs instance with same value', () => {
      assert(eql(true, new Boolean(true)) === false, 'eql(true, new Boolean(true)) === false');
    });

    it('returns false for literal vs instance with different values', () => {
      assert(eql(false, new Boolean(true)) === false, 'eql(false, new Boolean(true)) === false');
      assert(eql(new Boolean(false), true) === false, 'eql(new Boolean(false), true) === false');
    });

    it('returns false for instances with different values', () => {
      assert(eql(new Boolean(false), new Boolean(true)) === false,
        'eql(new Boolean(false), new Boolean(true)) === false');
      assert(eql(new Boolean(true), new Boolean(false)) === false,
        'eql(new Boolean(true), new Boolean(false)) === false');
    });

    it('returns false for different values', () => {
      assert(eql(true, false) === false, 'eql(true, false) === false');
      assert(eql(true, Boolean(false)) === false, 'eql(true, Boolean(false)) === false');
    });

  });

  describe('null', () => {

    it('returns true for two nulls', () => {
      assert(eql(null, null), 'eql(null, null)');
    });

    it('returns false for null, undefined', () => {
      assert(eql(null, undefined) === false, 'eql(null, undefined) === false');
    });

    it('doesn\'t crash on weakmap key error (#33)', () => {
      assert(eql({}, null) === false, 'eql({}, null) === false');
    });

  });

  describe('undefined', () => {

    it('returns true for two undefineds', () => {
      assert(eql(undefined, undefined), 'eql(undefined, undefined)');
    });

    it('returns false for undefined, null', () => {
      assert(eql(undefined, null) === false, 'eql(undefined, null) === false');
    });

  });

  describe('numbers', () => {

    it('returns true for same values', () => {
      assert(eql(-0, -0), 'eql(-0, -0)');
      assert(eql(+0, +0), 'eql(+0, +0)');
      assert(eql(0, 0), 'eql(0, 0)');
      assert(eql(1, 1), 'eql(1, 1)');
      assert(eql(Infinity, Infinity), 'eql(Infinity, Infinity)');
      assert(eql(-Infinity, -Infinity), 'eql(-Infinity, -Infinity)');
    });

    it('returns false for literal vs instance with same value', () => {
      assert(eql(1, new Number(1)) === false, 'eql(1, new Number(1)) === false');
    });

    it('returns true NaN vs NaN', () => {
      assert(eql(NaN, NaN), 'eql(NaN, NaN)');
    });

    it('returns true for NaN instances', () => {
      assert(eql(new Number(NaN), new Number(NaN)), 'eql(new Number(NaN), new Number(NaN))');
    });

    it('returns false on numbers with different signs', () => {
      assert(eql(-1, 1) === false, 'eql(-1, 1) === false');
      assert(eql(-0, +0) === false, 'eql(-0, +0) === false');
      assert(eql(-Infinity, Infinity) === false, 'eql(-Infinity, +Infinity) === false');
    });

    it('returns false on instances with different signs', () => {
      assert(eql(new Number(-1), new Number(1)) === false, 'eql(new Number(-1), new Number(1)) === false');
      assert(eql(new Number(-0), new Number(+0)) === false, 'eql(new Number(-0), new Number(+0)) === false');
      assert(eql(new Number(-Infinity), new Number(Infinity)) === false,
        'eql(new Number(-Infinity), new Number(+Infinity)) === false');
    });

  });

  describe('dates', () => {

    it('returns true given two dates with the same time', () => {
      const dateA = new Date();
      assert(eql(dateA, new Date(dateA.getTime())), 'eql(dateA, new Date(dateA.getTime()))');
    });

    it('returns true given two invalid dates', () => {
      assert(eql(new Date(NaN), new Date(NaN)), 'eql(new Date(NaN), new Date(NaN))');
    });

    it('returns false given two dates with the different times', () => {
      const dateA = new Date();
      assert(eql(dateA, new Date(dateA.getTime() + 1)) === false,
        'eql(dateA, new Date(dateA.getTime() + 1)) === false');
    });

  });

  describe('regexp', () => {

    it('returns true given two regexes with the same source', () => {
      assert(eql(/\s/, /\s/), 'eql(/\\s/, /\\s/)');
      assert(eql(/\s/, new RegExp('\\s')), 'eql(/\\s/, new RegExp("\\s"))');
    });

    it('returns false given two regexes with different source', () => {
      assert(eql(/^$/, /^/) === false, 'eql(/^$/, /^/) === false');
      assert(eql(/^$/, new RegExp('^')) === false, 'eql(/^$/, new RegExp("^"))');
    });

    it('returns false given two regexes with different flags', () => {
      assert(eql(/^/m, /^/i) === false, 'eql(/^/m, /^/i) === false');
    });

  });

  describe('empty types', () => {

    it('returns true on two empty objects', () => {
      assert(eql({}, {}), 'eql({}, {})');
    });

    it('returns true on two empty arrays', () => {
      assert(eql([], []), 'eql([], [])');
    });

    it('returns false on different types', () => {
      assert(eql([], {}) === false, 'eql([], {}) === false');
    });

  });

  describe('class instances', () => {

    it('returns true given two empty class instances', () => {
      function BaseA() {}
      assert(eql(new BaseA(), new BaseA()), 'eql(new BaseA(), new BaseA())');
    });

    it('returns true given two class instances with same properties', () => {
      function BaseA(prop) {
        this.prop = prop;
      }
      assert(eql(new BaseA(1), new BaseA(1)), 'eql(new BaseA(1), new BaseA(1))');
    });

    it('returns false given two class instances with deeply equal bases', () => {
      function BaseA() {}
      function BaseB() {}
      BaseA.prototype.foo = { a: 1 };
      BaseB.prototype.foo = { a: 1 };
      assert(eql(new BaseA(), new BaseB()) === false,
        'eql(new <BaseA with .prototype.foo = { a: 1 }>, new <BaseB with .prototype.foo = { a: 1 }>) === false');
    });

    it('returns false given two class instances with different properties', () => {
      function BaseA(prop) {
        this.prop = prop;
      }
      assert(eql(new BaseA(1), new BaseA(2)) === false, 'eql(new BaseA(1), new BaseA(2)) === false');
    });

    it('returns false given two class instances with deeply unequal bases', () => {
      function BaseA() {}
      function BaseB() {}
      BaseA.prototype.foo = { a: 1 };
      BaseB.prototype.foo = { a: 2 };
      assert(eql(new BaseA(), new BaseB()) === false,
        'eql(new <base with .prototype.foo = { a: 1 }>, new <base with .prototype.foo = { a: 2 }>) === false');
    });

  });

  describe('arguments', () => {
    function getArguments() {
      return arguments;
    }

    it('returns true given two arguments', () => {
      const argumentsA = getArguments();
      const argumentsB = getArguments();
      assert(eql(argumentsA, argumentsB), 'eql(argumentsA, argumentsB)');
    });

    it('returns true given two arguments with same properties', () => {
      const argumentsA = getArguments(1, 2);
      const argumentsB = getArguments(1, 2);
      assert(eql(argumentsA, argumentsB), 'eql(argumentsA, argumentsB)');
    });

    it('returns false given two arguments with different properties', () => {
      const argumentsA = getArguments(1, 2);
      const argumentsB = getArguments(3, 4);
      assert(eql(argumentsA, argumentsB) === false, 'eql(argumentsA, argumentsB) === false');
    });

    it('returns false given an array', function () {
      assert(eql([], arguments) === false, 'eql([], arguments) === false');
    });

    it.skip('returns false given an object', function () {
      assert(eql({}, arguments) === false, 'eql({}, arguments) === false');
    });

  });

  describe('arrays', () => {

    it('returns true with arrays containing same literals', () => {
      assert(eql([ 1, 2, 3 ], [ 1, 2, 3 ]), 'eql([ 1, 2, 3 ], [ 1, 2, 3 ])');
      assert(eql([ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ]), 'eql([ "a", "b", "c" ], [ "a", "b", "c" ])');
    });

    it('returns true given literal or constructor', () => {
      assert(eql([ 1, 2, 3 ], new Array(1, 2, 3)), 'eql([ 1, 2, 3 ], new Array(1, 2, 3))');
    });

    it('returns false with arrays containing literals in different order', () => {
      assert(eql([ 3, 2, 1 ], [ 1, 2, 3 ]) === false, 'eql([ 3, 2, 1 ], [ 1, 2, 3 ]) === false');
    });

    it('returns false for arrays of different length', () => {
      assert(eql(new Array(1), new Array(100)) === false, 'eql(new Array(1), new Array(100)) === false');
    });

  });

  describe('objects', () => {

    it('returns true with objects containing same literals', () => {
      assert(eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }), 'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })');
      assert(eql({ foo: 'baz' }, { foo: 'baz' }), 'eql({ foo: "baz" }, { foo: "baz" })');
    });

    it('returns true with objects containing same literals out of order', () => {
      assert(eql({ foo: 1, bar: 2 }, { bar: 2, foo: 1 }), 'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })');
      assert(eql({ foo: 'baz' }, { foo: 'baz' }), 'eql({ foo: "baz" }, { foo: "baz" })');
    });

    it('returns true for deeply nested objects', () => {
      assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'foo' } }),
        'eql({ foo: { bar: "foo" }}, { foo: { bar: "foo" }})');
    });

    it('returns true with objects with same circular reference', () => {
      const objectA = { foo: 1 };
      const objectB = { foo: 1 };
      const objectC = { a: objectA, b: objectB };
      objectA.bar = objectC;
      objectB.bar = objectC;
      assert(eql(objectA, objectB) === true,
        'eql({ foo: 1, bar: objectC }, { foo: 1, bar: objectC }) === true');
    });

    it.skip('returns true with objects with deeply equal prototypes', () => {
      const objectA = Object.create({ foo: { a: 1 } });
      const objectB = Object.create({ foo: { a: 1 } });
      assert(eql(objectA, objectB) === true,
        'eql(Object.create({ foo: { a: 1 } }), Object.create({ foo: { a: 1 } })) === true');
    });

    it('returns false with objects containing different literals', () => {
      assert(eql({ foo: 1, bar: 1 }, { foo: 1, bar: 2 }) === false,
        'eql({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }) === false');
      assert(eql({ foo: 'bar' }, { foo: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
      assert(eql({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } }) === false,
        'eql({ foo: { bar: "foo" }}, { foo: { bar: "baz" }}) === false');
    });

    it('returns false with objects containing different keys', () => {
      assert(eql({ foo: 1, bar: 1 }, { foo: 1, baz: 2 }) === false,
        'eql({ foo: 1, bar: 2 }, { foo: 1, baz: 2 }) === false');
      assert(eql({ foo: 'bar' }, { bar: 'baz' }) === false, 'eql({ foo: "bar" }, { foo: "baz" }) === false');
    });

    it('returns true with circular objects', () => {
      const objectA = { foo: 1 };
      const objectB = { foo: 1 };
      objectA.bar = objectB;
      objectB.bar = objectA;
      assert(eql(objectA, objectB) === true,
        'eql({ foo: 1, bar: -> }, { foo: 1, bar: <- }) === true');
    });

    it('returns true with non-extensible objects', () => {
      const objectA = Object.preventExtensions({ foo: 1 });
      const objectB = Object.preventExtensions({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.preventExtensions({ foo: 1 }), Object.preventExtensions({ foo: 1 })) === true');
    });

    it('returns true with sealed objects', () => {
      const objectA = Object.seal({ foo: 1 });
      const objectB = Object.seal({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.seal({ foo: 1 }), Object.seal({ foo: 1 })) === true');
    });

    it('returns true with frozen objects', () => {
      const objectA = Object.freeze({ foo: 1 });
      const objectB = Object.freeze({ foo: 1 });
      assert(eql(objectA, objectB) === true,
        'eql(Object.freeze({ foo: 1 }), Object.freeze({ foo: 1 })) === true');
    });

    it('returns false with objects with deeply unequal prototypes', () => {
      const objectA = Object.create({ foo: { a: 1 } });
      const objectB = Object.create({ foo: { a: 2 } });
      assert(eql(objectA, objectB) === false,
        'eql(Object.create({ foo: { a: 1 } }), Object.create({ foo: { a: 2 } })) === false');
    });

  });

  describe('functions', () => {

    it('returns true for same functions', () => {
      function foo() {}
      assert(eql(foo, foo), 'eql(function foo() {}, function foo() {})');
    });

    it('returns false for different functions', () => {
      assert(eql(() => {}, () => {}) === false,
        'eql(function foo() {}, function bar() {}) === false');
    });

  });

  describe('errors', () => {

    it('returns true for same errors', () => {
      const error = Error('foo');
      assert(eql(error, error), 'eql(error, error)');
    });

    it('returns true for errors with same name and message', () => {
      assert(eql(Error('foo'), Error('foo')),
        'eql(Error("foo"), Error("foo"))');
    });

    it.skip('returns true for errors with same name and message despite different constructors', () => {
      const err1 = Error('foo');
      const err2 = TypeError('foo');
      err2.name = 'Error';
      assert(eql(err1, err2),
        'eql(Error("foo"), Object.assign(TypeError("foo"), { name: "Error" }))');
    });

    it('returns false for errors with same name but different messages', () => {
      assert(eql(Error('foo'), Error('bar')) === false,
        'eql(Error("foo"), Error("bar")) === false');
    });

    it('returns false for errors with same message but different names', () => {
      assert(eql(Error('foo'), TypeError('foo')) === false,
        'eql(Error("foo"), TypeError("foo")) === false');
    });

    it('returns false for errors with same message but different names despite same constructors', () => {
      const err1 = Error('foo');
      const err2 = Error('foo');
      err2.name = 'TypeError';
      assert(eql(err1, err2) === false,
        'eql(Error("foo"), Object.assign(Error("foo"), { name: "TypeError" })) === false');
    });

    it('returns true for errors with same code', () => {
      const err1 = Error('foo');
      const err2 = Error('foo');
      err1.code = 42;
      err2.code = 42;
      assert(eql(err1, err2),
        'eql(Object.assign(Error("foo"), { code: 42 }), Object.assign(Error("foo"), { code: 42 }))');
    });

    it('returns false for errors with different code', () => {
      const err1 = Error('foo');
      const err2 = Error('foo');
      err1.code = 42;
      err2.code = 13;
      assert(eql(err1, err2) === false,
        'eql(Object.assign(new Error("foo"), { code: 42 }), Object.assign(new Error("foo"), { code: 13 })) === false');
    });

    it('returns true for errors with same name and message despite different otherProp', () => {
      const err1 = Error('foo');
      const err2 = Error('foo');
      err1.otherProp = 42;
      err2.otherProp = 13;
      assert(eql(err1, err2),
        'eql(Object.assign(Error("foo"), { otherProp: 42 }), Object.assign(Error("foo"), { otherProp: 13 }))');
    });

  });

});

describe('Node Specific', () => {

  describeIf(typeof Buffer === 'function')('buffers', () => {

    it('returns true for same buffers', () => {
      assert(eql(Buffer.from([ 1 ]), Buffer.from([ 1 ])) === true,
        'eql(new Buffer([ 1 ]), new Buffer([ 1 ])) === true');
    });

    it('returns false for different buffers', () => {
      assert(eql(Buffer.from([ 1 ]), Buffer.from([ 2 ])) === false,
        'eql(new Buffer([ 1 ]), new Buffer([ 2 ])) === false');
    });

  });

});

describe('Comparator', () => {
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
    return Object.is(left, right);
  }
  function falseComparator() {
    return false;
  }

  it('returns true if Comparator says so', () => {
    const valueA = { '@@specialValue': 1, a: 1 };
    const valueB = { '@@specialValue': 1, a: 2 };
    assert(eql(valueA, valueB, specialComparator) === true,
      'eql({@@specialValue:1,a:1}, {@@specialValue:1,a:2}, <comparator>) === true');
  });

  it('returns true if Comparator says so even on primitives', () => {
    const valueA = {
      a: new Matcher((value) => typeof value === 'number'),
    };
    const valueB = { a: 1 };
    assert(eql(valueA, valueB, matcherComparator) === true,
      'eql({a:value => typeof value === "number"}, {a:1}, <comparator>) === true');
  });

  it('returns true if Comparator says so even on primitives (switch arg order)', () => {
    const valueA = { a: 1 };
    const valueB = {
      a: new Matcher((value) => typeof value === 'number'),
    };
    assert(eql(valueA, valueB, matcherComparator) === true,
      'eql({a:1}, {a:value => typeof value === "number"}, <comparator>) === true');
  });

  it('returns true if Comparator says so (deep-equality)', () => {
    const valueA = { a: { '@@specialValue': 1, a: 1 }, b: 1 };
    const valueB = { a: { '@@specialValue': 1, a: 2 }, b: 1 };
    assert(eql(valueA, valueB, specialComparator) === true,
      'eql({a:{@@specialValue:1,a:1},b:1}, {a:{@@specialValue:2,a:2},b:1}, <comparator>) === true');
  });

  it('returns false if Comparator returns false (same objects)', () => {
    const valueA = { a: 1 };
    const valueB = { a: 1 };
    assert(eql(valueA, valueB, falseComparator) === false,
      'eql({}, {}, <falseComparator>) === false');
  });

});
