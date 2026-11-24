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
        iconColor: "text-slate-400",
    },
    [PpdLabelStatus.VERIFIED]: {
        label: "Verified",
        icon: ShieldCheck,
        styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconColor: "text-emerald-600",
    },
    [PpdLabelStatus.REJECTED]: {
        label: "Rejected",
        icon: ShieldX,
        styles: "bg-amber-50 text-amber-700 border-amber-200",
        iconColor: "text-amber-600",
    },
    [PpdLabelStatus.OUTDATED]: {
        label: "Needs re-review",
        icon: History,
        styles: "bg-slate-50 text-slate-700 border-slate-300",
        iconColor: "text-slate-400",
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
 * variant "badge": bordered pill (detail page).
 * variant "inline": icon + muted text, for secondary placement under
 * another pill (dashboard table) so the two don't compete.
 *
 * @param {{
 *   status: string | null | undefined,
 *   size?: "sm" | "md",
 *   variant?: "badge" | "inline",
 * }} props
 */
function PpdLabelStatusBadge({ status, size = "md", variant = "badge" }) {
    const config = statusConfig[normalizePpdLabelStatus(status)];
    const Icon = config.icon;

    if (variant === "inline") {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <Icon className={"w-3.5 h-3.5 " + config.iconColor} />
                {config.label}
            </span>
        );
    }

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
