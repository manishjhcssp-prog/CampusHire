import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { CompanyLogoRenderer } from "../common/CompanyLogos";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Video
} from "lucide-react";

export function CampusHireRecruiterPortal() {
  const {
    activeCompany,
    activeCompanyId,
    setActiveCompanyId,
    companies,
    jobs,
    applications,
    students,
    updateApplicationStatus,
    scheduleInterview,
    setCurrentRole
  } = usePlacement();

  const [selectedJobId, setSelectedJobId] = useState("all");
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState("2026-10-29T11:00");
  const [interviewRound, setInterviewRound] = useState("Technical Round 2 (System Design)");

  // Filter company jobs
  const companyJobs = jobs.filter(
    (j) => j.companyId === activeCompanyId || j.companyName.toLowerCase().includes(activeCompany.name.toLowerCase())
  );

  // Filter company applications
  const companyJobIds = companyJobs.map((j) => j.id);
  const companyApps = applications.filter((a) => {
    if (selectedJobId !== "all") {
      return a.jobId === selectedJobId;
    }
    return companyJobIds.includes(a.jobId) || a.jobId === "job-001";
  });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleModalApp) return;

    scheduleInterview(scheduleModalApp.id, {
      interviewDate,
      interviewRound,
      interviewLink: `https://meet.google.com/rec-${scheduleModalApp.id.slice(-4)}`
    });

    setScheduleModalApp(null);
    alert("Interview successfully scheduled and notified to student!");
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Recruiter Header */}
      <div className="bg-[#161b25] border border-white/[0.08] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <CompanyLogoRenderer name={activeCompany.name} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{activeCompany.name} Talent Acquisition</h1>
              <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Partner Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active drives: {companyJobs.length} • {activeCompany.headquarters}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={activeCompanyId}
            onChange={(e) => setActiveCompanyId(e.target.value)}
            className="bg-[#11151e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentRole("admin")}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold border border-white/10 transition"
          >
            Switch to Admin View
          </button>
        </div>
      </div>

      {/* Recruiter Candidate Pipeline Table */}
      <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Applicant Pipeline & Evaluation</span>
          </h2>
          <span className="text-xs text-slate-400">{companyApps.length} Candidates in Pipeline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#11151e] text-slate-400 text-[11px] font-medium border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-3">Stage Status</th>
                <th className="py-3 px-3">Interview</th>
                <th className="py-3 px-4 text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {companyApps.map((app) => {
                const student = students.find((s) => s.id === app.studentId);
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"}
                          alt={student?.name || "Candidate"}
                          className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white">{student?.name || "Candidate"}</div>
                          <div className="text-[11px] text-slate-400">{student?.branch}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-white font-medium">
                      {job?.role || "Software Engineer"}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-sky-300">
                      {student?.cgpa || 8.5}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === "selected"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : app.status === "interview"
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            : "bg-slate-700/40 text-slate-300"
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {app.interviewScheduled ? (
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Scheduled ({app.interviewRound?.slice(0, 16)}...)
                        </span>
                      ) : (
                        <button
                          onClick={() => setScheduleModalApp(app)}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-[11px] font-medium border border-sky-500/30 transition"
                        >
                          Schedule Slot
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => updateApplicationStatus(app.id, "interview")}
                          className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-semibold transition"
                        >
                          To Interview
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "selected")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
                        >
                          Make Offer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <span>Assign Interview Slot</span>
              </h3>
              <button
                onClick={() => setScheduleModalApp(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Interview Round Title</label>
                <input
                  type="text"
                  required
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalApp(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition shadow-lg"
                >
                  Confirm & Dispatch Meet Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
