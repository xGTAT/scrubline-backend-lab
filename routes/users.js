const express = require('express');
const router = express.Router();
const db = require('../db/store');

router.get('/profile', (req, res) => {
  res.json(db.getProfile());
});

router.get('/activity', (req, res) => {
  res.json(db.getActivity());
});

module.exports = router;
