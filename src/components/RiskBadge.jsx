import React from "react";
import { RiskLevel } from "./type";

// Map RiskLevel values ("Low", "Medium", "High") to Tailwind styles
const riskStyles = {
    [RiskLevel.LOW]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [RiskLevel.MEDIUM]: "bg-amber-50 text-amber-700 border-amber-200",
    [RiskLevel.HIGH]: "bg-rose-50 text-rose-700 border-rose-200",
};

/**
 * @param {{ level: string }} props
 */
function RiskBadge({ level }) {
    const styles = riskStyles[level] || "bg-slate-50 text-slate-700 border-slate-200";

    // level might be "Low" | "Medium" | "High"
    const label = (level || "").toUpperCase();

    return (
        <span
            className={
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border " +
                styles
            }
        >
            {label || "UNKNOWN"}
        </span>
    );
}

export default RiskBadge;