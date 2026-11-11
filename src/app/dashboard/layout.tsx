import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Administrator | CyberSecurity",
  description: "Pusat Kendali Pengelolaan Sistem CyberSecurity",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {children}
    </div>
  );
}

