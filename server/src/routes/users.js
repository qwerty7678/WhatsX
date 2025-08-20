const express = require('express');
const { authMiddleware } = require('./auth');
const { usersStore } = require('../stores/usersStore');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const users = await usersStore.listUsers();
  return res.json(users);
});

router.post('/', async (req, res) => {
  const { name, phone } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }
  const created = await usersStore.createUser({ name, phone });
  return res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body || {};
  const updated = await usersStore.updateUser(id, { name, phone });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const ok = await usersStore.deleteUser(id);
  if (!ok) return res.status(404).json({ error: 'User not found' });
  return res.json({ ok: true });
});

module.exports = { usersRouter: router };

