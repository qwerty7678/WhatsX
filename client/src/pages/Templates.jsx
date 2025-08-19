import React, { useEffect, useState } from 'react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../lib/api.js';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTemplate(e) {
    e.preventDefault();
    if (!name || !content) return;
    const created = await createTemplate({ name, content });
    setTemplates((prev) => [created, ...prev]);
    setName('');
    setContent('');
  }

  async function saveTemplate(id, field, value) {
    const updated = await updateTemplate(id, { [field]: value });
    setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function removeTemplate(id) {
    await deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Templates</h2>
      <form onSubmit={addTemplate} className="bg-white border rounded p-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm">Name</label>
            <input className="border rounded px-3 py-2 w-full" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <button className="self-end bg-indigo-600 text-white px-4 py-2 rounded h-10">Add</button>
        </div>
        <div>
          <label className="block text-sm">Content</label>
          <textarea className="border rounded px-3 py-2 w-full" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white border rounded divide-y">
          {templates.length === 0 && <p className="p-4 text-gray-500">No templates</p>}
          {templates.map((t) => (
            <div key={t.id} className="p-4 space-y-3">
              <input
                className="border rounded px-3 py-2 w-full"
                defaultValue={t.name}
                onBlur={(e) => saveTemplate(t.id, 'name', e.target.value)}
              />
              <textarea
                className="border rounded px-3 py-2 w-full"
                defaultValue={t.content}
                rows={4}
                onBlur={(e) => saveTemplate(t.id, 'content', e.target.value)}
              />
              <div className="flex justify-end">
                <button className="text-red-600" onClick={() => removeTemplate(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

