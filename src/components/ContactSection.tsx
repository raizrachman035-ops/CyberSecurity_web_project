"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "wapt",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="w-full py-20 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="font-telemetry text-xs text-primary-container tracking-widest uppercase">
            // HUBUNGI TIM CSIRT & AUDIT
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Konsultasi Kesiapsiagaan & Tanggap Insiden Siber
          </h2>
          <p className="text-base text-on-surface-variant">
            Dapatkan penilaian risiko tanpa komitmen atau hubungi pusat komando darurat kami untuk penanganan pengamanan web secara rahasia.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* Left Side: Contact Cards & Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-headline">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  Pusat Operasional & SOC
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {siteConfig.address.detail}, {siteConfig.address.city}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-secondary font-bold text-sm font-headline">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  Hotline & CSIRT 24 Jam
                </div>
                <p className="text-xs text-on-surface-variant">
                  Hotline: <strong className="text-on-surface">{siteConfig.contact.phone}</strong><br />
                  WA CSIRT: <strong className="text-secondary">{siteConfig.contact.whatsapp}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-headline">
                  <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                  Email Resmi Terenkripsi
                </div>
                <p className="text-xs text-on-surface-variant font-telemetry">
                  Umum: <span className="text-on-surface">{siteConfig.contact.email}</span><br />
                  Darurat: <span className="text-error font-semibold">{siteConfig.contact.emergencyEmail}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-on-surface font-bold text-sm font-headline">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  Jam Operasional
                </div>
                <p className="text-xs text-on-surface-variant">
                  SOC: <strong className="text-secondary">{siteConfig.contact.socHours}</strong><br />
                  Konsultasi: {siteConfig.contact.operationalHours}
                </p>
              </div>
            </div>

            {/* Audit Request Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-xl flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-xl font-bold text-primary">
                  Formulir Permintaan Audit & Uji Penetrasi
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Seluruh komunikasi dilindungi oleh standar kerahasiaan Non-Disclosure Agreement (NDA) ketat sebelum pertukaran data teknis.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-surface-container-high border border-secondary/40 flex flex-col gap-3 text-center items-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </div>
                  <h4 className="font-headline text-lg font-bold text-primary">
                    Permintaan Berhasil Terkirim
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-md">
                    Terima kasih, {formData.name}. Tiket permintaan audit keamanan Anda telah dicatat. Tim CSIRT kami akan menghubungi Anda melalui email atau WhatsApp dalam 15 menit.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: "", email: "", service: "wapt", message: "" });
                    }}
                    className="mt-2 px-4 py-2 rounded bg-surface-bright text-xs text-primary font-bold hover:bg-surface-container-highest transition-colors"
                  >
                    Kirim Permintaan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="font-telemetry text-xs text-on-surface-variant uppercase">
                        Nama Lengkap / Instansi
                      </label>
                      <input
                        id="name"
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="mis. Arya Pratama, Head of IT"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container font-sans text-sm transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="font-telemetry text-xs text-on-surface-variant uppercase">
                        Email Resmi Perusahaan
                      </label>
                      <input
                        id="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@perusahaan.co.id"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container font-sans text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="font-telemetry text-xs text-on-surface-variant uppercase">
                      Layanan yang Dibutuhkan
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary-container font-sans text-sm transition-all"
                    >
                      {siteConfig.services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-surface-container">
                          {s.title} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="font-telemetry text-xs text-on-surface-variant uppercase">
                      Cakupan Target / Deskripsi Kebutuhan
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Sebutkan URL aplikasi web, jenis arsitektur server, atau indikasi serangan yang sedang dialami..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container font-sans text-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-bold hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">encrypted</span>
                    Kirim Permintaan Audit Keamanan
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side: Google Maps Embed & Location Info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container border border-outline-variant/40 flex flex-col min-h-[520px]">
              {/* Google Maps Iframe */}
              <div className="w-full h-80 relative bg-surface-container-lowest">
                <iframe
                  title="Peta Lokasi Kantor CyberSecurity"
                  src={siteConfig.address.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter invert-[90%] hue-rotate-180 brightness-90 contrast-125"
                />
              </div>

              {/* Map Info Overlay */}
              <div className="p-6 bg-surface-container-high flex flex-col gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-telemetry text-xs text-secondary">
                      SOC_COMMAND_POST_JKT
                    </span>
                    <span className="font-telemetry text-[11px] text-on-surface-variant">
                      {siteConfig.address.coordinates}
                    </span>
                  </div>

                  <h4 className="font-headline text-lg font-bold text-primary">
                    {siteConfig.address.label}
                  </h4>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.address.detail}, {siteConfig.address.city}. Terkoneksi ke jaringan riset keamanan siber nasional dan pusat komando pertahanan web 24/7.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-outline-variant/20">
                  <Link
                    href={siteConfig.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-bright text-primary font-telemetry text-xs font-bold hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">directions</span>
                    Buka di Google Maps
                  </Link>
                  <span className="font-telemetry text-[11px] text-on-surface-variant">
                    Biometric & Restricted Access
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

