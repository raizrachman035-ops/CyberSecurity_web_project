import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="font-telemetry text-xs text-secondary tracking-widest uppercase">
            // TENTANG KAMI & REKAM JEJAK
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Dedikasi Menjaga Kedaulatan & Keamanan Ekosistem Web Anda
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed">
            {siteConfig.shortName} hadir dengan misi tunggal: melindungi platform web enterprise dan menguji ketahanan sistem dari ancaman siber yang kian canggih sebelum menimbulkan kerugian reputasi maupun finansial.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          {/* Left Cards */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[26px]">terminal</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-base font-bold text-on-surface">
                  Offensive Security & Uji Coba Penetrasi Mendalam
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Didukung personel bersertifikasi OSCP dan CREST yang melakukan simulasi serangan nyata berbasis taktik MITRE ATT&CK untuk membongkar celah tersembunyi sebelum dieksploitasi pihak luar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[26px]">radar</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-base font-bold text-on-surface">
                  Pemantauan SOC 24/7/365 Real-Time
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Automated anomaly detection diperkuat machine learning dan analis keamanan siaga 24 jam untuk mitigasi instan dalam hitungan detik setelah serangan terdeteksi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary-container">
                <span className="material-symbols-outlined text-[26px]">policy</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-base font-bold text-on-surface">
                  Kepatuhan Regulasi UU PDP & ISO 27001
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Audit kesiapan menyeluruh mengacu pada ISO/IEC 27001:2022 dan implementasi ketat Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
                </p>
              </div>
            </div>
          </div>

          {/* Right Photo & Badges */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="relative rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shadow-xl group">
              <div className="relative h-80 w-full">
                <Image
                  src="/images/team-collaboration.png"
                  alt="Tim Ethical Hacker dan Analis Keamanan Siber Berkolaborasi"
                  fill
                  className="object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline text-sm text-primary font-bold">
                      Unit Elit Cyber Threat Research (CTR)
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Reverse Engineers, Red Teamers, dan Spesialis Forensik
                    </span>
                  </div>
                  <span className="font-telemetry text-xs text-secondary bg-surface-container-high px-2 py-1 rounded">
                    SEC_TIER_3
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Mini Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-surface-container rounded-xl text-center border border-outline-variant/20">
                <span className="block font-headline text-sm text-primary font-bold">
                  OSCP / CREST
                </span>
                <span className="font-telemetry text-[11px] text-on-surface-variant">
                  Uji Penetrasi
                </span>
              </div>
              <div className="p-3 bg-surface-container rounded-xl text-center border border-outline-variant/20">
                <span className="block font-headline text-sm text-secondary font-bold">
                  ISO 27001
                </span>
                <span className="font-telemetry text-[11px] text-on-surface-variant">
                  Sistem Manajemen
                </span>
              </div>
              <div className="p-3 bg-surface-container rounded-xl text-center border border-outline-variant/20">
                <span className="block font-headline text-sm text-primary font-bold">
                  UU PDP No. 27
                </span>
                <span className="font-telemetry text-[11px] text-on-surface-variant">
                  Privasi Data
                </span>
              </div>
              <div className="p-3 bg-surface-container rounded-xl text-center border border-outline-variant/20">
                <span className="block font-headline text-sm text-secondary font-bold">
                  PCI-DSS QSA
                </span>
                <span className="font-telemetry text-[11px] text-on-surface-variant">
                  Audit Web Transaksi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

