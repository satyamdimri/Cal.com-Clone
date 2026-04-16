const express = require('express');
const cors = require('cors');
const eventTypeRoutes = require('./routes/eventType.routes');
const availabilityRoutes = require('./routes/availability.routes');
const bookingRoutes = require('./routes/booking.routes');
const publicRoutes = require('./routes/public.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow deployed frontend origin and non-browser requests.
      const isVercelOrigin = origin === 'https://cal-com-clone-sooty.vercel.app';
      if (!origin || isVercelOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/event-types', eventTypeRoutes);
// Compatibility route for simple health/manual verification.
app.use('/event-types', eventTypeRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/api/public', publicRoutes);

app.use((req, _res, next) => {
  next({ statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;
