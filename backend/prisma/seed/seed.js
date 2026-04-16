require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'owner@calclone.dev' },
    update: {},
    create: {
      name: 'Default Owner',
      email: 'owner@calclone.dev',
      timezone: 'Asia/Kolkata',
    },
  });

  const event15 = await prisma.eventType.upsert({
    where: { slug: '15min-meeting' },
    update: {},
    create: {
      userId: user.id,
      title: '15 Min Meeting',
      description: 'Quick 15 minute catch-up',
      duration: 15,
      slug: '15min-meeting',
    },
  });

  const event30 = await prisma.eventType.upsert({
    where: { slug: '30min-meeting' },
    update: {},
    create: {
      userId: user.id,
      title: '30 Min Meeting',
      description: 'Standard 30 minute meeting',
      duration: 30,
      slug: '30min-meeting',
    },
  });

  await prisma.availability.deleteMany({ where: { userId: user.id } });

  await prisma.availability.createMany({
    data: [
      { userId: user.id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
      { userId: user.id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
      { userId: user.id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
      { userId: user.id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
      { userId: user.id, dayOfWeek: 5, startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' },
    ],
  });

  const now = new Date();
  const booking1Start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0, 0);
  const booking1End = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 15, 0);
  const booking2Start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 14, 0, 0);
  const booking2End = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 14, 30, 0);

  await prisma.booking.deleteMany({ where: { userId: user.id } });
  await prisma.booking.createMany({
    data: [
      {
        eventTypeId: event15.id,
        userId: user.id,
        date: new Date(booking1Start.getFullYear(), booking1Start.getMonth(), booking1Start.getDate()),
        startDateTime: booking1Start,
        endDateTime: booking1End,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        timezone: 'Asia/Kolkata',
      },
      {
        eventTypeId: event30.id,
        userId: user.id,
        date: new Date(booking2Start.getFullYear(), booking2Start.getMonth(), booking2Start.getDate()),
        startDateTime: booking2Start,
        endDateTime: booking2End,
        name: 'Bob Smith',
        email: 'bob@example.com',
        timezone: 'Asia/Kolkata',
      },
    ],
  });

  console.log('Seed complete', { userId: user.id, eventType15Id: event15.id, eventType30Id: event30.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
