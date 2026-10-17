import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Search,
    ChevronRight,
    Activity,
    BrainCircuit,
} from "lucide-react";

import {
    fetchUsers,
    fetchCurrentDoctor,
} from "../api";

import Sparkline from "../components/Sparkline.jsx";


function Dashboard() {
    const [patients, setPatients] =
        useState([]);

    const [doctor, setDoctor] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const navigate =
        useNavigate();

    const getRiskStyle = (riskPercent) => {
        if (riskPercent == null) {
            return {
                label: "No score",
                className:
                    "bg-slate-50 text-slate-600 border-slate-200",
            };
        }

        if (riskPercent >= 70) {
            return {
                label: `${riskPercent}%`,
                className:
                    "bg-rose-50 text-rose-700 border-rose-200",
            };
        }

        if (riskPercent >= 40) {
            return {
                label: `${riskPercent}%`,
                className:
                    "bg-amber-50 text-amber-700 border-amber-200",
            };
        }

        return {
            label: `${riskPercent}%`,
            className:
                "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    };


    // ======================================================
    // Load doctor + assigned patients
    // ======================================================

    useEffect(() => {
        async function load() {
            try {
                const [
                    doctorData,
                    users,
                ] = await Promise.all([
                    fetchCurrentDoctor(),
                    fetchUsers(),
                ]);


                setDoctor(
                    doctorData
                );


                const mapped =
                    users.map((u) => ({
                        id:
                            u.id,

                        name:
                            u.displayName ||
                            "",

                        email:
                            u.email ||
                            "",

                        lastSync:
                            u.lastActive ||
                            null,

                        riskScore:
                            u.riskScore ??
                            null,

                        riskPercent:
                            u.riskPercent ??
                            null,

                        moodTrend:
                            Array.isArray(
                                u.moodTrend
                            )
                                ? u.moodTrend
                                : [],

                        modelVersion:
                            u.modelVersion ??
                            null,
                    }));


                setPatients(
                    mapped
                );

            } catch (err) {
                console.error(err);

                setError(
                    "Failed to load dashboard"
                );

            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);


    // ======================================================
    // Search
    // ======================================================

    const filtered =
        patients.filter((p) => {
            const term =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!term) {
                return true;
            }

            return (
                p.name
                    .toLowerCase()
                    .includes(term) ||

                p.email
                    .toLowerCase()
                    .includes(term)
            );
        });


    // ======================================================
    // Risk summary
    // ======================================================

    const patientsWithRisk =
        patients.filter(
            (p) =>
                p.riskPercent != null
        );


    const avgRiskPercent =
        patientsWithRisk.length > 0

            ? Math.round(
                patientsWithRisk.reduce(
                    (sum, p) =>
                        sum +
                        p.riskPercent,
                    0
                ) /
                patientsWithRisk.length
            )

            : null;


    // ======================================================
    // Model version
    // ======================================================

    const modelVersions =
        patients
            .map(
                (patient) =>
                    patient.modelVersion
            )
            .filter(
                (version) =>
                    version != null
            );


    const currentModelVersion =
        modelVersions.length > 0
            ? Math.max(
                ...modelVersions.map(
                    Number
                )
            )
            : null;


    // ======================================================
    // Doctor greeting
    // ======================================================

    const doctorName =
        doctor
            ? `Dr. ${doctor.firstName || ""} ${doctor.lastName || ""}`.trim()
            : "Doctor";


    // ======================================================
    // Loading
    // ======================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">

                <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />

            </div>
        );
    }


    // ======================================================
    // Error
    // ======================================================

    if (error) {
        return (
            <div className="p-8 max-w-3xl mx-auto">

                <p className="text-sm text-red-600">
                    {error}
                </p>

            </div>
        );
    }


    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">


            {/* ==================================================
                Greeting
            ================================================== */}

            <div className="mb-6">

                <p className="text-sm font-medium text-indigo-600">
                    LunaCare Doctor Portal
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back, {doctorName}
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Here is an overview of your assigned patients
                    and their latest health insights.
                </p>

                {doctor?.organization && (
                    <p className="mt-1 text-xs text-slate-400">
                        {doctor.organization}
                    </p>
                )}

            </div>


            {/* ==================================================
                Dashboard introduction
            ================================================== */}

            <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <h2 className="text-xl font-bold text-slate-900">
                    Patient Health Overview
                </h2>

                <p className="mt-2 text-sm text-slate-600 leading-6 max-w-4xl">
                    LunaCare combines self-reported mood and symptom
                    data with wearable health metrics and an
                    ML-generated PPD risk score to help review patient
                    trends and identify cases that may need closer
                    attention.
                </p>


                <div className="mt-4 px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-100">

                    <p className="text-xs text-indigo-800">

                        <span className="font-semibold">
                            Capstone prototype:
                        </span>{" "}

                        The ML-generated PPD risk score is a
                        decision-support signal and is not a medical
                        diagnosis.

                    </p>

                </div>

            </div>


            {/* ==================================================
                Summary Cards
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">


                {/* Assigned Patients */}

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">

                    <p className="text-sm font-medium text-slate-500">
                        Assigned Patients
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {patients.length}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                        Patients currently assigned to your account
                    </p>

                </div>


                {/* Avg PPD Risk */}

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">

                    <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">

                        <Activity className="w-6 h-6" />

                    </div>

                    <div>

                        <p className="text-sm font-medium text-slate-500">
                            Avg PPD Risk Score
                        </p>

                        <h3 className="text-2xl font-bold text-slate-900">
                            {avgRiskPercent != null
                                ? `${avgRiskPercent}%`
                                : "—"}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Average score across assigned patients
                            with available predictions
                        </p>

                    </div>

                </div>


                {/* Model Version */}

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">

                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">

                        <BrainCircuit className="w-6 h-6" />

                    </div>

                    <div>

                        <p className="text-sm font-medium text-slate-500">
                            Active ML Model
                        </p>

                        <h3 className="text-2xl font-bold text-slate-900">

                            {currentModelVersion != null
                                ? `v${currentModelVersion}`
                                : "—"}

                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Model version used for the latest available
                            PPD risk predictions
                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================================
                Header + Search
            ================================================== */}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                        My Patients
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                        Review your assigned patients, recent health
                        data, and PPD risk insights.
                    </p>

                </div>


                <div className="relative w-full md:w-auto">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}

                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }

                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-72 bg-white text-sm"
                    />

                </div>

            </div>


            {/* ==================================================
                Patient Table Header
            ================================================== */}

            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">

                <div className="col-span-4">
                    Patient
                </div>

                <div className="col-span-2">
                    PPD Risk Score
                </div>

                <div className="col-span-2">
                    Mood Trend (10d)
                </div>

                <div className="col-span-2 text-right">
                    Last Sync
                </div>

                <div className="col-span-2 text-right">
                    Action
                </div>

            </div>


            {/* ==================================================
                Patient Rows
            ================================================== */}

            <div className="space-y-2">

                {filtered.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">

                        <p className="text-sm font-medium text-slate-700">
                            No patients found
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            No assigned patients match your search.
                        </p>

                    </div>

                ) : (

                    filtered.map((p) => (

                        <div
                            key={p.id}

                            onClick={() =>
                                navigate(
                                    `/patient/${p.id}`
                                )
                            }

                            className="group bg-white rounded-lg border border-slate-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-indigo-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                        >

                            {/* Patient info */}

                            <div className="col-span-4 flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500">

                                    {p.name
                                        .split(" ")
                                        .map(
                                            (x) =>
                                                x[0]
                                        )
                                        .join("")
                                        .slice(0, 2) ||
                                        "PT"}

                                </div>


                                <div>

                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                        {p.name ||
                                            "Unnamed patient"}
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        {p.email}
                                    </p>

                                </div>

                            </div>


                            {/* Risk */}

                            {/* Risk */}
                            <div className="col-span-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${p.riskPercent == null
                                            ? "bg-slate-50 text-slate-600 border-slate-200"
                                            : p.riskPercent >= 70
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : p.riskPercent >= 40
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        }`}
                                >
                                    {p.riskPercent != null
                                        ? `${p.riskPercent}%`
                                        : "No score"}
                                </span>
                            </div>


                            {/* Mood trend */}

                            <div className="col-span-2 flex items-center">

                                <Sparkline
                                    data={
                                        p.moodTrend
                                    }
                                    color="#6366f1"
                                />

                            </div>


                            {/* Last sync */}

                            <div className="col-span-2 text-right">

                                <p className="text-xs font-medium text-slate-600">

                                    {p.lastSync
                                        ? new Date(
                                            p.lastSync
                                        ).toLocaleDateString()
                                        : "No data"}

                                </p>

                                <p className="text-[10px] text-slate-400">

                                    {p.lastSync
                                        ? "Recently synced"
                                        : "Awaiting data"}

                                </p>

                            </div>


                            {/* Action */}

                            <div className="col-span-2 flex justify-end">

                                <span className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">

                                    <ChevronRight className="w-4 h-4" />

                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}


export default Dashboard;