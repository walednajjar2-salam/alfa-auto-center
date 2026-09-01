import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مركز ألفا لصيانة السيارات",
  description: "نظام تشغيل الورشة — استقبال، فحص، صيانة، فواتير، مخزون، وصندوق.",
  applicationName: "مركز ألفا",
  appleWebApp: { capable: true, title: "مركز ألفا", statusBarStyle: "black-translucent" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
