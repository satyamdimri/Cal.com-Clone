const { z } = require('zod');

const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  timezone: z.string().min(1),
});

const setWeeklyAvailabilitySchema = z.object({
  items: z.array(availabilitySchema).min(1),
});

module.exports = { setWeeklyAvailabilitySchema };
