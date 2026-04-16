const express = require('express');
const eventTypeController = require('../controllers/eventType.controller');
const validate = require('../middlewares/validate');
const { eventTypeSchema } = require('../validations/eventType.validation');

const router = express.Router();

router.post('/', validate(eventTypeSchema), eventTypeController.createEventType);
router.get('/', eventTypeController.listEventTypes);
router.patch('/:id', validate(eventTypeSchema.partial()), eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);

module.exports = router;
