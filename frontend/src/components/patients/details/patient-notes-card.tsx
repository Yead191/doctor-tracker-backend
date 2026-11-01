"use client";

import { useState } from "react";
import { FileText, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientNotesCardProps {
  initialNotes?: string;
  onSaveNotes: (notes: string) => Promise<void>;
  isSaving: boolean;
}

export function PatientNotesCard({
  initialNotes = "",
  onSaveNotes,
  isSaving,
}: PatientNotesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = async () => {
    await onSaveNotes(notes);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Clinical Notes & Physician Remarks
            </h2>
            <p className="text-xs text-slate-500">
              Medical history, treatment progression, and special care instructions
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNotes(initialNotes);
              setIsEditing(true);
            }}
            className="gap-1.5 text-xs"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{initialNotes ? "Edit Notes" : "Add Notes"}</span>
          </Button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical observations, prescription directives, allergies, or progress notes..."
              rows={5}
              className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-800 shadow-2xs focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Save Clinical Notes
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5">
            {initialNotes ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {initialNotes}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No clinical notes recorded yet for this patient. Click &ldquo;Add Notes&rdquo; above to record medical observations.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

