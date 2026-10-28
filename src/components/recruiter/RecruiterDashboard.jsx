import React, { useState, useMemo } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { StatusBadge } from "../common/StatusBadge";
import {
  Building2,
  Plus,
  Users,
  Calendar,
  Briefcase,
  CheckCircle,
  XCircle,
  Video,
  Clock,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  LayoutGrid,
  List
} from "lucide-react";
import { BRANCH_LIST } from "../../data/mockData";

export function RecruiterDashboard() {
  const {
    activeCompany,
    activeCompanyId,
    setActiveCompanyId,
    companies,
    jobs,
    createJob,
    applications,
    students,
    updateApplicationStatus,
    scheduleInterview
  } = usePlacement();

  const [activeTab, setActiveTab] = useState("pipeline"); // 'pipeline' | 'postings'
  const [pipelineViewMode, setPipelineViewMode] = useState("table"); // 'table' | 'kanban'
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [viewCandidateModal, setViewCandidateModal] = useState(null);

  // New Job Form State
  const [newJobForm, setNewJobForm] = useState({
    role: "",
    department: "Engineering",
    location: "Bangalore, India",
    workplaceType: "Hybrid",
    packageLpa: 18.0,
    packageDisplay: "₹18.0 LPA fixed + benefits",
    description: "",
    deadline: "2026-11-20",
    openings: 10,
    eligibility: {
      minCgpa: 7.5,
      allowedBranches: ["Computer Science", "Information Technology", "Electronics & Comm."],
      maxBacklogs: 0,
      graduationYear: 2026
    }
  });

  // Interview Schedule Form State
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    interviewRound: "Technical Round 1 (DS & Problem Solving)",
    interviewLink: "https://meet.google.com/rec-interview-session"
  });

  // Jobs belonging to active company
  const companyJobs = useMemo(() => {
    return jobs.filter((j) => j.companyId === activeCompanyId);
  }, [jobs, activeCompanyId]);

  const companyJobIds = useMemo(() => companyJobs.map((j) => j.id), [companyJobs]);

  // Applications belonging to active company
  const companyApplications = useMemo(() => {
    return applications.filter((app) => companyJobIds.includes(app.jobId));
  }, [applications, companyJobIds]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return companyApplications.filter((app) => {
      const student = students.find((s) => s.id === app.studentId);
      const matchesJob = selectedJobFilter === "all" || app.jobId === selectedJobFilter;
      const matchesStatus =
        selectedStatusFilter === "all" || app.status === selectedStatusFilter;
      const matchesSearch =
        !searchTerm ||
        (student &&
          (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.branch.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [companyApplications, selectedJobFilter, selectedStatusFilter, searchTerm, students]);

  // Handle Post New Job
  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    createJob({
      ...newJobForm,
      companyId: activeCompanyId,
      companyName: activeCompany.name,
      packageLpa: parseFloat(newJobForm.packageLpa) || 10,
      openings: parseInt(newJobForm.openings, 10) || 5
    });
    setNewJobModalOpen(false);
  };

  const toggleBranchSelection = (branch) => {
    setNewJobForm((prev) => {
      const branches = prev.eligibility.allowedBranches;
      const exists = branches.includes(branch);
      return {
        ...prev,
        eligibility: {
          ...prev.eligibility,
          allowedBranches: exists
            ? branches.filter((b) => b !== branch)
            : [...branches, branch]
        }
      };
    });
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (interviewModalApp) {
      scheduleInterview(interviewModalApp.id, interviewForm);
      setInterviewModalApp(null);
    }
  };

  const kanbanColumns = [
    { key: "submitted", title: "Applications Received", color: "border-blue-300" },
    { key: "shortlisted", title: "Shortlisted", color: "border-purple-300" },
    { key: "interview", title: "Interview Stage", color: "border-amber-300" },
    { key: "selected", title: "Offers Extended", color: "border-emerald-300" },
    { key: "rejected", title: "Not Selected", color: "border-rose-300" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Recruiter Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {activeCompany.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{activeCompany.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {activeCompany.industry}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{activeCompany.tagline}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span>HQ: {activeCompany.headquarters}</span>
              <span>•</span>
              <a
                href={activeCompany.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline flex items-center gap-0.5"
              >
                <span>Official Careers</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => setNewJobModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Drive Opening</span>
          </button>
        </div>
      </div>

      {/* Recruiter Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Job Openings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{companyJobs.length}</span>
            <span className="text-xs text-slate-400">roles listed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Candidates Applied
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">
              {companyApplications.length}
            </span>
            <span className="text-xs text-slate-400">profiles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            In Interview Pipeline
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-600">
              {companyApplications.filter((a) => a.status === "interview").length}
            </span>
            <span className="text-xs text-slate-400">candidates</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Offers Extended
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600">
              {companyApplications.filter((a) => a.status === "selected").length}
            </span>
            <span className="text-xs text-slate-400">selected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
              activeTab === "pipeline"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Hiring Pipeline</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {companyApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("postings")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
              activeTab === "postings"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Drive Postings & Eligibility</span>
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {companyJobs.length}
            </span>
          </button>
        </div>

        {/* View toggle for pipeline */}
        {activeTab === "pipeline" && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-2">
            <button
              onClick={() => setPipelineViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                pipelineViewMode === "table" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPipelineViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                pipelineViewMode === "kanban" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600"
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tab: Pipeline */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate by name, roll no, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                >
                  <option value="all">All Company Openings</option>
                  {companyJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                >
                  <option value="all">All Stages</option>
                  <option value="submitted">Submitted</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected (Offer)</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table View */}
          {pipelineViewMode === "table" ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Applied Role</th>
                      <th className="py-3 px-4">Academic Record</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4">Interview Info</th>
                      <th className="py-3 px-4 text-right">Workflow Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No applicants match the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => {
                        const student = students.find((s) => s.id === app.studentId);
                        const job = jobs.find((j) => j.id === app.jobId);
                        if (!student) return null;

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Candidate */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <button
                                    onClick={() => setViewCandidateModal(student)}
                                    className="font-bold text-slate-900 hover:text-indigo-600 text-left block"
                                  >
                                    {student.name}
                                  </button>
                                  <span className="text-[11px] text-slate-500">
                                    {student.rollNumber} • {student.branch.split(" ")[0]}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Job */}
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800 block">
                                {job ? job.role : "Opening"}
                              </span>
                              <span className="text-[11px] text-slate-400">{app.appliedDate}</span>
                            </td>

                            {/* Academics */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md font-bold text-slate-800 bg-slate-100">
                                  {student.cgpa} CGPA
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                    student.activeBacklogs === 0
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {student.activeBacklogs} Backlogs
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <StatusBadge status={app.status} size="sm" />
                            </td>

                            {/* Interview info */}
                            <td className="py-3 px-4">
                              {app.interviewScheduled ? (
                                <div className="text-[11px] text-indigo-700 font-semibold">
                                  <span>{app.interviewRound}</span>
                                  <span className="block text-slate-400 font-normal">
                                    {new Date(app.interviewDate).toLocaleDateString([], {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">Not scheduled</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {app.status === "submitted" && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, "shortlisted")}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px]"
                                  >
                                    Shortlist
                                  </button>
                                )}

                                {app.status !== "selected" && app.status !== "rejected" && app.status !== "withdrawn" && (
                                  <button
                                    onClick={() => {
                                      setInterviewModalApp(app);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] flex items-center gap-1"
                                  >
                                    <Calendar className="w-3 h-3" />
                                    <span>Schedule</span>
                                  </button>
                                )}

                                {app.status !== "selected" && app.status !== "rejected" && app.status !== "withdrawn" && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, "selected")}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Offer</span>
                                  </button>
                                )}

                                {app.status !== "rejected" && app.status !== "withdrawn" && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, "rejected")}
                                    className="px-2 py-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-medium text-[11px]"
                                    title="Reject candidate"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Kanban Board View */
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {kanbanColumns.map((col) => {
                const columnApps = filteredApplications.filter((a) => a.status === col.key);

                return (
                  <div
                    key={col.key}
                    className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[700px]"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800">{col.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border">
                        {columnApps.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                      {columnApps.map((app) => {
                        const student = students.find((s) => s.id === app.studentId);
                        const job = jobs.find((j) => j.id === app.jobId);
                        if (!student) return null;

                        return (
                          <div
                            key={app.id}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {student.name}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {student.cgpa} CGPA
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 truncate">
                              {student.branch.split(" ")[0]} • {job?.role}
                            </p>

                            {/* Candidate Quick Actions */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={() => setViewCandidateModal(student)}
                                className="text-[10px] text-slate-500 hover:text-indigo-600 font-semibold"
                              >
                                View Resume
                              </button>

                              <div className="flex items-center gap-1">
                                {col.key === "submitted" && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, "shortlisted")}
                                    className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded"
                                  >
                                    Shortlist
                                  </button>
                                )}
                                {col.key === "shortlisted" && (
                                  <button
                                    onClick={() => setInterviewModalApp(app)}
                                    className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded"
                                  >
                                    Interview
                                  </button>
                                )}
                                {col.key === "interview" && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, "selected")}
                                    className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded"
                                  >
                                    Select
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Postings */}
      {activeTab === "postings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{job.role}</h3>
                    <p className="text-xs text-slate-500">{job.department} • {job.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ₹{job.packageLpa} LPA
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block mb-1">Configured Eligibility:</span>
                  <p>• Min CGPA: <strong className="text-slate-900">{job.eligibility.minCgpa}</strong></p>
                  <p>• Max Active Backlogs: <strong className="text-slate-900">{job.eligibility.maxBacklogs}</strong></p>
                  <p>• Allowed Branches: <span className="text-slate-600">{job.eligibility.allowedBranches.join(", ")}</span></p>
                  <p>• Passing Year: <strong className="text-slate-900">Class of {job.eligibility.graduationYear}</strong></p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                  <span>Openings: <strong className="text-slate-800">{job.openings}</strong></span>
                  <span>Deadline: <strong className="text-slate-800">{job.deadline}</strong></span>
                  <span className="font-bold text-emerald-600">{job.driveStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Schedule Candidate Interview</h3>
            <p className="text-xs text-slate-500 mt-1">
              Set interview time and generate meeting link for the shortlisted applicant.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Interview Round Title
                </label>
                <input
                  type="text"
                  value={interviewForm.interviewRound}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewRound: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewForm.interviewDate}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewDate: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Meeting Link (Google Meet / Teams)
                </label>
                <input
                  type="url"
                  value={interviewForm.interviewLink}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewLink: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post New Job Modal */}
      {newJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="text-lg font-bold text-slate-900">
                Create Campus Recruitment Drive Posting
              </h3>
              <button
                onClick={() => setNewJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Job Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graduate Software Engineer"
                    value={newJobForm.role}
                    onChange={(e) => setNewJobForm({ ...newJobForm, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    value={newJobForm.department}
                    onChange={(e) =>
                      setNewJobForm({ ...newJobForm, department: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Package (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newJobForm.packageLpa}
                    onChange={(e) =>
                      setNewJobForm({ ...newJobForm, packageLpa: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Package Display Text
                  </label>
                  <input
                    type="text"
                    value={newJobForm.packageDisplay}
                    onChange={(e) =>
                      setNewJobForm({ ...newJobForm, packageDisplay: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={newJobForm.deadline}
                    onChange={(e) => setNewJobForm({ ...newJobForm, deadline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Job Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={newJobForm.description}
                  onChange={(e) =>
                    setNewJobForm({ ...newJobForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Detail role expectations, tech stack, and benefits..."
                  required
                />
              </div>

              {/* Eligibility Criteria Sub-Form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Automated Eligibility Rules Configuration
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Minimum CGPA Cutoff
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newJobForm.eligibility.minCgpa}
                      onChange={(e) =>
                        setNewJobForm({
                          ...newJobForm,
                          eligibility: {
                            ...newJobForm.eligibility,
                            minCgpa: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border rounded-xl border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Max Active Backlogs Allowed
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={newJobForm.eligibility.maxBacklogs}
                      onChange={(e) =>
                        setNewJobForm({
                          ...newJobForm,
                          eligibility: {
                            ...newJobForm.eligibility,
                            maxBacklogs: parseInt(e.target.value, 10) || 0
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border rounded-xl border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Allowed Branches / Specializations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BRANCH_LIST.map((branch) => {
                      const isSelected = newJobForm.eligibility.allowedBranches.includes(branch);
                      return (
                        <button
                          type="button"
                          key={branch}
                          onClick={() => toggleBranchSelection(branch)}
                          className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {branch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNewJobModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Publish Recruitment Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Resume & Details Modal */}
      {viewCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-left border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={viewCandidateModal.avatar}
                  alt={viewCandidateModal.name}
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {viewCandidateModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {viewCandidateModal.rollNumber} • {viewCandidateModal.branch}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewCandidateModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-500 block">CGPA:</span>
                  <span className="text-base font-bold text-slate-900">{viewCandidateModal.cgpa} / 10.0</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Active Backlogs:</span>
                  <span className="text-base font-bold text-slate-900">{viewCandidateModal.activeBacklogs}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Graduation Batch:</span>
                  <span className="font-semibold text-slate-900">Class of {viewCandidateModal.graduationYear}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact:</span>
                  <span className="font-semibold text-slate-900">{viewCandidateModal.email}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Key Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewCandidateModal.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 border rounded-xl flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                      {viewCandidateModal.resumeUrl}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF Document</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Simulated Download of ${viewCandidateModal.resumeUrl}`)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px]"
                >
                  Download Resume
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setViewCandidateModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
