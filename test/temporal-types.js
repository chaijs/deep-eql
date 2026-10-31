import { assert } from 'simple-assert';
import { Temporal } from '@js-temporal/polyfill';
import eql from '../index.js';

describe('TC39 Temporal', function () {
  describe('Temporal.PlainDate', function () {
    it('returns true for same dates', function () {
      assert(eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 1)),
        'eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 1))');
    });

    it('returns false for different dates', function () {
      assert(eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 2)) === false,
        'eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 2)) === false');
    });
  });

  describe('Temporal.PlainTime', function () {
    it('returns true for same times', function () {
      assert(eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(12, 0, 0)),
        'eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(12, 0, 0))');
    });

    it('returns false for different times', function () {
      assert(eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(13, 0, 0)) === false,
        'eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(13, 0, 0)) === false');
    });
  });

  describe('Temporal.PlainDateTime', function () {
    it('returns true for same date times', function () {
      assert(eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0)),
        'eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0))');
    });

    it('returns false for different date times', function () {
      assert(eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0),
        new Temporal.PlainDateTime(2022, 1, 1, 13, 0, 0)) === false,
      'eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 13, 0, 0)) === false');
    });
  });

  describe('Temporal.Instant', function () {
    it('returns true for same instants', function () {
      assert(eql(Temporal.Instant.from('2022-01-01T12:00:00.000Z'), Temporal.Instant.from('2022-01-01T12:00:00.000Z')),
        'eql(Temporal.Instant.from("2022-01-01T12:00:00.000Z"), Temporal.Instant.from("2022-01-01T12:00:00.000Z"))');
    });

    it('returns false for different instants', function () {
      assert(eql(Temporal.Instant.from('2022-01-01T12:00:00.000Z'),
        Temporal.Instant.from('2022-01-01T13:00:00.000Z')) === false,
      'eql(Temporal.Instant.from("2022-01-01T12:00:00.000Z"), Temporal.Instant.from("2022-01-01T13:00:00.000Z")) === false');
    });
  });

  describe('Temporal.ZonedDateTime', function () {
    it('returns true for same zoned date times', function () {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]')),
      'eql(Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"), Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"))');
    });

    it('returns false for different zoned date times', function () {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T13:00:00.000Z[+01:00]')) === false,
      'eql(Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"), Temporal.ZonedDateTime.from("2022-01-01T13:00:00.000Z[+01:00]")) === false');
    });
  });

  describe('Temporal.PlainYearMonth', function () {
    it('returns true for same plain year months', function () {
      assert(eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 1)),
        'eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 1))');
    });

    it('returns false for different plain year months', function () {
      assert(eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 2)) === false,
        'eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 2)) === false');
    });
  });

  describe('Temporal.PlainMonthDay', function () {
    it('returns true for same plain month days', function () {
      assert(eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(1, 1)),
        'eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(1, 1))');
    });

    it('returns false for different plain month days', function () {
      assert(eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(2, 1)) === false,
        'eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(2, 1)) === false');
    });
  });

  describe('Temporal.Duration', function () {
    it('returns true for same durations', function () {
      assert(eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 1)),
        'eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 1))');
    });

    it('returns false for different durations', function () {
      assert(eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 2)) === false,
        'eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 2)) === false');
    });

    [ 'years', 'months', 'weeks' ].forEach(function (unit) {
      it('compares equal positive and negative calendar ' + unit, function () {
        [ 1, -1 ].forEach(function (sign) {
          const fields = { [unit]: sign, days: sign, hours: sign, nanoseconds: sign };
          assert(eql(Temporal.Duration.from(fields), Temporal.Duration.from(fields)));
        });
      });

      it('rejects different calendar ' + unit + ' with the same time part', function () {
        assert(eql(Temporal.Duration.from({ [unit]: 1, hours: 1 }),
          Temporal.Duration.from({ [unit]: 2, hours: 1 })) === false);
      });
    });

    it('does not convert calendar units without a relative date', function () {
      [ [ 'P1Y', 'P12M' ], [ 'P1M', 'P30D' ], [ 'P1W', 'P7D' ] ].forEach(function (pair) {
        assert(eql(Temporal.Duration.from(pair[0]), Temporal.Duration.from(pair[1])) === false);
      });
    });

    it('preserves equivalent day and time units', function () {
      [ [ 'P1D', 'PT24H' ], [ 'PT1H', 'PT60M' ], [ 'PT0S', 'P0D' ] ]
        .forEach(function (pair) {
          assert(eql(Temporal.Duration.from(pair[0]), Temporal.Duration.from(pair[1])));
        });
      assert(eql(Temporal.Duration.from({ seconds: 1 }), Temporal.Duration.from({ milliseconds: 1000 })));
      assert(eql(Temporal.Duration.from('-P1D'), Temporal.Duration.from('-PT24H')));
      assert(eql(Temporal.Duration.from({ nanoseconds: 9007199254740991 }),
        Temporal.Duration.from('PT9007199.254740991S')));
    });

    it('balances time units after matching calendar units', function () {
      assert(eql(Temporal.Duration.from('P1M1DT1H'), Temporal.Duration.from('P1MT25H')));
      assert(eql(Temporal.Duration.from('-P1Y1W1DT1H'), Temporal.Duration.from('-P1Y1WT25H')));
      assert(eql(Temporal.Duration.from('P1MT1H'), Temporal.Duration.from('P1MT2H')) === false);
    });

    it('distinguishes one nanosecond beyond the safe integer nanosecond range', function () {
      const left = Temporal.Duration.from('PT9007199.254740992S');
      const right = Temporal.Duration.from('PT9007199.254740993S');
      assert(left.total('nanoseconds') === right.total('nanoseconds'));
      assert(eql(left, right) === false);
      assert(eql(left.negated(), right.negated()) === false);
      const nearLimit = Temporal.Duration.from('PT9007199254740990.000000001S');
      const nextNanosecond = Temporal.Duration.from('PT9007199254740990.000000002S');
      assert(nearLimit.total('nanoseconds') === nextNanosecond.total('nanoseconds'));
      assert(eql(nearLimit, nextNanosecond) === false);
    });

    it('distinguishes one nanosecond alongside calendar units', function () {
      assert(eql(Temporal.Duration.from('P1MT9007199.254740992S'),
        Temporal.Duration.from('P1MT9007199.254740993S')) === false);
    });

    it('compares calendar durations nested in ordinary data structures', function () {
      const left = { values: [ Temporal.Duration.from('P1M') ], map: new Map([ [ 'year', Temporal.Duration.from('P1Y') ] ]) };
      const right = { values: [ Temporal.Duration.from('P1M') ], map: new Map([ [ 'year', Temporal.Duration.from('P1Y') ] ]) };
      assert(eql(left, right));
      right.values[0] = Temporal.Duration.from('P2M');
      assert(eql(left, right) === false);
    });

    it('does not require the duration instance constructor property', function () {
      [ 'P1M', 'P1D' ].forEach(function (value) {
        const left = Temporal.Duration.from(value);
        const right = Temporal.Duration.from(value);
        Object.defineProperty(left, 'constructor', { value: undefined });
        Object.defineProperty(right, 'constructor', { value: null });
        assert(eql(left, right));
      });
    });

    it('leaves the original calendar durations unchanged', function () {
      const left = Temporal.Duration.from('P1Y2M3W4DT5H6M7.987654321S');
      const right = Temporal.Duration.from(left);
      const original = left.toString();
      assert(eql(left, right));
      assert(left.toString() === original);
      assert(right.toString() === original);
    });
  });
});
