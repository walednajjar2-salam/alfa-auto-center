import Link from "next/link";
import type { ReactNode } from "react";

export default function EmptyState({
  title,
  hint,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  hint?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {hint ? <p>{hint}</p> : null}
      {children}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="primary-button compact-button">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
