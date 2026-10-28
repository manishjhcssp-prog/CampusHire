import React from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  Download,
  Award,
  Users,
  Briefcase,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";

export function ReportsView() {
  const { students, jobs } = usePlacement();

  // Branch statistics data
  const branchData = [
    { branch: "CS", placed: 94, total: 100, rate: 94 },
    { branch: "IT", placed: 88, total: 95, rate: 92 },
    { branch: "ECE", placed: 78, total: 92, rate: 84 },
    { branch: "EE", placed: 65, total: 80, rate: 81 },
    { branch: "Mech", placed: 58, total: 75, rate: 77 },
    { branch: "Civil", placed: 45, total: 68, rate: 66 }
  ];

  // CTC Package brackets
  const packageBrackets = [
    { name: "Super Dream (>20 LPA)", count: 48, color: "#38bdf8" },
    { name: "Dream (10-20 LPA)", count: 185, color: "#818cf8" },
    { name: "Core Tech (6-10 LPA)", count: 320, color: "#34d399" },
    { name: "Mass Recruitment (3-6 LPA)", count: 152, color: "#fbbf24" }
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Roll Number,Branch,CGPA,Status,Company,Package LPA\n" +
      students
        .map(
          (s) =>
            `"${s.name}","${s.rollNumber}","${s.branch}",${s.cgpa},"${s.placementStatus}","${
              s.placedCompany || "N/A"
            }",${s.offeredCtc || 0}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CampusHire_Placement_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <span>Placement Analytics & Audit Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated conversion rates, salary package distributions, and branch performance.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/20 transition shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Official CSV Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Average CTC</span>
          <div className="text-2xl font-black text-white mt-1">₹14.8 LPA</div>
          <span className="text-[10px] text-emerald-400 font-medium">+18% YoY growth</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Highest Package</span>
          <div className="text-2xl font-black text-sky-400 mt-1">₹44.0 LPA</div>
          <span className="text-[10px] text-slate-400">Google SWE (Bangalore)</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Total Offers Released</span>
          <div className="text-2xl font-black text-white mt-1">705 Offers</div>
          <span className="text-[10px] text-emerald-400 font-medium">84% of cohort placed</span>
        </div>

        <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Partner Recruiters</span>
          <div className="text-2xl font-black text-white mt-1">42 Companies</div>
          <span className="text-[10px] text-slate-400">24 Ongoing Drives</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Branch Placement Chart */}
        <div className="lg:col-span-7 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">
            Placement Rate by Engineering Branch (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Percentage of registered final-year students placed per branch.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <XAxis dataKey="branch" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161b25",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                  formatter={(val) => [`${val}%`, "Placement Rate"]}
                />
                <Bar dataKey="rate" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTC Distribution */}
        <div className="lg:col-span-5 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              CTC Bracket Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Number of students in each compensation tier.
            </p>

            <div className="space-y-3">
              {packageBrackets.map((tier, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{tier.name}</span>
                    <span className="text-white font-bold">{tier.count} Students</span>
                  </div>
                  <div className="w-full h-2 bg-[#11151e] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: tier.color,
                        width: `${(tier.count / 705) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 text-center">
            Audited & verified against university placement bylaws
          </div>
        </div>

      </div>
    </div>
  );
}
