import React from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Users from './Users.jsx';
import Templates from './Templates.jsx';
import Compose from './Compose.jsx';

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">WhatsX Advanced</h1>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}>Users</NavLink>
            <NavLink to="/templates" className={({ isActive }) => isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}>Templates</NavLink>
            <NavLink to="/compose" className={({ isActive }) => isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}>Compose</NavLink>
            <button onClick={logout} className="ml-4 text-sm text-red-600">Logout</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/compose" element={<Compose />} />
        </Routes>
      </main>
    </div>
  );
}

