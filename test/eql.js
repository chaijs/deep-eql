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

tests.push([ 'eql({ a: 1, b: 2, c: 3}, { a: 1, b: 2, c: 3 })', { a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 } ]);
tests.push([ 'eql({ foo: "bar" }, { foo: "baz" })', { foo: 'bar' }, { foo: 'baz' }, true ]);
tests.push([ 'eql({ foo: { bar: "foo" }}, { foo: { bar: "baz" }})', { foo: { bar: 'foo' }}, { foo: { bar: 'baz' }}, true ]);

/*!
 * Tolerance
 */

tests.push([ 'eql([ 1, 2, 3 ], [ 1.001, 2, 3 ], { tolerance: 0.001 })', [ 1, 2, 3 ], [ 1.001, 2, 3 ], false, { tolerance: 0.001 } ]);
tests.push([ 'eql([ 1, 2, 3 ], [ 1.01, 2, 3 ], { tolerance: 0.001 })', [ 1, 2, 3 ], [ 1.01, 2, 3 ], true, { tolerance: 0.001 } ]);

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
      if (negate) {
        assert(!eql(test[1], test[2], test[4]));
      } else {
        assert(eql(test[1], test[2], test[4]));
      }
    });
  });
});
