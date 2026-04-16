const { DateTime } = require('luxon');
const AppError = require('../utils/AppError');
const eventTypeModel = require('../models/eventType.model');
const availabilityModel = require('../models/availability.model');
const bookingModel = require('../models/booking.model');
const { generateSlots } = require('../utils/time');

const getEventBySlug = async (slug) => {
  const event = await eventTypeModel.getEventTypeBySlug(slug);
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const getAvailableSlots = async ({ slug, date, timezone = 'UTC' }) => {
  const event = await getEventBySlug(slug);
  const availabilities = await availabilityModel.getAvailabilityByUser(event.userId);

  const dayStartUtc = DateTime.fromISO(date, { zone: timezone }).startOf('day').toUTC().toJSDate();
  const dayEndUtc = DateTime.fromISO(date, { zone: timezone }).endOf('day').toUTC().toJSDate();

  const bookings = await bookingModel.getBookingsForDay(event.userId, dayStartUtc, dayEndUtc);

  return {
    event,
    date,
    timezone,
    slots: generateSlots({
      date,
      timezone,
      availabilities,
      duration: event.duration,
      bufferBefore: event.bufferBefore,
      bufferAfter: event.bufferAfter,
      bookings,
    }),
  };
};

module.exports = {
  getEventBySlug,
  getAvailableSlots,
};
