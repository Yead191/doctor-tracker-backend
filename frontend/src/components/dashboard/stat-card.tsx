import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: "teal" | "blue" | "indigo" | "emerald";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "teal",
}: StatCardProps) {
  const colorStyles = {
    teal: "bg-teal-50 text-teal-600 ring-teal-600/10",
    blue: "bg-sky-50 text-sky-600 ring-sky-600/10",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-600/10",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-600/10",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center ring-1",
            colorStyles[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </h3>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            {trend && <span className="font-semibold text-teal-600">{trend}</span>}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

