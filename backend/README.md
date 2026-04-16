# Cal.com-like Scheduling Backend

Production-ready backend API using Node.js, Express, PostgreSQL and Prisma.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install deps:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed sample data:
   - `npm run prisma:seed`
6. Start API:
   - `npm run dev`

## API Base

- `GET /health`
- `POST /api/event-types`
- `GET /api/event-types`
- `PATCH /api/event-types/:id`
- `DELETE /api/event-types/:id`
- `PUT /api/availability`
- `GET /api/availability`
- `POST /api/bookings`
- `GET /api/bookings/dashboard?scope=upcoming|past|all`
- `PATCH /api/bookings/:id/cancel`
- `PATCH /api/bookings/:id/reschedule`
- `GET /api/public/events/:slug`
- `GET /api/public/events/:slug/slots?date=YYYY-MM-DD&timezone=Asia/Kolkata`
