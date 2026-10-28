import React, { useState, useEffect } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { CompanyLogoRenderer } from "../common/CompanyLogos";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowUpRight,
  Check,
  X,
  ExternalLink,
  Clock,
  Briefcase
} from "lucide-react";

export function CampusHireOverview() {
  const {
    students,
    activeStudent,
    jobs,
    updateDriveStage,
    overrideStudentEligibility,
    approveStudentAdmission,
    notifications,
    setActiveTab,
    searchQuery,
    dashboardMetrics,
    liveEligibilityAudit,
    queryBackendEligibility,
    backendConnected,
    currentRole
  } = usePlacement();

  // Selected student for the Smart Eligibility & Audit panel (default Rahul Sharma)
  const [auditStudentId, setAuditStudentId] = useState("std-rahul");
  const auditStudent = students.find((s) => s.id === auditStudentId) || students[0];



  // Top recruitment drives
  const googleJob = jobs.find((j) => j.id === "job-001" || j.companyName.toLowerCase().includes("google")) || jobs[0] || {
    id: "job-001",
    activeStage: "Tech Round",
    eligibleCount: 280,
    appliedCount: 195
  };
  const msftJob = jobs.find((j) => j.id === "job-002" || j.companyName.toLowerCase().includes("microsoft")) || jobs[1] || {
    id: "job-002",
    activeStage: "Resume Screening",
    eligibleCount: 142,
    appliedCount: 105
  };
  const deloitteJob = jobs.find((j) => j.id === "job-005" || j.companyName.toLowerCase().includes("deloitte")) || jobs[2] || {
    id: "job-005",
    activeStage: "Interview",
    eligibleCount: 410,
    appliedCount: 310
  };

  // Query backend eligibility dynamically when audit candidate or job changes (admin only)
  useEffect(() => {
    if (backendConnected && queryBackendEligibility && currentRole === "admin") {
      const targetJobId = googleJob?.backendId;
      const targetStudentId = auditStudent?.backendId;
      if (targetJobId && targetStudentId) {
        queryBackendEligibility(targetJobId, targetStudentId).catch(() => null);
      }
    }
  }, [auditStudent.id, auditStudent.backendId, googleJob?.backendId, backendConnected, queryBackendEligibility, currentRole]);

  // Calendar State
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(18);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // October (0-indexed)

  // Interactive Modals State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState(
    "Dean Exception Approval: Candidate has exceptional algorithmic proficiency and completed capstone research."
  );
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [scheduleDetailsModal, setScheduleDetailsModal] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);



  // Filter drives based on global search if present
  const displayedJobs = jobs.filter((j) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.companyName.toLowerCase().includes(q) ||
      j.role.toLowerCase().includes(q)
    );
  });

  // Upcoming schedules list
  const upcomingSchedules = [
    {
      id: "sch-1",
      company: "Google",
      candidate: "Aakash Roy",
      round: "Google Tech Round 2",
      time: "@ 11:30 AM",
      dateDay: 18,
      meetLink: "https://meet.google.com/aakash-tech-round",
      interviewer: "Staff SWE, Core Systems",
      status: "Confirmed"
    },
    {
      id: "sch-2",
      company: "Amazon",
      candidate: "Priya Hegde",
      round: "Amazon Interview",
      time: "@ 1:30 PM",
      dateDay: 18,
      meetLink: "https://chime.aws/priya-interview-slot",
      interviewer: "Senior Solutions Architect",
      status: "Confirmed"
    },
    {
      id: "sch-3",
      company: "Microsoft",
      candidate: "Rohan Varma",
      round: "Microsoft Cloud Round",
      time: "@ 3:45 PM",
      dateDay: 19,
      meetLink: "https://teams.microsoft.com/l/meetup-join/rohan",
      interviewer: "Principal Azure Architect",
      status: "Confirmed"
    },
    {
      id: "sch-4",
      company: "Deloitte",
      candidate: "Tanvi Deshmukh",
      round: "Deloitte Analyst Fitment",
      time: "@ 4:30 PM",
      dateDay: 20,
      meetLink: "https://deloitte.zoom.us/j/fitment-tanvi",
      interviewer: "Director, Strategy & Analytics",
      status: "Scheduled"
    }
  ];

  // Calendar days grid matrix for October
  // Matches exact layout from screenshot:
  // Week 1: 29, 30, 31, 1, 2, 3, 4
  // Week 2: 5, 6, 7, 8, 9, 10, 11
  // Week 3: 12, 13, 14, 15, 16, 17, 18 (18 active)
  // Week 4: 19, 20, 21, 22, 23, 24, 25
  // Week 5: 26, 27, 28, 29, 1, 2, 3
  const calendarRows = [
    [
      { day: 29, currentMonth: false },
      { day: 30, currentMonth: false },
      { day: 31, currentMonth: false },
      { day: 1, currentMonth: true },
      { day: 2, currentMonth: true },
      { day: 3, currentMonth: true },
      { day: 4, currentMonth: true }
    ],
    [
      { day: 5, currentMonth: true },
      { day: 6, currentMonth: true },
      { day: 7, currentMonth: true },
      { day: 8, currentMonth: true },
      { day: 9, currentMonth: true },
      { day: 10, currentMonth: true },
      { day: 11, currentMonth: true }
    ],
    [
      { day: 12, currentMonth: true },
      { day: 13, currentMonth: true },
      { day: 14, currentMonth: true },
      { day: 15, currentMonth: true },
      { day: 16, currentMonth: true },
      { day: 17, currentMonth: true },
      { day: 18, currentMonth: true, hasEvent: true }
    ],
    [
      { day: 19, currentMonth: true, hasEvent: true },
      { day: 20, currentMonth: true, hasEvent: true },
      { day: 21, currentMonth: true },
      { day: 22, currentMonth: true },
      { day: 23, currentMonth: true },
      { day: 24, currentMonth: true },
      { day: 25, currentMonth: true }
    ],
    [
      { day: 26, currentMonth: true },
      { day: 27, currentMonth: true },
      { day: 28, currentMonth: true },
      { day: 29, currentMonth: true },
      { day: 1, currentMonth: false },
      { day: 2, currentMonth: false },
      { day: 3, currentMonth: false }
    ]
  ];

  const handleConfirmOverride = () => {
    overrideStudentEligibility(auditStudent.id, true, overrideReason);
    setOverrideModalOpen(false);
    triggerToast("Eligibility Override Applied for " + auditStudent.name);
  };

  const handleConfirmApprove = () => {
    approveStudentAdmission(auditStudent.id, "Google");
    setApproveModalOpen(false);
    triggerToast("Admission & Screening Approved for " + auditStudent.name);
  };

  const triggerToast = (msg) => {
    setActionSuccessToast(msg);
    setTimeout(() => {
      setActionSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1e2635] border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{actionSuccessToast}</span>
        </div>
      )}

      {/* Main Grid: Left (Metrics + Ongoing Drives) & Right (Smart Eligibility & Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Top Metrics Cards (Row 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Placements */}
            <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                <span className="text-xs font-medium text-slate-400 tracking-wide">Placements</span>
                <div className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {Math.round(dashboardMetrics.placementPercentage)}%
                </div>
              </div>

              <div className="mt-4">
                {/* Sleek horizontal progress bar */}
                <div className="w-full h-1.5 bg-[#232a39] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#38bdf8]"
                    style={{ width: `${Math.min(100, Math.max(0, dashboardMetrics.placementPercentage))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  {dashboardMetrics.placedStudents} of {dashboardMetrics.totalStudents} candidates placed
                </p>
              </div>
            </div>

            {/* Card 2: Active Drives */}
            <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                <span className="text-xs font-medium text-slate-400 tracking-wide">Active Drives</span>
                <div className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {dashboardMetrics.activeDrivesCount}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  8 new this week
                </p>
              </div>
            </div>

            {/* Card 3: Open Roles */}
            <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                <span className="text-xs font-medium text-slate-400 tracking-wide">Open Roles</span>
                <div className="text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {dashboardMetrics.openRolesCount}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[11px] text-slate-400 font-medium">
                  across tech, finance, & design
                </p>
              </div>
            </div>

          </div>

          {/* Ongoing Drives & Workflows Panel */}
          <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">
                Ongoing Drives & Workflows
              </h2>
              <button
                onClick={() => setActiveTab("drives")}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition"
              >
                <span>View all drives</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table Headings */}
            <div className="grid grid-cols-12 text-[11px] font-medium text-slate-400 px-3 pb-2 border-b border-white/[0.05]">
              <div className="col-span-5">Candidate Name</div>
              <div className="col-span-2 text-center">Eligible</div>
              <div className="col-span-2 text-center">Applied</div>
              <div className="col-span-3 text-right">Technical Round</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/[0.04]">
              
              {/* Row 1: Google Software Engineer */}
              <div className="grid grid-cols-12 items-center px-3 py-2.5 hover:bg-white/[0.02] rounded-xl transition">
                <div className="col-span-5 flex items-center gap-3">
                  <CompanyLogoRenderer name="Google" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Google • <span className="text-slate-300">Software Engineer</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{googleJob.eligibleCount || 280}</span>
                  <span className="block text-[10px] text-slate-500">Eligible</span>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{googleJob.appliedCount || 195}</span>
                  <span className="block text-[10px] text-slate-500">Applied</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5 flex-wrap">
                  {["Screening", "Tech Round", "Interview", "Offer"].map((stage) => {
                    const isActive = (googleJob.activeStage || "Tech Round") === stage;
                    return (
                      <button
                        key={stage}
                        onClick={() => updateDriveStage(googleJob.id, stage)}
                        className={`text-[10px] px-2.5 py-1 rounded-full transition ${
                          isActive
                            ? "bg-sky-500 text-white font-medium shadow-[0_0_10px_rgba(14,165,233,0.4)]"
                            : "bg-[#1e2533] text-slate-300 hover:bg-[#283244]"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Microsoft Product Manager */}
              <div className="grid grid-cols-12 items-center px-3 py-2.5 hover:bg-white/[0.02] rounded-xl transition">
                <div className="col-span-5 flex items-center gap-3">
                  <CompanyLogoRenderer name="Microsoft" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Microsoft • <span className="text-slate-300">Product Manager</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{msftJob.eligibleCount || 142}</span>
                  <span className="block text-[10px] text-slate-500">Eligible</span>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{msftJob.appliedCount || 105}</span>
                  <span className="block text-[10px] text-slate-500">Applied</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5 flex-wrap">
                  {["Resume Screening", "Interview"].map((stage) => {
                    const isActive = (msftJob.activeStage || "Resume Screening") === stage;
                    return (
                      <button
                        key={stage}
                        onClick={() => updateDriveStage(msftJob.id, stage)}
                        className={`text-[10px] px-3 py-1 rounded-full transition ${
                          isActive
                            ? "bg-slate-200 text-slate-900 font-semibold shadow-sm"
                            : "bg-[#1e2533] text-slate-300 hover:bg-[#283244]"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Deloitte Analyst */}
              <div className="grid grid-cols-12 items-center px-3 py-2.5 hover:bg-white/[0.02] rounded-xl transition">
                <div className="col-span-5 flex items-center gap-3">
                  <CompanyLogoRenderer name="Deloitte" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Deloitte • <span className="text-slate-300">Analyst</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{deloitteJob.eligibleCount || 410}</span>
                  <span className="block text-[10px] text-slate-500">Eligible</span>
                </div>

                <div className="col-span-2 text-center text-xs text-slate-300">
                  <span className="font-semibold text-white">{deloitteJob.appliedCount || 310}</span>
                  <span className="block text-[10px] text-slate-500">Applied</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5 flex-wrap">
                  {["Screening", "Interview", "Offer"].map((stage) => {
                    const isActive = (deloitteJob.activeStage || "Interview") === stage;
                    return (
                      <button
                        key={stage}
                        onClick={() => updateDriveStage(deloitteJob.id, stage)}
                        className={`text-[10px] px-3.5 py-1 rounded-full transition ${
                          isActive
                            ? "bg-[#1e2533] text-white border border-sky-500/50 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                            : "bg-[#1e2533] text-slate-300 hover:bg-[#283244]"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (Span 4) - Smart Eligibility & Audit Panel */}
        <div className="lg:col-span-4">
          <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  Smart Eligibility & Audit
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={auditStudentId}
                    onChange={(e) => setAuditStudentId(e.target.value)}
                    className="bg-[#1c2230] border border-white/10 text-slate-300 text-[10px] font-medium rounded-lg px-2 py-0.5 focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    {students.slice(0, 10).map((st) => (
                      <option key={st.id} value={st.id} className="bg-[#161b25] text-white">
                        {st.name} ({st.branch} • {st.cgpa})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-400 font-medium">Live Audit</span>
                  </div>
                </div>
              </div>

              {/* Student Verification Card */}
              <div className="bg-[#1c2230] border border-white/[0.08] rounded-2xl p-4 mb-4 relative overflow-hidden">
                <div className="flex items-center gap-3.5">
                  <img
                    src={auditStudent.avatar}
                    alt={auditStudent.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-slate-600/60 shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Student Verification:
                    </span>
                    <h3 className="text-base font-bold text-white truncate">
                      {auditStudent.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {auditStudent.branch}, {auditStudent.graduationYear}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 bg-[#141923] border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-200 font-medium">
                    <Briefcase className="w-3 h-3 text-sky-400" />
                    <span>Desired Role: {auditStudent.desiredRole || "SDE @ Google"}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {auditStudent.overrideEligibility && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-semibold">
                        Overridden
                      </span>
                    )}
                    {auditStudent.isAdmitted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-semibold">
                        Admitted
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Criteria Grid (3x2 matching screenshot) */}
              {(() => {
                const isCgpaOk = auditStudent.overrideEligibility || (auditStudent.cgpa >= 8.5);
                const isBacklogsOk = auditStudent.overrideEligibility || (auditStudent.activeBacklogs === 0);
                const isBranchOk = auditStudent.overrideEligibility || (
                  auditStudent.branch?.toLowerCase().includes("comp") ||
                  auditStudent.branch?.toLowerCase().includes("info") ||
                  auditStudent.branch?.toLowerCase().includes("cse") ||
                  auditStudent.branch?.toLowerCase().includes("it")
                );

                return (
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    
                    {/* CGPA Card */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400">CGPA</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isCgpaOk ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {isCgpaOk ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertTriangle className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>
                      <div className="mt-2 text-base font-bold text-white">
                        {auditStudent.cgpa} <span className="text-xs text-slate-400 font-normal">/10</span>
                      </div>
                    </div>

                    {/* No Active Backlogs Card 1 */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">No Active Backlogs</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isBacklogsOk ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {isBacklogsOk ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertTriangle className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>
                      <div className={`mt-2 text-xs font-semibold ${isBacklogsOk ? "text-emerald-400" : "text-amber-400"}`}>
                        {isBacklogsOk ? "Clean Record" : `${auditStudent.activeBacklogs} Backlog`}
                      </div>
                    </div>

                    {/* Branch Highlight (CS) */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">Branch Highlight</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isBranchOk ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {isBranchOk ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertTriangle className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-slate-200">
                        {auditStudent.branch?.includes("Computer") || auditStudent.branch === "CSE" ? "CS Cohort" : `${auditStudent.branch}`}
                      </div>
                    </div>

                    {/* Secondary Check / Attendance */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">No Active Backlogs</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isBacklogsOk ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {isBacklogsOk ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertTriangle className="w-3 h-3 stroke-[2.5]" />}
                        </div>
                      </div>
                      <div className={`mt-2 text-xs font-semibold ${isBacklogsOk ? "text-emerald-400" : "text-amber-400"}`}>
                        {isBacklogsOk ? "Zero Arrears" : "Backlog Alert"}
                      </div>
                    </div>

                    {/* Branch Problem / Fit */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">Branch Fit</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          (isCgpaOk && isBacklogsOk && isBranchOk)
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {(isCgpaOk && isBacklogsOk && isBranchOk) ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                          )}
                        </div>
                      </div>
                      <div className={`mt-2 text-xs font-semibold ${
                        auditStudent.overrideEligibility
                          ? "text-amber-300"
                          : (isCgpaOk && isBacklogsOk && isBranchOk)
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}>
                        {auditStudent.overrideEligibility ? "Admin Bypass" : (isCgpaOk && isBacklogsOk && isBranchOk ? "Tier-1 Tech" : "Review Req.")}
                      </div>
                    </div>

                    {/* Aptitude & Coding */}
                    <div className="bg-[#1c2230]/70 border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between text-left relative">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">DSA Score</span>
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-white">
                        {auditStudent.cgpa >= 9.0 ? "98% Top" : auditStudent.cgpa >= 8.5 ? "94% Top" : "86% Top"}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOverrideModalOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/20 text-xs font-semibold transition active:scale-[0.98] text-center"
              >
                Override Eligibility
              </button>

              <button
                onClick={() => setApproveModalOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition active:scale-[0.98] text-center"
              >
                Send Admission / Approve
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panels (Row 3): Upcoming Schedules (Left), Calendar (Center), Recent Activity (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Panel 1: Upcoming Schedules (Span 5) */}
        <div className="md:col-span-5 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Upcoming Schedules
            </h2>
            <button
              onClick={() => setActiveTab("schedules")}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Calendar view
            </button>
          </div>

          <div className="space-y-3">
            {upcomingSchedules.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => setScheduleDetailsModal(item)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1c2230]/70 border border-white/[0.05] hover:border-white/15 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <CompanyLogoRenderer name={item.company} />
                  <div>
                    <h4 className="text-xs font-medium text-white group-hover:text-sky-300 transition">
                      {item.candidate} - {item.round}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {item.interviewer}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300 tracking-tight block">
                    {item.time}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Calendar Widget (Span 3) */}
        <div className="md:col-span-3 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-200">
              Calendar
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Days of week header: M T W T F S S */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 mb-2">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Calendar Day Matrix */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
            {calendarRows.flat().map((item, idx) => {
              const isSelected = item.currentMonth && item.day === selectedCalendarDay;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.currentMonth) {
                      setSelectedCalendarDay(item.day);
                    }
                  }}
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] transition font-medium ${
                    isSelected
                      ? "bg-sky-500 text-white font-bold shadow-[0_0_12px_rgba(14,165,233,0.5)]"
                      : item.currentMonth
                      ? "text-slate-300 hover:bg-white/10"
                      : "text-slate-600 cursor-default"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
            <span>Selected: Oct {selectedCalendarDay}, 2026</span>
            <span className="text-sky-400 font-medium">3 Interviews</span>
          </div>
        </div>

        {/* Panel 3: Recent System Activity / Notifications (Span 4) */}
        <div className="md:col-span-4 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 truncate">
              Recent System activity / notifications
            </h2>
            <button
              onClick={() => setActiveTab("candidates")}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium shrink-0"
            >
              View audit log
            </button>
          </div>

          <div className="space-y-3.5">
            
            {/* Activity 1: Rahul Sharma Verification */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white">Rahul Sharma</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Candidate verification: the new candidates verified for placement pool.
                </p>
              </div>
            </div>

            {/* Activity 2: No Active Backlogs */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white">No Active Backlogs</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Branch Highlight: Eligible for Google & Microsoft drives (CS cohort).
                </p>
              </div>
            </div>

            {/* Activity 3: Offer Released */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white">Offer Letter Dispatched</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Aakash Roy officially placed at Google Core Engineering (₹32 LPA).
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Override Eligibility Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Administrative Eligibility Override</h3>
              </div>
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to issue a signed academic policy exception for{" "}
              <strong className="text-white">{auditStudent.name}</strong> ({auditStudent.rollNumber}).
              This authorizes the student to proceed to technical screening rounds regardless of standard threshold filters.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Override Audit Justification</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full bg-[#11151e] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
              >
                Confirm & Log Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Admission Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Approve Admission / Fast-Track Pass</h3>
              </div>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Verify candidate credentials and issue a verified entrance pass for{" "}
              <strong className="text-white">{auditStudent.name}</strong> into{" "}
              <strong className="text-sky-300">Google • Software Engineer</strong> technical interview pool.
            </p>

            <div className="bg-[#121620] border border-white/5 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Verified CGPA:</span>
                <span className="text-white font-semibold">{auditStudent.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active Backlogs:</span>
                <span className="text-emerald-400 font-semibold">0 (Passed)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Branch:</span>
                <span className="text-white font-semibold">{auditStudent.branch} (2025)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-lg shadow-sky-500/25"
              >
                Authorize & Send Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      {scheduleDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CompanyLogoRenderer name={scheduleDetailsModal.company} />
                <div>
                  <h3 className="text-sm font-bold text-white">{scheduleDetailsModal.round}</h3>
                  <p className="text-xs text-slate-400">{scheduleDetailsModal.company} Campus Drive</p>
                </div>
              </div>
              <button
                onClick={() => setScheduleDetailsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#121620] border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Candidate:</span>
                <span className="text-white font-semibold">{scheduleDetailsModal.candidate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time Slot:</span>
                <span className="text-sky-400 font-semibold">{scheduleDetailsModal.time} (Today)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Interviewer:</span>
                <span className="text-white font-medium">{scheduleDetailsModal.interviewer}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Room / Video Link:</span>
                <a
                  href={scheduleDetailsModal.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  Join Google Meet <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setScheduleDetailsModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Close
              </button>
              <a
                href={scheduleDetailsModal.meetLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-500/20"
              >
                <span>Launch Meeting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
