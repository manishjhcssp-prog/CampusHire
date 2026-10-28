import React, { useState } from "react";
import { CheckCircle, XCircle, Info, HelpCircle } from "lucide-react";
import { checkEligibility } from "../../utils/eligibilityChecker";

export function EligibilityBadge({ student, job, showDetailsButton = true }) {
  const [modalOpen, setModalOpen] = useState(false);
  const result = checkEligibility(student, job);

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {result.isEligible ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible ({result.passedCount}/{result.reasons.length})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Not Eligible ({result.failedCount} criteria unmet)</span>
          </span>
        )}

        {showDetailsButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
            title="Inspect eligibility criteria breakdown"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Breakdown Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-left border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Eligibility Evaluation Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role: <span className="font-semibold text-slate-700">{job.role}</span> at {job.companyName}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-4">
              <div
                className={`p-3.5 rounded-xl border text-sm flex items-center gap-3 ${
                  result.isEligible
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/80 border-rose-200 text-rose-900"
                }`}
              >
                {result.isEligible ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{result.summary}</p>
                  <p className="text-xs mt-0.5 opacity-80">
                    Candidate: {student.name} ({student.branch}, CGPA: {student.cgpa})
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Detailed Criteria Audit
              </p>

              {result.reasons.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    item.passed
                      ? "bg-slate-50/70 border-slate-200/80"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      {item.criterion}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        item.passed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Required: <strong className="text-slate-700">{item.expected}</strong></span>
                    <span>Your Record: <strong className="text-slate-700">{item.actual}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
