const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

const publicRouter = express.Router();
const destinationsPath = path.join(__dirname, '..', '..', '..', 'destinations.json');

async function readDestinations() {
  const file = await import('node:fs/promises');
  const raw = await file.readFile(destinationsPath, 'utf8');
  return JSON.parse(raw);
}

publicRouter.get('/divisions', async (req, res) => {
  try {
    const divisions = await readDestinations();
    res.json({ data: divisions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load divisions' });
  }
});

publicRouter.get('/divisions/:id', async (req, res) => {
  try {
    const divisions = await readDestinations();
    const division = divisions.find((item) => item.id === req.params.id);

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json({ data: division });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load division' });
  }
});

publicRouter.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { publicRouter };