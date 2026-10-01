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

export const Types = {};
