const asyncHandler = require('../utils/asyncHandler');
const eventTypeService = require('../services/eventType.service');
const { getDefaultUser } = require('../models/user.model');

const createEventType = asyncHandler(async (req, res) => {
  const user = await getDefaultUser();
  const eventType = await eventTypeService.create(req.validated, user.id);
  res.status(201).json({ message: 'Event type created', data: eventType });
});

const listEventTypes = asyncHandler(async (_req, res) => {
  const user = await getDefaultUser();
  const eventTypes = await eventTypeService.list(user.id);
  res.json({ data: eventTypes });
});

const updateEventType = asyncHandler(async (req, res) => {
  const updated = await eventTypeService.update(req.params.id, req.validated);
  res.json({ message: 'Event type updated', data: updated });
});

const deleteEventType = asyncHandler(async (req, res) => {
  await eventTypeService.remove(req.params.id);
  res.status(204).send();
});

module.exports = {
  createEventType,
  listEventTypes,
  updateEventType,
  deleteEventType,
};
