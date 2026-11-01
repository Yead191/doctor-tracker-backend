import Link from "next/link";
import {
  UserCheck,
  Users,
  Stethoscope,
  Activity,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
} from "lucide-react";
import { getDashboardAnalytics } from "@/helpers/next-fetch/dashboardActions";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { PatientsPerDoctorChart } from "@/components/dashboard/patients-per-doctor-chart";
import { SpecializationChart } from "@/components/dashboard/specialization-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Dashboard — Doctor Tracker",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [analyticsRes] = await Promise.all([getDashboardAnalytics()]);

  const analytics = analyticsRes?.data;

  const totalDoctors = analytics?.totalDoctors || 0;
  const totalPatients = analytics?.totalPatients || 0;
  const totalSpecializations = analytics?.totalSpecializations || 0;
  const avgPatients =
    totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : "0";

  return (
    <>
      <Header
        title="Administrative Dashboard"
        description="Healthcare ecosystem analytics, patient assignments, and capacity tracking"
        action={
          <div className="flex items-center gap-2">
            <Link href="/doctors">
              <Button variant="outline" size="sm">
                <UserCheck className="h-4 w-4" />
                Manage Doctors
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="primary" size="sm">
                <Users className="h-4 w-4" />
                Manage Patients
              </Button>
            </Link>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Doctors"
            value={totalDoctors}
            subtitle="Registered medical staff"
            icon={UserCheck}
            trend="+Active"
            color="teal"
          />
          <StatCard
            title="Total Patients"
            value={totalPatients}
            subtitle="Enrolled patient records"
            icon={Users}
            trend="+Monitored"
            color="blue"
          />
          <StatCard
            title="Specializations"
            value={totalSpecializations}
            subtitle="Clinical specialties"
            icon={Stethoscope}
            color="indigo"
          />
          <StatCard
            title="Patients / Doctor"
            value={avgPatients}
            subtitle="Average assignment ratio"
            icon={Activity}
            trend="Target < 15"
            color="emerald"
          />
        </div>

        {/* Primary Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                  Registration & Admission Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Timeline of doctor onboarding vs patient admissions
                </p>
              </div>
            </div>
            <TrendChart data={analytics?.dateBasedStats || []} />
          </div>

          {/* Patients per Doctor Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-600" />
                  Patients Per Doctor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current active workload distribution across doctors
                </p>
              </div>
            </div>
            <PatientsPerDoctorChart data={analytics?.patientsPerDoctor || []} />
          </div>
        </div>

        {/* Secondary Insights Row: Specialization Distribution & Patient Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specialization Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Doctor Specializations
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of clinical departments
            </p>
            <SpecializationChart
              data={analytics?.specializationDistribution || []}
            />
          </div>

          {/* Condition Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Prevalent Patient Conditions
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Aggregated diagnosis and condition frequency
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(analytics?.conditionDistribution || []).map((cond) => (
                <div
                  key={cond.condition}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {cond.condition}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">
                      {cond.count} {cond.count === 1 ? "Patient" : "Patients"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Records Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Doctors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recently Added Doctors
              </h3>
              <Link
                href="/doctors"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(analytics?.recentDoctors || []).slice(0, 4).map((doc) => (
                <div
                  key={doc._id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-teal-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {doc.name.replace(/^Dr\.\s*/i, "").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{doc.specialization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {doc.hospital}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={doc.status === "active" ? "success" : "neutral"}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Patient Admissions
              </h3>
              <Link
                href="/patients"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(analytics?.recentPatients || []).slice(0, 4).map((patient) => {
                const docName =
                  typeof patient.doctor === "object" && patient.doctor !== null
                    ? patient.doctor.name
                    : "Assigned Doctor";

                return (
                  <div
                    key={patient._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {patient.name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-700">
                            {patient.condition}
                          </span>
                          <span>•</span>
                          <span>{docName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          patient.status === "critical"
                            ? "danger"
                            : patient.status === "recovered"
                            ? "success"
                            : "info"
                        }
                      >
                        {patient.status}
                      </Badge>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(patient.admissionDate || patient.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
