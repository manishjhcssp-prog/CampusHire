import React from "react";
import { usePlacement } from "../../context/PlacementContext";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  ExternalLink,
  MapPin,
  Building2
} from "lucide-react";

export function InterviewSchedule() {
  const { applications, jobs, activeStudent } = usePlacement();

  const scheduledApps = applications.filter(
    (app) =>
      app.studentId === activeStudent.id &&
      app.interviewScheduled &&
      app.status !== "withdrawn"
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Interview Timetable & Assessments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed video calls, technical rounds, and behavioral discussions
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          {scheduledApps.length} Scheduled
        </span>
      </div>

      {scheduledApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No active interviews scheduled yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Once recruiters review your application and shortlist your profile, your interview calendar will update automatically here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId) || {
              companyName: "Company",
              role: "Role",
              packageLpa: 0
            };

            const interviewDateObj = new Date(app.interviewDate);
            const isToday =
              interviewDateObj.toDateString() === new Date().toDateString();

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between hover:border-indigo-200 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {job.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          {job.companyName}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{job.role}</h4>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isToday
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {isToday ? "TODAY" : "UPCOMING"}
                    </span>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Assessment Round
                      </span>
                      <span className="text-xs font-bold text-indigo-900 block mt-0.5">
                        {app.interviewRound}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold">
                          {interviewDateObj.toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold">
                          {interviewDateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Mode: Virtual Video Room
                  </span>

                  <a
                    href={app.interviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
