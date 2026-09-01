import type { UserRole } from "@prisma/client";

const ALL: UserRole[] = ["ADMIN", "RECEPTION", "ACCOUNTING", "TECHNICIAN", "STORE"];

const rules: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/users", roles: ["ADMIN"] },
  { prefix: "/settings", roles: ["ADMIN"] },
  { prefix: "/backup", roles: ["ADMIN"] },
  { prefix: "/reports", roles: ["ADMIN", "ACCOUNTING"] },
  { prefix: "/suppliers", roles: ["ADMIN", "STORE"] },
  { prefix: "/purchases", roles: ["ADMIN", "STORE"] },
  { prefix: "/parts", roles: ["ADMIN", "STORE", "TECHNICIAN"] },
  { prefix: "/inventory", roles: ["ADMIN", "STORE", "TECHNICIAN"] },
  { prefix: "/invoices", roles: ["ADMIN", "ACCOUNTING", "RECEPTION"] },
  { prefix: "/payments", roles: ["ADMIN", "ACCOUNTING", "RECEPTION"] },
  { prefix: "/expenses", roles: ["ADMIN", "ACCOUNTING"] },
  { prefix: "/cash", roles: ["ADMIN", "ACCOUNTING"] },
  { prefix: "/customers", roles: ["ADMIN", "RECEPTION"] },
  { prefix: "/vehicles", roles: ["ADMIN", "RECEPTION"] },
  { prefix: "/appointments", roles: ["ADMIN", "RECEPTION"] },
  { prefix: "/reception", roles: ["ADMIN", "RECEPTION"] },
  { prefix: "/work-orders", roles: ["ADMIN", "RECEPTION", "TECHNICIAN"] },
  { prefix: "/service", roles: ["ADMIN", "RECEPTION", "TECHNICIAN"] },
  { prefix: "/visits", roles: ["ADMIN", "RECEPTION", "TECHNICIAN"] },
  { prefix: "/dashboard", roles: ALL },
];

export function pathKey(pathname: string) {
  return pathname.split("?")[0] || "/";
}

export function canAccess(role: string | undefined, pathname: string) {
  if (role === "ADMIN") return true;
  const path = pathKey(pathname);
  const match = [...rules].sort((a, b) => b.prefix.length - a.prefix.length).find((rule) => path === rule.prefix || path.startsWith(`${rule.prefix}/`));
  if (!match) return true;
  return match.roles.includes((role || "RECEPTION") as UserRole);
}

export function allowedRolesFor(pathname: string) {
  const path = pathKey(pathname);
  const match = [...rules].sort((a, b) => b.prefix.length - a.prefix.length).find((rule) => path === rule.prefix || path.startsWith(`${rule.prefix}/`));
  return match?.roles ?? ALL;
}
