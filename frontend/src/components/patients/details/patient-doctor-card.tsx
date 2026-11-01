"use client";

import Link from "next/link";
import {
  Stethoscope,
  ExternalLink,
  Building2,
  Phone,
  Mail,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { IDoctor } from "@/types";
import { Button } from "@/components/ui/button";

interface PatientDoctorCardProps {
  doctor?: IDoctor | null;
  onCopy: (text: string, field: string) => void;
  onChangeDoctor: () => void;
}

export function PatientDoctorCard({
  doctor,
  onCopy,
  onChangeDoctor,
}: PatientDoctorCardProps) {
  return (
    <div className="lg:col-span-1 bg-gradient-to-b from-teal-50/50 to-white rounded-2xl border border-teal-200/80 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
          <Stethoscope className="h-4 w-4 text-teal-600" />
          Attending Physician
        </span>
        {doctor && (
          <Link
            href={`/doctors/${doctor._id}`}
            className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <span>Profile</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {doctor ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-sm">
              {doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)}
            </div>
            <div>
              <Link
                href={`/doctors/${doctor._id}`}
                className="font-bold text-slate-900 hover:text-teal-600 transition-colors leading-tight block text-sm"
              >
                {doctor.name}
              </Link>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">
                {doctor.specialization}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 text-slate-400" />
                {doctor.hospital}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-teal-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-teal-600" />
                {doctor.phone}
              </span>
              <button
                onClick={() => onCopy(doctor.phone, "Doctor Phone")}
                className="text-slate-400 hover:text-teal-600 p-1"
                title="Copy phone"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                <Mail className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                {doctor.email}
              </span>
              <button
                onClick={() => onCopy(doctor.email, "Doctor Email")}
                className="text-slate-400 hover:text-teal-600 p-1"
                title="Copy email"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onChangeDoctor}
            className="w-full text-xs font-semibold border-teal-200 text-teal-800 hover:bg-teal-50"
          >
            Change Assigned Doctor
          </Button>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 space-y-2">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
          <p className="text-xs">No doctor currently attached to this patient.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={onChangeDoctor}
            className="text-xs"
          >
            Assign Doctor Now
          </Button>
        </div>
      )}
    </div>
  );
}

