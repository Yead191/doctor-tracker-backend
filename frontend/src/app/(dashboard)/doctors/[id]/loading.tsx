import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorDetailsLoading() {
  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Breadcrumb & Action bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-900 p-8 flex flex-col md:flex-row md:items-center gap-6">
          <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-slate-800" />
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-52 bg-slate-800" />
              <Skeleton className="h-5 w-16 rounded-full bg-slate-800" />
            </div>
            <Skeleton className="h-4 w-44 bg-slate-800" />
            <Skeleton className="h-3.5 w-64 bg-slate-800" />
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200/80">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>

        {/* Contact info grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((j) => (
            <div key={j} className="p-4 rounded-xl border border-slate-200/80 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Patients Section Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

