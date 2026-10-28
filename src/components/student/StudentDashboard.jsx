import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { StudentProfileCard } from "./StudentProfileCard";
import { JobExplorer } from "./JobExplorer";
import { MyApplications } from "./MyApplications";
import { InterviewSchedule } from "./InterviewSchedule";
import { checkEligibility } from "../../utils/eligibilityChecker";
import {
  Compass,
  FileCheck2,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Award,
  Layers
} from "lucide-react";

export function StudentDashboard() {
  const { activeStudent, jobs, applications } = usePlacement();
  const [activeTab, setActiveTab] = useState("explore"); // 'explore' | 'applications' | 'interviews'

  // Calculations
  const studentApps = applications.filter(
    (a) => a.studentId === activeStudent.id && a.status !== "withdrawn"
  );
  const scheduledInterviews = studentApps.filter((a) => a.interviewScheduled);
  const offersReceived = studentApps.filter((a) => a.status === "selected");

  // Number of eligible jobs
  const eligibleJobsCount = jobs.filter(
    (j) => checkEligibility(activeStudent, j).isEligible
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Student Profile Card (always accessible on top) */}
      <StudentProfileCard />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Eligible Drives
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900">{eligibleJobsCount}</span>
              <span className="text-xs text-slate-400">of {jobs.length} open</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Applied Drives
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900">{studentApps.length}</span>
              <span className="text-xs text-slate-400">submitted</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Interviews Active
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900">
                {scheduledInterviews.length}
              </span>
              <span className="text-xs text-slate-400">rounds</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Offers Extended
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-emerald-600">
                {offersReceived.length}
              </span>
              <span className="text-xs text-slate-400">company offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "explore"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore Open Drives</span>
          <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {jobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "applications"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>My Applications</span>
          {studentApps.length > 0 && (
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {studentApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("interviews")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "interviews"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Interview Timetable</span>
          {scheduledInterviews.length > 0 && (
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {scheduledInterviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "explore" && (
          <JobExplorer onNavigateToApplications={() => setActiveTab("applications")} />
        )}
        {activeTab === "applications" && (
          <MyApplications onExploreJobs={() => setActiveTab("explore")} />
        )}
        {activeTab === "interviews" && <InterviewSchedule />}
      </div>
    </div>
  );
}
