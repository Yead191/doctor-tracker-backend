import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserX, ArrowLeft } from "lucide-react";
import { getDoctorById, getDoctorPatients } from "@/helpers/next-fetch/doctorActions";
import { DoctorDetailsClient } from "@/components/doctors/doctor-details-client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface DoctorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: DoctorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getDoctorById(id);
    if (res.success && res.data) {
      return {
        title: `${res.data.name} — Doctor Profile | Doctor Tracker`,
        description: `View profile, hospital affiliation, and assigned patients for ${res.data.name}.`,
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Doctor Profile | Doctor Tracker",
  };
}

export default async function DoctorDetailPage({
  params,
}: DoctorDetailPageProps) {
  const { id } = await params;

  // Concurrent data fetching pattern (like ifundayiti-frontend)
  const [doctorRes, patientsRes] = await Promise.all([
    getDoctorById(id),
    getDoctorPatients(id, { limit: 100 }),
  ]);

  if (!doctorRes.success || !doctorRes.data) {
    return (
      <div className="p-8 sm:p-12 max-w-xl mx-auto text-center space-y-4 my-auto">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center mx-auto shadow-sm">
          <UserX className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Doctor Not Found</h2>
        <p className="text-sm text-slate-500">
          The doctor profile you requested could not be found or has been removed from the registry.
        </p>
        <div className="pt-2">
          <Link href="/doctors">
            <Button variant="primary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Doctors Directory</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const doctor = doctorRes.data;
  const patients = patientsRes.data?.patients || [];

  return (
    <DoctorDetailsClient
      doctor={doctor}
      initialPatients={patients}
    />
  );
}

