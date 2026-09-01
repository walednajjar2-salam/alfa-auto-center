import type { UserRole } from "@prisma/client";
import { requireUser } from "./session";
import { canAccess } from "./permissions";
import { redirect } from "next/navigation";

export async function requirePageAccess(pathname: string) {
  const user = await requireUser();
  if (!canAccess(user.role, pathname)) redirect("/dashboard");
  return user as { id: string; name?: string | null; role: UserRole };
}

export async function requireActionAccess(pathname: string) {
  const user = await requireUser();
  if (!canAccess(user.role, pathname)) {
    throw new Error("ليست لديك صلاحية لهذه العملية");
  }
  return user as { id: string; name?: string | null; role: UserRole };
}
