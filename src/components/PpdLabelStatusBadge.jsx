// src/components/PpdLabelStatusBadge.jsx
import React from "react";
import {
    ShieldCheck,
    ShieldX,
    ShieldQuestion,
    History,
} from "lucide-react";
import { PpdLabelStatus } from "./type";

const statusConfig = {
    [PpdLabelStatus.UNVERIFIED]: {
        label: "Unverified",
        icon: ShieldQuestion,
        styles: "bg-slate-50 text-slate-700 border-slate-200",
    },
    [PpdLabelStatus.VERIFIED]: {
        label: "Verified",
        icon: ShieldCheck,
        styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    [PpdLabelStatus.REJECTED]: {
        label: "Rejected",
        icon: ShieldX,
        styles: "bg-amber-50 text-amber-700 border-amber-200",
    },
    [PpdLabelStatus.OUTDATED]: {
        label: "Needs re-review",
        icon: History,
        styles: "bg-slate-50 text-slate-700 border-slate-300",
    },
};

/** Normalize a status from the API; missing/unknown -> "unverified". */
export const normalizePpdLabelStatus = (status) =>
    statusConfig[status] ? status : PpdLabelStatus.UNVERIFIED;

/** Unverified or outdated: no review applies to the current prediction. */
export const ppdLabelNeedsReview = (status) =>
    status === PpdLabelStatus.UNVERIFIED ||
    status === PpdLabelStatus.OUTDATED;

/**
 * @param {{ status: string | null | undefined, size?: "sm" | "md" }} props
 */
function PpdLabelStatusBadge({ status, size = "md" }) {
    const config = statusConfig[normalizePpdLabelStatus(status)];
    const Icon = config.icon;

    const sizeStyles =
        size === "sm"
            ? "gap-1 px-2 py-0.5 text-[10px]"
            : "gap-1 px-2.5 py-0.5 text-xs";

    return (
        <span
            className={
                "inline-flex items-center rounded-full font-medium border " +
                sizeStyles +
                " " +
                config.styles
            }
        >
            <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {config.label}
        </span>
    );
}

export default PpdLabelStatusBadge;
