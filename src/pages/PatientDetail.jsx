// src/pages/PatientDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Clock,
    Brain,
    Activity,
    AlertTriangle,
    Moon,
    CheckCircle,
} from "lucide-react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    ComposedChart,
} from "recharts";
import { fetchUserDetail } from "../api";

// ---------- helpers ---------------------------------------------------------
const formatDecimal = (value, digits = 1) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return number.toFixed(digits);
};

const formatInteger = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return Math.round(number).toLocaleString();
};

const toDateLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;

    if (value.toDate && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("en-CA");
    }

    const seconds = value._seconds ?? value.seconds;
    if (seconds != null) {
        return new Date(seconds * 1000).toLocaleDateString("en-CA");
    }

    if (value instanceof Date) return value.toLocaleDateString("en-CA");

    return String(value);
};

const getMoodValue = (d) =>
    d.mood_1to5 ??
    d.score ??
    d.mood ??
    d.mood_score ??
    d.value ??
    null;

const getSymptomAverage = (d) => {
    const values = d.values || {};

    const nums = Object.values(values).filter(
        (v) => typeof v === "number" && !Number.isNaN(v)
    );

    if (!nums.length) return null;

    return nums.reduce((s, v) => s + v, 0) / nums.length;
};
// total “symptom load” (sum instead of avg)
const getSymptomLoad = (d) => {
    const values = d.values || {};
    const nums = Object.values(values).filter(
        (v) => typeof v === "number" && !Number.isNaN(v)
    );
    if (!nums.length) return 0;
    return nums.reduce((s, v) => s + v, 0);
};

// ---------- component -------------------------------------------------------

function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchUserDetail(id);
                setPatient(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load patient detail");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-3xl mx-auto">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-8 max-w-3xl mx-auto">
                <p className="text-sm text-slate-600">No data.</p>
            </div>
        );
    }

    // ---------- unpack backend data ------------------------------------------

    const { profile, metrics, risk } = patient;

    const riskPercent =
        typeof risk?.percent === "number"
            ? Math.round(risk.percent)
            : null;

    const rawMoodSeries = metrics?.moodSeries || [];
    const rawSymptomSeries = (metrics?.measurementSeries || [])
        .map((d) => ({
            ...d,
            values: {
                Fatigue: d.fatigue_1to10,
                Bleeding: d.bleeding_1to10,
                "Hair Loss": d.hair_loss_1to10,
                Appetite: d.appetite_issue_1to10,
                "Sleep Trouble": d.sleep_trouble_1to10,
            },
        }))
        .filter((d) =>
            Object.values(d.values).some(
                (value) =>
                    typeof value === "number" &&
                    !Number.isNaN(value)
            )
        );
    const rawWatchSeries = metrics?.measurementSeries || [];

    // Normalize basic series for summaries
    const moodSeries = rawMoodSeries.map((d) => ({
        ...d,
        score: getMoodValue(d),
        dateLabel: toDateLabel(d.date ?? d.createdAt ?? d.dateLabel),
    }));

    const symptomSeries = rawSymptomSeries.map((d) => ({
        ...d,
        avgSeverity: getSymptomAverage(d),
        dateLabel: toDateLabel(d.date ?? d.createdAt ?? d.dateLabel),
    }));

    const watchSeries = rawWatchSeries.map((d) => ({
        ...d,
        dateLabel: toDateLabel(d.date ?? d.createdAt ?? d.dateLabel),
    }));

    // ---------- summaries -----------------------------------------------------

    const avgMood =
        moodSeries.length > 0
            ? Math.round(
                moodSeries.reduce((s, d) => s + (d.score ?? 0), 0) /
                moodSeries.length
            )
            : null;

    const validSymptoms = symptomSeries.filter(
        (d) => d.avgSeverity != null
    );

    const avgSymptom =
        validSymptoms.length > 0
            ? Math.round(
                validSymptoms.reduce(
                    (s, d) => s + d.avgSeverity,
                    0
                ) / validSymptoms.length
            )
            : null;

    const lastSync =
        watchSeries.length > 0
            ? watchSeries[watchSeries.length - 1].dateLabel
            : "N/A";

    const avgSteps =
        watchSeries.length > 0
            ? Math.round(
                watchSeries.reduce((s, d) => s + (d.steps ?? 0), 0) /
                watchSeries.length
            )
            : null;

    const validSleepValues = watchSeries
        .map((d) => d.sleep_hours)
        .filter(
            (value) =>
                typeof value === "number" &&
                !Number.isNaN(value)
        );

    const avgSleep =
        validSleepValues.length > 0
            ? (
                validSleepValues.reduce(
                    (sum, value) => sum + value,
                    0
                ) / validSleepValues.length
            ).toFixed(1)
            : null;

    const avgRestingHR =
        watchSeries.length > 0
            ? (() => {
                let sum = 0;
                let count = 0;
                watchSeries.forEach((d) => {
                    const raw = d.resting_hr ?? d.resting_heart_rate;
                    if (raw == null) return;
                    const value =
                        typeof raw === "string" ? parseFloat(raw) : raw;
                    if (typeof value === "number" && !Number.isNaN(value)) {
                        sum += value;
                        count += 1;
                    }
                });
                return count > 0 ? Math.round(sum / count) : null;
            })()
            : null;

    // ---------- combine mood + steps + sleep -----

    const combinedLength = Math.max(
        moodSeries.length,
        watchSeries.length,
        symptomSeries.length
    );

    const clinicalData = watchSeries.map((w) => {
        const totalSleep = w.sleep_hours ?? null;
        const deepSleep = w.deep_sleep_hours ?? null;
        const remSleep = w.rem_sleep_hours ?? null;

        const lightSleep =
            totalSleep != null &&
                deepSleep != null &&
                remSleep != null
                ? Math.max(
                    totalSleep - deepSleep - remSleep,
                    0
                )
                : null;

        return {
            date: w.dateLabel,

            mood:
                w.mood_1to5 ?? null,

            steps:
                w.steps ?? null,

            hrv:
                w.hrv_sdnn_ms ?? null,

            deepSleep,
            remSleep,
            lightSleep,
        };
    });

    const sleepData = clinicalData.filter(
        (d) =>
            d.deepSleep != null ||
            d.remSleep != null ||
            d.lightSleep != null
    );

    const activationData = clinicalData.filter(
        (d) =>
            d.steps != null ||
            d.mood != null
    );

    // Symptom breakdown area chart
    const symptomTrends = rawSymptomSeries.map((log) => {
        const vals = log.values || {};
        return {
            date: toDateLabel(log.date ?? log.createdAt ?? log.dateLabel),
            Bleeding: vals["Bleeding"] ?? 0,
            HairLoss: vals["Hair Loss"] ?? 0,
            Appetite: vals["Appetite"] ?? 0,
            SleepTrouble: vals["Sleep Trouble"] ?? 0,
        };
    });

    const lastDeepSleep =
        [...sleepData]
            .reverse()
            .find((d) => d.deepSleep != null)
            ?.deepSleep ?? null;;

    // ------------------------------------------------------------------------

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            {/* Top nav */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Registry
                </button>
                <div className="text-sm text-slate-400 font-mono">
                    ID: #{(id || "").toString().padStart(6, "0")}
                </div>
            </div>

            {/* Clinical header card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                    {/* Identity */}
                    <div className="flex gap-5">
                        <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-slate-50 flex items-center justify-center text-lg font-semibold text-slate-500">
                            {profile.displayName
                                ?.split(" ")
                                .map((x) => x[0])
                                .join("")
                                .slice(0, 2) || "PT"}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {profile.displayName}
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                                    {riskPercent != null
                                        ? `${riskPercent}% PPD Risk Score`
                                        : "Risk score unavailable"}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="flex items-center">
                                    <Activity className="w-3.5 h-3.5 mr-1.5" />
                                    {profile.is_pregnant
                                        ? "Pregnant"
                                        : "Postpartum / Monitoring"}
                                </span>
                                {profile.age != null && (
                                    <span className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        {profile.age} yo
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Email: {profile.email || "—"}
                            </p>
                        </div>
                    </div>

                    {/* ML risk score */}
                    <div className="flex-1 p-4 rounded-xl border bg-indigo-50 border-indigo-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-5 h-5 text-indigo-600" />

                            <h3 className="font-bold text-sm text-indigo-900">
                                PPD Risk Score:{" "}
                                {riskPercent != null
                                    ? `${riskPercent}%`
                                    : "Unavailable"}
                            </h3>
                        </div>

                        <p className="text-xs text-indigo-700">
                            Model-generated risk score based on available patient
                            health data. Review this score together with mood,
                            sleep, symptoms, and other clinical information.
                        </p>
                    </div>
                </div>

                {/* Quick stats row */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-[11px] text-slate-500 uppercase">
                            Avg Mood
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {avgMood ?? "—"}{" "}
                            <span className="text-xs text-slate-400">/ 5</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-[11px] text-slate-500 uppercase">
                            Avg Symptom Severity
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {avgSymptom ?? "—"}{" "}
                            <span className="text-xs text-slate-400">/ 10</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-[11px] text-slate-500 uppercase">
                            Avg Sleep
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {avgSleep ?? "—"}{" "}
                            <span className="text-xs text-slate-400">hrs</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-[11px] text-slate-500 uppercase">
                            Last Measurements
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                            {lastSync}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sleep architecture */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Moon className="w-5 h-5 text-indigo-500" />
                                Sleep Architecture
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Deep & REM sleep cycles vs total duration.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                                {lastDeepSleep != null
                                    ? `${formatDecimal(lastDeepSleep, 1)}h`
                                    : "—"}
                            </p>
                            <p className="text-xs text-slate-400">
                                Deep sleep (latest available)
                            </p>
                        </div>
                    </div>
                    <div className="h-64">
                        {sleepData.length === 0 ? (
                            <p className="text-xs text-slate-400">
                                No sleep data available.
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={sleepData}
                                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                                    barSize={12}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `${formatDecimal(value, 1)} h`,
                                            name,
                                        ]}
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                            color: "#1e293b",
                                        }}
                                        labelStyle={{
                                            color: "#1e293b",
                                            fontWeight: 600,
                                        }}
                                        cursor={{ fill: "#f8fafc" }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                                    />
                                    <Bar
                                        dataKey="remSleep"
                                        name="REM"
                                        stackId="a"
                                        fill="#818cf8"
                                    />
                                    <Bar
                                        dataKey="deepSleep"
                                        name="Deep"
                                        stackId="a"
                                        fill="#4f46e5"
                                    />
                                    <Bar
                                        dataKey="lightSleep"
                                        name="Light"
                                        stackId="a"
                                        fill="#a5b4fc"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Steps vs Mood */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Behavioral Activation
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Physical activity vs self-reported mood.
                            </p>
                        </div>
                    </div>
                    <div className="h-64">
                        {activationData.length === 0 ? (
                            <p className="text-xs text-slate-400">
                                No activity or mood data available.
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={activationData}
                                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fontSize: 10, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        domain={[0, 6]}
                                        hide
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === "Steps") {
                                                return [
                                                    formatInteger(value),
                                                    name,
                                                ];
                                            }

                                            if (name === "Mood (1–5)") {
                                                return [
                                                    formatDecimal(value, 1),
                                                    name,
                                                ];
                                            }

                                            return [value, name];
                                        }}
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                            color: "#1e293b",
                                        }}
                                        labelStyle={{
                                            color: "#1e293b",
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#475569", }}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="steps"
                                        name="Steps"
                                        fill="#a7f3d0"
                                        barSize={20}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="mood"
                                        name="Mood (1–5)"
                                        stroke="#059669"
                                        strokeWidth={3}
                                        dot={{ r: 0 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Symptom burden trend */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                        Symptom Burden Trend
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Cumulative severity of self-reported symptoms over time.
                    </p>
                </div>
                <div className="h-72">
                    {symptomTrends.length === 0 ? (
                        <p className="text-xs text-slate-400">
                            No symptom data available.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={symptomTrends}
                                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorBleeding" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="#ef4444"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#ef4444"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient id="colorHair" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="#f59e0b"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#f59e0b"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="#6366f1"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#6366f1"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        formatDecimal(value, 1),
                                        name,
                                    ]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                        color: "#1e293b",
                                    }}
                                    labelStyle={{
                                        color: "#1e293b",
                                        fontWeight: 600,
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="SleepTrouble"
                                    name="Sleep Trouble"
                                    stackId="1"
                                    stroke="#6366f1"
                                    fill="url(#colorSleep)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Bleeding"
                                    name="Bleeding"
                                    stackId="1"
                                    stroke="#ef4444"
                                    fill="url(#colorBleeding)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Appetite"
                                    name="Appetite Changes"
                                    stackId="1"
                                    stroke="#10b981"
                                    fill="#d1fae5"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="HairLoss"
                                    name="Hair Loss"
                                    stackId="1"
                                    stroke="#f59e0b"
                                    fill="url(#colorHair)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientDetail;