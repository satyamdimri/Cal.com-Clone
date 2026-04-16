const { z } = require('zod');

const createBookingSchema = z.object({
  eventTypeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  timezone: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email(),
});

const rescheduleBookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  timezone: z.string().min(1),
});

module.exports = { createBookingSchema, rescheduleBookingSchema };
