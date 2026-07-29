'use strict';

// Pure, DOM-free clock logic, extracted from clock-practice.js so it can be
// unit tested independently of the browser. clock-practice.js imports these
// functions rather than reimplementing them.

/**
 * Picks a random practice time. Hour is 1-12 (never 0). Minute is a
 * multiple of five in the range 0-55, matching the five-minute marks on
 * the clock face.
 * @returns {{hour: number, minute: number}}
 */
function randomTime() {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = Math.floor(Math.random() * 12) * 5;
  return { hour, minute };
}

/**
 * Computes the rotation angle, in degrees, of the hour and minute hands
 * for a given time, measured clockwise from the 12 o'clock position.
 * @param {number} hour 1-12
 * @param {number} minute 0-59
 * @returns {{hourAngle: number, minuteAngle: number}}
 */
function handAngles(hour, minute) {
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  return { hourAngle, minuteAngle };
}

/**
 * Formats a time as "H:MM", the minute always shown with a leading zero.
 * @param {number} hour
 * @param {number} minute
 * @returns {string}
 */
function formatTime(hour, minute) {
  return `${hour}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Whether the user's chosen hour and minute match the target time exactly.
 * @param {number} userHour
 * @param {number} userMinute
 * @param {number} targetHour
 * @param {number} targetMinute
 * @returns {boolean}
 */
function isCorrectAnswer(userHour, userMinute, targetHour, targetMinute) {
  return userHour === targetHour && userMinute === targetMinute;
}

/**
 * Builds the hint shown after a wrong answer, telling the user which hand
 * (or both) to check again.
 * @param {number} userHour
 * @param {number} userMinute
 * @param {number} targetHour
 * @param {number} targetMinute
 * @returns {string}
 */
function getHint(userHour, userMinute, targetHour, targetMinute) {
  if (userHour !== targetHour && userMinute !== targetMinute) {
    return 'Have another look at both hands.';
  }
  if (userHour !== targetHour) {
    return 'Check the short hand — that one shows the hour.';
  }
  return 'Check the long hand — that one shows the minutes.';
}

/**
 * Wraps an hour value into the 1-12 range after adding delta, matching a
 * 12-hour clock face (13 wraps to 1, 0 wraps to 12).
 * @param {number} hour current hour, 1-12
 * @param {number} delta amount to add, typically +1 or -1
 * @returns {number}
 */
function wrapHour(hour, delta) {
  let next = hour + delta;
  if (next > 12) next = 1;
  if (next < 1) next = 12;
  return next;
}

/**
 * Wraps a minute value into the 0-59 range after adding delta, matching
 * clock arithmetic (60 wraps to 0, -5 wraps to 55).
 * @param {number} minute current minute, 0-59
 * @param {number} delta amount to add, typically +5 or -5
 * @returns {number}
 */
function wrapMinute(minute, delta) {
  let next = minute + delta;
  if (next >= 60) next = 0;
  if (next < 0) next = 55;
  return next;
}

export {
  randomTime,
  handAngles,
  formatTime,
  isCorrectAnswer,
  getHint,
  wrapHour,
  wrapMinute,
};
