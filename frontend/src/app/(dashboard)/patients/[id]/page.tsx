import { Metadata } from "next";
import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";
import { getPatientById } from "@/helpers/next-fetch/patientActions";
import { getDoctors } from "@/helpers/next-fetch/doctorActions";
import { PatientDetailsClient } from "@/components/patients/patient-details-client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface PatientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PatientDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getPatientById(id);
    if (res.success && res.data) {
      return {
        title: `${res.data.name} — Patient Record | Doctor Tracker`,
        description: `Medical record, diagnosis, and attending doctor details for ${res.data.name}.`,
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Patient Details | Doctor Tracker",
  };
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;

  // Concurrent data fetching
  const [patientRes, doctorsRes] = await Promise.all([
    getPatientById(id),
    getDoctors({ limit: 100 }),
  ]);

  if (!patientRes.success || !patientRes.data) {
    return (
      <div className="p-8 sm:p-12 max-w-xl mx-auto text-center space-y-4 my-auto">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center mx-auto shadow-sm">
          <UserX className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Patient Not Found</h2>
        <p className="text-sm text-slate-500">
          The patient record you requested could not be found or has been removed from the registry.
        </p>
        <div className="pt-2">
          <Link href="/patients">
            <Button variant="primary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Patients Directory</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const patient = patientRes.data;
  const doctors = doctorsRes.data || [];

  return <PatientDetailsClient patient={patient} doctors={doctors} />;
}

