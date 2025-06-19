// ───────────────────────────────────────────────
// 📦 API Utility Functions – api.js
// ───────────────────────────────────────────────

const API_BASE = "/api";

/**
 * Simulates a login request to the backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean }>}
 */
export function loginAdmin(email, password) {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
}

/**
 * Fetches a list of users from the backend.
 * @returns {Promise<Array>}
 */
export function fetchUsers() {
  return fetch(`${API_BASE}/users`)
    .then((res) => res.json());
}

/**
 * Sends a new user object to the backend.
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export function submitUser(userData) {
  return fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then((res) => res.json());
}

export function updateUser(id, user) {
  return fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then((res) => res.json());
}

export function deleteUser(id, isAdmin) {
  return fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAdmin }),
  }).then((res) => res.json());
}

export function toggleStatus(id, status) {
  return fetch(`${API_BASE}/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then((res) => res.json());
}

/**
 * Resets server data back to preload state.
 */
export function resetData() {
  return fetch(`${API_BASE}/reset`, {
    method: "POST",
  }).then((res) => res.json());
}
