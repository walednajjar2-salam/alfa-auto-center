"use client";

import type { WorkOrderStatus } from "@prisma/client";
import { updateWorkOrderStatus } from "@/lib/actions/work-orders";

export default function StatusButton({
  id,
  status,
  label,
  className,
}: {
  id: string;
  status: WorkOrderStatus;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        await updateWorkOrderStatus(id, status);
      }}
    >
      <button type="submit" className={className ?? "ghost-button"}>
        {label}
      </button>
    </form>
  );
}
