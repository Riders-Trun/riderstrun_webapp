import { ApiError } from "@/services/api";

/**
 * Turn a failed join (or trip-code lookup) into something worth showing a rider.
 *
 * The backend answers these with a machine-readable `code` alongside the prose
 * — `RIDE_FULL`, `INVALID_TRIP_CODE`, `ALREADY_JOINED` — and each one means a
 * different thing to the person tapping the button: one is "try another ride",
 * one is "check the code", one is not an error at all. Branching on the message
 * text would break the first time the server rewords it.
 */
export interface JoinErrorMessage {
  /** The server's error code, when it sent one. */
  code?: string;
  title: string;
  description: string;
}

/** Codes the join and lookup paths can return, mapped to rider-facing copy. */
const MESSAGES: Record<string, { title: string; description: string }> = {
  ALREADY_JOINED: {
    title: "You're already on this ride",
    description: "Opening the ride details.",
  },
  RIDE_FULL: {
    title: "This ride is full",
    description: "Every spot has been taken. Ask the organizer if more will open up.",
  },
  INVALID_TRIP_CODE: {
    title: "That code doesn't work",
    description: "Check the trip code with your organizer and try again.",
  },
  NOT_FOUND: {
    title: "No ride found",
    description: "No ride matches that trip code.",
  },
  TRIP_CODE_REQUIRED: {
    title: "Trip code needed",
    description: "This ride is invite-only — you'll need the code from the organizer.",
  },
  RATE_LIMITED: {
    title: "Too many attempts",
    description: "Wait a minute before trying another code.",
  },
};

export function joinErrorMessage(error: unknown): JoinErrorMessage {
  if (error instanceof ApiError) {
    const code = (error.data as { code?: string } | null)?.code;
    const known = code ? MESSAGES[code] : undefined;
    if (known) return { code, ...known };

    // 401 is worth calling out: the rider is signed out, not doing anything wrong.
    if (error.status === 401) {
      return {
        code,
        title: "Sign in to join",
        description: "You need to be signed in to join a ride.",
      };
    }

    return {
      code,
      title: "Couldn't join the ride",
      description: error.message,
    };
  }

  return {
    title: "Couldn't join the ride",
    description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
  };
}
