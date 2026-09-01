"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, FileText, Home, Plus, UsersRound } from "lucide-react";
import { canAccess } from "@/lib/permissions";

const items = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/work-orders", label: "الأوامر", icon: CarFront },
  { href: "/reception", label: "استقبال", icon: Plus, floating: true },
  { href: "/invoices", label: "الفواتير", icon: FileText },
  { href: "/customers", label: "العملاء", icon: UsersRound },
];

export default function BottomNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const visible = items.filter((item) => canAccess(role, item.href));

  return (
    <nav className="bottom-nav">
      {visible.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        if (item.floating) {
          return (
            <Link key={item.href} href={item.href} className="floating-add" aria-label={item.label}>
              <Plus size={22} />
            </Link>
          );
        }
        return (
          <Link key={item.href} href={item.href} className={active ? "active" : ""}>
            <Icon size={18} />
            <small>{item.label}</small>
          </Link>
        );
      })}
    </nav>
  );
}
