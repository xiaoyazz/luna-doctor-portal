import React from "react";
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

function Settings() {
    const doctor = {
        name: "Dr. Maya Chen",
        organization: "Oakville Women's Health Centre",
        specialty: "Family Medicine / Women's Health",
        cpsoNumber: "000000 (Demo)",
        email: "maya.chen@lunacare-demo.ca",
        phone: "(905) 555-0142",
        accessLevel: "Authorized Physician",
    };

    const assignedPatients = [
        "Matthew Boyd",
        "Fernanda Battig",
        "Jenna Smith",
        "Sami Turner",
        "Sam Ahmed",
        "Jenna Battig",
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Doctor Profile & Access
                </h1>

                <p className="text-sm text-slate-600 mt-1">
                    Authorized healthcare provider information and
                    LunaCare portal access.
                </p>
            </div>

            {/* Authorized Access Notice */}
            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5" />

                <div>
                    <p className="text-sm font-semibold text-indigo-900">
                        Authorized Doctor Access
                    </p>

                    <p className="text-xs text-indigo-800 mt-1 leading-5">
                        This portal is intended for authorized healthcare
                        providers only. Patient information synced from the
                        LunaCare mobile application is stored in the cloud
                        with protected access.
                    </p>
                </div>
            </div>

            {/* Doctor Profile */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
                            <UserRound className="w-8 h-8" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {doctor.name}
                                </h2>

                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    Authorized
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 mt-1">
                                {doctor.specialty}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Doctor Information */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                        icon={Building2}
                        label="Organization"
                        value={doctor.organization}
                    />

                    <InfoItem
                        icon={Stethoscope}
                        label="Specialty"
                        value={doctor.specialty}
                    />

                    <InfoItem
                        icon={BadgeCheck}
                        label="CPSO Number"
                        value={doctor.cpsoNumber}
                    />

                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={doctor.email}
                    />

                    <InfoItem
                        icon={Phone}
                        label="Contact"
                        value={doctor.phone}
                    />

                    <InfoItem
                        icon={LockKeyhole}
                        label="Access Level"
                        value={doctor.accessLevel}
                    />
                </div>
            </div>

            {/* Assigned Patients */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Assigned Patients
                        </h2>

                        <p className="text-sm text-slate-600 mt-1">
                            Patients currently available to this doctor
                            in the LunaCare portal.
                        </p>
                    </div>

                    <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        {assignedPatients.length} patients
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {assignedPatients.map((patient, index) => (
                        <div
                            key={patient}
                            className="px-6 py-4 flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                                {patient
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")
                                    .slice(0, 2)}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {patient}
                                </p>

                                <p className="text-xs text-slate-500">
                                    Patient #{String(index + 1).padStart(3, "0")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prototype note */}
            <p className="text-xs text-slate-500 mt-5">
                Doctor profile information on this page is hardcoded
                demo data for the LunaCare capstone prototype.
            </p>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
            </div>

            <div>
                <p className="text-xs font-medium text-slate-500">
                    {label}
                </p>

                <p className="text-sm font-semibold text-slate-900 mt-1">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default Settings;