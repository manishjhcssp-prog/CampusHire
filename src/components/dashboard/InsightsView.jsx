import React from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  Sparkles,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from "lucide-react";

export function InsightsView() {
  const { setActiveTab } = usePlacement();

  const skillGaps = [
    { skill: "System Design & Microservices", demand: 92, supply: 64, gap: "High Demand" },
    { skill: "React / TypeScript / Next.js", demand: 88, supply: 78, gap: "Balanced" },
    { skill: "Cloud (AWS / Azure DevOps)", demand: 85, supply: 52, gap: "Critical Shortage" },
    { skill: "Machine Learning & LLMs", demand: 76, supply: 60, gap: "Emerging" },
    { skill: "Embedded Systems / C++", demand: 62, supply: 48, gap: "Moderate" }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-[#161b25] to-[#161b25] border border-sky-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Placement Intelligence Engine</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Smart Cohort Insights & Policy Recommendations
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Machine intelligence models analyze recruiter job specs, interview conversion rates, and student eligibility to forecast hiring velocity.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("candidates")}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition shrink-0 flex items-center gap-1.5"
        >
          <span>Audit Candidate Readiness</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: Skill Demand Matrix & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Skill Demand vs Supply */}
        <div className="lg:col-span-7 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Industry Skill Demand vs Student Supply
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Identifies curriculum gaps where companies are actively hiring.
              </p>
            </div>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-4">
            {skillGaps.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{item.skill}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.gap === "Critical Shortage"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : item.gap === "High Demand"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {item.gap}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Recruiter Demand</span>
                      <span className="text-sky-400 font-bold">{item.demand}%</span>
                    </div>
                    <div className="h-1.5 bg-[#11151e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${item.demand}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cohort Proficiency</span>
                      <span className="text-slate-200 font-bold">{item.supply}%</span>
                    </div>
                    <div className="h-1.5 bg-[#11151e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full"
                        style={{ width: `${item.supply}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Smart Strategic Recommendations</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#11151e] border border-white/5 space-y-1">
                <span className="font-bold text-sky-400 block">
                  1. Conduct AWS & Cloud Bootcamp
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Amazon & Microsoft have 18 pending cloud openings requiring Docker & AWS certification. Hosting a 3-day boot camp will increase candidate pass rate by +32%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#11151e] border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 block">
                  2. Relax Backlog Policy for Mechanical & Civil
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Deloitte & TCS accept up to 1 historical backlog. Enabling policy override for 14 students will lift total placement rate to 88%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#11151e] border border-white/5 space-y-1">
                <span className="font-bold text-amber-400 block">
                  3. Peer Mock Interviews for Tier-1 Tech
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Students passing System Design rounds at Google can mentor candidate pools for Amazon & Microsoft technical rounds.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
