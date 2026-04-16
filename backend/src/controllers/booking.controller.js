const asyncHandler = require('../utils/asyncHandler');
const bookingService = require('../services/booking.service');
const { getDefaultUser } = require('../models/user.model');

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.create(req.validated);
  res.status(201).json({
    message: 'Booking confirmed',
    confirmation: {
      bookingId: booking.id,
      eventType: booking.eventType.title,
      startsAt: booking.startDateTime,
      endsAt: booking.endDateTime,
      attendee: booking.name,
      attendeeEmail: booking.email,
    },
  });
});

const getDashboard = asyncHandler(async (_req, res) => {
  const user = await getDefaultUser();
  const data = await bookingService.getDashboardBookings(user.id, _req.validated.scope);
  res.json({ data });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const cancelled = await bookingService.cancel(req.params.id);
  res.json({ message: 'Booking cancelled', data: cancelled });
});

const rescheduleBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.reschedule(req.params.id, req.validated);
  res.json({ message: 'Booking rescheduled', data: booking });
});

module.exports = {
  createBooking,
  getDashboard,
  cancelBooking,
  rescheduleBooking,
};
