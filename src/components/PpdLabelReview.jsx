// src/components/PpdLabelReview.jsx
import React, { useEffect, useState } from "react";
import {
    ShieldCheck,
    ShieldX,
    Loader2,
    X,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
} from "lucide-react";
import { verifyPpdLabel, rejectPpdLabel } from "../api";
import { formatDateTime } from "../utils/formatDateTime";
import { PpdLabelStatus } from "./type";
import PpdLabelStatusBadge, {
    normalizePpdLabelStatus,
} from "./PpdLabelStatusBadge";

const REASON_MAX_LENGTH = 1000;

const messageStyles = {
    success: {
        icon: CheckCircle2,
        styles: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    warning: {
        icon: AlertTriangle,
        styles: "border-amber-200 bg-amber-50 text-amber-800",
    },
};

const byLine = (name, at) => {
    const parts = [];
    if (name) parts.push(`by ${name}`);
    const date = formatDateTime(at);
    if (date) parts.push(`on ${date}`);
    return parts.join(" ");
};

const formatRiskPercent = (risk) => {
    if (typeof risk?.percent === "number") {
        return `${Math.round(risk.percent)}%`;
    }
    if (typeof risk?.score === "number") {
        return `${Math.round(risk.score * 100)}%`;
    }
    return "Unavailable";
};

/**
 * Status badge + Verify/Reject workflow for the patient's PPD risk prediction.
 *
 * @param {{
 *   userId: string,
 *   risk: import("./type").PatientRisk | null | undefined,
 *   ppdLabel: import("./type").PpdLabel | null | undefined,
 *   onReviewSaved: (result: import("./type").PpdLabelActionResponse) => void,
 *   onPredictionChanged: (currentRisk: import("./type").PatientRisk) => void,
 * }} props
 */
function PpdLabelReview({
    userId,
    risk,
    ppdLabel,
    onReviewSaved,
    onPredictionChanged,
}) {
    // "verify" | "reject" | null
    const [dialogAction, setDialogAction] = useState(null);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [dialogError, setDialogError] = useState(null);
    // { type: "success" | "warning", text: string } | null
    const [message, setMessage] = useState(null);

    // Treat a missing/unknown label as unverified.
    const status = normalizePpdLabelStatus(ppdLabel?.status);

    const canReview =
        risk?.score != null &&
        risk?.modelVersion != null;

    const hasCurrentReview =
        status === PpdLabelStatus.VERIFIED ||
        status === PpdLabelStatus.REJECTED;

    // Verified -> offer Reject only; Rejected -> offer Verify only;
    // Unverified/Outdated -> offer both.
    const showVerify = status !== PpdLabelStatus.VERIFIED;
    const showReject = status !== PpdLabelStatus.REJECTED;

    const closeDialog = () => {
        setDialogAction(null);
        setReason("");
        setDialogError(null);
    };

    // Close on Escape, but never mid-request.
    useEffect(() => {
        if (!dialogAction) return undefined;

        const onKeyDown = (e) => {
            if (e.key === "Escape" && !submitting) {
                setDialogAction(null);
                setReason("");
                setDialogError(null);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [dialogAction, submitting]);

    const openDialog = (action) => {
        setMessage(null);
        setDialogError(null);
        setReason("");
        setDialogAction(action);
    };

    const handleConfirm = async () => {
        if (!dialogAction || !canReview || submitting) return;

        const action = dialogAction;

        // Send back exactly the prediction the doctor is looking at.
        const payload = {
            predictionScore: risk.score,
            modelVersion: risk.modelVersion,
        };

        setSubmitting(true);
        setDialogError(null);

        try {
            const result =
                action === "verify"
                    ? await verifyPpdLabel(userId, payload)
                    : await rejectPpdLabel(userId, {
                        ...payload,
                        reason: reason.trim() || undefined,
                    });

            onReviewSaved(result);
            closeDialog();
            setMessage({
                type: "success",
                text:
                    action === "verify"
                        ? "PPD risk prediction verified."
                        : "PPD risk prediction rejected.",
            });
        } catch (err) {
            console.error(err);

            if (err.status === 409 && err.data?.currentRisk) {
                onPredictionChanged(err.data.currentRisk);
                closeDialog();
                setMessage({
                    type: "warning",
                    text:
                        "The risk prediction was updated since this page loaded, so your review was not saved. Please review the new prediction.",
                });
            } else {
                // 400 / 403 / 404 / 503 / network: keep the dialog
                // open (and any typed reason) so the doctor can retry.
                setDialogError(
                    err.message ||
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ---------- status detail text ------------------------------------------

    let detail = null;

    if (status === PpdLabelStatus.UNVERIFIED) {
        detail = "No doctor has reviewed this prediction yet.";
    } else if (status === PpdLabelStatus.VERIFIED) {
        detail = `Verified ${byLine(ppdLabel.verifiedByName, ppdLabel.verifiedAt)}`.trim();
    } else if (status === PpdLabelStatus.REJECTED) {
        detail = `Rejected ${byLine(ppdLabel.verifiedByName, ppdLabel.verifiedAt)}`.trim();
    } else if (status === PpdLabelStatus.OUTDATED) {
        const previous =
            ppdLabel.reviewedStatus === "verified"
                ? "verified"
                : ppdLabel.reviewedStatus === "rejected"
                    ? "rejected"
                    : "reviewed";
        const by = ppdLabel.verifiedByName
            ? ` by ${ppdLabel.verifiedByName}`
            : "";
        detail = `Previously ${previous}${by}, but the prediction has changed since.`;
    }

    const showRejectionReason =
        status === PpdLabelStatus.REJECTED &&
        ppdLabel?.rejectionReason;

    const MessageIcon = message ? messageStyles[message.type].icon : null;

    const buttonBase =
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:cursor-not-allowed";

    // ------------------------------------------------------------------------

    return (
        <div className="mt-3 pt-3 border-t border-indigo-100">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase text-indigo-900">
                    Doctor review
                </span>
                <PpdLabelStatusBadge status={status} />
            </div>

            {detail && (
                <p className="text-xs text-indigo-800 mt-2">{detail}</p>
            )}

            {showRejectionReason && (
                <p className="text-xs text-indigo-800 mt-1 whitespace-pre-wrap">
                    <span className="font-semibold">Reason:</span>{" "}
                    {ppdLabel.rejectionReason}
                </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                {showVerify && (
                    <button
                        type="button"
                        onClick={() => openDialog("verify")}
                        disabled={!canReview || submitting}
                        className={
                            buttonBase +
                            " bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300"
                        }
                    >
                        {submitting && dialogAction === "verify" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        Verify
                    </button>
                )}

                {showReject && (
                    <button
                        type="button"
                        onClick={() => openDialog("reject")}
                        disabled={!canReview || submitting}
                        className={
                            buttonBase +
                            " bg-white text-amber-700 border border-amber-300 hover:bg-amber-50 disabled:text-slate-400 disabled:border-slate-200 disabled:bg-white"
                        }
                    >
                        {submitting && dialogAction === "reject" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <ShieldX className="w-3.5 h-3.5" />
                        )}
                        Reject
                    </button>
                )}

                {hasCurrentReview && canReview && (
                    <span className="text-[11px] text-indigo-700">
                        Changing the decision replaces the earlier review.
                    </span>
                )}
            </div>

            {!canReview && (
                <p className="text-[11px] text-slate-500 mt-2">
                    Review is unavailable while the risk prediction is
                    missing. Try again later.
                </p>
            )}

            {message && (
                <div
                    role={message.type === "warning" ? "alert" : "status"}
                    className={
                        "mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs " +
                        messageStyles[message.type].styles
                    }
                >
                    <MessageIcon className="w-4 h-4 mt-px shrink-0" />
                    <span className="flex-1">{message.text}</span>
                    <button
                        type="button"
                        onClick={() => setMessage(null)}
                        aria-label="Dismiss message"
                        className="shrink-0 opacity-70 hover:opacity-100"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Confirmation dialog */}
            {dialogAction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
                    onClick={() => {
                        if (!submitting) closeDialog();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ppd-review-dialog-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2
                                id="ppd-review-dialog-title"
                                className="text-lg font-bold text-slate-900 flex items-center gap-2"
                            >
                                {dialogAction === "verify" ? (
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <ShieldX className="w-5 h-5 text-amber-600" />
                                )}
                                {dialogAction === "verify"
                                    ? "Verify PPD risk prediction?"
                                    : "Reject PPD risk prediction?"}
                            </h2>
                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={submitting}
                                aria-label="Close"
                                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
                            <p>
                                <span className="text-slate-500">Risk score:</span>{" "}
                                <span className="font-semibold">
                                    {formatRiskPercent(risk)}
                                </span>
                            </p>
                            <p>
                                <span className="text-slate-500">Model version:</span>{" "}
                                <span className="font-mono">
                                    {risk?.modelVersion ?? "—"}
                                </span>
                            </p>
                        </div>

                        <p className="mt-4 text-sm text-slate-600">
                            {dialogAction === "verify"
                                ? "You are confirming that this model-generated risk score is clinically appropriate for this patient."
                                : "You are recording that this model-generated risk score is not clinically appropriate for this patient."}{" "}
                            Your name and the current time will be recorded.
                            {hasCurrentReview &&
                                " This replaces the existing review."}
                        </p>

                        {dialogAction === "reject" && (
                            <div className="mt-4">
                                <label
                                    htmlFor="ppd-reject-reason"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Reason{" "}
                                    <span className="font-normal text-slate-400">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    id="ppd-reject-reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    maxLength={REASON_MAX_LENGTH}
                                    rows={4}
                                    autoFocus
                                    disabled={submitting}
                                    placeholder="Why is this prediction not appropriate?"
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    {reason.length} / {REASON_MAX_LENGTH} characters
                                </p>
                            </div>
                        )}

                        {dialogError && (
                            <div
                                role="alert"
                                className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{dialogError}</span>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            {/* Cancel gets focus for Verify so a stray Enter doesn't confirm. */}
                            <button
                                type="button"
                                onClick={closeDialog}
                                disabled={submitting}
                                autoFocus={dialogAction === "verify"}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={submitting || !canReview}
                                className={
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors " +
                                    (dialogAction === "verify"
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-amber-600 hover:bg-amber-700")
                                }
                            >
                                {submitting && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {submitting
                                    ? "Saving..."
                                    : dialogAction === "verify"
                                        ? "Verify prediction"
                                        : "Reject prediction"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PpdLabelReview;
