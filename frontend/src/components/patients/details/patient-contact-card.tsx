"use client";

import { Phone, Mail, MapPin, Calendar, Clock, Copy, Check } from "lucide-react";
import { IPatient } from "@/types";
import { formatDate } from "@/lib/utils";

interface PatientContactCardProps {
  patient: IPatient;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export function PatientContactCard({
  patient,
  copiedField,
  onCopy,
}: PatientContactCardProps) {
  return (
    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Phone Number */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-teal-600" />
            Patient Phone
          </span>
          <button
            onClick={() => onCopy(patient.phone, "Patient Phone")}
            className="text-slate-400 hover:text-teal-600 p-1 rounded transition-colors"
            title="Copy phone"
          >
            {copiedField === "Patient Phone" ? (
              <Check className="h-3.5 w-3.5 text-teal-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <a
          href={`tel:${patient.phone}`}
          className="font-semibold text-slate-800 hover:text-teal-600 transition-colors block text-sm"
        >
          {patient.phone}
        </a>
      </div>

      {/* Email Address */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-teal-600" />
            Email Address
          </span>
          {patient.email && (
            <button
              onClick={() => onCopy(patient.email!, "Patient Email")}
              className="text-slate-400 hover:text-teal-600 p-1 rounded transition-colors"
              title="Copy email"
            >
              {copiedField === "Patient Email" ? (
                <Check className="h-3.5 w-3.5 text-teal-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
        {patient.email ? (
          <a
            href={`mailto:${patient.email}`}
            className="font-semibold text-slate-800 hover:text-teal-600 transition-colors block text-sm truncate"
          >
            {patient.email}
          </a>
        ) : (
          <span className="text-sm text-slate-400 italic">Not provided</span>
        )}
      </div>

      {/* Residential Address */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5 sm:col-span-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-teal-600" />
          Home Address
        </span>
        <p className="font-medium text-slate-800 text-sm">
          {patient.address || (
            <span className="text-slate-400 italic">No home address registered</span>
          )}
        </p>
      </div>

      {/* Admission Timestamps */}
      <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-teal-600" />
          Admission Date:{" "}
          <strong className="text-slate-700">
            {formatDate(patient.admissionDate || patient.createdAt)}
          </strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-teal-600" />
          Last Updated:{" "}
          <strong className="text-slate-700">
            {formatDate(patient.updatedAt || patient.createdAt)}
          </strong>
        </span>
      </div>
    </div>
  );
}

