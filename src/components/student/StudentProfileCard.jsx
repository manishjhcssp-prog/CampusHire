import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  User,
  GraduationCap,
  Award,
  AlertTriangle,
  FileText,
  UploadCloud,
  Edit3,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { BRANCH_LIST } from "../../data/mockData";

export function StudentProfileCard() {
  const { activeStudent, updateStudentProfile } = usePlacement();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...activeStudent });
  const [newSkill, setNewSkill] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Sync state if activeStudent changes
  React.useEffect(() => {
    setFormData({ ...activeStudent });
  }, [activeStudent]);

  const handleSave = (e) => {
    e.preventDefault();
    updateStudentProfile(activeStudent.id, {
      ...formData,
      cgpa: parseFloat(formData.cgpa) || 0,
      activeBacklogs: parseInt(formData.activeBacklogs, 10) || 0
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSimulatedUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      setFormData((prev) => ({
        ...prev,
        resumeUrl: fileName,
        resumeUploadDate: new Date().toISOString().split("T")[0]
      }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{activeStudent.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {activeStudent.rollNumber}
              </span>
              {activeStudent.placementStatus === "Placed" ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Placed at {activeStudent.placedCompany} (₹{activeStudent.offeredCtc} LPA)
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {activeStudent.placementStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{activeStudent.course} - {activeStudent.branch}</span>
              <span>•</span>
              <span>Batch of {activeStudent.graduationYear}</span>
              <span>•</span>
              <span>{activeStudent.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...activeStudent });
            setIsEditing(true);
          }}
          className="self-start md:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all border border-slate-200"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile & Criteria</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Academic CGPA
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">{activeStudent.cgpa}</span>
            <span className="text-xs text-slate-400 font-medium">/ 10.0</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Backlogs
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className={`text-2xl font-black ${
                activeStudent.activeBacklogs > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {activeStudent.activeBacklogs}
            </span>
            <span className="text-xs text-slate-400 font-medium">subjects</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Verified Resume
          </span>
          <div className="flex items-center gap-2 mt-1 truncate">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate" title={activeStudent.resumeUrl}>
              {activeStudent.resumeUrl}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Updated: {activeStudent.resumeUploadDate || "2026-09-20"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Contact Details
          </span>
          <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
            {activeStudent.phone}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
            Verified Profile
          </span>
        </div>
      </div>

      {/* Skills Pill List */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Key Skills:
        </span>
        {activeStudent.skills.map((skill, i) => (
          <span
            key={i}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50/80 text-indigo-700 border border-indigo-100"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Student Profile & Academic Eligibility
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    disabled
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Branch / Department
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    {BRANCH_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CGPA (Cumulative)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Impacts eligibility for tier-1 recruiter cutoffs.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.activeBacklogs}
                    onChange={(e) => setFormData({ ...formData, activeBacklogs: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Skills & Competencies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Docker, Python, Next.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 text-xs px-3 py-2 border rounded-xl border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border rounded-xl">
                  {formData.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulated Resume Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Upload Resume PDF
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    <span>Select File (PDF/DOCX)</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleSimulatedUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">
                    {formData.resumeUrl}
                  </span>
                </div>
                {uploadSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resume updated successfully!
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
