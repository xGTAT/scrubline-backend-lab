const express = require('express');
const router = express.Router();
const db = require('../db/store');

router.get('/summary', (req, res) => {
  const stats = db.getAnalytics();
  res.json(stats);
});

router.get('/trends', (req, res) => {
  const { period = '7d' } = req.query;
  res.json(db.getTrends(period));
});

router.get('/breakdown/:category', (req, res) => {
  const data = db.getCategoryBreakdown(req.params.category);
  if (!data) return res.status(404).json({ error: 'Category not found' });
  res.json(data);
});

module.exports = router;
