import React, { useState } from "react";
import { usePlacement } from "../../context/PlacementContext";
import { CompanyLogoRenderer } from "../common/CompanyLogos";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  User
} from "lucide-react";

export function SchedulesView() {
  const { students, scheduleInterview } = usePlacement();
  const [filterDay, setFilterDay] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [schedulesList, setSchedulesList] = useState([
    {
      id: "sch-101",
      candidate: "Aakash Roy",
      rollNo: "2021CS042",
      company: "Google",
      round: "Google Tech Round 2 (System Design)",
      time: "11:30 AM",
      date: "Oct 18, 2026",
      interviewer: "Arun Sundaram (Staff SWE, Search Core)",
      meetLink: "https://meet.google.com/aakash-tech-round",
      status: "Confirmed"
    },
    {
      id: "sch-102",
      candidate: "Priya Hegde",
      rollNo: "2021IT023",
      company: "Amazon",
      round: "Amazon AWS Cloud Interview",
      time: "01:30 PM",
      date: "Oct 18, 2026",
      interviewer: "Siddharth Rao (Principal Solutions Architect)",
      meetLink: "https://chime.aws/priya-interview-slot",
      status: "Confirmed"
    },
    {
      id: "sch-103",
      candidate: "Rohan Varma",
      rollNo: "2022IT103",
      company: "Microsoft",
      round: "Microsoft Cloud Round (Azure Infrastructure)",
      time: "03:45 PM",
      date: "Oct 19, 2026",
      interviewer: "Maya Sen (Azure Engineering Lead)",
      meetLink: "https://teams.microsoft.com/l/meetup-join/rohan",
      status: "Confirmed"
    },
    {
      id: "sch-104",
      candidate: "Tanvi Deshmukh",
      rollNo: "2022CS111",
      company: "Deloitte",
      round: "Deloitte Analyst Fitment & Strategy",
      time: "04:30 PM",
      date: "Oct 20, 2026",
      interviewer: "Rajesh Kulkarni (Advisory Partner)",
      meetLink: "https://deloitte.zoom.us/j/fitment-tanvi",
      status: "Scheduled"
    },
    {
      id: "sch-105",
      candidate: "Rahul Sharma",
      rollNo: "2021CS088",
      company: "Google",
      round: "Google SDE Leadership & Coding Review",
      time: "10:00 AM",
      date: "Oct 21, 2026",
      interviewer: "Vikram Sethi (Engineering Director)",
      meetLink: "https://meet.google.com/rahul-google-sde",
      status: "Scheduled"
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    candidateName: "Rahul Sharma",
    company: "Google",
    round: "Technical Round 1",
    time: "02:00 PM",
    date: "Oct 22, 2026",
    interviewer: "Staff Engineer"
  });

  const handleAddSchedule = (e) => {
    e.preventDefault();
    const created = {
      id: `sch-${Date.now()}`,
      candidate: newSchedule.candidateName,
      rollNo: "2021CS088",
      company: newSchedule.company,
      round: newSchedule.round,
      time: newSchedule.time,
      date: newSchedule.date,
      interviewer: newSchedule.interviewer,
      meetLink: "https://meet.google.com/new-session",
      status: "Confirmed"
    };
    setSchedulesList([created, ...schedulesList]);
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161b25] border border-white/[0.07] rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-400" />
            <span>Interview Schedules & Calendar Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized interview rounds, automated video rooms, and panel interviewer assignments.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Interview Slot</span>
        </button>
      </div>

      {/* Schedule Cards Timeline */}
      <div className="space-y-3">
        {schedulesList.map((item) => (
          <div
            key={item.id}
            className="bg-[#161b25] border border-white/[0.07] hover:border-white/15 rounded-2xl p-4 shadow-sm transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <CompanyLogoRenderer name={item.company} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{item.round}</h3>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-semibold border border-sky-500/30">
                    {item.company}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="text-slate-200 font-medium">{item.candidate}</span>
                  <span>•</span>
                  <span>Panel: {item.interviewer}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-xs font-bold text-white block">{item.time}</span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={item.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Room</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Slot Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181d28] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-sky-400" />
                <span>Schedule Corporate Interview Slot</span>
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Candidate Name</label>
                <select
                  value={newSchedule.candidateName}
                  onChange={(e) => setNewSchedule({ ...newSchedule, candidateName: e.target.value })}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newSchedule.company}
                  onChange={(e) => setNewSchedule({ ...newSchedule, company: e.target.value })}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Round Title</label>
                <input
                  type="text"
                  required
                  value={newSchedule.round}
                  onChange={(e) => setNewSchedule({ ...newSchedule, round: e.target.value })}
                  className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full bg-[#11151e] border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
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
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
