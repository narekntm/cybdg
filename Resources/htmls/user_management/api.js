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
