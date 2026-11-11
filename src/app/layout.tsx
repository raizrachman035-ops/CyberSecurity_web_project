import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://cybersecurity.id"),
  title: `${siteConfig.shortName} | ${siteConfig.field}`,
  description: siteConfig.description,
  keywords: [
    "cybersecurity",
    "web security",
    "pengamanan web",
    "penetration testing",
    "WAPT",
    "WAF",
    "SOC 24/7",
    "audit keamanan",
    "Indonesia",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.shortName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "https://cybersecurity.id",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo.path,
        width: 800,
        height: 800,
        alt: siteConfig.logo.alt,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: siteConfig.logo.path,
    shortcut: siteConfig.logo.path,
    apple: siteConfig.logo.path,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

