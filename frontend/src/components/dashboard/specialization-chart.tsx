"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0d9488", "#0284c7", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

interface SpecializationChartProps {
  data: {
    specialization: string;
    count: number;
  }[];
}

export function SpecializationChart({ data }: SpecializationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No specialization records found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="specialization"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 mt-2">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.specialization} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{item.specialization}</span>
            <span className="font-semibold text-slate-900">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

