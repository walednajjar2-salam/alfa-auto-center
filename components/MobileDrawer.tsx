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

const groups = [
  {
    title: "العمل اليومي",
    icon: ClipboardList,
    items: [
      { href: "/reception", label: "استقبال سيارة" },
      { href: "/work-orders", label: "أوامر العمل" },
      { href: "/work-orders?status=INSPECTION", label: "الفحص والتشخيص" },
    ],
  },
  {
    title: "العملاء والسيارات",
    icon: UsersRound,
    items: [
      { href: "/customers", label: "العملاء" },
      { href: "/vehicles", label: "السيارات" },
    ],
  },
  {
    title: "الحسابات",
    icon: WalletCards,
    items: [
      { href: "/invoices", label: "الفواتير" },
      { href: "/payments", label: "المدفوعات" },
    ],
  },
];

type Props = { open: boolean; onClose: () => void; pathname: string };

export default function MobileDrawer({ open, onClose, pathname }: Props) {
  const [expanded, setExpanded] = useState<string | null>("العمل اليومي");

  return (
    <>
      {open && <button className="drawer-backdrop" aria-label="إغلاق القائمة" onClick={onClose} />}
      <aside className={`mobile-drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <div>
            <strong>ALFA</strong>
            <span>مركز ألفا</span>
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
          {groups.map((group) => {
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
          <div className="drawer-main" style={{ opacity: 0.45 }}>
            <Package size={18} />
            <span>المخزون</span>
            <span />
          </div>
          <div className="drawer-main" style={{ opacity: 0.45 }}>
            <Settings size={18} />
            <span>الإعدادات</span>
            <span />
          </div>
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
