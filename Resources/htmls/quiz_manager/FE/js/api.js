// api.js

// Configuration — adjust as needed or move into env/config module
const API_CONFIG = {
  baseUrl: "http://127.0.0.1:3000",
  timeout: 10000,           // ms before abort
  defaultHeaders: {
    "Content-Type": "application/json"
  }
};

// Custom error so callers can inspect status/path/body
export class ApiError extends Error {
  constructor(message, { status, path, body }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.body = body;
  }
}

/**
 * Core request helper
 * @param {string} path    — endpoint path (e.g. "/api/quizzes")
 * @param {object} opts    — options: method, body, query (object), headers
 * @returns {Promise<any>}  — parsed JSON response
 * @throws {ApiError}      — on network/fetch errors or non-OK status
 */
async function request(path, {
  method = "GET",
  body = null,
  query = null,
  headers = {}
} = {}) {
  // build URL with query string
  let url = API_CONFIG.baseUrl + path;
  if (query && typeof query === "object") {
    const qs = new URLSearchParams(query).toString();
    url += `?${qs}`;
  }

  // setup timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const res = await fetch(url, {
      method,
      headers: { ...API_CONFIG.defaultHeaders, ...headers },
      credentials: "include",
      signal: controller.signal,
      body: body != null
        ? headers["Content-Type"] === "application/json"
          ? JSON.stringify(body)
          : body // allows FormData, etc.
        : undefined
    });

    let parsed = null;
    const ct = res.headers.get("Content-Type") || "";
    if (ct.includes("application/json")) {
      parsed = await res.json();
    } else {
      parsed = await res.text(); // fallback
    }

    if (!res.ok) {
      const errMsg = parsed && parsed.error
        ? parsed.error
        : `Request failed (${res.status})`;
      throw new ApiError(errMsg, { status: res.status, path, body: parsed });
    }

    return parsed;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError(`Request timed out after ${API_CONFIG.timeout}ms`, {
        status: 0, path, body: null
      });
    }
    if (err instanceof ApiError) {
      throw err;
    }
    // network-level or other unexpected error
    throw new ApiError(err.message, { status: 0, path, body: null });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Thin wrappers for convenience
export const apiGet    = (path,  query) => request(path, { method: "GET",  query });
export const apiPost   = (path,  body)  => request(path, { method: "POST", body, headers: { "Content-Type": "application/json"} });
export const apiPut    = (path,  body)  => request(path, { method: "PUT",  body, headers: { "Content-Type": "application/json"} });
export const apiDelete = (path)         => request(path, { method: "DELETE" });
