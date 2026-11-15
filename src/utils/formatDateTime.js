// src/utils/formatDateTime.js

const DATE_TIME_OPTIONS = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
};

/**
 * Format a timestamp from the backend for display.
 * Handles Firestore Timestamps serialized as JSON
 * (`{ _seconds, _nanoseconds }`), `{ seconds }`, ISO strings,
 * epoch millis and Date objects. Returns "" for missing/invalid input.
 */
export function formatDateTime(value) {
    if (!value) return "";

    const seconds =
        value._seconds ??
        value.seconds;

    if (seconds != null) {
        return new Date(
            seconds * 1000
        ).toLocaleString("en-CA", DATE_TIME_OPTIONS);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-CA", DATE_TIME_OPTIONS);
}
