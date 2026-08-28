import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ALFA Auto Center", description: "نظام إدارة مركز ألفا لصيانة السيارات", manifest: "/manifest.webmanifest" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
