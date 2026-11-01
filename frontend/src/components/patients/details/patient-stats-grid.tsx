"use client";

import { IPatient, IDoctor } from "@/types";

interface PatientStatsGridProps {
  patient: IPatient;
  doctor?: IDoctor | null;
  daysAdmitted: number;
}

export function PatientStatsGrid({
  patient,
  doctor,
  daysAdmitted,
}: PatientStatsGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-rose-600";
      case "under-treatment":
        return "text-amber-600";
      case "recovered":
        return "text-teal-600";
      default:
        return "text-emerald-600";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200/80">
      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Primary Diagnosis
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-slate-900 truncate">
            {patient.condition}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Current Health State
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={`text-lg sm:text-xl font-bold capitalize ${getStatusColor(patient.status)}`}>
            {patient.status.replace("-", " ")}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Days Under Care
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            {daysAdmitted}
          </span>
          <span className="text-xs text-slate-500 font-medium">Days</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Attending Doctor
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {doctor?.name || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}

