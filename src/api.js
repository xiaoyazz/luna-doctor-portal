// src/api.js
const API_BASE = "https://us-central1-fir-example-bd842.cloudfunctions.net/api";

// GET /users  -> list for dashboard
export async function fetchUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
    }
    const data = await res.json();
    return data.users; // Cloud Function returns { users: [...] }
}

// GET /users/:id  -> detail page
export async function fetchUserDetail(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch user ${userId}: ${res.status}`);
    }
    const data = await res.json();
    return data; // contains profile, metrics, risk, etc.
}
