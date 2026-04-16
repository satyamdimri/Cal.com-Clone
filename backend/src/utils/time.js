const { DateTime, Interval } = require('luxon');

const parseDateAndTime = ({ date, time, timezone }) => {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
  if (!dt.isValid) return null;
  return dt;
};

const overlaps = (aStart, aEnd, bStart, bEnd) => {
  const a = Interval.fromDateTimes(aStart, aEnd);
  const b = Interval.fromDateTimes(bStart, bEnd);
  return a.overlaps(b);
};

/**
 * Generates slots for a date using weekly availability + event duration.
 * Buffer before/after is applied around each candidate slot to avoid tight back-to-back meetings.
 */
const generateSlots = ({ date, timezone, availabilities, duration, bufferBefore = 0, bufferAfter = 0, bookings }) => {
  const requestedDate = DateTime.fromISO(date, { zone: timezone });
  if (!requestedDate.isValid) return [];

  const dayOfWeek = requestedDate.weekday % 7;

  const dayAvailability = availabilities.filter((a) => a.dayOfWeek === dayOfWeek);
  const slotDuration = duration;

  const slots = [];

  for (const availability of dayAvailability) {
    const intervalStart = parseDateAndTime({
      date,
      time: availability.startTime,
      timezone: availability.timezone,
    });

    const intervalEnd = parseDateAndTime({
      date,
      time: availability.endTime,
      timezone: availability.timezone,
    });

    if (!intervalStart || !intervalEnd || intervalStart >= intervalEnd) continue;

    let cursor = intervalStart;

    while (cursor.plus({ minutes: slotDuration }) <= intervalEnd) {
      const slotStart = cursor;
      const slotEnd = cursor.plus({ minutes: slotDuration });
      const guardedStart = slotStart.minus({ minutes: bufferBefore });
      const guardedEnd = slotEnd.plus({ minutes: bufferAfter });

      const slotConflicts = bookings.some((booking) => {
        const bookingStart = DateTime.fromJSDate(booking.startDateTime, { zone: 'utc' });
        const bookingEnd = DateTime.fromJSDate(booking.endDateTime, { zone: 'utc' });
        return overlaps(guardedStart.toUTC(), guardedEnd.toUTC(), bookingStart, bookingEnd);
      });

      if (!slotConflicts) {
        slots.push({
          startTime: slotStart.setZone(timezone).toFormat('HH:mm'),
          endTime: slotEnd.setZone(timezone).toFormat('HH:mm'),
          startDateTimeUtc: slotStart.toUTC().toISO(),
          endDateTimeUtc: slotEnd.toUTC().toISO(),
        });
      }

      cursor = cursor.plus({ minutes: slotDuration });
    }
  }

  return slots;
};

module.exports = {
  parseDateAndTime,
  overlaps,
  generateSlots,
};
