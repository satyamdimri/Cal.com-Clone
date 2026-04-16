const express = require('express');
const { z } = require('zod');
const bookingController = require('../controllers/booking.controller');
const validate = require('../middlewares/validate');
const { createBookingSchema, rescheduleBookingSchema } = require('../validations/booking.validation');

const dashboardQuerySchema = z.object({
  scope: z.enum(['upcoming', 'past', 'all']).optional(),
});

const router = express.Router();

router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.get('/dashboard', validate(dashboardQuerySchema, 'query'), bookingController.getDashboard);
router.patch('/:id/cancel', bookingController.cancelBooking);
router.delete('/:id', bookingController.cancelBooking);
router.patch('/:id/reschedule', validate(rescheduleBookingSchema), bookingController.rescheduleBooking);

module.exports = router;
