import { useState } from "react";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaUserMd,
    FaLock,
    FaEnvelope,
    FaChartLine,
    FaUsers,
} from "react-icons/fa";

import { auth } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await setPersistence(
                auth,
                browserLocalPersistence
            );

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/");
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to sign in. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-8">

            <div className="w-full max-w-5xl">

                {/* Main card */}
                <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">

                    {/* ==================================================
              LEFT SIDE
          ================================================== */}
                    <div className="relative flex flex-col justify-between overflow-hidden bg-indigo-600 p-10 text-white">

                        {/* Decorative circles */}
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500" />

                        <div className="relative z-10">

                            {/* Logo */}
                            <div className="mb-8 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                    <FaUserMd className="text-xl" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        LunaCare
                                    </h1>

                                    <p className="text-sm text-indigo-100">
                                        Doctor Portal
                                    </p>
                                </div>
                            </div>

                            <h2 className="max-w-sm text-3xl font-semibold leading-tight">
                                Supporting better postpartum care through connected health insights.
                            </h2>

                            <p className="mt-4 max-w-md text-sm leading-6 text-indigo-100">
                                Review assigned patients, monitor health trends,
                                and access ML-supported PPD risk information in
                                one secure portal.
                            </p>


                            {/* Features */}
                            <div className="mt-8 space-y-4">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                        <FaUsers className="text-sm" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Assigned Patient Access
                                        </p>

                                        <p className="text-xs text-indigo-200">
                                            View only patients assigned to your account
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                        <FaChartLine className="text-sm" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Health & Risk Insights
                                        </p>

                                        <p className="text-xs text-indigo-200">
                                            Monitor trends and ML-generated PPD risk scores
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                        <FaShieldAlt className="text-sm" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">
                                            Secure Provider Access
                                        </p>

                                        <p className="text-xs text-indigo-200">
                                            Authentication powered by Firebase
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="relative z-10 mt-10 text-xs text-indigo-200">
                            LunaCare Capstone Project · 2026
                        </div>
                    </div>


                    {/* ==================================================
              RIGHT SIDE
          ================================================== */}
                    <div className="flex items-center p-8 md:p-10">

                        <div className="w-full">

                            <div className="mb-7">
                                <p className="mb-2 text-sm font-medium text-indigo-600">
                                    Authorized access
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Welcome back
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Sign in with your healthcare provider account.
                                </p>
                            </div>


                            <form
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="doctor@example.com"
                                            autoComplete="email"
                                            required
                                            className="
                        w-full rounded-xl
                        border border-slate-300
                        bg-white
                        py-3 pl-11 pr-4
                        text-sm text-slate-900
                        placeholder:text-slate-400
                        outline-none transition
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-100
                      "
                                        />
                                    </div>
                                </div>


                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            required
                                            className="
                        w-full rounded-xl
                        border border-slate-300
                        bg-white
                        py-3 pl-11 pr-4
                        text-sm text-slate-900
                        placeholder:text-slate-400
                        outline-none transition
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-100
                      "
                                        />
                                    </div>
                                </div>


                                {/* Error */}
                                {error && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                    >
                                        {error}
                                    </div>
                                )}


                                {/* Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                    w-full rounded-xl
                    bg-indigo-600
                    px-4 py-3
                    text-sm font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-indigo-700
                    focus:outline-none
                    focus:ring-4
                    focus:ring-indigo-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </button>
                            </form>


                            {/* Security notice */}
                            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">

                                <FaShieldAlt className="mt-0.5 flex-shrink-0 text-sm text-slate-400" />

                                <p className="text-xs leading-5 text-slate-500">
                                    This portal is restricted to authorized healthcare
                                    providers. Patient information is available only
                                    according to assigned access.
                                </p>
                            </div>


                            {/* Copyright */}
                            <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                                <p className="text-xs text-slate-400">
                                    © 2026 LunaCare Group· Sheridan College Capstone Project
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}