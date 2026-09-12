import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "CampusEngage",
  description: "Meaningful connections start here.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Campus",
  },
};

import { PushManager } from "@/components/PushManager";
import { InstallPWA } from "@/components/InstallPWA";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <PushManager />
          <InstallPWA />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
