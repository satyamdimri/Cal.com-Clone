const { z } = require('zod');

const eventTypeSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  duration: z.number().int().positive(),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  bufferBefore: z.number().int().min(0).max(120).optional(),
  bufferAfter: z.number().int().min(0).max(120).optional(),
});

module.exports = { eventTypeSchema };
