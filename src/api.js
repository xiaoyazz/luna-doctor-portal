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

// GET /users/:id/doctor-notes
export async function fetchDoctorNotes(userId) {
    const res = await fetch(
        `${API_BASE}/users/${userId}/doctor-notes`
    );

    if (!res.ok) {
        throw new Error(
            `Failed to fetch doctor notes: ${res.status}`
        );
    }

    const data = await res.json();

    return data.notes || [];
}


// POST /users/:id/doctor-notes
export async function createDoctorNote(userId, text) {
    const res = await fetch(
        `${API_BASE}/users/${userId}/doctor-notes`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                text,
            }),
        }
    );

    if (!res.ok) {
        throw new Error(
            `Failed to create doctor note: ${res.status}`
        );
    }

    return res.json();
}


// PATCH /users/:id/doctor-notes/:noteId
export async function updateDoctorNote(
    userId,
    noteId,
    text
) {
    const res = await fetch(
        `${API_BASE}/users/${userId}/doctor-notes/${noteId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                text,
            }),
        }
    );

    if (!res.ok) {
        throw new Error(
            `Failed to update doctor note: ${res.status}`
        );
    }

    return res.json();
}


// DELETE /users/:id/doctor-notes/:noteId
export async function deleteDoctorNote(
    userId,
    noteId
) {
    const res = await fetch(
        `${API_BASE}/users/${userId}/doctor-notes/${noteId}`,
        {
            method: "DELETE",
        }
    );

    if (!res.ok) {
        throw new Error(
            `Failed to delete doctor note: ${res.status}`
        );
    }

    return res.json();
}