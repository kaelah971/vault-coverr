"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ClearPoliciesDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ClearPoliciesDialog({
  onCancel,
  onConfirm,
}: ClearPoliciesDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const appMain = document.querySelector("main");
    appMain?.setAttribute("inert", "");

    const focusableSelector =
      'button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      appMain?.removeAttribute("inert");
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onCancel]);

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-policies-title"
      aria-describedby="clear-policies-description"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close clear policies dialog"
        tabIndex={-1}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[#42433D] bg-[#0E100F] p-6 text-[#FFFCE1] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <p className="text-xs text-[#D66A5E]">DESTRUCTIVE ACTION</p>
        <h2 id="clear-policies-title" className="mt-4 text-2xl font-normal">
          Clear demo policies?
        </h2>
        <p
          id="clear-policies-description"
          className="mt-3 text-sm leading-6 text-[#BBBAA6]"
        >
          This will permanently remove all demo policies, claim signals, and
          receipts stored in this browser. This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 border-[#42433D] px-4 text-[11px] font-semibold text-[#BBBAA6] transition-colors hover:border-[#FFFCE1] hover:text-[#FFFCE1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 border-[#D66A5E]/60 bg-[#D66A5E]/[0.06] px-4 text-[11px] font-semibold text-[#D66A5E] transition-colors hover:border-[#D66A5E] hover:bg-[#D66A5E]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2]"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
