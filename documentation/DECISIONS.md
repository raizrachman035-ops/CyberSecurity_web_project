# Catatan Keputusan Teknis (DECISIONS)

Dokumen ini mencatat keputusan arsitektural dan desain yang diambil selama pengembangan.

---

## 1. Stack & Framework
- **Framework:** Next.js 15 (App Router) + React 19.
  - *Alasan:* Sangat ramah Vercel (Vercel-friendly), mendukung Server Components untuk performa tinggi dan SEO optimal, serta memudahkan pembuatan rute API terproteksi pada Step 2.
- **Styling:** Tailwind CSS dengan Design Token *Obsidian Signal*.
  - *Alasan:* Menjamin kesesuaian visual (fidelitas tinggi) dengan rancangan UI Figma/Stitch tanpa *hard-coded values* yang berulang.

## 2. Aset & Media
- **Logo Perusahaan:** Menggunakan gambar emblem perisai sirkuit siber yang diunggah oleh pengguna dan disimpan di `public/images/logo.png`.
- **Placeholder Visual:** Menggunakan gambar lokal beresolusi tinggi di `public/images/` untuk menjamin tampilan tidak bergantung pada CDN eksternal yang rawan kadaluarsa.

## 3. Peta Lokasi (Google Maps)
- URL tautan dari pengguna: `https://maps.app.goo.gl/gN1nAXrxXvUHnz8q9` (SMK IDN Boarding School).
- Diimplementasikan menggunakan embed iframe resmi Google Maps tanpa memerlukan Google Maps API key berbayar (`https://maps.google.com/maps?q=-6.5252823,107.0381356&hl=id&z=15&output=embed`), dilengkapi `loading="lazy"` dan filter tema gelap (dark mode) agar serasi dengan desain Obsidian Signal.

## 4. Konfigurasi Terpusat
- Seluruh data teks, daftar layanan, artikel berita, kontak, dan link navigasi disimpan di `src/config/site.ts` sehingga mudah diperbarui tanpa harus mengedit kode komponen JSX/TSX.

