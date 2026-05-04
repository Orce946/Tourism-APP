const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const path = require('path');
const fs = require('node:fs/promises');

const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/dashboard', (req, res) => {
  res.json({
    message: 'Admin dashboard access granted',
    user: req.user
  });
});

adminRouter.get('/status', (req, res) => {
  res.json({
    message: 'Admin route is protected and ready for CRUD endpoints'
  });
});

const destinationsPath = path.join(__dirname, '..', '..', '..', 'destinations.json');

async function readDestinations() {
  const raw = await fs.readFile(destinationsPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDestinations(data) {
  await fs.writeFile(destinationsPath, JSON.stringify(data, null, 2), 'utf8');
}

// List all divisions (same data file used by public routes)
adminRouter.get('/destinations', async (req, res) => {
  try {
    const list = await readDestinations();
    res.json({ data: list });
  } catch (error) {
    res.status(500).json({ message: 'Failed to read destinations' });
  }
});

// Create a new division
adminRouter.post('/destinations', async (req, res) => {
  const { id, name } = req.body || {};

  if (!id || !name) {
    return res.status(400).json({ message: 'id and name are required' });
  }

  try {
    const list = await readDestinations();
    if (list.find((d) => d.id === id)) {
      return res.status(409).json({ message: 'Division id already exists' });
    }

    const newDivision = { id, name, spots: [] };
    list.push(newDivision);
    await writeDestinations(list);
    res.status(201).json({ data: newDivision });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create division' });
  }
});

// Delete a division
adminRouter.delete('/destinations/:id', async (req, res) => {
  try {
    const list = await readDestinations();
    const idx = list.findIndex((d) => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Division not found' });
    const removed = list.splice(idx, 1)[0];
    await writeDestinations(list);
    res.json({ data: removed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete division' });
  }
});

// Add a spot to a division
adminRouter.post('/destinations/:id/spots', async (req, res) => {
  const spot = req.body || {};
  if (!spot.spot_name) {
    return res.status(400).json({ message: 'spot_name is required' });
  }

  try {
    const list = await readDestinations();
    const division = list.find((d) => d.id === req.params.id);
    if (!division) return res.status(404).json({ message: 'Division not found' });
    division.spots = division.spots || [];
    division.spots.push(spot);
    await writeDestinations(list);
    res.status(201).json({ data: spot });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add spot' });
  }
});

// Delete a spot by index
adminRouter.delete('/destinations/:id/spots/:index', async (req, res) => {
  try {
    const list = await readDestinations();
    const division = list.find((d) => d.id === req.params.id);
    if (!division) return res.status(404).json({ message: 'Division not found' });
    const idx = Number.parseInt(req.params.index, 10);
    if (!Number.isFinite(idx) || idx < 0 || idx >= (division.spots || []).length) {
      return res.status(400).json({ message: 'Invalid spot index' });
    }
    const removed = division.spots.splice(idx, 1)[0];
    await writeDestinations(list);
    res.json({ data: removed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete spot' });
  }
});

module.exports = { adminRouter };