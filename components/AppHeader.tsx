"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import MobileDrawer from "./MobileDrawer";

export default function AppHeader({ userName, role }: { userName?: string | null; role?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="mobile-header">
        <button className="top-icon-button" onClick={() => setOpen(true)} aria-label="فتح القائمة">
          <Menu size={20} />
        </button>
        <Link href="/dashboard" className="header-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" className="header-icon" />
          <div>
            <strong>مركز ألفا</strong>
            <small>{userName ? `مرحباً ${userName}` : "ALFA AUTO CENTER"}</small>
          </div>
        </Link>
        <Link href="/work-orders" className="top-icon-button notification" aria-label="التنبيهات">
          <Bell size={20} />
        </Link>
      </header>
      <MobileDrawer open={open} onClose={() => setOpen(false)} pathname={pathname} role={role} />
    </>
  );
}
