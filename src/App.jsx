import React from "react";
import { PlacementProvider, usePlacement } from "./context/PlacementContext";
import { Header } from "./components/common/Header";
import { CampusHireOverview } from "./components/dashboard/CampusHireOverview";
import { RecruitmentDrivesView } from "./components/dashboard/RecruitmentDrivesView";
import { CandidatesView } from "./components/dashboard/CandidatesView";
import { SchedulesView } from "./components/dashboard/SchedulesView";
import { ReportsView } from "./components/dashboard/ReportsView";
import { InsightsView } from "./components/dashboard/InsightsView";
import { CampusHireStudentPortal } from "./components/student/CampusHireStudentPortal";
import { CampusHireRecruiterPortal } from "./components/recruiter/CampusHireRecruiterPortal";

function MainContent() {
  const { currentRole, activeTab } = usePlacement();

  // If role is Student
  if (currentRole === "student") {
    return <CampusHireStudentPortal />;
  }

  // If role is Recruiter
  if (currentRole === "recruiter") {
    return <CampusHireRecruiterPortal />;
  }

  // Admin / TPO role views based on active navigation tab
  switch (activeTab) {
    case "drives":
      return <RecruitmentDrivesView />;
    case "candidates":
      return <CandidatesView />;
    case "schedules":
      return <SchedulesView />;
    case "reports":
      return <ReportsView />;
    case "insights":
      return <InsightsView />;
    case "overview":
    default:
      return <CampusHireOverview />;
  }
}

export default function App() {
  return (
    <PlacementProvider>
      <div className="min-h-screen bg-[#0e1219] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
        
        {/* Sleek Top Navigation Header */}
        <Header />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MainContent />
        </main>

        {/* Minimalist Dark Footer */}
        <footer className="border-t border-white/[0.05] bg-[#0c1017] py-5 text-center text-xs text-slate-500">
          <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">CampusHire</span>
              <span>•</span>
              <span>Enterprise College Placement & Talent Verification System</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Campus Placement Portal • Problem HACK-P410
            </div>
          </div>
        </footer>

      </div>
    </PlacementProvider>
  );
}
