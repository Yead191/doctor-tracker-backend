"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { IDoctor } from "@/types";
import { Button } from "@/components/ui/button";
import { PatientFormModal } from "./patient-form-modal";

interface PatientHeaderActionProps {
  doctors: IDoctor[];
}

export function PatientHeaderAction({ doctors }: PatientHeaderActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" />
        Enroll Patient
      </Button>

      <PatientFormModal
        open={open}
        onClose={() => setOpen(false)}
        doctors={doctors}
      />
    </>
  );
}

