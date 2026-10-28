import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  Lock,
  Mail,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register, currentUser, logout } = usePlacement();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("admin@campushire.edu");
  const [password, setPassword] = useState("Admin@123");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (isRegister) {
      const res = await register({
        name,
        email,
        password,
        role,
        course: "B.Tech",
        graduation_year: 2026,
        cgpa: 8.5,
        backlogs_count: 0,
        branch: "Computer Science",
        skills: ["React", "Node.js", "Python"]
      });
      setLoading(false);
      if (res.success) {
        setSuccessMsg(`Account created! Logged in as ${res.user.name}`);
        setTimeout(() => setAuthModalOpen(false), 1200);
      } else {
        setError(res.error || "Registration failed.");
      }
    } else {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => setAuthModalOpen(false), 1200);
      } else {
        setError(res.error || "Invalid email or password.");
      }
    }
  };

  const handleQuickPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#161b25] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4 animate-fade-in relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isRegister ? "Create CampusHire Account" : "CampusHire Portal Login"}
            </h3>
            <p className="text-xs text-slate-400">
              JWT-Authenticated Role-Based Access Control
            </p>
          </div>
        </div>

        {/* Quick Test Presets */}
        {!isRegister && (
          <div className="bg-[#11151e] border border-white/5 rounded-xl p-3 text-xs space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              1-Click Demo Accounts (Pre-Seeded):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickPreset("admin@campushire.edu", "Admin@123")}
                className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-medium hover:bg-sky-500/30 transition flex items-center gap-1"
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("recruiter.google@campushire.edu", "Recruiter@123")}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium hover:bg-amber-500/30 transition flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3" /> Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset("rahul.sharma@campushire.edu", "Student@123")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium hover:bg-emerald-500/30 transition flex items-center gap-1"
              >
                <GraduationCap className="w-3 h-3" /> Student (Rahul)
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#11151e] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campushire.edu"
                className="w-full bg-[#11151e] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#11151e] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold transition shadow-lg shadow-sky-500/25 text-xs mt-2"
          >
            {loading ? "Authenticating..." : isRegister ? "Create Account & Sign In" : "Sign In with Token"}
          </button>
        </form>

        <div className="pt-2 border-t border-white/[0.06] text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-sky-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-sky-400 hover:underline font-semibold"
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
