import React from "react";
import { CheckCircle2, Clock, XCircle, Calendar, Sparkles, AlertCircle } from "lucide-react";

export function StatusBadge({ status, size = "md" }) {
  const normalized = (status || "").toLowerCase();

  const configs = {
    submitted: {
      label: "Submitted",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock
    },
    shortlisted: {
      label: "Shortlisted",
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Sparkles
    },
    interview: {
      label: "Interview Scheduled",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Calendar
    },
    selected: {
      label: "Selected / Offered",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2
    },
    rejected: {
      label: "Not Selected",
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle
    },
    withdrawn: {
      label: "Withdrawn",
      bg: "bg-slate-100 text-slate-600 border-slate-200",
      icon: AlertCircle
    }
  };

  const config = configs[normalized] || {
    label: status || "Unknown",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock
  };

  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{config.label}</span>
    </span>
  );
}
