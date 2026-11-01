"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DoctorFilterBarProps {
  specializations: string[];
}

export function DoctorFilterBar({ specializations }: DoctorFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [specialization, setSpecialization] = useState(
    searchParams.get("specialization") || "all"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const applyFilters = (overrides?: {
    term?: string;
    spec?: string;
    stat?: string;
    start?: string;
    end?: string;
  }) => {
    const term = overrides?.term !== undefined ? overrides.term : searchTerm;
    const spec = overrides?.spec !== undefined ? overrides.spec : specialization;
    const stat = overrides?.stat !== undefined ? overrides.stat : status;
    const start = overrides?.start !== undefined ? overrides.start : startDate;
    const end = overrides?.end !== undefined ? overrides.end : endDate;

    const params = new URLSearchParams();

    if (term.trim()) params.set("searchTerm", term.trim());
    if (spec && spec !== "all") params.set("specialization", spec);
    if (stat && stat !== "all") params.set("status", stat);
    if (start) params.set("startDate", start);
    if (end) params.set("endDate", end);
    params.set("page", "1"); // Reset to page 1 on filter

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSpecialization("all");
    setStatus("all");
    setStartDate("");
    setEndDate("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by name, specialization, hospital, email..."
            value={searchTerm}
            icon={<Search className="h-4 w-4" />}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </div>

        {/* Specialization Filter */}
        <div>
          <select
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
              applyFilters({ spec: e.target.value });
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilters({ stat: e.target.value });
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Date-wise Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Calendar className="h-3.5 w-3.5" /> Date Added:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              applyFilters({ start: e.target.value });
            }}
            className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-700 shadow-xs focus:border-teal-600 focus:outline-none"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              applyFilters({ end: e.target.value });
            }}
            className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-700 shadow-xs focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(searchTerm ||
            specialization !== "all" ||
            status !== "all" ||
            startDate ||
            endDate) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Filters
              </Button>
            )}

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => applyFilters()}
            isLoading={isPending}
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
}

