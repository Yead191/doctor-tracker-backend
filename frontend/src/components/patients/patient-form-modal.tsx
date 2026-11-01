"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { IDoctor, IPatient } from "@/types";
import { createPatient, updatePatient } from "@/helpers/next-fetch/patientActions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0, "Age must be valid").max(150),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  address: z.string().optional(),
  condition: z.string().min(2, "Medical condition is required"),
  doctor: z.string().min(1, "Assigned doctor is required"),
  status: z.enum(["active", "under-treatment", "recovered", "critical"]),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  patient?: IPatient | null;
  doctors: IDoctor[];
  onSuccess?: (updatedPatient: IPatient) => void;
}

export function PatientFormModal({
  open,
  onClose,
  patient,
  doctors,
  onSuccess,
}: PatientFormModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = Boolean(patient);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      age: 30,
      gender: "male",
      phone: "",
      email: "",
      address: "",
      condition: "",
      doctor: "",
      status: "active",
      notes: "",
    },
  });

  useEffect(() => {
    if (patient) {
      const docId =
        typeof patient.doctor === "object" && patient.doctor !== null
          ? patient.doctor._id
          : String(patient.doctor || "");

      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || "",
        address: patient.address || "",
        condition: patient.condition,
        doctor: docId,
        status: patient.status,
        notes: patient.notes || "",
      });

      if (patient.image) {
        const fullImg = patient.image.startsWith("http")
          ? patient.image
          : `http://localhost:5000/files${patient.image}`;
        setImagePreview(fullImg);
      } else {
        setImagePreview(null);
      }
    } else {
      reset({
        name: "",
        age: 30,
        gender: "male",
        phone: "",
        email: "",
        address: "",
        condition: "",
        doctor: doctors[0]?._id || "",
        status: "active",
        notes: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [patient, doctors, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (values: PatientFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("age", String(values.age));
      formData.append("gender", values.gender);
      formData.append("phone", values.phone);
      if (values.email) formData.append("email", values.email);
      if (values.address) formData.append("address", values.address);
      formData.append("condition", values.condition);
      formData.append("doctor", values.doctor);
      formData.append("status", values.status);
      if (values.notes) formData.append("notes", values.notes);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (isEditing && patient) {
        res = await updatePatient(patient._id, formData);
      } else {
        res = await createPatient(formData);
      }

      if (res.success) {
        toast.success(
          isEditing
            ? "Patient information updated"
            : "Patient record created successfully"
        );
        if (onSuccess && res.data) {
          onSuccess(res.data);
        }
        onClose();
        router.refresh();
      } else {
        toast.error(
          typeof res.error === "string"
            ? res.error
            : res.message || "Failed to save patient"
        );
      }
    } catch {
      toast.error("An error occurred while saving patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Patient Information" : "Enroll New Patient"}
      description={
        isEditing
          ? "Update clinical details, condition status, or assigned doctor."
          : "Register a patient and assign them to an attending physician."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Patient Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Patient preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-slate-400" />
              )}
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition-colors">
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. John Doe"
            error={errors.name?.message}
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Age <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              {...register("age", { valueAsNumber: true })}
              placeholder="45"
              error={errors.age?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("gender")}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("phone")}
              placeholder="+1 555-0144"
              error={errors.phone?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="patient@example.com"
              error={errors.email?.message}
            />
          </div>
        </div>

        {/* Condition & Assigned Doctor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Condition / Diagnosis <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("condition")}
              placeholder="e.g. Type 2 Diabetes"
              error={errors.condition?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Attending Doctor <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("doctor")}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </select>
            {errors.doctor?.message && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.doctor.message}
              </p>
            )}
          </div>
        </div>

        {/* Status & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Condition Status
            </label>
            <select
              {...register("status")}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="under-treatment">Under Treatment</option>
              <option value="recovered">Recovered</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Address
            </label>
            <Input
              {...register("address")}
              placeholder="City, State"
            />
          </div>
        </div>

        {/* Clinical Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Clinical Notes / Medical History
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Special instructions, dosage, or medical history..."
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            {isEditing ? "Save Changes" : "Enroll Patient"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
