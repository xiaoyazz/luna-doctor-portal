// src/api.js
const API_BASE =
    "http://127.0.0.1:5001/lunacare-d181e/us-central1/api"; // use this emulator URL for local development because firebase functions deployment uses pay as-you-go plan and can be expensive for testing. For production, use the deployed URL.
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
