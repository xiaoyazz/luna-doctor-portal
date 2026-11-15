// -----------------------------
// Risk level "enum"
// -----------------------------
export const RiskLevel = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
});

// Optional: array for selects / filters
export const RISK_LEVELS = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH];

/**
 * @typedef {Object} MoodLog
 * @property {string} id
 * @property {number} mood    - 1–5
 * @property {string} notes
 * @property {string} date
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SymptomValues
 * @property {number} Bleeding        - 1–10
 * @property {number} ["Hair Loss"]   - 1–10
 * @property {number} Appetite        - 1–10
 * @property {number} ["Sleep Trouble"] - 1–10
 */

/**
 * @typedef {Object} SymptomLog
 * @property {string} id
 * @property {SymptomValues} values
 * @property {string} date
 * @property {string} source
 */

/**
 * @typedef {Object} AppleWatchSleepMetrics
 * @property {number} sleep_hours
 * @property {number} deep_sleep_hours
 * @property {number} rem_sleep_hours
 * @property {number} sleep_efficiency
 * @property {number} wake_after_onset_min
 */

/**
 * @typedef {Object} AppleWatchHeartMetrics
 * @property {number} avg_heart_rate
 * @property {number} resting_heart_rate
 * @property {number} hrv
 * @property {number} vo2max
 */

/**
 * @typedef {Object} AppleWatchActivityMetrics
 * @property {number} steps
 * @property {number} active_energy
 * @property {number} exercise_minutes
 * @property {number} stand_hours
 */

/**
 * @typedef {Object} AppleWatchLog
 * @property {string} id
 * @property {string} date
 * @property {AppleWatchSleepMetrics} sleep_metrics
 * @property {AppleWatchHeartMetrics} heart_metrics
 * @property {AppleWatchActivityMetrics} activity_metrics
 */

/**
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {number} age
 * @property {boolean} is_pregnant
 * @property {string} photoUrl
 * @property {keyof typeof RiskLevel | string} riskLevel
 * @property {string} lastSync
 * @property {MoodLog[]} moodLogs
 * @property {SymptomLog[]} symptomLogs
 * @property {AppleWatchLog[]} watchLogs
 */

// -----------------------------
// PPD risk prediction review
// -----------------------------
export const PpdLabelStatus = Object.freeze({
  UNVERIFIED: "unverified",
  VERIFIED: "verified",
  REJECTED: "rejected",
  OUTDATED: "outdated",
});

/**
 * Firestore Timestamp as serialized to JSON by the backend.
 * @typedef {Object} FirestoreTimestampJson
 * @property {number} _seconds
 * @property {number} _nanoseconds
 */

/**
 * `risk` object on GET /users/:id. `score` is null when the
 * ML service was unavailable.
 * @typedef {Object} PatientRisk
 * @property {number|null} score         - 0–1
 * @property {number|null} percent       - 0–100
 * @property {string} label
 * @property {string|null} modelVersion
 */

/**
 * `ppdLabel` object on GET /users/:id.
 * `verifiedBy`/`verifiedByName`/`verifiedAt` describe the most recent
 * review, whether it was a verification or a rejection.
 * @typedef {Object} PpdLabel
 * @property {"unverified"|"verified"|"rejected"|"outdated"} status
 * @property {"verified"|"rejected"|null} reviewedStatus
 * @property {boolean} matchesCurrentPrediction
 * @property {string|null} verifiedBy
 * @property {string|null} verifiedByName
 * @property {FirestoreTimestampJson|null} verifiedAt
 * @property {FirestoreTimestampJson|null} updatedAt
 * @property {number|null} predictionScore
 * @property {string|null} modelVersion
 * @property {string|null} rejectionReason
 */

/**
 * Body for POST /users/:id/ppd-label/verify.
 * @typedef {Object} PpdLabelVerifyRequest
 * @property {number} predictionScore - `risk.score` currently shown
 * @property {string} modelVersion    - `risk.modelVersion` currently shown
 */

/**
 * Body for POST /users/:id/ppd-label/reject.
 * @typedef {Object} PpdLabelRejectRequest
 * @property {number} predictionScore
 * @property {string} modelVersion
 * @property {string} [reason]        - optional, max 1000 chars
 */

/**
 * 200 response from verify/reject.
 * @typedef {Object} PpdLabelActionResponse
 * @property {PpdLabel} ppdLabel
 * @property {PatientRisk} risk
 */

/**
 * 409 response from verify/reject (prediction changed since page load).
 * @typedef {Object} PpdLabelConflictResponse
 * @property {string} error
 * @property {PatientRisk} currentRisk
 */

/**
 * GET /users/:id response (fields used by the patient detail page).
 * @typedef {Object} PatientDetailResponse
 * @property {Object} profile
 * @property {Object} metrics
 * @property {PatientRisk} risk
 * @property {PpdLabel} [ppdLabel]
 */

export const Types = {};
