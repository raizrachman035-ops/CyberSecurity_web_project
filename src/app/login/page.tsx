"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login gagal. Periksa kembali email dan password Anda.");
        setLoading(false);
        return;
      }

      // Berhasil login
      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("Terjadi gangguan koneksi ke server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high p-1.5 border border-primary/20 group-hover:border-primary-container transition-colors">
              <Image
                src={siteConfig.logo.path}
                alt={siteConfig.logo.alt}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="font-headline font-bold text-2xl text-primary">
              {siteConfig.shortName}
            </span>
          </Link>
          <h1 className="font-headline font-bold text-xl text-on-surface mt-2">
            Portal Klien & Akses Admin
          </h1>
          <p className="text-xs text-on-surface-variant font-telemetry">
            OTENTIKASI TERENKRIPSI SHA-256 / JWT
          </p>
        </div>

        {/* Credentials Reminder Box */}
        <div className="p-4 rounded-xl bg-surface-container-high border border-primary/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-telemetry font-bold text-primary-container flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">key</span>
              AKUN ADMIN BAWAAN
            </span>
            <span className="font-telemetry text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
              DEVELOPMENT
            </span>
          </div>
          <div className="text-xs text-on-surface-variant space-y-0.5 font-telemetry">
            <div>Email: <strong className="text-on-surface">admin@gmail.com</strong></div>
            <div>Password: <strong className="text-on-surface">123456</strong></div>
          </div>
          <p className="text-[11px] text-error leading-tight mt-1">
            * Peringatan: Harap ganti password ini di Dashboard sebelum website dipublikasikan ke production.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/40 text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-telemetry text-xs text-on-surface-variant uppercase">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container font-sans text-sm transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="pass" className="font-telemetry text-xs text-on-surface-variant uppercase">
                  Password
                </label>
              </div>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container font-sans text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-primary-container text-on-primary-container font-headline text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk ke Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Belum punya akun?</span>
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Daftar Akun Baru
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors font-telemetry">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

