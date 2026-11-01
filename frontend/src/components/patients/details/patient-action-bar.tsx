"use client";

import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientActionBarProps {
  patientName: string;
  status: "active" | "under-treatment" | "recovered" | "critical";
  isUpdatingStatus: boolean;
  onStatusChange: (status: "active" | "under-treatment" | "recovered" | "critical") => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PatientActionBar({
  patientName,
  status,
  isUpdatingStatus,
  onStatusChange,
  onEdit,
  onDelete,
}: PatientActionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div className="flex items-center gap-2">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200/80 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Patients</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]">
          {patientName}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Status Dropdown */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
          {isUpdatingStatus ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
          ) : (
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Status:
            </span>
          )}
          <select
            value={status}
            disabled={isUpdatingStatus}
            onChange={(e) =>
              onStatusChange(
                e.target.value as "active" | "under-treatment" | "recovered" | "critical"
              )
            }
            className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none cursor-pointer capitalize"
          >
            <option value="active">Active</option>
            <option value="under-treatment">Under Treatment</option>
            <option value="critical">Critical</option>
            <option value="recovered">Recovered</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
        >
          <Edit2 className="h-4 w-4 text-slate-600" />
          <span>Edit Profile</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          className="gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}

