// import React, { useMemo } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//     Box, Grid, Paper, Typography, Avatar, Divider, TextField, Button, Chip
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import {
//     ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';

// const BRAND_PURPLE = '#C1C1E4';
// const BRAND_TEXT = '#7E7EB5';
// const BRAND_HIGHLIGHT = '#FF7043';

// // MOCK FIRESTORE DATA
// const firestoreMoodLogs = [
//     { id: '1', mood: 8, notes: "Good", createdAt: new Date('2025-11-15') },
//     { id: '2', mood: 7, notes: "Okay", createdAt: new Date('2025-11-16') },
//     { id: '3', mood: 4, notes: "Sad", createdAt: new Date('2025-11-17') },
//     { id: '4', mood: 3, notes: "Bad", createdAt: new Date('2025-11-18') }, // Crash
//     { id: '5', mood: 5, notes: "Better", createdAt: new Date('2025-11-19') },
//     { id: '6', mood: 6, notes: "Okay", createdAt: new Date('2025-11-20') },
//     { id: '7', mood: 8, notes: "Great", createdAt: new Date('2025-11-21') },
// ];

// const firestoreSymptomLogs = [
//     { id: 'a', createdAt: new Date('2025-11-15'), values: { Fatigue: 2 } },
//     { id: 'b', createdAt: new Date('2025-11-16'), values: { Fatigue: 3 } },
//     { id: 'c', createdAt: new Date('2025-11-17'), values: { Fatigue: 7 } },
//     { id: 'd', createdAt: new Date('2025-11-18'), values: { Fatigue: 9 } }, // Spike
//     { id: 'e', createdAt: new Date('2025-11-19'), values: { Fatigue: 6 } },
//     { id: 'f', createdAt: new Date('2025-11-20'), values: { Fatigue: 4 } },
//     { id: 'g', createdAt: new Date('2025-11-21'), values: { Fatigue: 2 } },
// ];

// const PatientDetail = () => {
//     const { id } = useParams();

//     const chartData = useMemo(() => {
//         const merged = {};
//         // Simple merge logic for demo
//         firestoreMoodLogs.forEach(l => {
//             const d = l.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//             if (!merged[d]) merged[d] = { day: d };
//             merged[d].mood = l.mood;
//         });
//         firestoreSymptomLogs.forEach(l => {
//             const d = l.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//             if (!merged[d]) merged[d] = { day: d };
//             merged[d].fatigue = l.values.Fatigue || 0;
//         });
//         return Object.values(merged);
//     }, []);

//     return (
//         <Box>
//             <Link to="/" style={{ textDecoration: 'none' }}>
//                 <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2, color: BRAND_TEXT }}>Back to Dashboard</Button>
//             </Link>

//             {/* Header */}
//             <Paper elevation={0} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 3, border: `1px solid ${BRAND_PURPLE}` }}>
//                 <Avatar sx={{ width: 80, height: 80, bgcolor: BRAND_PURPLE, color: 'white', mr: 3, fontWeight: 'bold' }}>AJ</Avatar>
//                 <Box>
//                     <Typography variant="h4" sx={{ color: BRAND_TEXT, fontWeight: 'bold' }}>Alice Johnson</Typography>
//                     <Typography variant="subtitle1" color="textSecondary">ID: {id} | Postpartum Day: 12</Typography>
//                 </Box>
//                 <Box sx={{ ml: 'auto', textAlign: 'right' }}>
//                     <Typography variant="h6" sx={{ color: BRAND_TEXT }}>ML Risk Score</Typography>
//                     <Typography variant="h3" color="error" fontWeight="bold">85%</Typography>
//                     <Chip label="High Risk" color="error" size="small" />
//                 </Box>
//             </Paper>

//             <Grid container spacing={3}>
//                 {/* Chart */}
//                 <Grid item xs={12} md={8}>
//                     <Paper elevation={0} sx={{ p: 3, height: '450px', borderRadius: 3, border: `1px solid ${BRAND_PURPLE}` }}>
//                         <Typography variant="h6" gutterBottom sx={{ color: BRAND_TEXT }}>Mood (Line) vs. Fatigue (Bar)</Typography>
//                         <ResponsiveContainer width="100%" height="90%">
//                             <ComposedChart data={chartData}>
//                                 <CartesianGrid stroke="#f0f0f0" vertical={false} />
//                                 <XAxis dataKey="day" />
//                                 <YAxis yAxisId="left" domain={[0, 10]} label={{ value: 'Mood', angle: -90, position: 'insideLeft' }} />
//                                 <YAxis yAxisId="right" orientation="right" domain={[0, 10]} label={{ value: 'Fatigue', angle: 90, position: 'insideRight' }} />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar yAxisId="right" dataKey="fatigue" barSize={20} fill={BRAND_HIGHLIGHT} name="Fatigue" />
//                                 <Line yAxisId="left" type="monotone" dataKey="mood" stroke={BRAND_PURPLE} strokeWidth={4} dot={{ r: 5 }} name="Mood" />
//                             </ComposedChart>
//                         </ResponsiveContainer>
//                     </Paper>
//                 </Grid>

//                 {/* Actions */}
//                 <Grid item xs={12} md={4}>
//                     <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: `1px solid ${BRAND_PURPLE}` }}>
//                         <Typography variant="h6" gutterBottom sx={{ color: BRAND_TEXT }}>AI Recommendations</Typography>
//                         <Divider sx={{ mb: 2 }} />
//                         <Box sx={{ bgcolor: '#fff0f0', p: 2, borderRadius: 2, mb: 3, borderLeft: '4px solid #d32f2f' }}>
//                             <Typography variant="subtitle2" fontWeight="bold" color="error">Alert</Typography>
//                             <Typography variant="body2">High fatigue correlating with low mood on Nov 18.</Typography>
//                         </Box>
//                         <TextField fullWidth multiline rows={4} label="Doctor's Notes" defaultValue="Recommend sleep consultation." />
//                         <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: BRAND_PURPLE }}>Send</Button>
//                     </Paper>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default PatientDetail;
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchUserDetail } from "../api";

// function PatientDetail() {
//     const { id } = useParams();          // assuming route like /patients/:id
//     const [patient, setPatient] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         async function load() {
//             try {
//                 const data = await fetchUserDetail(id);
//                 setPatient(data);
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to load patient detail");
//             } finally {
//                 setLoading(false);
//             }
//         }
//         load();
//     }, [id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!patient) return <div>No data</div>;

//     const { profile, metrics, risk } = patient;

//     return (
//         <div>
//             <h1>{profile.displayName}</h1>
//             <p>Email: {profile.email}</p>
//             <p>Risk: {risk.label} ({risk.percent}%)</p>

//             {/* here you plug metrics.moodSeries, metrics.symptomSeries/watchSeries into your charts */}
//         </div>
//     );
// }

// export default PatientDetail;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Chip,
    CircularProgress,
    Divider,
} from "@mui/material";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, ComposedChart
} from "recharts";
import { fetchUserDetail } from "../api";

const getRiskChipStyles = (riskLabel) => {
    const label = (riskLabel || "").toUpperCase();
    switch (label) {
        case "HIGH RISK":
            return { bg: "#FDECEA", color: "#C62828" };
        case "MEDIUM":
            return { bg: "#FFF4E5", color: "#EF6C00" };
        case "STABLE":
            return { bg: "#E8F5E9", color: "#2E7D32" };
        case "UNKNOWN":
        default:
            return { bg: "#ECEFF1", color: "#546E7A" };
    }
};

// Turn Firestore Timestamp / Date / string into a label
const toDateLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;

    if (value.toDate && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString();
    }

    const seconds = value._seconds ?? value.seconds;
    if (seconds != null) {
        return new Date(seconds * 1000).toLocaleDateString();
    }

    if (value instanceof Date) return value.toLocaleDateString();

    return String(value);
};

const getMoodValue = (d) =>
    d.score ?? d.mood ?? d.mood_score ?? d.value ?? 0;

// Symptom value – average numeric values if only `values` exists
const getSymptomValue = (d) => {
    if (d.severity != null) return d.severity;
    if (d.score != null) return d.score;
    if (d.symptom_severity != null) return d.symptom_severity;

    const values = d.values || {};
    const nums = Object.values(values).filter(
        (v) => typeof v === "number" && !Number.isNaN(v)
    );
    if (!nums.length) return 0;
    const avg = nums.reduce((s, v) => s + v, 0) / nums.length;
    return avg;
};

function PatientDetail() {
    const { id } = useParams();
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Box sx={{ mt: 4 }}>{error}</Box>;
    if (!patient) return <Box sx={{ mt: 4 }}>No data</Box>;

    const { profile, metrics, risk } = patient;

    const rawMoodSeries = metrics?.moodSeries || [];
    const rawSymptomSeries = metrics?.symptomSeries || [];
    const rawWatchSeries = metrics?.watchSeries || [];

    const moodSeries = rawMoodSeries.map((d) => ({
        ...d,
        score: getMoodValue(d),
        dateLabel: toDateLabel(d.dateLabel ?? d.date ?? d.createdAt),
    }));

    const symptomSeries = rawSymptomSeries.map((d) => {
        const severity = getSymptomValue(d);
        return {
            ...d,
            severity,
            dateLabel: toDateLabel(d.dateLabel ?? d.date ?? d.createdAt),
        };
    });

    const watchSeries = rawWatchSeries.map((d) => ({
        ...d,
        dateLabel: toDateLabel(d.dateLabel ?? d.date ?? d.createdAt),
    }));

    // summaries
    const avgMood =
        moodSeries.length > 0
            ? Math.round(
                moodSeries.reduce((s, d) => s + (d.score ?? 0), 0) /
                moodSeries.length
            )
            : null;

    const avgSymptom =
        symptomSeries.length > 0
            ? Math.round(
                symptomSeries.reduce((s, d) => s + (d.severity ?? 0), 0) /
                symptomSeries.length
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

    const avgSleep =
        watchSeries.length > 0
            ? (
                watchSeries.reduce((s, d) => s + (d.sleep_hours ?? 0), 0) /
                watchSeries.length
            ).toFixed(1)
            : null;

    const avgRestingHR =
        watchSeries.length > 0
            ? Math.round(
                watchSeries.reduce(
                    (s, d) => s + (d.resting_heart_rate ?? 0),
                    0
                ) / watchSeries.length
            )
            : null;

    const { bg: riskBg, color: riskColor } = getRiskChipStyles(risk.label);

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {profile.displayName}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                        Email: {profile.email}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                    >
                        Risk Status
                    </Typography>
                    <Chip
                        label={`${risk.label} (${risk.percent}%)`}
                        sx={{
                            mt: 0.5,
                            backgroundColor: riskBg,
                            color: riskColor,
                            fontWeight: 600,
                            px: 1,
                        }}
                    />
                </Box>
            </Box>

            {/* OVERVIEW CARDS – flex row, equal size */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* each card flexes to same width */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: "1 1 220px",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                    >
                        Risk Index
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                        {risk.percent}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575", mt: 0.5 }}>
                        {risk.label}
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        flex: "1 1 220px",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                    >
                        Avg Mood (7 days)
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                        {avgMood !== null ? avgMood : "—"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575", mt: 0.5 }}>
                        Scale 1–5
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        flex: "1 1 220px",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                    >
                        Avg Symptom Severity
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                        {avgSymptom !== null ? avgSymptom : "—"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575", mt: 0.5 }}>
                        Scale 0–10
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        flex: "1 1 220px",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                    >
                        Last Apple Health Sync
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
                        {lastSync}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575", mt: 0.5 }}>
                        Watch data summary
                    </Typography>
                </Paper>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* CHARTS – stacked vertically */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Mood */}
                {/* Mood */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                        height: 380,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Mood over Time
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#757575" }}>
                        Mood (1–5): higher values indicate better mood.
                    </Typography>

                    {moodSeries.length === 0 ? (
                        <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
                            No mood data available.
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={moodSeries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dateLabel" />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="Mood"
                                    stroke="#6B6BEA"
                                    strokeWidth={3}   // thicker line (option B)
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Paper>


                {/* Symptoms */}
                {/* Symptoms */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                        height: 380,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Symptom Severity
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#757575" }}>
                        Symptom Severity (0–10): higher values indicate more severe symptoms.
                    </Typography>

                    {symptomSeries.length === 0 ? (
                        <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
                            No symptom data available.
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={symptomSeries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dateLabel" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="severity"
                                    name="Severity"
                                    stroke="#F0A34C"
                                    strokeWidth={3}   // thicker line (option B)
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Paper>


                {/* Apple Health */}
                {/* Apple Health – combined trends */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: "1px solid #E0E0F4",
                        height: 400,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Apple Health Summary
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: "#757575" }}>
                        Daily trends for steps, sleep, and resting heart rate.
                    </Typography>

                    {watchSeries.length === 0 ? (
                        <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
                            No Apple Health data available.
                        </Typography>
                    ) : (
                        <>
                            {/* quick stats row */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 3,
                                    mb: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                                    >
                                        Avg Steps
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {avgSteps?.toLocaleString() ?? "—"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                                    >
                                        Avg Sleep
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {avgSleep ?? "—"} hrs
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ textTransform: "uppercase", color: "#9E9E9E" }}
                                    >
                                        Avg Resting HR
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {avgRestingHR ?? "—"} bpm
                                    </Typography>
                                </Box>
                            </Box>

                            {/* combined multicolor trend chart */}
                            <ResponsiveContainer width="100%" height={260}>
                                <ComposedChart
                                    data={watchSeries}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                >
                                    <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
                                    <XAxis dataKey="dateLabel" />

                                    {/* two axes: left for Steps, right for Sleep + HR */}
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            value: "Steps",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                        domain={[0, "dataMax + 1000"]}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        domain={[0, 120]} // HR & Sleep scale
                                    />

                                    <Tooltip />

                                    {/* move legend to top-right so it doesn't overflow */}
                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        wrapperStyle={{ fontSize: 12 }}
                                    />

                                    {/* Steps as green bars */}
                                    <Bar
                                        yAxisId="left"
                                        dataKey="steps"
                                        name="Steps"
                                        fill="#66BB6A"
                                        radius={[3, 3, 0, 0]}
                                    />

                                    {/* Sleep as blue line */}
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="sleep_hours"
                                        name="Sleep (hrs)"
                                        stroke="#42A5F5"
                                        strokeWidth={3}
                                        dot={false}
                                    />

                                    {/* Resting HR as red line */}
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="resting_hr"
                                        name="Resting HR"
                                        stroke="#EF5350"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>

                        </>
                    )}
                </Paper>

            </Box>
        </Box>
    );
}

export default PatientDetail;

