'use strict';
var assert = require('simple-assert');
var eql = require('..');
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

    it('returns false given two class instances with different properties', function () {
      function BaseA(prop) {
        this.prop = prop;
      }
      assert(eql(new BaseA(1), new BaseA(2)) === false, 'eql(new BaseA(1), new BaseA(2)) === false');
    });

    it('returns false given two different empty class instances', function () {
      function BaseA() {}
      function BaseB() {}
      assert(eql(new BaseA(), new BaseB()) === false, 'eql(new BaseA(), new BaseB()) === false');
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

  describe('errors', function () {

    it('returns true for same errors', function () {
      var error = new Error('foo');
      assert(eql(error, error), 'eql(error, error)');
    });

    it('returns false for different errors', function () {
      assert(eql(new Error('foo'), new Error('foo')) === false,
        'eql(new Error("foo"), new Error("foo")) === false');
    });

  });

});
