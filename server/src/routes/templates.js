const express = require('express');
const { authMiddleware } = require('./auth');
const { templatesStore } = require('../stores/templatesStore');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const templates = await templatesStore.listTemplates();
  return res.json(templates);
});

router.post('/', async (req, res) => {
  const { name, content } = req.body || {};
  if (!name || !content) {
    return res.status(400).json({ error: 'name and content are required' });
  }
  const created = await templatesStore.createTemplate({ name, content });
  return res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body || {};
  const updated = await templatesStore.updateTemplate(id, { name, content });
  if (!updated) return res.status(404).json({ error: 'Template not found' });
  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const ok = await templatesStore.deleteTemplate(id);
  if (!ok) return res.status(404).json({ error: 'Template not found' });
  return res.json({ ok: true });
});

module.exports = { templatesRouter: router };

