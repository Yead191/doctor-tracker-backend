"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  Calendar,
  UserCheck,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { IDoctor, Pagination } from "@/types";
import { deleteDoctor } from "@/helpers/next-fetch/doctorActions";
import { DoctorFormModal } from "./doctor-form-modal";
import { DoctorPatientsModal } from "./doctor-patients-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { formatDate } from "@/lib/utils";

interface DoctorTableProps {
  doctors: IDoctor[];
  pagination?: Pagination;
}

export function DoctorTable({ doctors, pagination }: DoctorTableProps) {
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);
  const [selectedDoctorForPatients, setSelectedDoctorForPatients] =
    useState<IDoctor | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${name}? All corresponding patient records will also be updated.`
      )
    ) {
      return;
    }

    try {
      const res = await deleteDoctor(id);
      if (res.success) {
        toast.success(`Doctor ${name} deleted successfully`);
      } else {
        toast.error(res.message || "Failed to delete doctor");
      }
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
        <UserCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          No Doctors Found
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search criteria or register a new doctor using the
          button above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table View (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Hospital</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-center">Patients</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {doctors.map((doctor) => {
                const imgUrl = doctor.image
                  ? doctor.image.startsWith("http")
                    ? doctor.image
                    : `http://localhost:5000/files${doctor.image}`
                  : null;

                return (
                  <tr
                    key={doctor._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Doctor Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 font-bold flex items-center justify-center shrink-0 overflow-hidden text-sm">
                          {imgUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imgUrl}
                              alt={doctor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/doctors/${doctor._id}`}
                            className="font-semibold text-slate-900 hover:text-teal-600 transition-colors leading-tight block"
                          >
                            {doctor.name}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(doctor.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {doctor.specialization}
                      </span>
                      {doctor.experience ? (
                        <p className="text-xs text-slate-400">
                          {doctor.experience} yrs exp
                        </p>
                      ) : null}
                    </td>

                    {/* Hospital */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {doctor.hospital}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[160px]">
                          {doctor.email}
                        </span>
                      </div>
                    </td>

                    {/* Patients Pill button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedDoctorForPatients(doctor)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs border border-teal-200/80 transition-colors"
                        title="View & manage assigned patients"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>{doctor.patientCount || 0} Patients</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          doctor.status === "active" ? "success" : "neutral"
                        }
                      >
                        {doctor.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/doctors/${doctor._id}`}
                          title="View Doctor Details"
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setEditingDoctor(doctor)}
                          title="Edit Doctor"
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id, doctor.name)}
                          title="Delete Doctor"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 leading-tight">
                    {doctor.name}
                  </h4>
                  <p className="text-xs text-teal-600 font-medium">
                    {doctor.specialization}
                  </p>
                </div>
                <Badge
                  variant={doctor.status === "active" ? "success" : "neutral"}
                >
                  {doctor.status}
                </Badge>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.hospital}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.email}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDoctorForPatients(doctor)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold"
                >
                  <Users className="h-3.5 w-3.5" />
                  {doctor.patientCount || 0} Patients
                </button>

                <div className="flex items-center gap-1.5">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingDoctor(doctor)}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(doctor._id, doctor.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && <PaginationControls pagination={pagination} />}
      </div>

      {/* Edit Doctor Modal */}
      <DoctorFormModal
        open={Boolean(editingDoctor)}
        onClose={() => setEditingDoctor(null)}
        doctor={editingDoctor}
      />

      {/* Corresponding Patients Modal */}
      <DoctorPatientsModal
        open={Boolean(selectedDoctorForPatients)}
        onClose={() => setSelectedDoctorForPatients(null)}
        doctor={selectedDoctorForPatients}
      />
    </>
  );
}

