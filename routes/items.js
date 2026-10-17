const express = require('express');
const router = express.Router();
const db = require('../db/store');

router.get('/', (req, res) => {
  const { page = 1, limit = 20, category, sort } = req.query;
  const items = db.getItems({ page: +page, limit: +limit, category, sort });
  res.json({ items, total: db.itemCount(category), page: +page });
});

router.get('/:id', (req, res) => {
  const item = db.getItem(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'Name and category required' });
  const item = db.createItem({ name, category, price: price || 0 });
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const updated = db.updateItem(req.params.id, { ...req.body });
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  res.json(updated);
});

// DELETE with 204 (standard REST)
router.delete('/:id', (req, res) => {
  const deleted = db.deleteItem(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Item not found' });
  res.status(204).end();
});

// DELETE with 200 (explicit body for capture testing)
router.delete('/:id/confirm', (req, res) => {
  const deleted = db.deleteItem(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Item not found' });
  res.status(200).json({ deleted: true, id: req.params.id });
});

module.exports = router;
