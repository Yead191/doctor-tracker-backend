"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Award,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  HeartPulse,
  Clock,
  ShieldCheck,
  Activity,
  Plus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { IDoctor, IPatient } from "@/types";
import {
  deleteDoctor,
  removePatientFromDoctor,
  addPatientToDoctor,
} from "@/helpers/next-fetch/doctorActions";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DoctorFormModal } from "@/components/doctors/doctor-form-modal";

interface DoctorDetailsClientProps {
  doctor: IDoctor;
  initialPatients: IPatient[];
}

export function DoctorDetailsClient({
  doctor,
  initialPatients,
}: DoctorDetailsClientProps) {
  const router = useRouter();

  const [patients, setPatients] = useState<IPatient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [deletingDoctor, setDeletingDoctor] = useState(false);
  const [removingPatientId, setRemovingPatientId] = useState<string | null>(null);

  // New patient state
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<"male" | "female" | "other">("male");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCondition, setPatientCondition] = useState("");
  const [patientStatus, setPatientStatus] = useState<
    "active" | "under-treatment" | "recovered" | "critical"
  >("active");
  const [submittingPatient, setSubmittingPatient] = useState(false);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Delete doctor
  const handleDeleteDoctor = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}? This will also delete their assigned records.`
    );
    if (!confirmed) return;

    setDeletingDoctor(true);
    try {
      const res = await deleteDoctor(doctor._id);
      if (res.success) {
        toast.success("Doctor deleted successfully");
        router.push("/doctors");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete doctor");
      }
    } catch {
      toast.error("Failed to delete doctor");
    } finally {
      setDeletingDoctor(false);
    }
  };

  // Add patient directly under doctor
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientAge || !patientPhone.trim() || !patientCondition.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmittingPatient(true);
    try {
      const payload = {
        name: patientName.trim(),
        age: Number(patientAge),
        gender: patientGender,
        phone: patientPhone.trim(),
        condition: patientCondition.trim(),
        status: patientStatus,
      };

      const res = await addPatientToDoctor(doctor._id, payload);
      if (res.success && res.data) {
        toast.success("Patient assigned successfully");
        setPatients((prev) => [res.data as IPatient, ...prev]);
        setPatientName("");
        setPatientAge("");
        setPatientPhone("");
        setPatientCondition("");
        setPatientStatus("active");
        setIsAddPatientModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to assign patient");
      }
    } catch {
      toast.error("An error occurred while adding patient");
    } finally {
      setSubmittingPatient(false);
    }
  };

  // Remove patient
  const handleRemovePatient = async (patientId: string, patientName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${patientName} from Dr. ${doctor.name}?`
    );
    if (!confirmed) return;

    setRemovingPatientId(patientId);
    try {
      const res = await removePatientFromDoctor(doctor._id, patientId);
      if (res.success) {
        toast.success("Patient removed successfully");
        setPatients((prev) => prev.filter((p) => p._id !== patientId));
        router.refresh();
      } else {
        toast.error(res.message || "Failed to remove patient");
      }
    } catch {
      toast.error("Failed to remove patient");
    } finally {
      setRemovingPatientId(null);
    }
  };

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const imgUrl = doctor.image
    ? doctor.image.startsWith("http")
      ? doctor.image
      : `http://localhost:5000/files${doctor.image}`
    : null;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200/80 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Doctors</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]">
            {doctor.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5"
          >
            <Edit2 className="h-4 w-4 text-slate-600" />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddPatientModalOpen(true)}
            className="gap-1.5 shadow-sm shadow-teal-900/10"
          >
            <UserPlus className="h-4 w-4" />
            <span>Assign Patient</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteDoctor}
            disabled={deletingDoctor}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 px-6 sm:px-8 py-8 text-white relative">
          <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
            <HeartPulse className="h-40 w-40" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-teal-800 text-teal-100 border-2 border-teal-400/30 font-bold flex items-center justify-center text-3xl shadow-xl overflow-hidden">
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
              <span
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 ${
                  doctor.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                }`}
                title={`Status: ${doctor.status}`}
              />
            </div>

            {/* Title & Affiliation */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {doctor.name}
                </h1>
                <Badge
                  variant={doctor.status === "active" ? "success" : "neutral"}
                  className="capitalize"
                >
                  {doctor.status}
                </Badge>
              </div>

              <p className="text-teal-400 font-medium text-base flex items-center gap-2">
                <span>{doctor.specialization}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-normal">{doctor.hospital}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-teal-400" />
                  Registered {formatDate(doctor.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-teal-400" />
                  {doctor.experience || 0} Years Experience
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-teal-400" />
                  {patients.length} Assigned Patients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Highlight Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200/80">
          <div className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Assigned Patients
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {patients.length}
              </span>
              <span className="text-xs text-teal-600 font-medium">Under Care</span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Medical Experience
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {doctor.experience || 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">Years Active</span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Critical Cases
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-600">
                {patients.filter((p) => p.status === "critical").length}
              </span>
              <span className="text-xs text-rose-600 font-medium">Priority</span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Under Treatment
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600">
                {patients.filter((p) => p.status === "under-treatment").length}
              </span>
              <span className="text-xs text-amber-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Doctor Contact & Details Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-teal-600" />
                Email Address
              </span>
              <button
                onClick={() => handleCopy(doctor.email, "Email")}
                className="text-slate-400 hover:text-teal-600 p-1 rounded transition-colors"
                title="Copy email"
              >
                {copiedField === "Email" ? (
                  <Check className="h-3.5 w-3.5 text-teal-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <a
              href={`mailto:${doctor.email}`}
              className="font-medium text-slate-800 hover:text-teal-600 transition-colors block text-sm truncate"
            >
              {doctor.email}
            </a>
          </div>

          {/* Phone */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-teal-600" />
                Direct Phone
              </span>
              <button
                onClick={() => handleCopy(doctor.phone, "Phone")}
                className="text-slate-400 hover:text-teal-600 p-1 rounded transition-colors"
                title="Copy phone"
              >
                {copiedField === "Phone" ? (
                  <Check className="h-3.5 w-3.5 text-teal-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <a
              href={`tel:${doctor.phone}`}
              className="font-medium text-slate-800 hover:text-teal-600 transition-colors block text-sm"
            >
              {doctor.phone}
            </a>
          </div>

          {/* Hospital */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-teal-600" />
              Hospital Affiliation
            </span>
            <p className="font-medium text-slate-800 text-sm truncate">
              {doctor.hospital}
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Patients Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Assigned Patients
              </h2>
              <Badge variant="info">{patients.length}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Individuals currently under medical care or monitoring with Dr. {doctor.name}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddPatientModalOpen(true)}
            className="gap-1.5 shrink-0 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient to Doctor</span>
          </Button>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Filter patients by name, condition, or phone..."
              value={searchTerm}
              icon={<Search className="h-4 w-4" />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">All Patient Statuses</option>
              <option value="active">Active</option>
              <option value="under-treatment">Under Treatment</option>
              <option value="critical">Critical</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>
        </div>

        {/* Patients Table */}
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">
              No Patients Found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {patients.length === 0
                ? "This doctor currently has no assigned patients. Click below to assign the first patient."
                : "No patients matched your search filter criteria."}
            </p>
            {patients.length === 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddPatientModalOpen(true)}
                className="mt-4 gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>Assign First Patient</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Admission Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPatients.map((patient) => {
                  const patientImg = patient.image
                    ? patient.image.startsWith("http")
                      ? patient.image
                      : `http://localhost:5000/files${patient.image}`
                    : null;

                  return (
                    <tr
                      key={patient._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 font-bold flex items-center justify-center shrink-0 overflow-hidden text-xs">
                            {patientImg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={patientImg}
                                alt={patient.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              patient.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block leading-tight">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ID: {patient._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-4 text-slate-600 capitalize">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      {/* Medical Condition */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <HeartPulse className="h-3 w-3 text-teal-600" />
                          {patient.condition}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{patient.phone}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={
                            patient.status === "critical"
                              ? "danger"
                              : patient.status === "under-treatment"
                              ? "warning"
                              : patient.status === "recovered"
                              ? "info"
                              : "success"
                          }
                          className="capitalize text-xs"
                        >
                          {patient.status.replace("-", " ")}
                        </Badge>
                      </td>

                      {/* Admission Date */}
                      <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                        {patient.admissionDate
                          ? formatDate(patient.admissionDate)
                          : formatDate(patient.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            handleRemovePatient(patient._id, patient.name)
                          }
                          disabled={removingPatientId === patient._id}
                          title="Remove from this doctor"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Doctor Modal */}
      {isEditModalOpen && (
        <DoctorFormModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          doctor={doctor}
        />
      )}

      {/* Add Patient Under Doctor Modal */}
      <Modal
        open={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        title={`Assign Patient to Dr. ${doctor.name}`}
        description="Create and attach a new patient directly under this doctor's care."
      >
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Patient Full Name *
            </label>
            <Input
              placeholder="e.g. Michael Vance"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Age *
              </label>
              <Input
                type="number"
                placeholder="42"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                min={0}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Gender *
              </label>
              <select
                value={patientGender}
                onChange={(e) =>
                  setPatientGender(e.target.value as "male" | "female" | "other")
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Phone Number *
            </label>
            <Input
              placeholder="+1-555-0199"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Medical Condition / Diagnosis *
            </label>
            <Input
              placeholder="e.g. Hypertension, Type 2 Diabetes"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Health Status *
            </label>
            <select
              value={patientStatus}
              onChange={(e) =>
                setPatientStatus(
                  e.target.value as
                    | "active"
                    | "under-treatment"
                    | "recovered"
                    | "critical"
                )
              }
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="active">Active</option>
              <option value="under-treatment">Under Treatment</option>
              <option value="critical">Critical</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddPatientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submittingPatient}
            >
              Assign to Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
