import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../lib/api.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addUser(e) {
    e.preventDefault();
    if (!name || !phone) return;
    const newUser = await createUser({ name, phone });
    setUsers((prev) => [newUser, ...prev]);
    setName('');
    setPhone('');
  }

  async function saveUser(id, field, value) {
    const updated = await updateUser(id, { [field]: value });
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }

  async function removeUser(id) {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Users</h2>
      <form onSubmit={addUser} className="bg-white border rounded p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm">Name</label>
          <input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input className="border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white border rounded divide-y">
          {users.length === 0 && <p className="p-4 text-gray-500">No users</p>}
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center gap-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                defaultValue={u.name}
                onBlur={(e) => saveUser(u.id, 'name', e.target.value)}
              />
              <input
                className="border rounded px-3 py-2 flex-1"
                defaultValue={u.phone}
                onBlur={(e) => saveUser(u.id, 'phone', e.target.value)}
              />
              <button className="text-red-600" onClick={() => removeUser(u.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

