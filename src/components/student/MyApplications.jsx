import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { StatusBadge } from "../common/StatusBadge";
import {
  Calendar,
  Clock,
  Video,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  XCircle,
  Building2,
  FileText
} from "lucide-react";

export function MyApplications({ onExploreJobs }) {
  const { applications, jobs, activeStudent, withdrawApplication } = usePlacement();
  const [withdrawModalApp, setWithdrawModalApp] = useState(null);

  const studentApps = applications.filter(
    (app) => app.studentId === activeStudent.id
  );

  const pipelineStages = [
    { key: "submitted", label: "Submitted" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interview", label: "Interview" },
    { key: "selected", label: "Selected" }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case "submitted":
        return 0;
      case "shortlisted":
        return 1;
      case "interview":
        return 2;
      case "selected":
        return 3;
      default:
        return -1;
    }
  };

  const handleConfirmWithdraw = () => {
    if (withdrawModalApp) {
      withdrawApplication(withdrawModalApp.id);
      setWithdrawModalApp(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Application Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates across your campus placement applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Total Applications: <strong className="text-slate-900">{studentApps.length}</strong>
          </span>
          <button
            onClick={onExploreJobs}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Explore More Drives
          </button>
        </div>
      </div>

      {studentApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Browse active company drives, check your automated eligibility score, and submit applications.
          </p>
          <button
            onClick={onExploreJobs}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100"
          >
            Browse Open Recruitment Drives
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {studentApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId) || {
              companyName: "Company",
              role: "Role",
              packageLpa: 0,
              location: "Location"
            };

            const stageIdx = getStageIndex(app.status);
            const isTerminalNegative = app.status === "rejected" || app.status === "withdrawn";

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all hover:border-slate-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {job.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {job.companyName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{job.role}</h3>
                      <p className="text-xs text-slate-500">
                        Package: <strong className="text-emerald-700 font-semibold">₹{job.packageLpa} LPA</strong> • Applied on: {app.appliedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <StatusBadge status={app.status} />

                    {app.status !== "withdrawn" && app.status !== "selected" && (
                      <button
                        onClick={() => setWithdrawModalApp(app)}
                        className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Pipeline Progression (When not rejected/withdrawn) */}
                {!isTerminalNegative ? (
                  <div className="py-5">
                    <div className="flex items-center justify-between relative">
                      {/* Connecting line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, stageIdx) / (pipelineStages.length - 1)) * 100}%`
                        }}
                      />

                      {pipelineStages.map((stage, idx) => {
                        const isCompleted = stageIdx > idx;
                        const isCurrent = stageIdx === idx;

                        return (
                          <div key={stage.key} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                                isCompleted
                                  ? "bg-indigo-600 text-white"
                                  : isCurrent
                                  ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                                  : "bg-white border-2 border-slate-200 text-slate-400"
                              }`}
                            >
                              {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] font-semibold mt-1.5 ${
                                isCurrent
                                  ? "text-indigo-700 font-bold"
                                  : isCompleted
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-3 mt-2">
                    <div
                      className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                        app.status === "rejected"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        {app.status === "rejected"
                          ? "Application not shortlisted for final offer. Better luck next time!"
                          : "Application has been voluntarily withdrawn by the candidate."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Recruiter Notes / Status remark */}
                {app.statusNotes && (
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 mt-2">
                    <span className="font-bold text-slate-700 mr-1.5">Recruiter Update:</span>
                    <span>{app.statusNotes}</span>
                  </div>
                )}

                {/* Scheduled Interview Highlight Card */}
                {app.interviewScheduled && app.status !== "withdrawn" && app.status !== "rejected" && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-slate-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-900">
                            Interview Scheduled: {app.interviewRound}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            Live Round
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            {new Date(app.interviewDate).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={app.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal to Withdraw */}
      {withdrawModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Withdraw Application?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to withdraw your application? This action will notify the placement cell and the recruiter. You will forfeit your interview slot.
            </p>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setWithdrawModalApp(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep Application
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
