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

// ======================================================
// PPD Risk Prediction Review
// ======================================================


// ------------------------------------------------------
// POST /users/:id/ppd-label/verify
// POST /users/:id/ppd-label/reject
//
// Unlike the helpers above, errors thrown here carry
// `status` and the parsed response body (`data`) so the
// caller can handle 409 (prediction changed, includes
// `currentRisk`) and 503 (ML service unavailable).
// ------------------------------------------------------

const PPD_LABEL_ERROR_MESSAGES = {
    400: "The review could not be saved. Check the prediction and reason, then try again.",
    403: "You do not have access to this patient.",
    404: "Patient not found.",
    409: "The risk prediction was updated since this page loaded. Please review the new prediction.",
    503: "Risk prediction is unavailable, try again later.",
};

async function postPpdLabelAction(
    userId,
    action,
    body
) {
    const headers =
        await getAuthHeaders();

    const res =
        await fetch(
            `${API_BASE}/users/${userId}/ppd-label/${action}`,
            {
                method: "POST",

                headers,

                body: JSON.stringify(body),
            }
        );

    const data =
        await res.json().catch(
            () => ({})
        );

    if (!res.ok) {
        // 503 always uses the fixed message so the doctor
        // sees consistent wording for an ML outage.
        const message =
            res.status === 503
                ? PPD_LABEL_ERROR_MESSAGES[503]
                : data.error ||
                PPD_LABEL_ERROR_MESSAGES[res.status] ||
                `Failed to ${action} PPD risk prediction: ${res.status}`;

        const error =
            new Error(message);

        error.status = res.status;
        error.data = data;

        throw error;
    }

    return data;
}

/**
 * @param {string} userId
 * @param {import("./components/type").PpdLabelVerifyRequest} body
 * @returns {Promise<import("./components/type").PpdLabelActionResponse>}
 */
export function verifyPpdLabel(
    userId,
    { predictionScore, modelVersion }
) {
    return postPpdLabelAction(
        userId,
        "verify",
        {
            predictionScore,
            modelVersion,
        }
    );
}

/**
 * @param {string} userId
 * @param {import("./components/type").PpdLabelRejectRequest} body
 * @returns {Promise<import("./components/type").PpdLabelActionResponse>}
 */
export function rejectPpdLabel(
    userId,
    { predictionScore, modelVersion, reason }
) {
    const body = {
        predictionScore,
        modelVersion,
    };

    if (reason) {
        body.reason = reason;
    }

    return postPpdLabelAction(
        userId,
        "reject",
        body
    );
}
