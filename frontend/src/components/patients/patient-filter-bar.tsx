"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { IDoctor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PatientFilterBarProps {
  conditions: string[];
  doctors: IDoctor[];
}

export function PatientFilterBar({ conditions, doctors }: PatientFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [condition, setCondition] = useState(
    searchParams.get("condition") || "all"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [doctor, setDoctor] = useState(searchParams.get("doctor") || "all");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const applyFilters = (overrides?: {
    term?: string;
    cond?: string;
    stat?: string;
    doc?: string;
    start?: string;
    end?: string;
  }) => {
    const term = overrides?.term !== undefined ? overrides.term : searchTerm;
    const cond = overrides?.cond !== undefined ? overrides.cond : condition;
    const stat = overrides?.stat !== undefined ? overrides.stat : status;
    const doc = overrides?.doc !== undefined ? overrides.doc : doctor;
    const start = overrides?.start !== undefined ? overrides.start : startDate;
    const end = overrides?.end !== undefined ? overrides.end : endDate;

    const params = new URLSearchParams();

    if (term.trim()) params.set("searchTerm", term.trim());
    if (cond && cond !== "all") params.set("condition", cond);
    if (stat && stat !== "all") params.set("status", stat);
    if (doc && doc !== "all") params.set("doctor", doc);
    if (start) params.set("startDate", start);
    if (end) params.set("endDate", end);
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setCondition("all");
    setStatus("all");
    setDoctor("all");
    setStartDate("");
    setEndDate("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div>
          <Input
            placeholder="Search name, condition, phone..."
            value={searchTerm}
            icon={<Search className="h-4 w-4" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
        </div>

        {/* Condition Filter */}
        <div>
          <select
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value);
              applyFilters({ cond: e.target.value });
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Conditions</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
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
            <option value="under-treatment">Under Treatment</option>
            <option value="recovered">Recovered</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Doctor Filter */}
        <div>
          <select
            value={doctor}
            onChange={(e) => {
              setDoctor(e.target.value);
              applyFilters({ doc: e.target.value });
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Calendar className="h-3.5 w-3.5" /> Admission Date:
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
            condition !== "all" ||
            status !== "all" ||
            doctor !== "all" ||
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

