import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ServicesSection() {
  return (
    <section id="services" className="w-full py-20 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-telemetry text-xs text-primary-container tracking-widest uppercase">
              // SOLUSI PERTAHANAN & PENGUJIAN WEB
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Layanan Keamanan Web Terkelola
            </h2>
            <p className="text-base text-on-surface-variant">
              Arsitektur pertahanan modular dirancang untuk melindungi setiap lapisan web stack mulai dari basis kode hingga jaringan komputasi awan.
            </p>
          </div>
          <div className="flex items-center gap-2 font-telemetry text-xs text-on-surface-variant">
            <span>{siteConfig.services.length} MODUL AKTIF</span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.map((service, index) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary-container/40 hover:bg-surface-container transition-all duration-300 shadow-md hover:shadow-[0_0_24px_rgba(0,242,254,0.12)]"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="material-symbols-outlined text-[26px]">
                      {service.icon}
                    </span>
                  </div>
                  <span className="font-telemetry text-xs text-on-surface-variant">
                    {service.code}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-headline text-lg font-bold text-primary group-hover:text-primary-container transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="font-telemetry text-[11px] text-secondary font-semibold">
                  {service.badge}
                </span>
                <Link
                  href="#contact"
                  className="inline-flex items-center text-primary group-hover:translate-x-1 transition-transform"
                  aria-label={`Pilih layanan ${service.title}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

