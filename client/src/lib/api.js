import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers() {
  const res = await axios.get(`${API_BASE}/users`, { headers: authHeaders() });
  return res.data;
}

export async function createUser(payload) {
  const res = await axios.post(`${API_BASE}/users`, payload, { headers: authHeaders() });
  return res.data;
}

export async function updateUser(id, payload) {
  const res = await axios.put(`${API_BASE}/users/${id}`, payload, { headers: authHeaders() });
  return res.data;
}

export async function deleteUser(id) {
  const res = await axios.delete(`${API_BASE}/users/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function getTemplates() {
  const res = await axios.get(`${API_BASE}/templates`, { headers: authHeaders() });
  return res.data;
}

export async function createTemplate(payload) {
  const res = await axios.post(`${API_BASE}/templates`, payload, { headers: authHeaders() });
  return res.data;
}

export async function updateTemplate(id, payload) {
  const res = await axios.put(`${API_BASE}/templates/${id}`, payload, { headers: authHeaders() });
  return res.data;
}

export async function deleteTemplate(id) {
  const res = await axios.delete(`${API_BASE}/templates/${id}`, { headers: authHeaders() });
  return res.data;
}

export async function deduplicate(contacts, defaultCountryCode) {
  const res = await axios.post(
    `${API_BASE}/utils/deduplicate`,
    { contacts, defaultCountryCode },
    { headers: authHeaders() }
  );
  return res.data;
}

