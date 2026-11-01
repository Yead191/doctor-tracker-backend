"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorFormModal } from "./doctor-form-modal";

export function DoctorHeaderAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" />
        Register Doctor
      </Button>

      <DoctorFormModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

