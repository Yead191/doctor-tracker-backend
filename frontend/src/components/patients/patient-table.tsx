"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  User,
  Stethoscope,
  Building2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { IDoctor, IPatient, Pagination } from "@/types";
import { deletePatient } from "@/helpers/next-fetch/patientActions";
import { PatientFormModal } from "./patient-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { getImageUrl } from "@/lib/getImageUrl";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface PatientTableProps {
  patients: IPatient[];
  doctors: IDoctor[];
  pagination?: Pagination;
}

export function PatientTable({
  patients,
  doctors,
  pagination,
}: PatientTableProps) {
  const [editingPatient, setEditingPatient] = useState<IPatient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingPatient) return;
    setIsDeleting(true);
    try {
      const res = await deletePatient(deletingPatient.id);
      if (res.success) {
        toast.success(`Patient "${deletingPatient.name}" deleted successfully`);
        setDeletingPatient(null);
      } else {
        toast.error(res.message || "Failed to delete patient");
      }
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "critical":
        return "danger";
      case "recovered":
        return "success";
      case "under-treatment":
        return "warning";
      default:
        return "info";
    }
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
        <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          No Patients Found
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search filters or enroll a new patient using the
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
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Attending Doctor</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {patients.map((patient) => {
                const imgUrl = getImageUrl(patient.image);

                const docObj =
                  typeof patient.doctor === "object" && patient.doctor !== null
                    ? (patient.doctor as IDoctor)
                    : null;

                return (
                  <tr
                    key={patient._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Patient Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 font-bold flex items-center justify-center shrink-0 overflow-hidden text-sm">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={patient.name}
                              height={100}
                              width={100}
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            patient.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/patients/${patient._id}`}
                            className="font-semibold text-slate-900 hover:text-teal-600 transition-colors leading-tight block"
                          >
                            {patient.name}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {patient.age} yrs • {patient.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Condition */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {patient.condition}
                      </span>
                      {patient.notes ? (
                        <p className="text-xs text-slate-400 truncate max-w-[150px]">
                          {patient.notes}
                        </p>
                      ) : null}
                    </td>

                    {/* Attending Doctor */}
                    <td className="py-3.5 px-4">
                      {docObj ? (
                        <div>
                          <p className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                            <Stethoscope className="h-3 w-3 text-teal-600" />
                            {docObj.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {docObj.specialization} • {docObj.hospital}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{patient.phone}</span>
                      </div>
                      {patient.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">
                            {patient.email}
                          </span>
                        </div>
                      ) : null}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={getStatusBadgeVariant(patient.status)}>
                        {patient.status}
                      </Badge>
                    </td>

                    {/* Admission Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {formatDate(patient.admissionDate || patient.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/patients/${patient._id}`}
                          title="View Patient Details"
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setEditingPatient(patient)}
                          title="Edit Patient"
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeletingPatient({
                              id: patient._id,
                              name: patient.name,
                            })
                          }
                          title="Delete Patient"
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

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {patients.map((patient) => {
            const docObj =
              typeof patient.doctor === "object" && patient.doctor !== null
                ? (patient.doctor as IDoctor)
                : null;

            return (
              <div key={patient._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/patients/${patient._id}`}
                      className="font-semibold text-slate-900 hover:text-teal-600 transition-colors leading-tight block"
                    >
                      {patient.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(patient.status)}>
                    {patient.status}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-slate-800">
                    Condition: {patient.condition}
                  </p>
                  {docObj ? (
                    <p className="flex items-center gap-1.5 text-teal-700">
                      <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                      {docObj.name} ({docObj.specialization})
                    </p>
                  ) : null}
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {patient.phone}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Admitted: {formatDate(patient.admissionDate || patient.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Link href={`/patients/${patient._id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPatient(patient)}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setDeletingPatient({
                        id: patient._id,
                        name: patient.name,
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination && <PaginationControls pagination={pagination} />}
      </div>

      {/* Edit Patient Modal */}
      <PatientFormModal
        open={Boolean(editingPatient)}
        onClose={() => setEditingPatient(null)}
        patient={editingPatient}
        doctors={doctors}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(deletingPatient)}
        onClose={() => setDeletingPatient(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        itemName={deletingPatient?.name}
        itemType="patient"
        isLoading={isDeleting}
        description={
          <p>
            Are you sure you want to delete patient{" "}
            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
              {deletingPatient?.name}
            </span>
            ? This action cannot be undone and will permanently remove this patient from the directory.
          </p>
        }
      />
    </>
  );
}

