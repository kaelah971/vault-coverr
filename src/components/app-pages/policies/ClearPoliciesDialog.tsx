"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ClearPoliciesDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const dialogButton =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 px-4 text-[11px] font-semibold leading-none transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2] motion-reduce:transition-none";

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
        className="absolute inset-0 cursor-default bg-[#0E100F]/85 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close clear policies dialog"
        tabIndex={-1}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-[#42433D] bg-[#0E100F] p-6 text-[#FFFCE1] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(247,189,248,0.12),transparent_32%),linear-gradient(rgba(255,252,225,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.03)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px] [mask-image:linear-gradient(to_bottom_right,black,transparent_78%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#F7BDF8,#00BAE2,#ABFF84)]"
        />
        <div className="relative">
          <p className="text-xs text-[#F7BDF8]">DESTRUCTIVE ACTION</p>
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
              className={`${dialogButton} border-[#42433D] text-[#BBBAA6] hover:border-[#FFFCE1] hover:bg-[#FFFCE1]/10 hover:text-[#FFFCE1]`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`${dialogButton} border-[#F7BDF8]/60 bg-[#F7BDF8]/[0.06] text-[#F7BDF8] hover:border-[#F7BDF8] hover:bg-[#F7BDF8]/10`}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
