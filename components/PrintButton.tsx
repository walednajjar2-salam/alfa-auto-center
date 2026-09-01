"use client";

export default function PrintButton({ label = "طباعة / حفظ PDF" }: { label?: string }) {
  return (
    <button type="button" className="primary-button compact-button no-print" onClick={() => window.print()}>
      {label}
    </button>
  );
}
