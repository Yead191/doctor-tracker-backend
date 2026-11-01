import { getPatients } from "@/helpers/next-fetch/patientActions";
import { getDoctors } from "@/helpers/next-fetch/doctorActions";
import { Header } from "@/components/layout/header";
import { PatientHeaderAction } from "@/components/patients/patient-header-action";
import { PatientFilterBar } from "@/components/patients/patient-filter-bar";
import { PatientTable } from "@/components/patients/patient-table";

export const metadata = {
  title: "Patient Management — Doctor Tracker",
};

export const dynamic = "force-dynamic";

interface PatientsPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    condition?: string;
    status?: string;
    gender?: string;
    doctor?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function PatientsPage({
  searchParams,
}: PatientsPageProps) {
  const {
    searchTerm,
    condition,
    status,
    gender,
    doctor,
    startDate,
    endDate,
    page = "1",
    limit = "10",
  } = await searchParams;

  // Use Promise.all pattern as requested
  const [patientsRes, doctorsRes] = await Promise.all([
    getPatients({
      searchTerm,
      condition,
      status,
      gender,
      doctor,
      startDate,
      endDate,
      page,
      limit,
    }),
    getDoctors({ limit: 100 }),
  ]);

  const patients = patientsRes.data || [];
  const pagination = patientsRes.pagination;
  const doctors = doctorsRes.data || [];

  // Extract distinct conditions for filter dropdown
  const conditions = Array.from(
    new Set(patients.map((p) => p.condition).filter(Boolean))
  );

  return (
    <>
      <Header
        title="Patient Directory"
        description="Search, filter, enroll, and manage patient treatment records"
        action={<PatientHeaderAction doctors={doctors} />}
      />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Filters */}
        <PatientFilterBar conditions={conditions} doctors={doctors} />

        {/* Table & Pagination */}
        <PatientTable
          patients={patients}
          doctors={doctors}
          pagination={pagination}
        />
      </main>
    </>
  );
}
