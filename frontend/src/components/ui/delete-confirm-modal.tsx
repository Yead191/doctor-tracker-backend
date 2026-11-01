"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = "record",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, isLoading]);

  if (!mounted || !open) return null;

  const defaultTitle =
    variant === "danger"
      ? `Delete ${itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : "Record"}`
      : `Remove ${itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : "Record"}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 transition-all">
        {/* Top Accent Strip */}
        <div
          className={`absolute top-0 inset-x-0 h-1.5 ${
            variant === "danger"
              ? "bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500"
              : "bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500"
          }`}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
          {/* Danger / Warning Icon */}
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              variant === "danger"
                ? "bg-rose-50 text-rose-600 border-rose-100 ring-4 ring-rose-500/10"
                : "bg-amber-50 text-amber-600 border-amber-100 ring-4 ring-amber-500/10"
            }`}
          >
            {variant === "danger" ? (
              <Trash2 className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {title || defaultTitle}
            </h3>

            {description ? (
              <div className="text-sm text-slate-600 leading-relaxed">
                {description}
              </div>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete{" "}
                {itemName ? (
                  <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    {itemName}
                  </span>
                ) : (
                  `this ${itemType}`
                )}
                ? This action is permanent and cannot be undone.
              </p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="gap-1.5 shadow-sm shadow-rose-900/10"
          >
            <Trash2 className="h-4 w-4" />
            <span>{confirmText}</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

