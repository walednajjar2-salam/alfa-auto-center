"use client";

import { updateAppointmentStatus } from "@/lib/actions/appointments";
import type { AppointmentStatus } from "@prisma/client";

export default function AppointmentStatusButton({
  id,
  status,
  label,
  className,
}: {
  id: string;
  status: AppointmentStatus;
  label: string;
  className?: string;
}) {
  return (
    <form action={async () => updateAppointmentStatus(id, status)}>
      <button type="submit" className={className ?? "ghost-button"}>
        {label}
      </button>
    </form>
  );
}
