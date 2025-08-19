const { v4: uuidv4 } = require('uuid');
const { initializeFirestoreIfConfigured } = require('./db');

const memory = {
  templates: new Map(),
};

async function getCollection() {
  const db = initializeFirestoreIfConfigured();
  if (db) {
    return db.collection('templates');
  }
  return null;
}

async function listTemplates() {
  const col = await getCollection();
  if (col) {
    const snap = await col.orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Array.from(memory.templates.values());
}

async function createTemplate({ name, content }) {
  const col = await getCollection();
  const now = Date.now();
  if (col) {
    const ref = await col.add({ name, content, createdAt: now, updatedAt: now });
    return { id: ref.id, name, content, createdAt: now, updatedAt: now };
  }
  const id = uuidv4();
  const template = { id, name, content, createdAt: now, updatedAt: now };
  memory.templates.set(id, template);
  return template;
}

async function updateTemplate(id, { name, content }) {
  const col = await getCollection();
  const updates = { updatedAt: Date.now() };
  if (typeof name === 'string' && name.length) updates.name = name;
  if (typeof content === 'string' && content.length) updates.content = content;

  if (col) {
    const ref = col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update(updates);
    const data = { id, ...doc.data(), ...updates };
    return data;
  }
  const existing = memory.templates.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  memory.templates.set(id, updated);
  return updated;
}

async function deleteTemplate(id) {
  const col = await getCollection();
  if (col) {
    const ref = col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  }
  return memory.templates.delete(id);
}

module.exports = {
  templatesStore: { listTemplates, createTemplate, updateTemplate, deleteTemplate },
};

