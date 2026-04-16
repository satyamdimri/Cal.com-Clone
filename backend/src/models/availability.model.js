const prisma = require('../config/prisma');

const replaceWeeklyAvailability = async (userId, items) => {
  await prisma.availability.deleteMany({ where: { userId } });

  return prisma.availability.createMany({
    data: items.map((item) => ({ ...item, userId })),
  });
};

const getAvailabilityByUser = (userId) =>
  prisma.availability.findMany({
    where: { userId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

module.exports = {
  replaceWeeklyAvailability,
  getAvailabilityByUser,
};
