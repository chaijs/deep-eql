'use strict';
var deepEql = require('../');
var lodashDeepEql = require('lodash.isequal');
var assertDeepeql = require('assert').deepEql;
var kewlrDeepeql = require('kewlr').chai;
var inspect = require('util').inspect;
var Benchmark = require('benchmark');
var benches = [];
var mapObjRefA = {};
var mapObjRefB = {};
function getArguments() {
  return arguments;
}
var fixtures = {
  'equal references           ': [ mapObjRefA, mapObjRefA ],
  'string literal             ': [ 'abc', 'abc' ],
  'array literal              ': [ [ 1, 2, 3 ], [ 1, 2, 3 ] ],
  'boolean literal            ': [ true, true ],
  'object literal             ': [ { a: 1 }, { a: 1 } ],
  'object from null           ': [ Object.create(null), Object.create(null) ],
  'regex literal              ': [ /^abc$/, /^abc$/ ],
  'number literal             ': [ 1, 1 ],
  'null                       ': [ null, null ],
  'undefined                  ': [ undefined, undefined ],
  'buffer                     ': [ new Buffer('hello world'), new Buffer('hello world') ],
  'date                       ': [ new Date(123), new Date(123) ],
  'map                        ': [ new Map().set('a', 1), new Map().set('a', 1) ],
  'map (complex)              ': [
    new Map().set(mapObjRefA, new Map().set(mapObjRefB, 1)),
    new Map().set(mapObjRefA, new Map().set(mapObjRefB, 1)),
  ],
  'regex constructor          ': [ new RegExp('abc'), new RegExp('abc') ],
  'set                        ': [ new Set().add(1), new Set().add(1) ],
  'string constructor         ': [ new String(), new String() ],
  'arguments                  ': [ getArguments(1, 2, 3), getArguments(1, 2, 3) ],

  /* Failing benchmarks */
  'string literal (differing) ': [ 'abc', 'cba', false ],
  'array literal (differing)  ': [ [ 1, 2, 3 ], [ 4, 5, 6 ], false ],
  'boolean literal (differing)': [ true, false, false ],
  'object literal (differing) ': [ { a: 1 }, { a: 2 }, false ],
  'regex literal (differing)  ': [ /^abc$/, /^def$/, false ],
  'number literal (differing) ': [ 1, 2, false ],
  'null & undefined           ': [ null, undefined, false ],
  'buffer (differing)         ': [ new Buffer(123), new Buffer(456), false ],
  'date (differing)           ': [ new Date(123), new Date(456), false ],
  'error                      ': [ new Error(''), new Error(''), false ],
  'map (differing)            ': [ new Map().set('a', 1), new Map().set('a', 2), false ],
  'regex ctor (differing)     ': [ new RegExp('abc'), new RegExp('def'), false ],
  'set (differing)            ': [ new Set().add(1), new Set().add(2), false ],
  'string ctor (differing)    ': [ new String('abc'), new String('def'), false ],
  'weakmap                    ': [ new WeakMap(), new WeakMap(), false ],
  'weakset                    ': [ new WeakSet(), new WeakSet(), false ],
  'arguments (differing)      ': [ getArguments(1, 2, 3), getArguments(4, 5, 6), false ],
  'function                   ': [ function () {}, function () {}, false ],
  'promise                    ': [ Promise.resolve(), Promise.resolve(), false ],
};
try {
  fixtures['arrow function (differing) '] = [
    eval('() => {}'),
    eval('() => {}'),
    false,
  ];
} catch (error) {
  console.error('cannot benchmark arrow functions');
}
try {
  fixtures['generator func (differing) '] = [
    eval('(function* () {})'),
    eval('(function* () {})'),
    false,
  ];
} catch (error) {
  console.error('cannot benchmark generator functions');
}

function prepareBenchMark(test, name, assert) {
  assert = assert || deepEql;
  var leftHand = test[0];
  var rightHand = test[1];
  var expectedResult = 2 in test ? test[2] : true;
  var invocationString = 'deepEql(' + inspect(leftHand) + ', ' + inspect(rightHand) + ') === ' + expectedResult;
  benches.push(new Benchmark(name, {
    fn: function () {
      if (assert(leftHand, rightHand) !== expectedResult) {
        throw new Error('failing test: ' + invocationString);
      }
    },
    onCycle: function (event) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(event.target.toString());
    },
  }));
}

var filter = process.argv.slice(2).filter(function (arg) {
  return arg[0] !== '-';
})[0] || '';
var lodash = process.argv.indexOf('--lodash') !== -1;
var nodeassert = process.argv.indexOf('--nodeassert') !== -1;
var kewlr = process.argv.indexOf('--kewlr') !== -1;
Object.keys(fixtures).filter(function (key) {
  return key.indexOf(filter) !== -1;
}).forEach(function (testName) {
  prepareBenchMark(fixtures[testName], testName + '         ');
  if (lodash) {
    prepareBenchMark(fixtures[testName], testName + ' (lodash)', lodashDeepEql);
  }
  if (nodeassert) {
    prepareBenchMark(fixtures[testName], testName + '   (node)', assertDeepeql);
  }
  if (kewlr) {
    prepareBenchMark(fixtures[testName], testName + '  (kewlr)', kewlrDeepeql);
  }
});
Benchmark.invoke(benches, {
  name: 'run',
  onCycle: function onCycle() {
    console.log('');
  },
  onComplete: function onComplete() {
    console.log('~Fin~');
  },
});
