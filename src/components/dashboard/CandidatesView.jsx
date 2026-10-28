import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Award,
  GraduationCap
} from "lucide-react";
import { BRANCH_LIST } from "../../data/mockData";

export function CandidatesView() {
  const { students, overrideStudentEligibility, approveStudentAdmission } = usePlacement();
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [inspectStudent, setInspectStudent] = useState(null);

  const filteredStudents = students.filter((s) => {
    if (selectedBranch !== "all" && s.branch !== selectedBranch) return false;
    if (selectedStatus !== "all" && s.placementStatus !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.skills?.some((skill) => skill.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Filters */}
      <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>Student Candidate Pool ({students.length} Total Enrolled)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time audit verification, academic standing, and job match records.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, roll no, skills..."
              className="w-full bg-[#11151e] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/[0.05] text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Branch:
          </span>
          <button
            onClick={() => setSelectedBranch("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
              selectedBranch === "all"
                ? "bg-sky-500 text-white font-bold"
                : "bg-[#11151e] text-slate-400 hover:text-white"
            }`}
          >
            All Branches
          </button>
          {BRANCH_LIST.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                selectedBranch === branch
                  ? "bg-sky-500 text-white font-bold"
                  : "bg-[#11151e] text-slate-400 hover:text-white"
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Data Table */}
      <div className="bg-[#161b25] border border-white/[0.07] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#11151e] text-slate-400 text-[11px] font-medium border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-3 text-center">Backlogs</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Audit Standing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    {s.rollNumber}
                  </td>

                  <td className="py-3 px-3 text-slate-200">
                    {s.branch}
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-white">
                    {s.cgpa}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {s.activeBacklogs === 0 ? (
                      <span className="text-[11px] text-emerald-400 font-semibold">0 (Clear)</span>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-semibold">{s.activeBacklogs} Arrear</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.placementStatus === "Placed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : s.placementStatus === "In Progress"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                          : "bg-slate-700/40 text-slate-300"
                      }`}
                    >
                      {s.placementStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {s.overrideEligibility ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-semibold border border-amber-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Admin Overridden
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectStudent(s)}
                      className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-medium transition"
                    >
                      Audit Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={inspectStudent.avatar}
                  alt={inspectStudent.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{inspectStudent.name}</h3>
                  <p className="text-xs text-slate-400">
                    {inspectStudent.branch} • Class of {inspectStudent.graduationYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#121620] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[11px]">Cumulative CGPA</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  {inspectStudent.cgpa} / 10
                </span>
              </div>
              <div className="bg-[#121620] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[11px]">Academic Backlogs</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">
                  {inspectStudent.activeBacklogs}
                </span>
              </div>
            </div>

            <div className="bg-[#121620] p-3 rounded-xl border border-white/5 text-xs space-y-1">
              <span className="text-slate-400 block text-[11px]">Technical Skills</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inspectStudent.skills?.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#1d2331] text-sky-300 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  overrideStudentEligibility(inspectStudent.id, true);
                  alert(`Override applied for ${inspectStudent.name}!`);
                  setInspectStudent(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
              >
                Grant Override
              </button>

              <button
                onClick={() => {
                  approveStudentAdmission(inspectStudent.id);
                  alert(`Approved direct admission for ${inspectStudent.name}!`);
                  setInspectStudent(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-md transition"
              >
                Approve Admission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
