"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { canAccess } from "@/lib/permissions";

const groups = [
  {
    title: "العمل اليومي",
    icon: ClipboardList,
    items: [
      { href: "/reception", label: "استقبال سيارة" },
      { href: "/work-orders", label: "أوامر العمل" },
      { href: "/work-orders?status=INSPECTION", label: "الفحص والتشخيص" },
      { href: "/service", label: "الصيانة والإصلاح" },
    ],
  },
  {
    title: "العملاء والسيارات",
    icon: UsersRound,
    items: [
      { href: "/customers", label: "العملاء" },
      { href: "/vehicles", label: "السيارات" },
      { href: "/visits", label: "سجل الزيارات" },
    ],
  },
  {
    title: "المخزون",
    icon: Package,
    items: [
      { href: "/parts", label: "قطع الغيار" },
      { href: "/inventory", label: "المخزون" },
      { href: "/suppliers", label: "الموردون" },
      { href: "/purchases", label: "المشتريات" },
    ],
  },
  {
    title: "الحسابات",
    icon: WalletCards,
    items: [
      { href: "/invoices", label: "الفواتير" },
      { href: "/quotations", label: "عروض الأسعار" },
      { href: "/payments", label: "المدفوعات" },
      { href: "/expenses", label: "المصاريف" },
      { href: "/cash", label: "الصندوق" },
    ],
  },
  {
    title: "الإدارة",
    icon: Settings,
    items: [
      { href: "/appointments", label: "المواعيد" },
      { href: "/reports", label: "التقارير" },
      { href: "/backup", label: "النسخ الاحتياطي" },
      { href: "/users", label: "المستخدمون" },
      { href: "/settings", label: "الإعدادات" },
    ],
  },
];

type Props = { open: boolean; onClose: () => void; pathname: string; role?: string };

export default function MobileDrawer({ open, onClose, pathname, role }: Props) {
  const [expanded, setExpanded] = useState<string | null>("العمل اليومي");
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccess(role, item.href)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {open && <button className="drawer-backdrop" aria-label="إغلاق القائمة" onClick={onClose} />}
      <aside
        className={`mobile-drawer ${open ? "open" : ""}`}
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        <div className="drawer-head">
          <div className="header-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="drawer-logo" />
            <div>
              <strong>ALFA</strong>
              <span>مركز ألفا</span>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>
        <nav>
          <Link
            href="/dashboard"
            className={`drawer-main ${pathname === "/dashboard" ? "active" : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>لوحة التحكم</span>
            <ChevronLeft size={16} />
          </Link>
          {visibleGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expanded === group.title;
            return (
              <div className="drawer-group" key={group.title}>
                <button
                  className="drawer-main"
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : group.title)}
                >
                  <Icon size={18} />
                  <span>{group.title}</span>
                  <ChevronDown size={16} className={isExpanded ? "rotate" : ""} />
                </button>
                <div className={`submenu ${isExpanded ? "show" : ""}`}>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <form action={logoutAction} className="drawer-logout">
          <button type="submit">
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </form>
      </aside>
    </>
  );
}
