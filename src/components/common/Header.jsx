import React, { useState, useRef, useEffect } from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Lock,
  LogOut,
  Radio
} from "lucide-react";

export function Header() {
  const {
    currentRole,
    quickSwitchRole,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    searchQuery,
    setSearchQuery,
    activeStudent,
    backendConnected,
    currentUser,
    setAuthModalOpen,
    logout
  } = usePlacement();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const navTabs = [
    { id: "overview", label: "Overview" },
    { id: "drives", label: "Recruitment Drives" },
    { id: "candidates", label: "Candidates" },
    { id: "schedules", label: "Schedules" },
    { id: "reports", label: "Reports" },
    { id: "insights", label: "Insights" }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabel =
    currentRole === "admin"
      ? "Admin"
      : currentRole === "recruiter"
      ? "Recruiter"
      : "Student";

  return (
    <header className="sticky top-0 z-40 bg-[#0e1219]/90 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Brand Logo & API Connectivity Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("overview")}
              className="flex items-center gap-2 group text-left"
            >
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                CampusHire
              </span>
            </button>

            {backendConnected ? (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>REST API Online</span>
              </span>
            ) : (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Connecting API...</span>
              </span>
            )}
          </div>

          {/* Center: Navigation Pill Bar (matches exact reference design) */}
          <nav className="hidden md:flex items-center bg-[#171c26]/90 border border-white/[0.08] rounded-full p-1 shadow-inner backdrop-blur-md">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none ${
                    isActive
                      ? "text-white bg-white/[0.12] shadow-sm font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Notification & User Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Search Input / Icon */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#171c26] border border-white/20 rounded-full px-3 py-1 text-xs text-white shadow-lg w-56 animate-fade-in">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search drives, students..."
                    className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-8 h-8 rounded-full bg-[#171c26] hover:bg-[#1f2634] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Notification Button with Green Dot indicator */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171c26] hover:bg-[#1f2634] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition shadow-sm"
              >
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                <span>Notification</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161b25] border border-white/10 rounded-2xl shadow-2xl p-4 text-left z-50 animate-fade-in backdrop-blur-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Notifications</h4>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-white/[0.04] max-h-80 overflow-y-auto my-2">
                    {notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition ${
                          n.read ? "opacity-60 hover:opacity-100" : "bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-white truncate">
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] text-center">
                    <span className="text-[10px] text-slate-500">
                      Live system events synced via CampusHire Core
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown (AL Admin ∨) */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#171c26] hover:bg-[#1f2634] border border-white/10 text-xs font-medium text-white transition shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-200">
                  AL
                </div>
                <span className="font-semibold text-slate-200">{roleLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Role Switcher & User Settings Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#161b25] border border-white/10 rounded-2xl shadow-2xl p-3 text-left z-50 animate-fade-in backdrop-blur-2xl">
                  
                  {/* Current Active Persona & Auth Status */}
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-2">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                      <span>Authenticated Session</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        JWT Active
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">
                      {currentUser?.name || "Placement Officer"}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || "admin@campushire.edu"}
                    </p>
                  </div>

                  {/* Switch Role Options (with live backend JWT login) */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        quickSwitchRole("admin");
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        currentRole === "admin"
                          ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                          : "text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-3.5 h-3.5 text-sky-400" />
                        <span>Administrator View</span>
                      </div>
                      {currentRole === "admin" && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        quickSwitchRole("recruiter");
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        currentRole === "recruiter"
                          ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                          : "text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recruiter Pipeline</span>
                      </div>
                      {currentRole === "recruiter" && <span className="text-[10px]">Active</span>}
                    </button>

                    <button
                      onClick={() => {
                        quickSwitchRole("student");
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        currentRole === "student"
                          ? "bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30"
                          : "text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Student Portal (Rahul)</span>
                      </div>
                      {currentRole === "student" && <span className="text-[10px]">Active</span>}
                    </button>
                  </div>

                  {/* Auth Modal & Reset Demo */}
                  <div className="mt-2 pt-2 border-t border-white/[0.06] space-y-1">
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-sky-300 hover:bg-sky-500/10 transition"
                    >
                      <Lock className="w-3 h-3 text-sky-400" />
                      <span>Custom Auth / Register (JWT)</span>
                    </button>

                    <button
                      onClick={() => {
                        resetDemoData();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>Reset Mock Cache</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-white/[0.05] gap-2">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white/10 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}
