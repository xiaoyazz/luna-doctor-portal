// src/api.js

import { auth } from "./firebase";

const API_BASE =
    "https://us-central1-newlunacare.cloudfunctions.net/api";


// ======================================================
// Authentication Helper
// ======================================================

async function getAuthHeaders() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "You must be logged in to access the doctor portal."
        );
    }

    const token =
        await user.getIdToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


// ======================================================
// Current Doctor
// GET /me
// ======================================================

export async function fetchCurrentDoctor() {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/me`,
            {
                headers,
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to fetch doctor profile: ${res.status}`
        );
    }

    const data =
        await res.json();

    return data.doctor;
}


// ======================================================
// Dashboard Patients
// GET /users
//
// Backend now returns only patients assigned
// to the logged-in doctor.
// ======================================================

export async function fetchUsers() {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users`,
            {
                headers,
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to fetch users: ${res.status}`
        );
    }

    const data =
        await res.json();

    return data.users || [];
}


// ======================================================
// Patient Detail
// GET /users/:id
// ======================================================

export async function fetchUserDetail(
    userId
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}`,
            {
                headers,
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to fetch user ${userId}: ${res.status}`
        );
    }

    return res.json();
}


// ======================================================
// Doctor Notes
// ======================================================


// ------------------------------------------------------
// GET /users/:id/doctor-notes
// ------------------------------------------------------

export async function fetchDoctorNotes(
    userId
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}/doctor-notes`,
            {
                headers,
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to fetch doctor notes: ${res.status}`
        );
    }

    const data =
        await res.json();

    return data.notes || [];
}


// ------------------------------------------------------
// POST /users/:id/doctor-notes
// ------------------------------------------------------

export async function createDoctorNote(
    userId,
    text
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}/doctor-notes`,
            {
                method: "POST",

                headers,

                body: JSON.stringify({
                    text,
                }),
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to create doctor note: ${res.status}`
        );
    }

    return res.json();
}


// ------------------------------------------------------
// PATCH /users/:id/doctor-notes/:noteId
// ------------------------------------------------------

export async function updateDoctorNote(
    userId,
    noteId,
    text
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}/doctor-notes/${noteId}`,
            {
                method: "PATCH",

                headers,

                body: JSON.stringify({
                    text,
                }),
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to update doctor note: ${res.status}`
        );
    }

    return res.json();
}


// ------------------------------------------------------
// DELETE /users/:id/doctor-notes/:noteId
// ------------------------------------------------------

export async function deleteDoctorNote(
    userId,
    noteId
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}/doctor-notes/${noteId}`,
            {
                method: "DELETE",

                headers,
            }
        );

    if (!res.ok) {
        const data =
            await res.json().catch(
                () => ({})
            );

        throw new Error(
            data.error ||
            `Failed to delete doctor note: ${res.status}`
        );
    }

    return res.json();
}