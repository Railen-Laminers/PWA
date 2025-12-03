// src/utils/api.js
const API_BASE = 'http://localhost:5000/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth
export const register = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
};

export const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
};

// ===== TASKS =====
export const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/tasks`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
};

export const createTask = async (title, description = '') => {
    const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
};

export const updateTask = async (id, updates) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
};

export const deleteTask = async (id) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return await res.json();
};