import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <span className="font-telemetry text-xs text-error bg-error/10 px-3 py-1 rounded border border-error/30">
          ERROR 404 // TARGET UNREACHABLE
        </span>
        <h1 className="font-headline font-extrabold text-4xl text-primary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Alamat rute atau modul yang Anda minta tidak tersedia pada sistem pertahanan siber kami atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-headline text-xs font-bold hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
        >
          Kembali ke Beranda Utama
        </Link>
      </div>
    </div>
  );
}

