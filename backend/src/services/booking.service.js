const { DateTime } = require('luxon');
const AppError = require('../utils/AppError');
const bookingModel = require('../models/booking.model');
const eventTypeModel = require('../models/eventType.model');
const { parseDateAndTime } = require('../utils/time');

const validateBookingWindow = async ({ userId, startDateTimeUtc, endDateTimeUtc, excludeBookingId }) => {
  const conflicts = await bookingModel.getConflictingBookings(
    userId,
    startDateTimeUtc.toJSDate(),
    endDateTimeUtc.toJSDate(),
    excludeBookingId
  );

  if (conflicts.length > 0) {
    throw new AppError('Requested slot overlaps with an existing booking', 409);
  }
};

const create = async (payload) => {
  const eventType = await eventTypeModel.getEventTypeById(payload.eventTypeId);
  if (!eventType) throw new AppError('Event type not found', 404);

  const start = parseDateAndTime({ date: payload.date, time: payload.startTime, timezone: payload.timezone });
  const end = parseDateAndTime({ date: payload.date, time: payload.endTime, timezone: payload.timezone });

  if (!start || !end || start >= end) throw new AppError('Invalid booking time range', 400);

  const durationMins = end.diff(start, 'minutes').minutes;
  if (durationMins !== eventType.duration) {
    throw new AppError(`Booking must exactly match event duration of ${eventType.duration} minutes`, 400);
  }

  const startUtc = start.toUTC();
  const endUtc = end.toUTC();

  // Explicit event-slot check before overlap validation for clearer user feedback.
  const exactSlot = await bookingModel.getExactEventSlotBooking(
    eventType.id,
    startUtc.toJSDate(),
    endUtc.toJSDate()
  );
  if (exactSlot) {
    throw new AppError('This time slot is already booked for the selected event type', 409);
  }

  await validateBookingWindow({ userId: eventType.userId, startDateTimeUtc: startUtc, endDateTimeUtc: endUtc });

  return bookingModel.createBooking({
    eventTypeId: eventType.id,
    userId: eventType.userId,
    date: DateTime.fromISO(payload.date, { zone: payload.timezone }).startOf('day').toUTC().toJSDate(),
    startDateTime: startUtc.toJSDate(),
    endDateTime: endUtc.toJSDate(),
    name: payload.name,
    email: payload.email,
    timezone: payload.timezone,
  });
};

const getDashboardBookings = async (userId, scope = 'all') => {
  const now = new Date();
  if (scope === 'upcoming') {
    const upcoming = await bookingModel.getBookingsByUserAndRange(userId, { gte: now });
    return { upcoming, past: [] };
  }
  if (scope === 'past') {
    const past = await bookingModel.getBookingsByUserAndRange(userId, { lt: now });
    return { upcoming: [], past };
  }

  const [upcoming, past] = await Promise.all([
    bookingModel.getBookingsByUserAndRange(userId, { gte: now }),
    bookingModel.getBookingsByUserAndRange(userId, { lt: now }),
  ]);
  return { upcoming, past };
};

const cancel = async (id) => {
  const booking = await bookingModel.getBookingById(id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status === 'CANCELLED') throw new AppError('Booking is already cancelled', 400);

  return bookingModel.cancelBooking(id);
};

const reschedule = async (id, payload) => {
  const booking = await bookingModel.getBookingById(id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status === 'CANCELLED') throw new AppError('Cannot reschedule a cancelled booking', 400);

  const start = parseDateAndTime({ date: payload.date, time: payload.startTime, timezone: payload.timezone });
  const end = parseDateAndTime({ date: payload.date, time: payload.endTime, timezone: payload.timezone });

  if (!start || !end || start >= end) {
    throw new AppError('Invalid booking time range', 400);
  }

  const startUtc = start.toUTC();
  const endUtc = end.toUTC();

  await validateBookingWindow({
    userId: booking.userId,
    startDateTimeUtc: startUtc,
    endDateTimeUtc: endUtc,
    excludeBookingId: booking.id,
  });

  await bookingModel.cancelBooking(id);

  return bookingModel.createBooking({
    eventTypeId: booking.eventTypeId,
    userId: booking.userId,
    date: DateTime.fromISO(payload.date, { zone: payload.timezone }).startOf('day').toUTC().toJSDate(),
    startDateTime: startUtc.toJSDate(),
    endDateTime: endUtc.toJSDate(),
    name: booking.name,
    email: booking.email,
    timezone: payload.timezone,
    rescheduledFromId: booking.id,
  });
};

module.exports = {
  create,
  getDashboardBookings,
  cancel,
  reschedule,
};
