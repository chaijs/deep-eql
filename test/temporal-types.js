'use strict';

var assert = require('simple-assert');
var { Temporal } = require('@js-temporal/polyfill');
var eql = require('..');

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
      // eslint-disable-next-line max-len
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
      // eslint-disable-next-line max-len
      'eql(Temporal.Instant.from("2022-01-01T12:00:00.000Z"), Temporal.Instant.from("2022-01-01T13:00:00.000Z")) === false');
    });
  });

  describe('Temporal.ZonedDateTime', function () {
    it('returns true for same zoned date times', function () {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]')),
      // eslint-disable-next-line max-len
      'eql(Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"), Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"))');
    });

    it('returns false for different zoned date times', function () {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T13:00:00.000Z[+01:00]')) === false,
      // eslint-disable-next-line max-len
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
  });

  describe('Temporal.TimeZone', function () {
    it('returns true for same time zones', function () {
      assert(eql(new Temporal.TimeZone('+01:00'), new Temporal.TimeZone('+01:00')),
        'eql(new Temporal.TimeZone("+01:00"), new Temporal.TimeZone("+01:00"))');
    });

    it('returns false for different time zones', function () {
      assert(eql(new Temporal.TimeZone('+01:00'), new Temporal.TimeZone('+02:00')) === false,
        'eql(new Temporal.TimeZone("+01:00"), new Temporal.TimeZone("+02:00")) === false');
    });
  });

  describe('Temporal.Calendar', function () {
    it('returns true for same calendars', function () {
      assert(eql(new Temporal.Calendar('gregory'), new Temporal.Calendar('gregory')),
        'eql(new Temporal.Calendar("gregory"), new Temporal.Calendar("gregory"))');
    });

    it('returns false for different calendars', function () {
      assert(eql(new Temporal.Calendar('gregory'), new Temporal.Calendar('iso8601')) === false,
        'eql(new Temporal.Calendar("gregory"), new Temporal.Calendar("iso8601")) === false');
    });
  });
});
