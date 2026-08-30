import { describe, it, expect } from 'vitest';
import {
  getDifficultyColor,
  getDifficultyFromDistance,
  getDifficultyColorFromDistance,
  getTimeUntilRide,
  getRideTypeEmoji,
  formatRideDate,
  parseDistanceKm,
  rideStartTime,
} from './rideUtils';

describe('getDifficultyColor', () => {
  it('returns green for Easy', () => {
    expect(getDifficultyColor('Easy')).toBe('bg-green-100 text-green-800');
  });

  it('returns yellow for Moderate/Medium', () => {
    expect(getDifficultyColor('Moderate')).toBe('bg-yellow-100 text-yellow-800');
    expect(getDifficultyColor('Medium')).toBe('bg-yellow-100 text-yellow-800');
  });

  it('returns red for Hard/Challenging/Expert', () => {
    expect(getDifficultyColor('Hard')).toBe('bg-red-100 text-red-800');
    expect(getDifficultyColor('Challenging')).toBe('bg-red-100 text-red-800');
    expect(getDifficultyColor('Expert')).toBe('bg-red-100 text-red-800');
  });

  it('returns gray for unknown', () => {
    expect(getDifficultyColor('Unknown')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getDifficultyFromDistance', () => {
  it('returns Easy for < 50km', () => {
    expect(getDifficultyFromDistance('30 km')).toBe('Easy');
  });

  it('returns Moderate for 50-99km', () => {
    expect(getDifficultyFromDistance('75 km')).toBe('Moderate');
  });

  it('returns Hard for >= 100km', () => {
    expect(getDifficultyFromDistance('150 km')).toBe('Hard');
  });
});

describe('getDifficultyColorFromDistance', () => {
  it('combines distance and color logic', () => {
    expect(getDifficultyColorFromDistance('30 km')).toBe('bg-green-100 text-green-800');
    expect(getDifficultyColorFromDistance('150 km')).toBe('bg-red-100 text-red-800');
  });
});

describe('getTimeUntilRide', () => {
  it('returns Starting Soon for today', () => {
    expect(getTimeUntilRide('Today, 6:00 AM')).toBe('Starting Soon');
  });

  it('returns Tomorrow for tomorrow', () => {
    expect(getTimeUntilRide('Tomorrow, 7:00 AM')).toBe('Tomorrow');
  });

  it('returns Upcoming for other dates', () => {
    expect(getTimeUntilRide('March 15, 8:00 AM')).toBe('Upcoming');
  });
});

describe('getRideTypeEmoji', () => {
  it('returns correct emoji for known types', () => {
    expect(getRideTypeEmoji('Breakfast')).toBe('🍳');
    expect(getRideTypeEmoji('Adventure')).toBe('🏔️');
    expect(getRideTypeEmoji('All')).toBe('🎯');
  });

  it('returns default motorcycle emoji for unknown type', () => {
    expect(getRideTypeEmoji('Random')).toBe('🏍️');
  });
});

describe('formatRideDate', () => {
  it('parses Today format', () => {
    const result = formatRideDate('Today, 6:00 AM');
    expect(result.label).toBe('Today');
    expect(result.time).toBe('6:00 AM');
    expect(result.isToday).toBe(true);
  });

  it('parses Tomorrow format', () => {
    const result = formatRideDate('Tomorrow, 7:00 AM');
    expect(result.label).toBe('Tomorrow');
    expect(result.isTomorrow).toBe(true);
  });

  it('parses regular date format', () => {
    const result = formatRideDate('March 15, 8:00 AM');
    expect(result.label).toBe('March 15');
    expect(result.isRegular).toBe(true);
  });
});

describe('parseDistanceKm', () => {
  it('reads the number out of a display distance', () => {
    expect(parseDistanceKm('80 km round trip')).toBe(80);
    expect(parseDistanceKm('280 km')).toBe(280);
    expect(parseDistanceKm('12.5 km')).toBe(12.5);
  });

  it('returns null when there is no number to find', () => {
    expect(parseDistanceKm('unknown')).toBeNull();
    expect(parseDistanceKm('')).toBeNull();
    expect(parseDistanceKm(undefined)).toBeNull();
  });
});

describe('rideStartTime', () => {
  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  it('prefers the ISO startDate when the API supplied one', () => {
    const iso = '2026-03-15T04:30:00.000Z';
    expect(rideStartTime({ startDate: iso, date: 'Today, 6:00 AM' })).toBe(
      new Date(iso).getTime()
    );
  });

  it('resolves the Today label against the current day', () => {
    const sixAm = 6 * 60 * 60 * 1000;
    expect(rideStartTime({ date: 'Today, 6:00 AM' })).toBe(startOfToday() + sixAm);
  });

  it('resolves Tomorrow a day later than Today', () => {
    const today = rideStartTime({ date: 'Today, 6:00 AM' });
    const tomorrow = rideStartTime({ date: 'Tomorrow, 6:00 AM' });
    expect(tomorrow - today).toBe(24 * 60 * 60 * 1000);
  });

  it('handles PM times and 12-hour edge cases', () => {
    const base = startOfToday();
    expect(rideStartTime({ date: 'Today, 1:00 PM' })).toBe(base + 13 * 60 * 60 * 1000);
    expect(rideStartTime({ date: 'Today, 12:00 AM' })).toBe(base);
    expect(rideStartTime({ date: 'Today, 12:30 PM' })).toBe(base + 12.5 * 60 * 60 * 1000);
  });

  it('sorts unreadable dates last instead of returning NaN', () => {
    expect(rideStartTime({ date: 'sometime soon' })).toBe(Number.POSITIVE_INFINITY);
    expect(rideStartTime({})).toBe(Number.POSITIVE_INFINITY);
  });

  it('orders Today before Tomorrow when used as a comparator', () => {
    const rides = [
      { date: 'Tomorrow, 5:30 AM' },
      { date: 'Today, 6:00 AM' },
      { date: 'not a date' },
    ];
    const sorted = [...rides].sort((a, b) => rideStartTime(a) - rideStartTime(b));
    expect(sorted.map((r) => r.date)).toEqual([
      'Today, 6:00 AM',
      'Tomorrow, 5:30 AM',
      'not a date',
    ]);
  });
});
