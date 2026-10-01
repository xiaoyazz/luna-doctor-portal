import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Settings,
    LogOut,
} from "lucide-react";

function Sidebar({ onLogout }) {
    // Simple, doctor-focused navigation
    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            to: "/", // main cohort overview + patient registry
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            to: "/settings",
        },
        // If later you add a triage/alerts view, you can add it here.
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-10">
            {/* Brand header */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    LC
                </div>
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                    LunaCare
                </span>
            </div>

            {/* Main nav */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.to}
                            end={item.to === "/"} // exact match for dashboard
                            className={({ isActive }) =>
                                [
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                ].join(" ")
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
