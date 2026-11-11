"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

interface DisplayNewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  date: string;
  author: string;
}

export default function NewsSection() {
  const [newsList, setNewsList] = useState<DisplayNewsItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<DisplayNewsItem | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success && Array.isArray(data.news) && data.news.length > 0) {
        const formatted: DisplayNewsItem[] = data.news.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          thumbnail: item.thumbnail_path || "/images/soc-center.png",
          category: "Riset Keamanan",
          date: new Date(item.created_at || Date.now()).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          author: item.author_id || "Analis Siber",
        }));
        setNewsList(formatted);
        return;
      }
    } catch {
      // Fallback ke siteConfig jika offline
    }

    // Default fallback
    setNewsList(siteConfig.news);
  };

  return (
    <section id="news" className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-telemetry text-xs text-secondary tracking-widest uppercase">
              // THREAT INTELLIGENCE & RESEARCH
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Kabar Intelijen Siber & Analisis Kerentanan
            </h2>
            <p className="text-base text-on-surface-variant">
              Laporan berkala hasil observasi radar ancaman SOC {siteConfig.shortName} terhadap vektor serangan aplikasi web terkini (terhubung langsung ke database).
            </p>
          </div>
          <span className="font-telemetry text-xs text-on-surface-variant px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
            {newsList.length} LAPORAN TERPUBLIKASI
          </span>
        </div>

        {/* 3 Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high transition-all shadow-md group"
            >
              <div className="flex flex-col gap-4">
                {/* Thumbnail */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-surface-container-lowest">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-telemetry text-[11px] text-secondary bg-surface-container-lowest/90 px-2.5 py-1 rounded backdrop-blur-sm border border-secondary/30">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant font-telemetry pt-1">
                  <span>{item.date}</span>
                  <span>{item.author}</span>
                </div>

                <h3 className="font-headline text-lg font-bold text-primary group-hover:text-primary-container transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(item)}
                  className="inline-flex items-center gap-1.5 font-headline text-xs text-primary-container font-semibold hover:underline"
                >
                  Baca Selengkapnya
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_right_alt
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-2xl flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-surface-container-high text-on-surface hover:text-primary transition-colors"
              aria-label="Tutup artikel"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-telemetry text-xs text-secondary bg-secondary/10 px-2.5 py-1 rounded border border-secondary/30">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-on-surface-variant font-telemetry">
                {selectedArticle.date} • {selectedArticle.author}
              </span>
            </div>

            <h3 className="font-headline text-2xl font-bold text-primary">
              {selectedArticle.title}
            </h3>

            <div className="relative h-60 w-full rounded-xl overflow-hidden bg-surface-container-lowest">
              <Image
                src={selectedArticle.thumbnail}
                alt={selectedArticle.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-base text-on-surface leading-relaxed space-y-4">
              <p className="text-on-surface-variant font-medium">
                {selectedArticle.excerpt}
              </p>
              <p className="whitespace-pre-line">{selectedArticle.content}</p>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded bg-surface-container-high hover:bg-surface-bright text-primary font-headline text-xs font-bold transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
