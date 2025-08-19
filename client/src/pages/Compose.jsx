import React, { useEffect, useMemo, useState } from 'react';
import { getTemplates, deduplicate } from '../lib/api.js';

export default function Compose() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [message, setMessage] = useState('');
  const [contactsInput, setContactsInput] = useState('');
  const [defaultCountryCode, setDefaultCountryCode] = useState('');
  const [dedupResult, setDedupResult] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getTemplates();
      setTemplates(data);
    })();
  }, []);

  const selectedTemplate = useMemo(() => templates.find((t) => t.id === selectedTemplateId), [templates, selectedTemplateId]);

  useEffect(() => {
    if (selectedTemplate) {
      setMessage(selectedTemplate.content);
    }
  }, [selectedTemplateId]);

  function parseContacts() {
    return contactsInput
      .split(/\r?\n|,|;|\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function runDedup() {
    const contacts = parseContacts();
    if (contacts.length === 0) {
      setDedupResult({ uniqueContacts: [], duplicates: {} });
      return;
    }
    const result = await deduplicate(contacts, defaultCountryCode);
    setDedupResult(result);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Compose</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded p-4 space-y-4">
          <div>
            <label className="block text-sm">Template</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="">Choose a template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">Message (editable)</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
          </div>
        </div>
        <div className="bg-white border rounded p-4 space-y-4">
          <div>
            <label className="block text-sm">Contacts (paste numbers, any separators)</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              rows={8}
              value={contactsInput}
              onChange={(e) => setContactsInput(e.target.value)}
              placeholder={"e.g.\n+15551234567\n0422123456\n+92 300 1234567"}
            />
          </div>
          <div>
            <label className="block text-sm">Default country code (digits only, optional)</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={defaultCountryCode}
              onChange={(e) => setDefaultCountryCode(e.target.value)}
              placeholder="1 for US, 92 for PK, etc"
            />
          </div>
          <button onClick={runDedup} className="bg-indigo-600 text-white px-4 py-2 rounded">Deduplicate</button>
        </div>
      </div>

      {dedupResult && (
        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-2">Deduplication Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-1">Unique Contacts ({dedupResult.uniqueContacts.length})</h4>
              <div className="text-sm text-gray-800 whitespace-pre-wrap break-words bg-gray-50 rounded p-2">
                {dedupResult.uniqueContacts.join('\n') || '—'}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">Duplicates</h4>
              {Object.keys(dedupResult.duplicates).length === 0 ? (
                <p className="text-sm text-gray-500">None</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {Object.entries(dedupResult.duplicates).map(([normalized, originals]) => (
                    <div key={normalized} className="bg-gray-50 rounded p-2">
                      <div className="font-mono text-xs text-gray-600">{normalized}</div>
                      <div className="text-gray-800">{originals.join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

