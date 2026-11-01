import { getDoctors } from "@/helpers/next-fetch/doctorActions";
import { Header } from "@/components/layout/header";
import { DoctorHeaderAction } from "@/components/doctors/doctor-header-action";
import { DoctorFilterBar } from "@/components/doctors/doctor-filter-bar";
import { DoctorTable } from "@/components/doctors/doctor-table";

export const metadata = {
  title: "Doctor Management — Doctor Tracker",
};

export const dynamic = "force-dynamic";

interface DoctorsPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    specialization?: string;
    hospital?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const {
    searchTerm,
    specialization,
    hospital,
    status,
    startDate,
    endDate,
    page = "1",
    limit = "10",
  } = await searchParams;

  // Use Promise.all pattern as requested
  const [doctorsRes] = await Promise.all([
    getDoctors({
      searchTerm,
      specialization,
      hospital,
      status,
      startDate,
      endDate,
      page,
      limit,
    }),
  ]);

  const doctors = doctorsRes.data || [];
  const pagination = doctorsRes.pagination;

  // Distinct specializations for filter dropdown
  const specializations = Array.from(
    new Set(doctors?.map((d) => d.specialization).filter(Boolean)),
  );
  console.log(doctors);
  return (
    <>
      <Header
        title="Doctor Directory"
        description="Search, filter, manage medical staff, and view assigned patients"
        action={<DoctorHeaderAction />}
      />

      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Filters */}
        <DoctorFilterBar specializations={specializations} />

        {/* Table & Pagination */}
        <DoctorTable doctors={doctors} pagination={pagination} />
      </main>
    </>
  );
}
