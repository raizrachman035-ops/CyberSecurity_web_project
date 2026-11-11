import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full pt-32 pb-20 overflow-hidden bg-surface-container-lowest"
    >
      {/* Ambient grid telemetry glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop relative z-10 flex flex-col gap-8">
        {/* Monospace Status Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span className="font-telemetry text-xs text-secondary font-semibold uppercase tracking-wider">
              DEFCON 1 ACTIVE // THREAT RADAR ON
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 font-telemetry text-xs text-on-surface-variant">
            <span>LATENCY: 1.4ms</span>
            <span>•</span>
            <span>MITIGATED L7 ATTACKS: 4.8M / 24H</span>
            <span>•</span>
            <span>NODE: JKT-ID-01</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-telemetry text-xs text-primary-container uppercase tracking-widest font-semibold">
                // ARSITEKTUR PERTAHANAN WEB & UJI PENETRASI
              </span>
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                {siteConfig.heroHeadline}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {siteConfig.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded bg-primary-container text-on-primary-container font-headline text-sm font-bold hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  shield
                </span>
                Mulai Audit & Uji Coba
              </Link>
              <Link
                href={`https://wa.me/${siteConfig.contact.whatsappNumberOnly}?text=Halo%20CyberSecurity,%20saya%20butuh%20konsultasi%20pengamanan%20web`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface font-headline text-sm font-medium hover:bg-surface-bright hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                Konsultasi Tanggap Darurat
              </Link>
            </div>

            {/* Micro Quick Facts */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-headline text-xl sm:text-2xl text-primary font-bold">
                  99.99%
                </span>
                <span className="text-xs text-on-surface-variant">
                  SLA Mitigasi Serangan
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl sm:text-2xl text-secondary font-bold">
                  &lt; 5 Mnt
                </span>
                <span className="text-xs text-on-surface-variant">
                  MTTR Respon Insiden
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xl sm:text-2xl text-primary-container font-bold">
                  Zero
                </span>
                <span className="text-xs text-on-surface-variant">
                  Kebocoran Kredensial
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic / Terminal Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 shadow-2xl">
              {/* Header Bar */}
              <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/80" />
                  <div className="w-3 h-3 rounded-full bg-primary-container/80" />
                  <div className="w-3 h-3 rounded-full bg-secondary/80" />
                  <span className="ml-2 font-telemetry text-xs text-on-surface-variant">
                    soc-live-stream.sh
                  </span>
                </div>
                <span className="font-telemetry text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/30">
                  ENCRYPTED TLS 1.3
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-telemetry text-xs flex flex-col gap-2.5 text-on-surface-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="text-secondary">$</span>
                  <span>./wapt_engine --target enterprise-app.id --deep-scan</span>
                </div>
                <div className="text-on-surface-variant pl-4 border-l border-outline-variant/30 flex flex-col gap-1.5 my-1">
                  <span className="text-secondary">[OK] Target DNS resolved: 103.144.xxx.xx</span>
                  <span>[SCAN] Testing SQL injection payloads (1,420 vectors)...</span>
                  <span className="text-primary-container">[SECURE] WAF layer intercepted 100% of malicious probes</span>
                  <span>[SCAN] Checking CSRF, SSRF & Broken Authentication...</span>
                  <span className="text-secondary">[PASS] Zero exploitable vulnerabilities on edge</span>
                </div>
                <div className="p-3 rounded bg-surface-container border border-outline-variant/30 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-primary font-bold">RADAR TELEMETRY</span>
                    <span className="text-secondary animate-pulse">● LIVE</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full w-[88%] rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1.5">
                    <span>Threat Mitigation: 88,400 pkts/s</span>
                    <span>Load: Normal</span>
                  </div>
                </div>
              </div>

              {/* Visual image preview below terminal */}
              <div className="relative h-44 w-full">
                <Image
                  src="/images/soc-center.png"
                  alt="Security Operations Center Monitoring"
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="font-telemetry text-[11px] text-primary font-semibold">
                    PUSAT KOMANDO SOC JAKARTA
                  </span>
                  <span className="font-telemetry text-[10px] text-secondary">
                    TIER-4 READY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

