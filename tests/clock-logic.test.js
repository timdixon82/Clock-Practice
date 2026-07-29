// Unit tests for the pure clock logic in clock-logic.js.
//
// These tests assert against an INDEPENDENT notion of correctness — the
// standard analog-clock formulas and game rules — not against whatever
// clock-logic.js happens to produce:
//
//   - Hand angles: a clock face is 360 degrees over 12 hours, so the hour
//     hand moves 30 degrees per hour (360 / 12) plus 0.5 degrees per minute
//     (30 degrees / 60 minutes), and the minute hand moves 6 degrees per
//     minute (360 / 60). These are well-established facts about how an
//     analog clock face works, computed here directly rather than by
//     calling handAngles.
//   - Answer checking: correct means the chosen hour and minute both equal
//     the target hour and minute; anything else is wrong.
//   - Wrapping: a 12-hour dial has no 0 or 13; a 60-minute face has no 60
//     or -5.

import { describe, it, expect } from 'vitest';
import {
  randomTime,
  handAngles,
  formatTime,
  isCorrectAnswer,
  getHint,
  wrapHour,
  wrapMinute,
} from '../scripts/clock-logic.js';

// Independent reference implementation of the standard analog clock hand
// formula, written separately from handAngles so a shared bug would not
// cancel out.
function expectedAngles(hour, minute) {
  const minuteAngle = minute * (360 / 60);
  const hourAngle = (hour % 12) * (360 / 12) + minute * (360 / 60 / 12);
  return { hourAngle, minuteAngle };
}

describe('randomTime', () => {
  it('always returns an hour between 1 and 12 inclusive', () => {
    for (let i = 0; i < 500; i++) {
      const { hour } = randomTime();
      expect(Number.isInteger(hour)).toBe(true);
      expect(hour).toBeGreaterThanOrEqual(1);
      expect(hour).toBeLessThanOrEqual(12);
    }
  });

  it('always returns a minute that is a multiple of five, from 0 to 55', () => {
    for (let i = 0; i < 500; i++) {
      const { minute } = randomTime();
      expect(Number.isInteger(minute)).toBe(true);
      expect(minute % 5).toBe(0);
      expect(minute).toBeGreaterThanOrEqual(0);
      expect(minute).toBeLessThanOrEqual(55);
    }
  });

  it('eventually produces more than one distinct hour and minute (not stuck)', () => {
    const hours = new Set();
    const minutes = new Set();
    for (let i = 0; i < 200; i++) {
      const { hour, minute } = randomTime();
      hours.add(hour);
      minutes.add(minute);
    }
    expect(hours.size).toBeGreaterThan(1);
    expect(minutes.size).toBeGreaterThan(1);
  });
});

describe('handAngles', () => {
  it.each([
    [12, 0],
    [3, 15],
    [6, 0],
    [9, 45],
    [1, 5],
    [11, 55],
    [7, 30],
  ])('matches the standard analog clock formula for %i:%i', (hour, minute) => {
    expect(handAngles(hour, minute)).toEqual(expectedAngles(hour, minute));
  });

  it('places both hands at 0 degrees for 12 o\'clock exactly', () => {
    expect(handAngles(12, 0)).toEqual({ hourAngle: 0, minuteAngle: 0 });
  });

  it('places the minute hand at 180 degrees for half past', () => {
    expect(handAngles(4, 30).minuteAngle).toBe(180);
  });

  it('places the hour hand between hour marks for a quarter past', () => {
    // 3:15 -> hour hand a quarter of the way from 3 to 4: 90 + 7.5 = 97.5
    expect(handAngles(3, 15).hourAngle).toBe(97.5);
  });
});

describe('formatTime', () => {
  it('pads a single-digit minute with a leading zero', () => {
    expect(formatTime(3, 5)).toBe('3:05');
  });

  it('does not pad a two-digit minute', () => {
    expect(formatTime(1, 30)).toBe('1:30');
  });

  it('formats the o\'clock case with two zeros', () => {
    expect(formatTime(12, 0)).toBe('12:00');
  });

  it('does not pad the hour, even when single digit', () => {
    expect(formatTime(9, 45)).toBe('9:45');
  });
});

describe('isCorrectAnswer', () => {
  it('accepts an answer that matches both hour and minute', () => {
    expect(isCorrectAnswer(3, 15, 3, 15)).toBe(true);
  });

  it('rejects an answer with the right minute but wrong hour', () => {
    expect(isCorrectAnswer(4, 15, 3, 15)).toBe(false);
  });

  it('rejects an answer with the right hour but wrong minute', () => {
    expect(isCorrectAnswer(3, 20, 3, 15)).toBe(false);
  });

  it('rejects an answer that is wrong in both hour and minute', () => {
    expect(isCorrectAnswer(7, 40, 3, 15)).toBe(false);
  });

  it('accepts midnight/noon represented as hour 12, minute 0', () => {
    expect(isCorrectAnswer(12, 0, 12, 0)).toBe(true);
  });
});

describe('getHint', () => {
  it('tells the user to check both hands when both are wrong', () => {
    expect(getHint(7, 40, 3, 15)).toBe('Have another look at both hands.');
  });

  it('tells the user to check the hour hand when only the hour is wrong', () => {
    expect(getHint(4, 15, 3, 15)).toBe(
      'Check the short hand — that one shows the hour.'
    );
  });

  it('tells the user to check the minute hand when only the minute is wrong', () => {
    expect(getHint(3, 20, 3, 15)).toBe(
      'Check the long hand — that one shows the minutes.'
    );
  });
});

describe('wrapHour', () => {
  it('increments normally within range', () => {
    expect(wrapHour(5, 1)).toBe(6);
  });

  it('wraps from 12 up to 1', () => {
    expect(wrapHour(12, 1)).toBe(1);
  });

  it('wraps from 1 down to 12', () => {
    expect(wrapHour(1, -1)).toBe(12);
  });

  it('decrements normally within range', () => {
    expect(wrapHour(8, -1)).toBe(7);
  });
});

describe('wrapMinute', () => {
  it('increments normally within range', () => {
    expect(wrapMinute(10, 5)).toBe(15);
  });

  it('wraps from 55 up to 0', () => {
    expect(wrapMinute(55, 5)).toBe(0);
  });

  it('wraps from 0 down to 55', () => {
    expect(wrapMinute(0, -5)).toBe(55);
  });

  it('decrements normally within range', () => {
    expect(wrapMinute(20, -5)).toBe(15);
  });
});
