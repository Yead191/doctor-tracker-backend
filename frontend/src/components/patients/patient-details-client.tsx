"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IDoctor, IPatient } from "@/types";
import { deletePatient, updatePatient } from "@/helpers/next-fetch/patientActions";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { PatientFormModal } from "@/components/patients/patient-form-modal";
import { PatientActionBar } from "./details/patient-action-bar";
import { PatientHeroCard } from "./details/patient-hero-card";
import { PatientStatsGrid } from "./details/patient-stats-grid";
import { PatientDoctorCard } from "./details/patient-doctor-card";
import { PatientContactCard } from "./details/patient-contact-card";
import { PatientNotesCard } from "./details/patient-notes-card";

interface PatientDetailsClientProps {
  patient: IPatient;
  doctors: IDoctor[];
}

export function PatientDetailsClient({
  patient: initialPatient,
  doctors,
}: PatientDetailsClientProps) {
  const router = useRouter();

  const [patient, setPatient] = useState<IPatient>(initialPatient);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Synchronize state with props on server revalidation
  useEffect(() => {
    setPatient(initialPatient);
  }, [initialPatient]);

  // Modal and action states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const doctorObj =
    typeof patient.doctor === "object" && patient.doctor !== null
      ? (patient.doctor as IDoctor)
      : doctors.find((d) => d._id === patient.doctor);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Quick status change
  const handleStatusChange = async (
    newStatus: "active" | "under-treatment" | "recovered" | "critical"
  ) => {
    if (newStatus === patient.status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await updatePatient(patient._id, { status: newStatus });
      if (res.success && res.data) {
        setPatient(res.data);
        toast.success(`Status updated to "${newStatus.replace("-", " ")}"`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Save clinical notes
  const handleSaveNotes = async (notes: string) => {
    setIsSavingNotes(true);
    try {
      const res = await updatePatient(patient._id, { notes });
      if (res.success && res.data) {
        setPatient(res.data);
        toast.success("Clinical notes updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to save notes");
      }
    } catch {
      toast.error("Failed to update notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete patient
  const handleDeletePatient = async () => {
    setIsDeleting(true);
    try {
      const res = await deletePatient(patient._id);
      if (res.success) {
        toast.success("Patient record deleted successfully");
        router.push("/patients");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete patient");
      }
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  // Days admitted calculation
  const getDaysAdmitted = (dateStr?: string) => {
    if (!dateStr) return 0;
    const start = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  const daysAdmitted = getDaysAdmitted(patient.admissionDate || patient.createdAt);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Action Header */}
      <PatientActionBar
        patientName={patient.name}
        status={patient.status}
        isUpdatingStatus={isUpdatingStatus}
        onStatusChange={handleStatusChange}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* Hero & Details Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <PatientHeroCard
          patient={patient}
          doctor={doctorObj}
          daysAdmitted={daysAdmitted}
        />

        <PatientStatsGrid
          patient={patient}
          doctor={doctorObj}
          daysAdmitted={daysAdmitted}
        />

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PatientDoctorCard
            doctor={doctorObj}
            onCopy={handleCopy}
            onChangeDoctor={() => setIsEditModalOpen(true)}
          />

          <PatientContactCard
            patient={patient}
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        </div>
      </div>

      {/* Clinical Notes Card */}
      <PatientNotesCard
        initialNotes={patient.notes}
        onSaveNotes={handleSaveNotes}
        isSaving={isSavingNotes}
      />

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <PatientFormModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          patient={patient}
          doctors={doctors}
          onSuccess={(updated) => {
            setPatient(updated);
            router.refresh();
          }}
        />
      )}

      {/* Delete Patient Confirmation Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatient}
        title="Delete Patient Record"
        itemName={patient.name}
        itemType="patient"
        isLoading={isDeleting}
        description={
          <p>
            Are you sure you want to permanently delete patient{" "}
            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
              {patient.name}
            </span>
            ? This action cannot be undone.
          </p>
        }
      />
    </div>
  );
}
