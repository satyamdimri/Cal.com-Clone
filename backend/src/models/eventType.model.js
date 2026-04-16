const prisma = require('../config/prisma');

const createEventType = (data) => prisma.eventType.create({ data });
const getEventTypesByUser = (userId) => prisma.eventType.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
const getEventTypeById = (id) => prisma.eventType.findUnique({ where: { id } });
const getEventTypeBySlug = (slug) => prisma.eventType.findUnique({ where: { slug } });
const getEventTypeByUserAndSlug = (userId, slug) => prisma.eventType.findFirst({ where: { userId, slug } });
const updateEventType = (id, data) => prisma.eventType.update({ where: { id }, data });
const deleteEventType = (id) => prisma.eventType.delete({ where: { id } });

module.exports = {
  createEventType,
  getEventTypesByUser,
  getEventTypeById,
  getEventTypeBySlug,
  getEventTypeByUserAndSlug,
  updateEventType,
  deleteEventType,
};
