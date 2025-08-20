const { v4: uuidv4 } = require('uuid');
const { initializeFirestoreIfConfigured } = require('./db');

const memory = {
  users: new Map(),
};

async function getCollection() {
  const db = initializeFirestoreIfConfigured();
  if (db) {
    return db.collection('users');
  }
  return null;
}

async function listUsers() {
  const col = await getCollection();
  if (col) {
    const snap = await col.orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return Array.from(memory.users.values());
}

async function createUser({ name, phone }) {
  const col = await getCollection();
  const now = Date.now();
  if (col) {
    const ref = await col.add({ name, phone, createdAt: now, updatedAt: now });
    return { id: ref.id, name, phone, createdAt: now, updatedAt: now };
  }
  const id = uuidv4();
  const user = { id, name, phone, createdAt: now, updatedAt: now };
  memory.users.set(id, user);
  return user;
}

async function updateUser(id, { name, phone }) {
  const col = await getCollection();
  const updates = { updatedAt: Date.now() };
  if (typeof name === 'string' && name.length) updates.name = name;
  if (typeof phone === 'string' && phone.length) updates.phone = phone;

  if (col) {
    const ref = col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    await ref.update(updates);
    const data = { id, ...doc.data(), ...updates };
    return data;
  }
  const existing = memory.users.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  memory.users.set(id, updated);
  return updated;
}

async function deleteUser(id) {
  const col = await getCollection();
  if (col) {
    const ref = col.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  }
  return memory.users.delete(id);
}

module.exports = {
  usersStore: { listUsers, createUser, updateUser, deleteUser },
};

