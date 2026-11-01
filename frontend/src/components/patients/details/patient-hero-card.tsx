"use client";

import Image from "next/image";
import { Activity, Calendar, Clock, Stethoscope } from "lucide-react";
import { IDoctor, IPatient } from "@/types";
import { formatDate } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Badge } from "@/components/ui/badge";

interface PatientHeroCardProps {
  patient: IPatient;
  doctor?: IDoctor | null;
  daysAdmitted: number;
}

export function PatientHeroCard({
  patient,
  doctor,
  daysAdmitted,
}: PatientHeroCardProps) {
  const imgUrl = getImageUrl(patient.image);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "critical":
        return "danger";
      case "under-treatment":
        return "warning";
      case "recovered":
        return "info";
      default:
        return "success";
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 px-6 sm:px-8 py-8 text-white relative">
      <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
        <Activity className="h-40 w-40" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-teal-800 text-teal-100 border-2 border-teal-400/30 font-bold flex items-center justify-center text-3xl shadow-xl overflow-hidden relative">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={patient.name}
                height={150}
                width={150}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              patient.name.charAt(0)
            )}
          </div>
          <span
            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 ${
              patient.status === "critical"
                ? "bg-rose-500"
                : patient.status === "under-treatment"
                ? "bg-amber-500"
                : patient.status === "recovered"
                ? "bg-sky-500"
                : "bg-emerald-500"
            }`}
            title={`Status: ${patient.status}`}
          />
        </div>

        {/* Title & Medical Tags */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {patient.name}
            </h1>
            <Badge
              variant={getStatusVariant(patient.status)}
              className="capitalize font-semibold"
            >
              {patient.status.replace("-", " ")}
            </Badge>
            <span className="text-xs bg-slate-800 text-teal-300 font-mono px-2 py-0.5 rounded-md border border-slate-700">
              ID: #{patient._id.slice(-6).toUpperCase()}
            </span>
          </div>

          <p className="text-teal-400 font-medium text-base flex items-center gap-2">
            <span>{patient.condition}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-normal capitalize">
              {patient.age} yrs • {patient.gender}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-400" />
              Admitted {formatDate(patient.admissionDate || patient.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              {daysAdmitted === 0 ? "Admitted Today" : `${daysAdmitted} Days Under Care`}
            </span>
            {doctor && (
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-teal-400" />
                Doctor: {doctor.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

