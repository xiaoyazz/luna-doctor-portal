import { useState } from "react";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";

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

    const inputClass =
        "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
        "focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600";

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-slate-50 to-slate-100 flex flex-col items-center justify-center px-4 py-12">

            <div className="w-full max-w-sm">

                {/* Wordmark */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        LunaCare
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        Doctor Portal
                    </p>
                </div>


                {/* Form card */}
                <div className="rounded-lg border border-slate-200 bg-white px-6 py-7 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Doctor sign-in
                        </h1>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="mt-5 space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Work email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                autoComplete="email"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="current-password"
                                required
                                className={inputClass}
                            />
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>
                </div>


                {/* Restricted-use notice */}
                <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                    Restricted to authorized doctors. Access is limited
                    to patients assigned to your account.
                </p>
            </div>


            <p className="mt-10 text-center text-xs text-slate-400">
                © 2026 LunaCare · by Team LunaBear
            </p>
        </div>
    );
}
