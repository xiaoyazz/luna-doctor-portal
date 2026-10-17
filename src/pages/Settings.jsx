import React, {
    useEffect,
    useState,
} from "react";

import {
    UserRound,
    Building2,
    BadgeCheck,
    Mail,
    Phone,
    ShieldCheck,
    Users,
    Stethoscope,
    LockKeyhole,
} from "lucide-react";

import {
    fetchCurrentDoctor,
    fetchUsers,
} from "../api";

function Settings() {
    const [doctor, setDoctor] =
        useState(null);

    const [assignedPatients, setAssignedPatients] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================================
    // Load logged-in doctor + assigned patients
    // ======================================================

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    doctorData,
                    patientsData,
                ] = await Promise.all([
                    fetchCurrentDoctor(),
                    fetchUsers(),
                ]);

                setDoctor(
                    doctorData
                );

                setAssignedPatients(
                    patientsData
                );

            } catch (error) {
                console.error(
                    "Settings load error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load doctor profile."
                );

            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);


    // ======================================================
    // Loading
    // ======================================================

    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                        <p className="text-sm text-slate-500 mt-4">
                            Loading doctor profile...
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    // ======================================================
    // Error
    // ======================================================

    if (error) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load profile
                    </p>

                    <p className="text-sm text-red-700 mt-1">
                        {error}
                    </p>
                </div>
            </div>
        );
    }


    if (!doctor) {
        return null;
    }


    // ======================================================
    // Doctor display values
    // ======================================================

    const doctorName =
        `Dr. ${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();

    const specialty =
        doctor.specialty ||
        "Not provided";

    const organization =
        doctor.organization ||
        "Not provided";

    const cpsoNumber =
        doctor.cpsoNumber ||
        "Not provided";

    const email =
        doctor.email ||
        "Not provided";

    const phone =
        doctor.phone ||
        "Not provided";

    const accessLevel =
        doctor.accessLevel ||
        "Doctor";


    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">

            {/* ==================================================
                Page Header
            ================================================== */}

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Doctor Profile & Access
                </h1>

                <p className="text-sm text-slate-600 mt-1">
                    Your healthcare provider profile and LunaCare
                    patient access.
                </p>
            </div>


            {/* ==================================================
                Authorized Access Notice
            ================================================== */}

            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">

                <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />

                <div>
                    <p className="text-sm font-semibold text-indigo-900">
                        Authorized Doctor Access
                    </p>

                    <p className="text-xs text-indigo-800 mt-1 leading-5">
                        You are signed in as an authorized healthcare
                        provider. Patient access is limited to patients
                        assigned to your LunaCare account.
                    </p>
                </div>
            </div>


            {/* ==================================================
                Doctor Profile
            ================================================== */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

                <div className="p-6 border-b border-slate-100">

                    <div className="flex items-center gap-4">

                        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">

                            <UserRound className="w-8 h-8" />

                        </div>


                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <h2 className="text-xl font-bold text-slate-900">
                                    {doctorName}
                                </h2>


                                {doctor.authorized && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">

                                        <BadgeCheck className="w-3.5 h-3.5" />

                                        Authorized

                                    </span>
                                )}

                            </div>


                            <p className="text-sm text-slate-600 mt-1">
                                {specialty}
                            </p>


                            <p className="text-xs text-slate-400 mt-1">
                                {organization}
                            </p>

                        </div>
                    </div>
                </div>


                {/* Doctor Information */}

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <InfoItem
                        icon={Building2}
                        label="Organization"
                        value={organization}
                    />

                    <InfoItem
                        icon={Stethoscope}
                        label="Specialty"
                        value={specialty}
                    />

                    <InfoItem
                        icon={BadgeCheck}
                        label="CPSO Number"
                        value={cpsoNumber}
                    />

                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={email}
                    />

                    <InfoItem
                        icon={Phone}
                        label="Contact"
                        value={phone}
                    />

                    <InfoItem
                        icon={LockKeyhole}
                        label="Access Level"
                        value={accessLevel}
                    />

                </div>
            </div>


            {/* ==================================================
                Assigned Patients
            ================================================== */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">

                            <Users className="w-5 h-5 text-indigo-600" />

                            Assigned Patients

                        </h2>

                        <p className="text-sm text-slate-600 mt-1">
                            Patients currently assigned to your
                            LunaCare account.
                        </p>

                    </div>


                    <span className="self-start sm:self-auto text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">

                        {assignedPatients.length}{" "}
                        {assignedPatients.length === 1
                            ? "patient"
                            : "patients"}

                    </span>

                </div>


                {/* Patient List */}

                {assignedPatients.length === 0 ? (

                    <div className="px-6 py-10 text-center">

                        <Users className="w-8 h-8 text-slate-300 mx-auto" />

                        <p className="text-sm font-medium text-slate-700 mt-3">
                            No assigned patients
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                            No patients are currently assigned
                            to your account.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100">

                        {assignedPatients.map(
                            (patient) => {

                                const patientName =
                                    patient.displayName ||
                                    patient.email ||
                                    "Patient";

                                const initials =
                                    patientName
                                        .split(" ")
                                        .filter(Boolean)
                                        .map(
                                            (name) =>
                                                name[0]
                                        )
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();


                                return (
                                    <div
                                        key={patient.id}
                                        className="px-6 py-4 flex items-center gap-3"
                                    >

                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">

                                            {initials}

                                        </div>


                                        <div className="min-w-0">

                                            <p className="text-sm font-semibold text-slate-900">
                                                {patientName}
                                            </p>


                                            {patient.email && (
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {patient.email}
                                                </p>
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </div>


            {/* ==================================================
                Footer Note
            ================================================== */}

            <p className="text-xs text-slate-400 mt-5">
                Profile and patient access information is loaded
                from your authenticated LunaCare account.
            </p>

        </div>
    );
}


// ======================================================
// Reusable Info Item
// ======================================================

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex gap-3">

            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">

                <Icon className="w-5 h-5" />

            </div>


            <div className="min-w-0">

                <p className="text-xs font-medium text-slate-500">
                    {label}
                </p>

                <p className="text-sm font-semibold text-slate-900 mt-1 break-words">
                    {value}
                </p>

            </div>

        </div>
    );
}


export default Settings;