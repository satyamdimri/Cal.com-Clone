const asyncHandler = require('../utils/asyncHandler');
const publicService = require('../services/public.service');

const getEventBySlug = asyncHandler(async (req, res) => {
  const event = await publicService.getEventBySlug(req.params.slug);
  res.json({ data: event });
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const result = await publicService.getAvailableSlots({
    slug: req.params.slug,
    date: req.query.date,
    timezone: req.query.timezone,
  });

  res.json({ data: result });
});

module.exports = {
  getEventBySlug,
  getAvailableSlots,
};
