import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-surface-container-high p-1 border border-primary/20">
                <Image
                  src={siteConfig.logo.path}
                  alt={siteConfig.logo.alt}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-headline font-bold text-lg text-primary">
                {siteConfig.shortName}
              </span>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {siteConfig.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 font-telemetry text-xs text-secondary bg-secondary/10 px-3 py-1 rounded border border-secondary/20">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                BSSN Compliant
              </span>
              <span className="font-telemetry text-xs text-on-surface-variant bg-surface-container-high px-3 py-1 rounded border border-outline-variant/30">
                ISO/IEC 27001
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-headline font-semibold text-sm text-on-surface uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Services */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-headline font-semibold text-sm text-on-surface uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Portal & Emergency */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-headline font-semibold text-sm text-on-surface uppercase tracking-wider">
              Portal & Saluran Darurat
            </h4>
            <p className="text-xs text-on-surface-variant">
              Akses cepat ke portal klien dan pemantauan tiket insiden siber.
            </p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-primary font-telemetry text-xs hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Portal Klien & Admin
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2 text-on-surface-variant">
              <span className="font-telemetry text-xs">
                HOTLINE CSIRT: {siteConfig.contact.whatsapp}
              </span>
            </div>
          </div>
        </div>

        {/* NDA & Encryption Banner */}
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              lock_clock
            </span>
            <span className="text-xs text-on-surface-variant">
              <strong className="text-on-surface">Garansi Kerahasiaan Penuh:</strong> Setiap interaksi uji penetrasi dilindungi NDA terikat hukum dengan standar data holding ISO 27001.
            </span>
          </div>
          <span className="font-telemetry text-xs text-on-surface-variant shrink-0">
            ENC_LEVEL: AES-256-GCM
          </span>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Kebijakan Privasi UU PDP
            </span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">
              SLA 99.99%
            </span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">
              Status Sistem: Operasional
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

