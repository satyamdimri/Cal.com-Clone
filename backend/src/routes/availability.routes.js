const express = require('express');
const { z } = require('zod');
const availabilityController = require('../controllers/availability.controller');
const validate = require('../middlewares/validate');
const { setWeeklyAvailabilitySchema } = require('../validations/availability.validation');

const router = express.Router();
const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventTypeId: z.string().min(1),
  timezone: z.string().optional(),
});

router.put('/', validate(setWeeklyAvailabilitySchema), availabilityController.setWeeklyAvailability);
router.post('/', validate(setWeeklyAvailabilitySchema), availabilityController.setWeeklyAvailability);
router.get('/', availabilityController.getAvailability);
router.get('/slots', validate(slotsQuerySchema, 'query'), availabilityController.getAvailabilitySlots);

module.exports = router;
