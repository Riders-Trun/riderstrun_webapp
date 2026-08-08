import { describe, it, expect } from 'vitest';
import { joinErrorMessage } from './joinErrors';
import { ApiError } from '@/services/api';

/** The shape the backend's errorHandler actually sends on a failed join. */
const apiError = (status: number, code?: string, message = 'Request failed') =>
  new ApiError(message, status, { status: 'error', message, code });

describe('joinErrorMessage', () => {
  it('maps the server error code, not the message text', () => {
    const result = joinErrorMessage(apiError(409, 'RIDE_FULL', 'Ride is full'));
    expect(result.code).toBe('RIDE_FULL');
    expect(result.title).toBe('This ride is full');
  });

  it('reports ALREADY_JOINED so callers can treat it as success', () => {
    const result = joinErrorMessage(apiError(409, 'ALREADY_JOINED'));
    expect(result.code).toBe('ALREADY_JOINED');
    expect(result.title).toBe("You're already on this ride");
  });

  it('distinguishes a bad code from a missing ride', () => {
    expect(joinErrorMessage(apiError(403, 'INVALID_TRIP_CODE')).title).toBe(
      "That code doesn't work"
    );
    expect(joinErrorMessage(apiError(404, 'NOT_FOUND')).title).toBe('No ride found');
  });

  it('calls out a signed-out rider rather than blaming the code', () => {
    const result = joinErrorMessage(apiError(401));
    expect(result.title).toBe('Sign in to join');
  });

  it('falls back to the server message for an unrecognised code', () => {
    const result = joinErrorMessage(apiError(500, 'SOMETHING_NEW', 'Boom'));
    expect(result.title).toBe("Couldn't join the ride");
    expect(result.description).toBe('Boom');
  });

  it('handles a plain Error and a non-Error throw', () => {
    expect(joinErrorMessage(new Error('offline')).description).toBe('offline');
    expect(joinErrorMessage('weird').description).toBe(
      'Something went wrong. Please try again.'
    );
  });
});
