const AppError = require('../utils/AppError');
const availabilityModel = require('../models/availability.model');
const eventTypeModel = require('../models/eventType.model');
const bookingModel = require('../models/booking.model');
const { DateTime } = require('luxon');
const { generateSlots } = require('../utils/time');

const setWeeklyAvailability = async (userId, items) => {
  const hasInvalidRange = items.some((item) => item.startTime >= item.endTime);
  if (hasInvalidRange) {
    throw new AppError('startTime must be before endTime for every availability interval', 400);
  }

  await availabilityModel.replaceWeeklyAvailability(userId, items);
  return availabilityModel.getAvailabilityByUser(userId);
};

const getAvailability = async (userId) => availabilityModel.getAvailabilityByUser(userId);

const getSlotsByEventTypeId = async ({ date, eventTypeId, timezone }) => {
  const eventType = await eventTypeModel.getEventTypeById(eventTypeId);
  if (!eventType) throw new AppError('Event type not found', 404);

  const safeTimezone = timezone || 'UTC';
  const availabilities = await availabilityModel.getAvailabilityByUser(eventType.userId);

  const dayStartUtc = DateTime.fromISO(date, { zone: safeTimezone }).startOf('day').toUTC().toJSDate();
  const dayEndUtc = DateTime.fromISO(date, { zone: safeTimezone }).endOf('day').toUTC().toJSDate();
  const bookings = await bookingModel.getBookingsForDay(eventType.userId, dayStartUtc, dayEndUtc);

  return {
    eventTypeId: eventType.id,
    date,
    timezone: safeTimezone,
    slots: generateSlots({
      date,
      timezone: safeTimezone,
      availabilities,
      duration: eventType.duration,
      bufferBefore: eventType.bufferBefore,
      bufferAfter: eventType.bufferAfter,
      bookings,
    }),
  };
};

module.exports = {
  setWeeklyAvailability,
  getAvailability,
  getSlotsByEventTypeId,
};
