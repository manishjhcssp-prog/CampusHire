import React, { useState, useMemo } from "react";
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
  Cell,
  Legend
} from "recharts";
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Building2,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Briefcase,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { BRANCH_LIST } from "../../data/mockData";

export function TpoDashboard() {
  const { students, jobs, applications, companies } = usePlacement();
  const [activeTab, setActiveTab] = useState("analytics"); // 'analytics' | 'students' | 'drives'
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");

  // Key Metrics Calculations
  const totalStudents = students.length;
  const placedStudents = students.filter((s) => s.placementStatus === "Placed");
  const placementRate = ((placedStudents.length / totalStudents) * 100).toFixed(1);

  const placedCtcList = placedStudents
    .map((s) => s.offeredCtc)
    .filter((ctc) => typeof ctc === "number" && !isNaN(ctc));

  const averageCtc = placedCtcList.length
    ? (placedCtcList.reduce((acc, curr) => acc + curr, 0) / placedCtcList.length).toFixed(2)
    : "0.00";

  const highestCtc = placedCtcList.length ? Math.max(...placedCtcList).toFixed(1) : "0.0";

  const totalApplicationsCount = applications.length;
  const activeDrivesCount = jobs.filter((j) => j.driveStatus === "Ongoing").length;

  // Chart Data 1: Branch-wise Placement Statistics
  const branchChartData = useMemo(() => {
    return BRANCH_LIST.map((branch) => {
      const branchStudents = students.filter((s) => s.branch === branch);
      const placed = branchStudents.filter((s) => s.placementStatus === "Placed").length;
      const total = branchStudents.length;
      const rate = total > 0 ? Math.round((placed / total) * 100) : 0;
      return {
        name: branch.replace("Engg", "").replace("Electronics & Comm.", "ECE").trim(),
        fullName: branch,
        placed,
        unplaced: total - placed,
        total,
        rate
      };
    });
  }, [students]);

  // Chart Data 2: Package Tiers Distribution
  const ctcTierData = useMemo(() => {
    let superDream = 0; // > 20 LPA
    let dream = 0; // 10 - 20 LPA
    let massTech = 0; // < 10 LPA

    placedStudents.forEach((s) => {
      if (s.offeredCtc >= 20) superDream++;
      else if (s.offeredCtc >= 10) dream++;
      else massTech++;
    });

    return [
      { name: "Super Dream (> ₹20 LPA)", count: superDream, color: "#4F46E5" },
      { name: "Dream (₹10 - 20 LPA)", count: dream, color: "#0EA5E9" },
      { name: "Core & Mass (< ₹10 LPA)", count: massTech, color: "#10B981" }
    ];
  }, [placedStudents]);

  // Chart Data 3: Application Pipeline Breakdown
  const pipelineFunnelData = useMemo(() => {
    const counts = {
      submitted: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0
    };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });

    return [
      { stage: "Submitted", count: counts.submitted, fill: "#3B82F6" },
      { stage: "Shortlisted", count: counts.shortlisted, fill: "#8B5CF6" },
      { stage: "Interview", count: counts.interview, fill: "#F59E0B" },
      { stage: "Selected (Offer)", count: counts.selected, fill: "#10B981" },
      { stage: "Rejected", count: counts.rejected, fill: "#EF4444" }
    ];
  }, [applications]);

  // Filtered student list for master directory
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesBranch = branchFilter === "all" || s.branch === branchFilter;
      const matchesStatus = statusFilter === "all" || s.placementStatus === statusFilter;
      const matchesSearch =
        !studentSearch ||
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase());
      return matchesBranch && matchesStatus && matchesSearch;
    });
  }, [students, branchFilter, statusFilter, studentSearch]);

  const handleExportCsv = () => {
    const headers = "Roll Number,Name,Branch,Graduation Year,CGPA,Active Backlogs,Placement Status,Placed Company,Offered CTC (LPA)\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.rollNumber}","${s.name}","${s.branch}","${s.graduationYear}","${s.cgpa}","${s.activeBacklogs}","${s.placementStatus}","${s.placedCompany || 'N/A'}","${s.offeredCtc || 'N/A'}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `campus_placement_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* TPO Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white font-black text-xl flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">
                Central Placement Cell (TPO Executive Suite)
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Verified Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Batch of 2026 Recruitment Statistics, Auditability Logs, and Drive Approvals
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Placement Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards (3+ Key Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Placement Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Placement Rate
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{placementRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            <strong className="text-slate-800">{placedStudents.length}</strong> placed of {totalStudents} batch total
          </p>
        </div>

        {/* Metric 2: Average CTC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Average CTC Package
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-slate-900">₹{averageCtc}</span>
            <span className="text-xs text-slate-500 font-semibold">LPA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Calculated across confirmed offers
          </p>
        </div>

        {/* Metric 3: Highest CTC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Highest CTC Offered
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-amber-600">₹{highestCtc}</span>
            <span className="text-xs text-slate-500 font-semibold">LPA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Google SDE-1 Core (₹32 LPA)
          </p>
        </div>

        {/* Metric 4: Drives & Apps */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Drives / Apps
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900">{activeDrivesCount}</span>
            <span className="text-xs text-slate-500 font-medium">drives</span>
            <span className="text-slate-300">/</span>
            <span className="text-xl font-bold text-indigo-600">{totalApplicationsCount}</span>
            <span className="text-xs text-slate-500 font-medium">apps</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across 4 registered recruiting giants
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 gap-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "analytics"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Executive Placement Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "students"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Master Directory</span>
          <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("drives")}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === "drives"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Company Drives Audit</span>
          <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {jobs.length}
          </span>
        </button>
      </div>

      {/* Tab: Analytics Charts */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Branch-wise Placement Chart */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Department / Branch Placement Rate (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Placed vs unplaced students across all engineering branches
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "rate" ? `${value}% placed` : value,
                        name === "rate" ? "Placement %" : name
                      ]}
                      contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Bar dataKey="rate" name="Placement Rate (%)" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CTC Tiers Distribution */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Offers by Salary Band (CTC Tiers)
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of Super Dream, Dream, and Core tier offers
                </p>
              </div>

              <div className="h-56 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ctcTierData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {ctcTierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {ctcTierData.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span className="text-slate-600">{tier.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{tier.count} offers</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Pipeline Funnel Chart */}
            <div className="lg:col-span-12 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Campus-Wide Application Funnel
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Total candidates at each stage of the placement lifecycle
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {pipelineFunnelData.map((stage) => (
                  <div
                    key={stage.stage}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center"
                  >
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {stage.stage}
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stage.count}
                    </span>
                    <div className="w-full h-1.5 rounded-full mt-3 bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: stage.fill,
                          width: `${Math.min(100, (stage.count / totalApplicationsCount) * 100 * 2)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Student Directory */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name, roll number, or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                >
                  <option value="all">All Branches ({students.length})</option>
                  {BRANCH_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
                >
                  <option value="all">All Placement Statuses</option>
                  <option value="Placed">Placed Only</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Open">Open (Not Placed)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Branch & Batch</th>
                    <th className="py-3 px-4">CGPA / Backlogs</th>
                    <th className="py-3 px-4">Status & Offer</th>
                    <th className="py-3 px-4">Skills</th>
                    <th className="py-3 px-4 text-right">Resume File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{student.name}</span>
                              <span className="text-[11px] text-slate-500">{student.rollNumber}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">{student.branch}</span>
                          <span className="text-[11px] text-slate-400">Class of {student.graduationYear}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md font-bold text-slate-800 bg-slate-100">
                              {student.cgpa}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                student.activeBacklogs === 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {student.activeBacklogs} Backlogs
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {student.placementStatus === "Placed" ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle className="w-3 h-3" />
                                {student.placedCompany}
                              </span>
                              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                                ₹{student.offeredCtc} LPA
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600 font-medium">
                              {student.placementStatus}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.skills.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                              >
                                {s}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer truncate inline-block max-w-[120px]"
                            title={student.resumeUrl}
                            onClick={() => alert(`Viewing verified resume: ${student.resumeUrl}`)}
                          >
                            {student.resumeUrl}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Drives Audit */}
      {activeTab === "drives" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const driveApps = applications.filter((a) => a.jobId === job.id);
              const driveOffers = driveApps.filter((a) => a.status === "selected");

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {job.companyName}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">{job.role}</h3>
                      <p className="text-xs text-slate-500">{job.location} • {job.workplaceType}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ₹{job.packageLpa} LPA
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Applications</span>
                      <span className="text-sm font-black text-slate-900">{driveApps.length}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Interviews</span>
                      <span className="text-sm font-black text-amber-600">
                        {driveApps.filter((a) => a.status === "interview").length}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Offers</span>
                      <span className="text-sm font-black text-emerald-600">{driveOffers.length}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>• Min CGPA Cutoff: <strong className="text-slate-900">{job.eligibility.minCgpa}</strong></p>
                    <p>• Allowed Branches: <span className="text-slate-700">{job.eligibility.allowedBranches.join(", ")}</span></p>
                    <p>• Max Backlogs: <strong className="text-slate-900">{job.eligibility.maxBacklogs}</strong></p>
                    <p>• Drive Deadline: <strong className="text-slate-900">{job.deadline}</strong></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
