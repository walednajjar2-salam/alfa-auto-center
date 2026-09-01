"use client";

import { useState, type ReactNode } from "react";

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}

export default function ActionForm({
  action,
  children,
  className,
  encType,
}: {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  className?: string;
  encType?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await action(formData);
      setPending(false);
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      setPending(false);
      setError(err instanceof Error ? err.message : "تعذر تنفيذ العملية");
    }
  }

  return (
    <form action={onSubmit} className={className} encType={encType}>
      {error ? <p className="form-error">{error}</p> : null}
      <fieldset disabled={pending} className="bare-fieldset">
        {children}
      </fieldset>
    </form>
  );
}
