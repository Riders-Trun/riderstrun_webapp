import { describe, it, expect } from 'vitest';
import {
  getDifficultyColor,
  getDifficultyFromDistance,
  getDifficultyColorFromDistance,
  getTimeUntilRide,
  getRideTypeEmoji,
  formatRideDate,
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
    expect(getRideTypeEmoji('Breakfast')).toBe('🌅');
    expect(getRideTypeEmoji('Adventure')).toBe('🏔️');
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
