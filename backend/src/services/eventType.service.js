const AppError = require('../utils/AppError');
const eventTypeModel = require('../models/eventType.model');

const create = async (payload, userId) => {
  const slugOwner = await eventTypeModel.getEventTypeByUserAndSlug(userId, payload.slug);
  if (slugOwner) {
    throw new AppError('Slug already exists. Please choose a unique slug.', 409);
  }
  return eventTypeModel.createEventType({ ...payload, userId });
};

const list = async (userId) => eventTypeModel.getEventTypesByUser(userId);

const update = async (id, payload) => {
  const existing = await eventTypeModel.getEventTypeById(id);
  if (!existing) throw new AppError('Event type not found', 404);

  if (payload.slug && payload.slug !== existing.slug) {
    const slugOwner = await eventTypeModel.getEventTypeByUserAndSlug(existing.userId, payload.slug);
    if (slugOwner && slugOwner.id !== existing.id) {
      throw new AppError('Slug already exists. Please choose a unique slug.', 409);
    }
  }

  return eventTypeModel.updateEventType(id, payload);
};

const remove = async (id) => {
  const existing = await eventTypeModel.getEventTypeById(id);
  if (!existing) throw new AppError('Event type not found', 404);
  await eventTypeModel.deleteEventType(id);
};

module.exports = {
  create,
  list,
  update,
  remove,
};
