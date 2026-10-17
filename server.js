const express = require('express');
const path = require('path');
const itemsRouter = require('./routes/items');
const analyticsRouter = require('./routes/analytics');
const usersRouter = require('./routes/users');
const { requestLogger } = require('./middleware/logger');
const { authCheck } = require('./middleware/auth');
const db = require('./db/store');

const app = express();
const PORT = process.env.PORT || 4100;

app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

// Seed data
db.seed();

// API routes
app.use('/api/items', authCheck, itemsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/items', (req, res) => res.sendFile(path.join(__dirname, 'public', 'items.html')));
app.get('/analytics', (req, res) => res.sendFile(path.join(__dirname, 'public', 'analytics.html')));

// Intentional error route for testing
app.get('/api/health', (req, res) => {
  if (req.query.deep === 'true') {
    return res.status(500).json({ error: 'Internal service failure', code: 'HEALTH_DEGRADED' });
  }
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Local:   http://localhost:${PORT}/`);
});
