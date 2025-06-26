// ───────────────────────────────────────────────
// 📦 API Utility Functions – api.js
// ───────────────────────────────────────────────

const API_BASE = "/api";

/**
 * Helper to handle JSON responses and throw structured errors.
 */
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw {
      status: res.status,
      errors: data.errors || [data.error || "Server error"],
    };
  }
  return data;
}

/**
 * Simulates a login request to the backend.
 */
export function loginAdmin(email, password) {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

/**
 * Fetches a list of users from the backend.
 */
export function fetchUsers() {
  return fetch(`${API_BASE}/users`).then(handleResponse);
}

/**
 * Sends a new user object to the backend.
 */
export function submitUser(userData) {
  return fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then(handleResponse);
}

/**
 * Updates an existing user.
 */
export function updateUser(id, user) {
  return fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(handleResponse);
}

/**
 * Deletes a user by ID.
 */
export function deleteUser(id, isAdmin) {
  return fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAdmin }),
  }).then(handleResponse);
}

/**
 * Toggles user status.
 */
export function toggleStatus(id, status) {
  return fetch(`${API_BASE}/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(handleResponse);
}

/**
 * Resets server data back to preload state.
 */
export function resetData() {
  return fetch(`${API_BASE}/reset`, {
    method: "POST",
  }).then(handleResponse);
}
