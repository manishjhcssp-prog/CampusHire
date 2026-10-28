import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { CompanyLogoRenderer } from "../common/CompanyLogos";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Users,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  X
} from "lucide-react";

export function RecruitmentDrivesView() {
  const { jobs, createJob, currentRole, applyToJob, activeStudentId } = usePlacement();
  const [filterBranch, setFilterBranch] = useState("all");
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDriveDetails, setSelectedDriveDetails] = useState(null);

  // Form State for creating a new drive
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    packageLpa: "",
    minCgpa: "7.0",
    maxBacklogs: "0",
    deadline: "2026-11-30",
    openings: "10",
    location: "Bangalore / Hybrid",
    description: ""
  });

  const filteredJobs = jobs.filter((job) => {
    if (filterBranch !== "all") {
      if (
        job.eligibility?.allowedBranches &&
        !job.eligibility.allowedBranches.includes(filterBranch)
      ) {
        return false;
      }
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        job.companyName.toLowerCase().includes(q) ||
        job.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.role) return;

    createJob({
      companyName: formData.companyName,
      role: formData.role,
      packageLpa: parseFloat(formData.packageLpa) || 12.0,
      packageDisplay: `₹${formData.packageLpa || 12.0} LPA`,
      location: formData.location,
      deadline: formData.deadline,
      openings: parseInt(formData.openings) || 5,
      description: formData.description || "Exciting campus hiring opportunity.",
      eligibleCount: 220,
      appliedCount: 0,
      stages: ["Screening", "Interview", "Offer"],
      activeStage: "Screening",
      eligibility: {
        minCgpa: parseFloat(formData.minCgpa) || 7.0,
        maxBacklogs: parseInt(formData.maxBacklogs) || 0,
        allowedBranches: ["Computer Science", "Information Technology", "Electronics & Comm."]
      }
    });

    setCreateModalOpen(false);
    setFormData({
      companyName: "",
      role: "",
      packageLpa: "",
      minCgpa: "7.0",
      maxBacklogs: "0",
      deadline: "2026-11-30",
      openings: "10",
      location: "Bangalore / Hybrid",
      description: ""
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161b25] border border-white/[0.07] rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <span>Campus Recruitment Drives (24 Active)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage corporate placement pipelines, eligibility thresholds, and applicant progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter companies, roles..."
              className="w-full bg-[#11151e] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Drive</span>
          </button>
        </div>
      </div>

      {/* Grid of Drives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-[#161b25] border border-white/[0.07] hover:border-white/15 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CompanyLogoRenderer name={job.companyName} />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                      {job.companyName}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {job.role}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {job.driveStatus || "Active"}
                </span>
              </div>

              {/* Package & Location */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <div className="text-white font-bold">
                  ₹{job.packageLpa} LPA
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{job.location || "Hybrid"}</span>
                </div>
              </div>

              {/* Eligibility Bar */}
              <div className="mt-3 bg-[#11151e] border border-white/5 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Min CGPA:</span>
                  <span className="font-semibold text-white">
                    {job.eligibility?.minCgpa || 7.0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Backlogs Allowed:</span>
                  <span className="font-semibold text-white">
                    {job.eligibility?.maxBacklogs ?? 0}
                  </span>
                </div>
              </div>

              {/* Pipeline Tracker */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-500 block mb-1">Pipeline Stages</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {(job.stages || ["Screening", "Tech Round", "Interview", "Offer"]).map(
                    (stage, idx) => {
                      const isActive = (job.activeStage || "Screening") === stage;
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            isActive
                              ? "bg-sky-500 text-white font-bold shadow-sm"
                              : "bg-[#1f2636] text-slate-400"
                          }`}
                        >
                          {stage}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div className="text-slate-400 text-[11px]">
                <strong className="text-white">{job.appliedCount || 0}</strong> applicants
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDriveDetails(job)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-medium transition"
                >
                  Details
                </button>

                {currentRole === "student" && (
                  <button
                    onClick={() => {
                      applyToJob(job.id, activeStudentId);
                      alert(`Successfully applied to ${job.companyName} for ${job.role}!`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition"
                  >
                    1-Click Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drive Details Modal */}
      {selectedDriveDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CompanyLogoRenderer name={selectedDriveDetails.companyName} />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedDriveDetails.companyName} • {selectedDriveDetails.role}
                  </h3>
                  <span className="text-xs text-sky-400 font-semibold">
                    Package: ₹{selectedDriveDetails.packageLpa} LPA
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriveDetails(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedDriveDetails.description ||
                "Corporate campus recruitment drive for final year engineering students."}
            </p>

            <div className="bg-[#121620] border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Eligible Candidate Count:</span>
                <span className="text-white font-semibold">
                  {selectedDriveDetails.eligibleCount || 280} students
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Applications Submitted:</span>
                <span className="text-white font-semibold">
                  {selectedDriveDetails.appliedCount || 195} candidates
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Application Deadline:</span>
                <span className="text-white font-semibold">
                  {selectedDriveDetails.deadline}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Eligible Branches:</span>
                <span className="text-slate-200">
                  {selectedDriveDetails.eligibility?.allowedBranches?.join(", ") || "All Branches"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDriveDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Drive Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Post New Recruitment Drive</span>
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Cisco Systems, Atlassian"
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Associate Site Reliability Engineer"
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Package (CTC in LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.packageLpa}
                    onChange={(e) => setFormData({ ...formData, packageLpa: e.target.value })}
                    placeholder="e.g. 18.5"
                    className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold transition shadow-lg shadow-sky-600/30"
                >
                  Create & Launch Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
