require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
