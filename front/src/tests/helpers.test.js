import { formatDate, isDateTodayOrFuture, validateEmail, validatePhone } from '../utils/helpers.js';

describe('validateEmail', () => {
  test('valid email returns true', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('carlos.ramirez@hotel.com')).toBe(true);
    expect(validateEmail('guest+test@domain.co.uk')).toBe(true);
  });

  test('invalid email returns false', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});

describe('formatDate', () => {
  test('formats ISO date to es-ES locale dd/mm/yyyy', () => {
    expect(formatDate('2026-06-15')).toBe('15/06/2026');
    expect(formatDate('2026-12-01T10:30:00Z')).toBe('01/12/2026');
  });

  test('returns dash for empty/null date or invalid structure', () => {
    expect(formatDate('')).toBe('-');
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
    expect(formatDate('invalid-date')).toBe('-');
  });
});

describe('validatePhone', () => {
  test('valid numeric phone (6-20 digits) returns true', () => {
    expect(validatePhone('612345678')).toBe(true);
    expect(validatePhone('5512349876')).toBe(true);
    expect(validatePhone('12345678901234567890')).toBe(true);
  });

  test('phone containing non-digit characters returns false', () => {
    expect(validatePhone('+34 612 345 678')).toBe(false);
    expect(validatePhone('55-123-4567')).toBe(false);
    expect(validatePhone('(55) 1234 9876')).toBe(false);
    expect(validatePhone('551234987a')).toBe(false);
  });

  test('too short or too long phone returns false', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('123456789012345678901')).toBe(false);
    expect(validatePhone('')).toBe(false);
    expect(validatePhone(null)).toBe(false);
  });
});

describe('isDateTodayOrFuture', () => {
  test('future date returns true', () => {
    const nextYear = new Date().getFullYear() + 1;
    expect(isDateTodayOrFuture(`${nextYear}-12-31`)).toBe(true);
  });

  test('today returns true', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isDateTodayOrFuture(today)).toBe(true);
  });

  test('past date returns false', () => {
    expect(isDateTodayOrFuture('2020-01-01')).toBe(false);
  });

  test('empty or invalid date returns false', () => {
    expect(isDateTodayOrFuture('')).toBe(false);
    expect(isDateTodayOrFuture(null)).toBe(false);
  });
});
