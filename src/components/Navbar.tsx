"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop h-20 flex items-center justify-between gap-space-lg">
        {/* Brand & Logo */}
        <Link href="#hero" className="flex items-center gap-space-sm group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high p-1 border border-primary/20 group-hover:border-primary-container transition-colors">
            <Image
              src={siteConfig.logo.path}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg text-primary tracking-tight group-hover:text-primary-container transition-colors">
              {siteConfig.shortName}
            </span>
            <span className="text-[10px] text-on-surface-variant font-telemetry tracking-wider uppercase">
              Web Security
            </span>
          </div>
          <span className="hidden xl:inline-block font-telemetry text-[11px] text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/30 ml-2">
            SEC_OPS v4.2
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-space-lg"
          aria-label="Navigasi Utama"
        >
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary-container text-on-primary-container font-headline text-xs font-bold tracking-wide hover:shadow-[0_0_16px_rgba(0,242,254,0.35)] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Portal Klien
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-low border-b border-outline-variant/30 px-margin py-4 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3" aria-label="Navigasi Mobile">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded text-on-surface hover:text-primary hover:bg-surface-container transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-outline-variant/20">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-primary-container text-on-primary-container font-headline text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Portal Klien
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

