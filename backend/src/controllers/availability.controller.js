const asyncHandler = require('../utils/asyncHandler');
const availabilityService = require('../services/availability.service');
const { getDefaultUser } = require('../models/user.model');

const setWeeklyAvailability = asyncHandler(async (req, res) => {
  const user = await getDefaultUser();
  const availability = await availabilityService.setWeeklyAvailability(user.id, req.validated.items);
  res.json({ message: 'Availability updated', data: availability });
});

const getAvailability = asyncHandler(async (_req, res) => {
  const user = await getDefaultUser();
  const availability = await availabilityService.getAvailability(user.id);
  res.json({ data: availability });
});

const getAvailabilitySlots = asyncHandler(async (req, res) => {
  const result = await availabilityService.getSlotsByEventTypeId({
    date: req.query.date,
    eventTypeId: req.query.eventTypeId,
    timezone: req.query.timezone,
  });
  res.json({ data: result });
});

module.exports = {
  setWeeklyAvailability,
  getAvailability,
  getAvailabilitySlots,
};
