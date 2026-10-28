import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { CompanyLogoRenderer } from "../common/CompanyLogos";
import { checkEligibility } from "../../utils/eligibilityChecker";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  Video,
  ChevronRight,
  UploadCloud,
  Check
} from "lucide-react";

export function CampusHireStudentPortal() {
  const {
    activeStudent,
    updateStudentProfile,
    jobs,
    applications,
    applyToJob,
    withdrawApplication,
    setCurrentRole
  } = usePlacement();

  const [activeTab, setActiveTab] = useState("explore"); // 'explore' | 'applications' | 'interviews' | 'offers'
  const [applySuccessToast, setApplySuccessToast] = useState(null);

  // Filter student applications
  const myApps = applications.filter(
    (a) => a.studentId === activeStudent.id && a.status !== "withdrawn"
  );
  const scheduledInterviews = myApps.filter((a) => a.interviewScheduled);
  const offersReceived = myApps.filter((a) => a.status === "selected");

  // Determine eligibility for each job
  const jobsWithEligibility = jobs.map((job) => {
    const isApplied = myApps.some((a) => a.jobId === job.id);
    const eligibilityRes = checkEligibility(activeStudent, job);
    return {
      ...job,
      isApplied,
      eligibilityRes
    };
  });

  const eligibleCount = jobsWithEligibility.filter((j) => j.eligibilityRes.isEligible).length;

  const handleApply = (job) => {
    const res = applyToJob(job.id, activeStudent.id);
    if (res.success) {
      setApplySuccessToast(`Application successfully sent to ${job.companyName} for ${job.role}!`);
      setTimeout(() => setApplySuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Toast Feedback */}
      {applySuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1e2635] border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{applySuccessToast}</span>
        </div>
      )}

      {/* Student Private Profile Hero Banner */}
      <div className="bg-[#161b25] border border-white/[0.08] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <img
              src={activeStudent.avatar}
              alt={activeStudent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-sky-500/40 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{activeStudent.name}</h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activeStudent.auditStatus || "Verified Candidate"}</span>
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {activeStudent.rollNumber} • {activeStudent.course} {activeStudent.branch} • Batch of {activeStudent.graduationYear}
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-xs bg-[#11151e] text-slate-300 px-2.5 py-0.5 rounded-lg border border-white/5">
                  CGPA: <strong className="text-white">{activeStudent.cgpa} / 10</strong>
                </span>
                <span className="text-xs bg-[#11151e] text-emerald-400 px-2.5 py-0.5 rounded-lg border border-white/5 font-semibold">
                  Active Backlogs: {activeStudent.activeBacklogs}
                </span>
                <span className="text-xs bg-[#11151e] text-sky-400 px-2.5 py-0.5 rounded-lg border border-white/5">
                  Desired: {activeStudent.desiredRole || "SDE @ Google"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => setCurrentRole("admin")}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold border border-white/10 transition"
            >
              Switch to Admin View
            </button>
          </div>

        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Eligible Drives
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {eligibleCount} <span className="text-xs text-slate-400 font-normal">of {jobs.length} open</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Automatic Pre-Approval</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Applications Sent
          </span>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {myApps.length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">In Active Screening</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Scheduled Interviews
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {scheduledInterviews.length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Meeting Links Ready</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Offers Extended
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {offersReceived.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Ready for Download</span>
        </div>
      </div>

      {/* Student Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-xs">
        <button
          onClick={() => setActiveTab("explore")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "explore"
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Explore Eligible Drives ({eligibleCount})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "applications"
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          My Applications ({myApps.length})
        </button>
        <button
          onClick={() => setActiveTab("interviews")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "interviews"
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          My Scheduled Interviews ({scheduledInterviews.length})
        </button>
      </div>

      {/* Tab 1: Explore Eligible Drives */}
      {activeTab === "explore" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobsWithEligibility.map((job) => {
            const isEligible = job.eligibilityRes.isEligible;
            return (
              <div
                key={job.id}
                className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CompanyLogoRenderer name={job.companyName} />
                      <div>
                        <h3 className="text-sm font-bold text-white">{job.companyName}</h3>
                        <span className="text-xs text-slate-400">{job.role}</span>
                      </div>
                    </div>

                    {job.isApplied ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        Applied
                      </span>
                    ) : isEligible ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Eligible
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Ineligible
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                    <span className="text-white font-bold">₹{job.packageLpa} LPA</span>
                    <span className="text-slate-400 text-[11px]">{job.location || "Hybrid"}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    Deadline: <strong className="text-slate-200">{job.deadline}</strong>
                  </div>

                  {job.isApplied ? (
                    <span className="text-xs text-slate-400 font-semibold">Under Review</span>
                  ) : isEligible ? (
                    <button
                      onClick={() => handleApply(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition active:scale-[0.98]"
                    >
                      1-Click Apply
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500">Criteria Not Met</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === "applications" && (
        <div className="space-y-3">
          {myApps.length === 0 ? (
            <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-8 text-center text-slate-400 text-xs">
              No active applications submitted yet. Browse eligible drives and apply with 1 click!
            </div>
          ) : (
            myApps.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CompanyLogoRenderer name={job?.companyName || "Org"} />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {job?.companyName} • {job?.role}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Applied on {app.appliedDate} • {app.statusNotes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        app.status === "selected"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : app.status === "interview"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => withdrawApplication(app.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 transition"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: My Scheduled Interviews */}
      {activeTab === "interviews" && (
        <div className="space-y-3">
          {scheduledInterviews.length === 0 ? (
            <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-8 text-center text-slate-400 text-xs">
              No interviews currently scheduled. You will receive an alert once recruiters advance your round.
            </div>
          ) : (
            scheduledInterviews.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              return (
                <div
                  key={app.id}
                  className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CompanyLogoRenderer name={job?.companyName || "Company"} />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {app.interviewRound || "Technical Interview"} with {job?.companyName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Slot: {new Date(app.interviewDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={app.interviewLink || "https://meet.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Interview Video Room</span>
                  </a>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
