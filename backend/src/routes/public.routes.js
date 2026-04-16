const express = require('express');
const { z } = require('zod');
const publicController = require('../controllers/public.controller');
const validate = require('../middlewares/validate');

const slotQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string().optional(),
});

const router = express.Router();

router.get('/events/:slug', publicController.getEventBySlug);
router.get('/events/:slug/slots', validate(slotQuerySchema, 'query'), publicController.getAvailableSlots);

module.exports = router;
