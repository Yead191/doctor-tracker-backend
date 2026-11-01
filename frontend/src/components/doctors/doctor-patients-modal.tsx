"use client";

import { useState, useEffect } from "react";
import { UserPlus, Trash2, HeartPulse, User, Calendar, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { IDoctor, IPatient } from "@/types";
import {
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
} from "@/helpers/next-fetch/doctorActions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { formatDate } from "@/lib/utils";

interface DoctorPatientsModalProps {
  open: boolean;
  onClose: () => void;
  doctor: IDoctor | null;
}

export function DoctorPatientsModal({
  open,
  onClose,
  doctor,
}: DoctorPatientsModalProps) {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [removingPatient, setRemovingPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // New patient form state
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState<"male" | "female" | "other">("male");
  const [newPhone, setNewPhone] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "under-treatment" | "recovered" | "critical">("active");
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = async () => {
    if (!doctor) return;
    setLoading(true);
    try {
      const res = await getDoctorPatients(doctor._id, { limit: 50 });
      if (res.success && res.data?.patients) {
        setPatients(res.data.patients);
      }
    } catch {
      toast.error("Failed to load doctor's patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && doctor) {
      fetchPatients();
      setShowAddForm(false);
    }
  }, [open, doctor]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !newName || !newAge || !newPhone || !newCondition) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: newName,
        age: Number(newAge),
        gender: newGender,
        phone: newPhone,
        condition: newCondition,
        status: newStatus,
      };

      const res = await addPatientToDoctor(doctor._id, payload);
      if (res.success) {
        toast.success("Patient assigned to doctor successfully");
        setNewName("");
        setNewAge("");
        setNewPhone("");
        setNewCondition("");
        setShowAddForm(false);
        fetchPatients();
      } else {
        toast.error(
          typeof res.error === "string"
            ? res.error
            : res.message || "Failed to add patient"
        );
      }
    } catch {
      toast.error("Failed to add patient under this doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePatientConfirm = async () => {
    if (!doctor || !removingPatient) return;

    setIsRemoving(true);
    try {
      const res = await removePatientFromDoctor(doctor._id, removingPatient.id);
      if (res.success) {
        toast.success("Patient removed from doctor's list");
        setRemovingPatient(null);
        fetchPatients();
      } else {
        toast.error(res.message || "Failed to remove patient");
      }
    } catch {
      toast.error("Failed to remove patient");
    } finally {
      setIsRemoving(false);
    }
  };

  if (!doctor) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Patients under {doctor.name}</span>
          <Badge variant="info">
            {patients.length} Assigned
          </Badge>
        </div>
      }
      description={`${doctor.specialization} • ${doctor.hospital}`}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Toggle Add Patient Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Patient Roster
          </p>
          <Button
            type="button"
            size="sm"
            variant={showAddForm ? "outline" : "primary"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <X className="h-3.5 w-3.5 mr-1" /> Close Form
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Patient Under Doctor
              </>
            )}
          </Button>
        </div>

        {/* Inline Add Patient Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddPatient}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in-0 duration-150"
          >
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              New Patient Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Robert Vance"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Age *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="45"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-teal-600 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone *
                </label>
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 555-0182"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Condition / Diagnosis *
                </label>
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Hypertension"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-teal-600 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="under-treatment">Under Treatment</option>
                  <option value="recovered">Recovered</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={submitting}
              >
                Save & Assign Patient
              </Button>
            </div>
          </form>
        )}

        {/* Patient List */}
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading assigned patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="py-12 text-center">
            <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              No patients assigned yet
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Add Patient Under Doctor&quot; above to enroll the first patient.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
            {patients.map((patient) => (
              <div
                key={patient._id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {patient.name}
                      </p>
                      <span className="text-xs text-slate-400 font-normal">
                        ({patient.age} yrs, {patient.gender})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-slate-700">
                        {patient.condition}
                      </span>
                      <span>•</span>
                      <span>{patient.phone}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(patient.admissionDate || patient.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                  <button
                    onClick={() =>
                      setRemovingPatient({
                        id: patient._id,
                        name: patient.name,
                      })
                    }
                    title="Remove from doctor"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Patient Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(removingPatient)}
        onClose={() => setRemovingPatient(null)}
        onConfirm={handleRemovePatientConfirm}
        title="Remove Patient Assignment"
        itemName={removingPatient?.name}
        itemType="patient"
        confirmText="Remove"
        variant="warning"
        isLoading={isRemoving}
        description={
          <p>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
              {removingPatient?.name}
            </span>{" "}
            from {doctor.name}&apos;s patient list?
          </p>
        }
      />
    </Modal>
  );
}

