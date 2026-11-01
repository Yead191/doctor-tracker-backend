"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { IDoctor } from "@/types";
import { createDoctor, updateDoctor } from "@/helpers/next-fetch/doctorActions";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  status: z.enum(["active", "inactive"]),
  experience: z.number().min(0, "Experience must be 0 or more"),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

interface DoctorFormModalProps {
  open: boolean;
  onClose: () => void;
  doctor?: IDoctor | null;
}

export function DoctorFormModal({
  open,
  onClose,
  doctor,
}: DoctorFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = Boolean(doctor);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
      status: "active",
      experience: 0,
    },
  });

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        phone: doctor.phone,
        email: doctor.email,
        status: doctor.status,
        experience: doctor.experience || 0,
      });
      if (doctor.image) {
        const fullImg = doctor.image.startsWith("http")
          ? doctor.image
          : `http://localhost:5000/files${doctor.image}`;
        setImagePreview(fullImg);
      } else {
        setImagePreview(null);
      }
    } else {
      reset({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        email: "",
        status: "active",
        experience: 0,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [doctor, reset]);

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

  const onSubmit = async (values: DoctorFormValues) => {
    setLoading(true);
    try {
      // Use FormData to support file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("specialization", values.specialization);
      formData.append("hospital", values.hospital);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("status", values.status);
      formData.append("experience", String(values.experience));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (isEditing && doctor) {
        res = await updateDoctor(doctor._id, formData);
      } else {
        res = await createDoctor(formData);
      }

      if (res.success) {
        toast.success(
          isEditing
            ? "Doctor record updated successfully"
            : "Doctor registered successfully"
        );
        onClose();
      } else {
        toast.error(
          typeof res.error === "string"
            ? res.error
            : res.message || "Operation failed"
        );
      }
    } catch {
      toast.error("An error occurred while saving doctor record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Doctor Information" : "Register New Doctor"}
      description={
        isEditing
          ? "Update clinical profile, contact, or affiliation details."
          : "Add a medical practitioner to the Doctor Tracker system."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Doctor preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCheck className="h-6 w-6 text-slate-400" />
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
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Name & Specialization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("name")}
              placeholder="Dr. Gregory House"
              error={errors.name?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Specialization <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("specialization")}
              placeholder="e.g. Cardiology"
              error={errors.specialization?.message}
            />
          </div>
        </div>

        {/* Hospital & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Hospital / Clinic <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("hospital")}
              placeholder="e.g. Princeton Hospital"
              error={errors.hospital?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Experience (Years)
            </label>
            <Input
              type="number"
              min="0"
              {...register("experience", { valueAsNumber: true })}
              placeholder="10"
              error={errors.experience?.message}
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="doctor@hospital.org"
              error={errors.email?.message}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <Input
              {...register("phone")}
              placeholder="+1 555-0199"
              error={errors.phone?.message}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Account Status
          </label>
          <select
            {...register("status")}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            {isEditing ? "Save Changes" : "Register Doctor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
