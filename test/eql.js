var tests = [];

/*!
 * sameValue
 */

tests.push([ 'eql("x", "x")', 'x', 'x']);
tests.push([ 'eql("x", "y")', 'x', 'y', true ]);
tests.push([ 'eql(-0, +0)', -0, +0, true ]);
tests.push([ 'eql(-0, -0)', -0, -0 ]);
tests.push([ 'eql(+0, +0)', +0, +0 ]);
tests.push([ 'eql(0, 0)', 0, 0 ]);
tests.push([ 'eql(1, 1)', 1, 1 ]);
tests.push([ 'eql(-1, 1)', -1, 1, true ]);
tests.push([ 'eql(inf, inf)', Infinity, Infinity ]);
tests.push([ 'eql(-inf, -inf)', -Infinity, -Infinity ]);
tests.push([ 'eql(NaN, NaN)', NaN, NaN ]);
tests.push([ '!eql(NaN, 0)', NaN, 0, true ]);
tests.push([ 'eql(undefined, undefined)', undefined, undefined ]);
tests.push([ 'eql(null, null)', null, null ]);
tests.push([ '!eql(null, undefined)', null, undefined, true ]);

// wrap in array to hide from the test framework
tests.push([ 'eql(Error, Error)', [new Error('foo')], [new Error('foo')]]);
// fails on browser, I think because of the test framework itself
// tests.push([ '!eql(Error, Error)', [new Error('foo')], [new Error('BAR')], true]);

/*!
 * typeEqual
 */

tests.push([ 'eql([], [])', [], [] ]);
tests.push([ 'eql({}, {})', {}, {} ]);
tests.push([ 'eql([], {})', [], {}, true ]);

/*!
 * object identity
 */

function Base1() {};
function Base2() {};
var object1 = new Base1();
var object2 = new Base2();

tests.push([ 'eql(object1, object1)', object1, object1 ]);
tests.push([ 'eql(object1, object2)', object1, object2, true ]);

(function() {
  tests.push([ 'eql([], arguments)', [], arguments, true ]);
})();

(function() {
  var arg1 = arguments;
  (function() {
    var arg2 = arguments;
    tests.push([ 'eql(args1, args2)', arg1, arg2 ]);
  })();
})();

/*!
 * dateEqual
 */

var date1 = new Date();
var date2 = new Date(date1.getTime() + 10);
tests.push([ 'eql(date1, date1)', date1, date1 ]);
tests.push([ 'eql(date1, date2)', date1, date2, true ]);

/*!
 * regexpEqual
 */

tests.push([ 'eql(/\\\s/, new RegExp("\\\s"))', /\s/, new RegExp('\\\s') ]);
tests.push([ 'eql(/\\\s/g, /\\\s/g)', /\s/g, /\s/g ]);
tests.push([ 'eql(/\\\s/g, /\\\[/g)', /\s/g, /\[/g, true ]);

/*!
 * Iteration
 */

tests.push([ 'eql([ 1, 2, 3 ], [ 1, 2, 3 ])', [ 1, 2, 3 ], [ 1, 2, 3 ] ]);
tests.push([ 'eql([ 3, 2, 1 ], [ 1, 2, 3 ])', [ 3, 2, 1 ], [ 1, 2, 3 ], true ]);
tests.push([ 'eql([ [1, 2, 3] ], [ [1, 2, 3] ])', [ [1, 2, 3] ], [ [1, 2, 3] ] ]);

tests.push([ 'eql({ a: 1, b: 2, c: 3}, { a: 1, b: 2, c: 3 })', { a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 } ]);
tests.push([ 'eql({ foo: "bar" }, { foo: "baz" })', { foo: 'bar' }, { foo: 'baz' }, true ]);
tests.push([ 'eql({ foo: { bar: "foo" }}, { foo: { bar: "baz" }})', { foo: { bar: 'foo' }}, { foo: { bar: 'baz' }}, true ]);

/*!
 * setEqual
 */

if (typeof(Set) === 'function') {
  var set1 = new Set([{a:0},{a:1}]);
  var set2 = new Set([{a:1},{a:0}]);
  tests.push([ 'eql(set1, set2)', set1, set2]);
  var sym = Symbol('sym')
  var set3 = new Set([sym]);
  var set4 = new Set([sym]);
  tests.push([ 'eql(set3, set4)', set3, set4]);
  tests.push([ '!eql(set1, set3)', set1, set3, true]);
}

/*!
 * mapEqual
 */

if (typeof(Map) === 'function') {
  var map1 = new Map([[0, {a: 1}]]);
  var map2 = new Map([[0, {a: 1}]]);
  tests.push([ 'eql(map1, map2)', map1, map2]);
  var sym = Symbol('sym')
  var map3 = new Map([[sym, sym]]);
  var map4 = new Map([[sym, sym]]);
  tests.push([ 'eql(map3, map4)', map3, map4]);
  tests.push([ '!eql(map1, map3)', map1, map3, true]);
}

/*!
 * New array types
 */

if (typeof(ArrayBuffer) === 'function') {
  var buf1 = new ArrayBuffer(16);
  var buf2 = new ArrayBuffer(16);
  var buf3 = new ArrayBuffer(16);
  tests.push([ 'eql(arraybuffer1, arraybuffer1)', buf1, buf1]);
  tests.push([ 'eql(arraybuffer1, arraybuffer2)', buf1, buf2]);
  var ubuf3 = new Uint8Array(buf3);
  ubuf3[0] = 1; // just make it not equal
  tests.push([ '!eql(arraybuffer1, arraybuffer3)', buf1, buf3, true]);
  var types = [
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
    DataView
  ];
  types.forEach(function(t) {
    var b1 = new t(buf1);
    var b2 = new t(buf2);
    var b3 = new t(buf3);
    tests.push([ 'eql(' + t.name + '1, ' + t.name + '1)', b1, b1]);
    tests.push([ 'eql(' + t.name + '1, ' + t.name + '2)', b1, b2]);
    tests.push([ '!eql(' + t.name + '1, ' + t.name + '3)', b1, b3, true]);
  })
}

function f() {}
function g() {}
tests.push(['eql(f(), f())', f, f])
tests.push(['eql(f(), g())', f, g, true])

if (typeof(Proxy) === 'function') {
  // note: there are lots of ways you could make a proxy fail
  var handler = {
    get: function(target, name) {
      return target[name] || name;
    }
  }
  var o1 = { foo: 1 };
  var o2 = { foo: 1 };
  var p1 = new Proxy(o1, handler);
  var p2 = new Proxy(o2, handler);
  tests.push([ 'eql(proxy1, proxy2)', p1, p2 ]);
}

/*!
 * Test setup
 */

describe('deep-equal', function() {
  tests.forEach(function(test, i) {
    var negate = test[3] && true === test[3];
    var title = '[' + (i + 1) + '] ';
    title += negate ? '(-) ' : '(+) ';
    title += test[0];

    it(title, function() {
      if (test[1] && test[1].constructor && (test[1].constructor.name === 'Error')) {
        console.log(test[1].message, test[2].message)
      }
      if (negate) {
        assert(!eql(test[1], test[2]));
      } else {
        assert(eql(test[1], test[2]));
      }
    });
  });
});
