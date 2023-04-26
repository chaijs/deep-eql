

const assert = require('simple-assert');
const { Temporal } = require('@js-temporal/polyfill');
const eql = require('..');

describe('TC39 Temporal', () => {
  describe('Temporal.PlainDate', () => {
    it('returns true for same dates', () => {
      assert(eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 1)),
        'eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 1))');
    });

    it('returns false for different dates', () => {
      assert(eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 2)) === false,
        'eql(new Temporal.PlainDate(2022, 1, 1), new Temporal.PlainDate(2022, 1, 2)) === false');
    });
  });

  describe('Temporal.PlainTime', () => {
    it('returns true for same times', () => {
      assert(eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(12, 0, 0)),
        'eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(12, 0, 0))');
    });

    it('returns false for different times', () => {
      assert(eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(13, 0, 0)) === false,
        'eql(new Temporal.PlainTime(12, 0, 0), new Temporal.PlainTime(13, 0, 0)) === false');
    });
  });

  describe('Temporal.PlainDateTime', () => {
    it('returns true for same date times', () => {
      assert(eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0)),
        'eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0))');
    });

    it('returns false for different date times', () => {
      assert(eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0),
        new Temporal.PlainDateTime(2022, 1, 1, 13, 0, 0)) === false,
      // eslint-disable-next-line max-len
      'eql(new Temporal.PlainDateTime(2022, 1, 1, 12, 0, 0), new Temporal.PlainDateTime(2022, 1, 1, 13, 0, 0)) === false');
    });
  });

  describe('Temporal.Instant', () => {
    it('returns true for same instants', () => {
      assert(eql(Temporal.Instant.from('2022-01-01T12:00:00.000Z'), Temporal.Instant.from('2022-01-01T12:00:00.000Z')),
        'eql(Temporal.Instant.from("2022-01-01T12:00:00.000Z"), Temporal.Instant.from("2022-01-01T12:00:00.000Z"))');
    });

    it('returns false for different instants', () => {
      assert(eql(Temporal.Instant.from('2022-01-01T12:00:00.000Z'),
        Temporal.Instant.from('2022-01-01T13:00:00.000Z')) === false,
      // eslint-disable-next-line max-len
      'eql(Temporal.Instant.from("2022-01-01T12:00:00.000Z"), Temporal.Instant.from("2022-01-01T13:00:00.000Z")) === false');
    });
  });

  describe('Temporal.ZonedDateTime', () => {
    it('returns true for same zoned date times', () => {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]')),
      // eslint-disable-next-line max-len
      'eql(Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"), Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"))');
    });

    it('returns false for different zoned date times', () => {
      assert(eql(Temporal.ZonedDateTime.from('2022-01-01T12:00:00.000Z[+01:00]'),
        Temporal.ZonedDateTime.from('2022-01-01T13:00:00.000Z[+01:00]')) === false,
      // eslint-disable-next-line max-len
      'eql(Temporal.ZonedDateTime.from("2022-01-01T12:00:00.000Z[+01:00]"), Temporal.ZonedDateTime.from("2022-01-01T13:00:00.000Z[+01:00]")) === false');
    });
  });

  describe('Temporal.PlainYearMonth', () => {
    it('returns true for same plain year months', () => {
      assert(eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 1)),
        'eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 1))');
    });

    it('returns false for different plain year months', () => {
      assert(eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 2)) === false,
        'eql(new Temporal.PlainYearMonth(2022, 1), new Temporal.PlainYearMonth(2022, 2)) === false');
    });
  });

  describe('Temporal.PlainMonthDay', () => {
    it('returns true for same plain month days', () => {
      assert(eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(1, 1)),
        'eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(1, 1))');
    });

    it('returns false for different plain month days', () => {
      assert(eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(2, 1)) === false,
        'eql(new Temporal.PlainMonthDay(1, 1), new Temporal.PlainMonthDay(2, 1)) === false');
    });
  });

  describe('Temporal.Duration', () => {
    it('returns true for same durations', () => {
      assert(eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 1)),
        'eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 1))');
    });

    it('returns false for different durations', () => {
      assert(eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 2)) === false,
        'eql(new Temporal.Duration(0, 0, 0, 1), new Temporal.Duration(0, 0, 0, 2)) === false');
    });
  });

  describe('Temporal.TimeZone', () => {
    it('returns true for same time zones', () => {
      assert(eql(new Temporal.TimeZone('+01:00'), new Temporal.TimeZone('+01:00')),
        'eql(new Temporal.TimeZone("+01:00"), new Temporal.TimeZone("+01:00"))');
    });

    it('returns false for different time zones', () => {
      assert(eql(new Temporal.TimeZone('+01:00'), new Temporal.TimeZone('+02:00')) === false,
        'eql(new Temporal.TimeZone("+01:00"), new Temporal.TimeZone("+02:00")) === false');
    });
  });

  describe('Temporal.Calendar', () => {
    it('returns true for same calendars', () => {
      assert(eql(new Temporal.Calendar('gregory'), new Temporal.Calendar('gregory')),
        'eql(new Temporal.Calendar("gregory"), new Temporal.Calendar("gregory"))');
    });

    it('returns false for different calendars', () => {
      assert(eql(new Temporal.Calendar('gregory'), new Temporal.Calendar('iso8601')) === false,
        'eql(new Temporal.Calendar("gregory"), new Temporal.Calendar("iso8601")) === false');
    });
  });
});
