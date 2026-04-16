const prisma = require('../config/prisma');

const createBooking = (data) => prisma.booking.create({ data, include: { eventType: true } });

const getBookingById = (id) => prisma.booking.findUnique({ where: { id }, include: { eventType: true } });

const getBookingsByUserAndRange = (userId, comparator) =>
  prisma.booking.findMany({
    where: {
      userId,
      status: 'BOOKED',
      startDateTime: comparator,
    },
    include: { eventType: true },
    orderBy: { startDateTime: 'asc' },
  });

const cancelBooking = (id) =>
  prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  });

const getConflictingBookings = (userId, startDateTime, endDateTime, excludeBookingId) =>
  prisma.booking.findMany({
    where: {
      userId,
      status: 'BOOKED',
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      startDateTime: { lt: endDateTime },
      endDateTime: { gt: startDateTime },
    },
  });

const getExactEventSlotBooking = (eventTypeId, startDateTime, endDateTime) =>
  prisma.booking.findFirst({
    where: {
      eventTypeId,
      startDateTime,
      endDateTime,
      status: 'BOOKED',
    },
  });

const getBookingsForDay = (userId, dayStartUtc, dayEndUtc) =>
  prisma.booking.findMany({
    where: {
      userId,
      status: 'BOOKED',
      startDateTime: { gte: dayStartUtc, lt: dayEndUtc },
    },
  });

module.exports = {
  createBooking,
  getBookingById,
  getBookingsByUserAndRange,
  cancelBooking,
  getConflictingBookings,
  getExactEventSlotBooking,
  getBookingsForDay,
};
