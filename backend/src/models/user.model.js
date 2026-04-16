const prisma = require('../config/prisma');

const DEFAULT_USER_EMAIL = 'owner@calclone.dev';

const getDefaultUser = async () => {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (user) return user;

  return prisma.user.create({
    data: {
      name: 'Default Owner',
      email: DEFAULT_USER_EMAIL,
      timezone: 'UTC',
    },
  });
};

module.exports = {
  getDefaultUser,
};
