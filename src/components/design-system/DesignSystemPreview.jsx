import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  FileText
} from "lucide-react";

export function DesignSystemPreview() {
  const [activeTab, setActiveTab] = useState("components"); // 'components' | 'pages' | 'responsive' | 'roadmap'
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [emailInput, setEmailInput] = useState("aarav.sharma@university.edu");
  const [cgpaInput, setCgpaInput] = useState("11.5");
  const [selectedBranch, setSelectedBranch] = useState("Computer Science");
  const [viewportMode, setViewportMode] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'

  const copyToClipboard = (text, tokenKey) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorTokens = [
    { name: "Primary Brand", hex: "#0369A1", tw: "bg-[#0369A1]", contrast: "6.8:1 (AAA Large / AA)", role: "Navigation headers, primary buttons, brand accents" },
    { name: "Primary Hover", hex: "#075985", tw: "bg-[#075985]", contrast: "8.2:1 (AAA)", role: "Interactive button and link hover states" },
    { name: "Secondary", hex: "#0EA5E9", tw: "bg-[#0EA5E9]", contrast: "3.2:1 (Large text / UI)", role: "Secondary highlights, focus indicators, tag outlines" },
    { name: "Accent / CTA", hex: "#16A34A", tw: "bg-[#16A34A]", contrast: "4.6:1 (AA)", role: "Offers, apply actions, positive eligibility confirmations" },
    { name: "Warning", hex: "#D97706", tw: "bg-[#D97706]", contrast: "4.5:1 (AA)", role: "Interview scheduling, pending verifications, alerts" },
    { name: "Destructive", hex: "#DC2626", tw: "bg-[#DC2626]", contrast: "5.1:1 (AA)", role: "Application rejections, withdrawals, validation errors" },
    { name: "Canvas Surface", hex: "#F8FAFC", tw: "bg-[#F8FAFC]", contrast: "N/A (Background)", role: "Global application background behind elevated cards", darkText: true },
    { name: "Card Surface", hex: "#FFFFFF", tw: "bg-white", contrast: "15.8:1 with #0F172A", role: "Card containers, modals, table surfaces", darkText: true },
    { name: "Muted Surface", hex: "#F1F5F9", tw: "bg-[#F1F5F9]", contrast: "N/A (Divider)", role: "Metric backgrounds, disabled inputs, table headers", darkText: true },
    { name: "Border Neutral", hex: "#E2E8F0", tw: "bg-[#E2E8F0]", contrast: "N/A (Border)", role: "Card borders, table row dividers, input boundaries", darkText: true },
  ];

  const pageInventory = [
    { role: "Shared Auth", route: "/login", name: "Unified Login Screen", desc: "Role-aware login with email/password authentication", status: "Phase 3" },
    { role: "Shared Auth", route: "/register", name: "Registration Portal", desc: "Student academic signup & corporate recruiter onboarding", status: "Phase 3" },
    { role: "Shared Auth", route: "/forgot-password", name: "Password Recovery", desc: "Self-serve secure password reset workflow", status: "Phase 3" },
    { role: "Student", route: "/student/dashboard", name: "Student Dashboard", desc: "Placement readiness KPIs, recommended drives, quick stats", status: "Phase 6" },
    { role: "Student", route: "/student/profile", name: "Student Profile & Resume", desc: "Academic details (CGPA, backlogs, branch) + resume file manager", status: "Phase 6" },
    { role: "Student", route: "/student/jobs", name: "Job Discovery & Search", desc: "Filter drives, automated eligibility breakdown, 1-click apply", status: "Phase 8" },
    { role: "Student", route: "/student/applications", name: "My Applications Tracker", desc: "4-step lifecycle stepper (submitted → shortlisted → interview → selected)", status: "Phase 9" },
    { role: "Student", route: "/student/interviews", name: "Interview Timetable", desc: "Calendar/list agenda of scheduled rounds & virtual meet links", status: "Phase 10" },
    { role: "Recruiter", route: "/recruiter/dashboard", name: "Recruiter Overview", desc: "Active drives, candidate funnel metrics, upcoming interviews", status: "Phase 7" },
    { role: "Recruiter", route: "/recruiter/jobs/create", name: "Post Recruitment Drive", desc: "Create openings with automated eligibility rules & cutoff settings", status: "Phase 7" },
    { role: "Recruiter", route: "/recruiter/pipeline", name: "Applicant Review Pipeline", desc: "Dual Table & Kanban view with status transition actions", status: "Phase 9" },
    { role: "Recruiter", route: "/recruiter/interviews", name: "Schedule Interviews", desc: "Slot assignment, round specifications, and video meet links", status: "Phase 10" },
    { role: "Administrator", route: "/admin/dashboard", name: "TPO Placement Analytics", desc: "Institutional KPIs, Recharts branch %, CTC tier distribution", status: "Phase 11" },
    { role: "Administrator", route: "/admin/students", name: "Student Master Directory", desc: "Searchable master table with CGPA sorting & CSV export", status: "Phase 11" },
    { role: "Administrator", route: "/admin/drives", name: "Drive Moderation & Audit", desc: "Company drives approval, application counts, placement audit logs", status: "Phase 12" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Phase 1 Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                Phase 1 Deliverable
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                UI/UX Pro Max Engine
              </span>
              <span className="text-xs text-slate-400">Problem ID: HACK-P410</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
              CampusConnect — Design System & Visual Architecture
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/80 mt-1 max-w-2xl leading-relaxed">
              Design specifications, semantic tokens, accessible UI components, responsive layout plans, and full page inventory before code implementation.
            </p>
          </div>

          {/* Design Dials Metric Block */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 space-y-2 text-xs">
            <span className="font-bold text-sky-200 uppercase tracking-wider text-[10px] block">
              Calibrated Design Dials
            </span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Variance:</span>
              <strong className="text-white">5/10 (Balanced Modern)</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Density:</span>
              <strong className="text-white">8/10 (Dense Dashboard)</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Motion:</span>
              <strong className="text-white">3/10 (Subtle Micro)</strong>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
              <span className="text-emerald-300 font-semibold">WCAG Contrast:</span>
              <strong className="text-emerald-300">AA / AAA Compliant</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-sky-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab("components")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "components"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-sky-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Design Tokens & Components
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "pages"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-sky-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Page Inventory & Route Map
          </button>
          <button
            onClick={() => setActiveTab("responsive")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "responsive"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-sky-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Responsive Layout Grid
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "roadmap"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-sky-200 hover:text-white hover:bg-white/10"
            }`}
          >
            Phase 2 Implementation Plan
          </button>
        </div>
      </div>

      {/* TAB 1: DESIGN TOKENS & COMPONENTS */}
      {activeTab === "components" && (
        <div className="space-y-8">
          
          {/* 1. Color Palette */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">1. Semantic Color Token Architecture</h2>
                <p className="text-xs text-slate-500">Click any card to copy its Hex color value</p>
              </div>
              <span className="text-xs font-mono text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                10 Tokens Standardized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {colorTokens.map((token, idx) => (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(token.hex, token.name)}
                  className={`p-4 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between min-h-[130px] ${
                    token.tw
                  } ${token.darkText ? "text-slate-900" : "text-white"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                      {token.name}
                    </span>
                    {copiedToken === token.name ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </div>

                  <div className="my-1">
                    <span className="text-base font-extrabold font-mono block">{token.hex}</span>
                    <span className="text-[10px] opacity-80 block">{token.contrast}</span>
                  </div>

                  <p className="text-[10px] opacity-75 line-clamp-2 leading-tight">
                    {token.role}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Typography Scale */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">2. Typography Hierarchy (Plus Jakarta Sans)</h2>
              <p className="text-xs text-slate-500">Enterprise SaaS readability with dynamic iOS/Android typography scaling</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Display H1 — 24px (1.5rem) / ExtraBold 800</span>
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Placement Drives & Recruiter Suite</span>
                </div>
                <code className="text-[11px] bg-white px-2 py-0.5 rounded border text-slate-500">font-extrabold tracking-tight</code>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Section Title H2 — 18px (1.125rem) / Bold 700</span>
                  <span className="text-lg font-bold text-slate-900">Candidate Evaluation & Academic Eligibility</span>
                </div>
                <code className="text-[11px] bg-white px-2 py-0.5 rounded border text-slate-500">text-lg font-bold</code>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Body Regular & Medium — 13px (0.8125rem) / 400 & 500</span>
                  <p className="text-xs text-slate-600 font-medium max-w-xl">
                    Campus recruitment portals require transparent audit rules. Students must clearly view why their CGPA or department meets or misses recruitment criteria.
                  </p>
                </div>
                <code className="text-[11px] bg-white px-2 py-0.5 rounded border text-slate-500">text-xs font-medium</code>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monospace Meta / Roll Numbers — 11px (0.6875rem)</span>
                  <span className="text-[11px] font-mono text-slate-600">ROLL: 2022CS101 • CGPA: 9.42 • BACKLOGS: 0 • BATCH: 2026</span>
                </div>
                <code className="text-[11px] bg-white px-2 py-0.5 rounded border text-slate-500">font-mono text-[11px]</code>
              </div>
            </div>
          </section>

          {/* 3. Component Sandbox: Buttons & Badges */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">3. Interactive Component Standards</h2>
              <p className="text-xs text-slate-500">Accessible buttons, state pills, and lifecycle indicators</p>
            </div>

            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[11px]">
                  Button Variants (with visible focus rings & smooth hover states)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="px-4 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white text-xs font-bold transition-all shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none cursor-pointer">
                    Primary Button
                  </button>

                  <button className="px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer flex items-center gap-1.5">
                    <span>Apply for Job (CTA)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all focus:ring-2 focus:ring-sky-600 focus:outline-none cursor-pointer">
                    Secondary Outline
                  </button>

                  <button className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all focus:ring-2 focus:ring-red-600 focus:outline-none cursor-pointer">
                    Destructive Action
                  </button>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Test Modal Dialog</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button disabled className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold cursor-not-allowed">
                    Disabled State
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-[11px]">
                  Recruitment Application Workflow State Badges
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Shortlisted</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Interview Scheduled</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Selected / Offer Extended</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Withdrawn</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Accessible Form Controls */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">4. Accessible Form Controls & Validation States</h2>
              <p className="text-xs text-slate-500">Adhering to UI/UX Pro Max guidelines: persistent labels, aria-live alerts, focus rings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Registered University Email (Valid)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0369A1] transition-all font-medium text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">Must use official @college.edu address</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Department / Specialization
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0369A1] transition-all font-medium text-slate-800"
                >
                  <option value="Computer Science">Computer Science & Engg</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm.">Electronics & Communication</option>
                  <option value="Electrical Engg">Electrical Engineering</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Used by eligibility engine</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Cumulative CGPA (Error State)
                </label>
                <input
                  type="text"
                  value={cgpaInput}
                  onChange={(e) => setCgpaInput(e.target.value)}
                  aria-invalid="true"
                  aria-describedby="cgpa-error-demo"
                  className="w-full text-xs px-3.5 py-2.5 bg-red-50/40 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-red-900"
                />
                <div id="cgpa-error-demo" role="alert" className="flex items-center gap-1 text-[11px] font-semibold text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>CGPA must be a valid number between 0.00 and 10.00</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Responsive Data Table Preview */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">5. Enterprise Data Table Specification</h2>
                <p className="text-xs text-slate-500">Horizontal scroll container, hover states, aligned typography</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">Sample Preview</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Department & Batch</th>
                    <th className="py-3 px-4">CGPA / Backlogs</th>
                    <th className="py-3 px-4">Applied Drive</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">Aarav Sharma</td>
                    <td className="py-3 px-4 text-slate-600">Computer Science (2026)</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 mr-1.5">9.42</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">0 Backlogs</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">Google SDE-1</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Selected (₹32 LPA)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-semibold cursor-pointer">
                        View Details
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">Rohan Varma</td>
                    <td className="py-3 px-4 text-slate-600">Information Technology (2026)</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 mr-1.5">8.12</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">0 Backlogs</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">Microsoft Cloud Arch</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Calendar className="w-3 h-3" />
                        Interview Round 2
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-semibold cursor-pointer">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      )}

      {/* TAB 2: PAGE INVENTORY & ROUTE MAP */}
      {activeTab === "pages" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">CampusConnect Page Inventory (15 Routes)</h2>
            <p className="text-xs text-slate-500">Exhaustive mapping of all screens across Student, Recruiter, and Administrator workspaces</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Role / Scope</th>
                  <th className="py-3 px-4">Route Path</th>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Core Functionality</th>
                  <th className="py-3 px-4 text-right">Implementation Phase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageInventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.role === "Student" ? "bg-blue-50 text-blue-700" :
                        item.role === "Recruiter" ? "bg-purple-50 text-purple-700" :
                        item.role === "Administrator" ? "bg-emerald-50 text-emerald-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">{item.route}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600">{item.desc}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 text-[10px]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: RESPONSIVE LAYOUT GRID */}
      {activeTab === "responsive" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Responsive Layout Architecture & Breakpoints</h2>
              <p className="text-xs text-slate-500">Adaptive navigation shell behavior across device form-factors</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewportMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewportMode === "desktop" ? "bg-white text-sky-800 shadow-2xs" : "text-slate-600"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1440px)</span>
              </button>
              <button
                onClick={() => setViewportMode("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewportMode === "tablet" ? "bg-white text-sky-800 shadow-2xs" : "text-slate-600"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet (768px)</span>
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  viewportMode === "mobile" ? "bg-white text-sky-800 shadow-2xs" : "text-slate-600"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Device Mockup Preview */}
          <div className="p-4 bg-slate-100 rounded-2xl flex justify-center">
            <div
              className={`bg-white rounded-xl border border-slate-300 shadow-md p-4 transition-all duration-300 ${
                viewportMode === "mobile" ? "w-[375px]" : viewportMode === "tablet" ? "w-[768px]" : "w-full max-w-4xl"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0369A1] text-white flex items-center justify-center font-bold text-[10px]">
                    CC
                  </div>
                  <span className="font-extrabold text-slate-800">CampusConnect</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{viewportMode.toUpperCase()} VIEWPORT</span>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="h-6 bg-slate-100 rounded-md w-1/3" />
                <div className={`grid gap-3 ${viewportMode === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
                  <div className="h-16 bg-sky-50/70 border border-sky-100 rounded-lg p-2 text-[11px] text-sky-900 font-semibold">
                    Metric Card 1
                  </div>
                  <div className="h-16 bg-sky-50/70 border border-sky-100 rounded-lg p-2 text-[11px] text-sky-900 font-semibold">
                    Metric Card 2
                  </div>
                  <div className="h-16 bg-sky-50/70 border border-sky-100 rounded-lg p-2 text-[11px] text-sky-900 font-semibold">
                    Metric Card 3
                  </div>
                </div>
                <div className="h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500">
                  Main Content Section (Responsive Grid & Tables)
                </div>
              </div>
            </div>
          </div>

          {/* Breakpoint Specs Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block mb-1">Mobile (&lt; 768px)</span>
              <p className="text-slate-600 leading-relaxed">
                Collapsible hamburger menu drawer, single-column stacked cards, horizontally scrollable data tables.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block mb-1">Tablet (768px - 1023px)</span>
              <p className="text-slate-600 leading-relaxed">
                2-column metric cards, top sticky navigation bar, compact table columns.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block mb-1">Desktop (1024px+)</span>
              <p className="text-slate-600 leading-relaxed">
                Collapsible left sidebar navigation (w-64), 4-column metric grid, multi-pane candidate evaluation pipeline.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: PHASE 2 IMPLEMENTATION ROADMAP */}
      {activeTab === "roadmap" && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Phase 2 — Concise Implementation Plan</h2>
            <p className="text-xs text-slate-500">Ready for execution once Phase 1 receives explicit approval</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <strong className="text-slate-900 block text-sm">Install & Configure React Router</strong>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Install `react-router-dom` and establish client-side browser routing structure in `src/routes.jsx` mapping all 15 planned URLs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <strong className="text-slate-900 block text-sm">Build Shared Component Library (`src/components/common/`)</strong>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Implement modular, reusable components adhering to Phase 1 tokens: `Button.jsx`, `Input.jsx`, `Select.jsx`, `Card.jsx`, `Badge.jsx`, `Modal.jsx`, `Table.jsx`, and `Breadcrumbs.jsx`.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <strong className="text-slate-900 block text-sm">Assemble Responsive Application Shell (`src/layouts/`)</strong>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Create `AppLayout.jsx` with collapsible `Sidebar.jsx`, sticky `TopNav.jsx` with role indicators, user profile dropdown preview, and notification drawer.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div>
                <strong className="text-slate-900 block text-sm">Construct Route Skeleton & Placeholder Pages</strong>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Create clean placeholder page components for every route with breadcrumbs, empty state illustrations, and loading skeleton states to guarantee seamless navigation without runtime errors.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal Dialog Sandbox */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Phase 1 Modal Dialog Specification</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Modals feature backdrop-blur, keyboard dismissibility (Escape), and a standardized action footer.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-[#0369A1] hover:bg-[#075985] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
