import React, { useState, useMemo } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { EligibilityBadge } from "../common/EligibilityBadge";
import { StatusBadge } from "../common/StatusBadge";
import { checkEligibility } from "../../utils/eligibilityChecker";
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  ChevronRight,
  Filter,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { BRANCH_LIST } from "../../data/mockData";

export function JobExplorer({ onNavigateToApplications }) {
  const { jobs, activeStudent, applications, applyToJob } = usePlacement();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [minCtcFilter, setMinCtcFilter] = useState(0);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [applyConfirmJob, setApplyConfirmJob] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Map of student's current application statuses
  const studentApplicationsMap = useMemo(() => {
    const map = {};
    applications
      .filter((a) => a.studentId === activeStudent.id && a.status !== "withdrawn")
      .forEach((a) => {
        map[a.jobId] = a;
      });
    return map;
  }, [applications, activeStudent.id]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBranch =
        selectedBranch === "all" ||
        job.eligibility.allowedBranches.includes(selectedBranch);

      const matchesCtc = job.packageLpa >= Number(minCtcFilter);

      return matchesSearch && matchesBranch && matchesCtc;
    });
  }, [jobs, searchTerm, selectedBranch, minCtcFilter]);

  const handleApply = (job) => {
    const res = applyToJob(job.id, activeStudent.id);
    setApplyConfirmJob(null);
    if (res.success) {
      setToastMessage({
        type: "success",
        text: `Application submitted successfully to ${job.companyName} for ${job.role}!`
      });
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setToastMessage({
        type: "error",
        text: res.message
      });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`mb-4 p-4 rounded-xl text-xs font-semibold flex items-center justify-between border animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company (Google, TCS...), job role, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="all">Filter by Branch (All)</option>
              {BRANCH_LIST.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={minCtcFilter}
              onChange={(e) => setMinCtcFilter(Number(e.target.value))}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value={0}>Minimum CTC (Any)</option>
              <option value={8}>≥ ₹8.0 LPA</option>
              <option value={15}>≥ ₹15.0 LPA</option>
              <option value={25}>≥ ₹25.0 LPA (Super Dream)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredJobs.length}</strong> active recruitment drive{filteredJobs.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-indigo-600 font-medium">
            Real-time automated eligibility audit applied for {activeStudent.name}
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          const existingApp = studentApplicationsMap[job.id];
          const eligibility = checkEligibility(activeStudent, job);

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {job.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {job.companyName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {job.role}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.department}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    ₹{job.packageLpa} LPA
                  </span>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location} ({job.workplaceType})</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: {job.deadline}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.openings} Openings</span>
                  </span>
                </div>

                {/* Brief description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Eligibility Criteria Breakdown Bar */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Eligibility:</span>
                    <EligibilityBadge student={activeStudent} job={job} />
                  </div>

                  <button
                    onClick={() => setSelectedJobForModal(job)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5"
                  >
                    <span>View Rounds & Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                {existingApp ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <StatusBadge status={existingApp.status} />
                    </div>
                    {onNavigateToApplications && (
                      <button
                        onClick={onNavigateToApplications}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Track Progress →
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-[11px] text-slate-500">
                      Min CGPA: <strong className="text-slate-700">{job.eligibility.minCgpa}</strong> • Max Backlogs: <strong className="text-slate-700">{job.eligibility.maxBacklogs}</strong>
                    </div>

                    {eligibility.isEligible ? (
                      <button
                        type="button"
                        onClick={() => setApplyConfirmJob(job)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-100 flex items-center gap-1.5"
                      >
                        <span>Apply for Drive</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          // Open details modal to explain why
                          setSelectedJobForModal(job);
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        title="Click to see why you are not eligible"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ineligible Criteria</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal to Apply */}
      {applyConfirmJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Application Submission
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are applying for <strong className="text-slate-800">{applyConfirmJob.role}</strong> at <strong className="text-slate-800">{applyConfirmJob.companyName}</strong>.
            </p>

            <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="font-semibold text-slate-700 border-b pb-1.5">
                Profile Data to be Shared with Recruiter:
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Candidate:</span>
                <strong className="text-slate-900">{activeStudent.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Roll Number:</span>
                <strong className="text-slate-900">{activeStudent.rollNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Branch & CGPA:</span>
                <strong className="text-slate-900">{activeStudent.branch} ({activeStudent.cgpa} CGPA)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Resume Attached:</span>
                <strong className="text-indigo-600">{activeStudent.resumeUrl}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setApplyConfirmJob(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(applyConfirmJob)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100"
              >
                Confirm & Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Job Details Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {selectedJobForModal.companyName} Drive
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedJobForModal.role}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedJobForModal.packageDisplay} • {selectedJobForModal.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                  About the Role & Team
                </h4>
                <p className="leading-relaxed text-slate-600">{selectedJobForModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                  Selection & Interview Rounds
                </h4>
                <div className="space-y-2">
                  {selectedJobForModal.rounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {round.roundNumber}
                        </span>
                        <span className="font-semibold text-slate-800">{round.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{round.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                  Mandatory Eligibility Criteria
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <p>• <strong>Minimum CGPA:</strong> {selectedJobForModal.eligibility.minCgpa}</p>
                  <p>• <strong>Allowed Branches:</strong> {selectedJobForModal.eligibility.allowedBranches.join(", ")}</p>
                  <p>• <strong>Maximum Active Backlogs:</strong> {selectedJobForModal.eligibility.maxBacklogs}</p>
                  <p>• <strong>Eligible Passing Batch:</strong> Class of {selectedJobForModal.eligibility.graduationYear}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <EligibilityBadge student={activeStudent} job={selectedJobForModal} />
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
