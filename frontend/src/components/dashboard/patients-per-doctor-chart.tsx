"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PatientsPerDoctorChartProps {
  data: {
    doctorId: string;
    doctorName: string;
    specialization: string;
    patientCount: number;
  }[];
}

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-slate-400">
        No doctor patient associations found.
      </div>
    );
  }

  const chartData = data.slice(0, 7).map((d) => ({
    name: d.doctorName.replace(/^Dr\.\s*/i, ""),
    patients: d.patientCount,
    specialization: d.specialization,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value} Patients (${item.payload.specialization})`,
              "Assigned Patients",
            ]}
          />
          <Bar
            dataKey="patients"
            fill="#0d9488"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

