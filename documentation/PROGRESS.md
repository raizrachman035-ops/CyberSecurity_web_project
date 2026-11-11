# Progres Proyek - CyberSecurity (PT CyberSecurity Keamanan Indonesia)

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **STEP 4 — Proses Deploy ke Vercel (Langkah 5: Deploy Web App Apps Script)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Setup project (Next.js App Router + Tailwind CSS + Obsidian Signal Design System)
  - [x] Hero Section
  - [x] About Section
  - [x] Service Section (6 Modul Keamanan)
  - [x] Berita/Post Section (Data dummy siap integrasi)
  - [x] Contact Form + Google Maps Embed (SMK IDN Boarding School / Cyber 2 Tower)
  - [x] Responsif (Mobile 375px, Tablet 768px, Desktop 1280px) & Aksesibilitas
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (`code.gs`, `setup.gs`) + inisiasi tabel Google Spreadsheet
  - [x] Dokumentasi `SETUP.md` (panduan integrasi Apps Script & Script Properties)
  - [x] Modul lib storage lokal (`src/lib/storage.ts`) untuk upload gambar berita
  - [x] Modul auth & JWT cookie (`src/lib/auth.ts`, `src/lib/db.ts`)
  - [x] Halaman Login (`/login`) & Register (`/register`)
  - [x] Middleware proteksi rute (`/dashboard/*`) & server-side role check
  - [x] Dashboard Admin (`/dashboard`):
    - [x] Manajemen User (search, ubah role, aktif/nonaktif, delete aman)
    - [x] Manajemen Role (tambah role, permission, proteksi system role)
    - [x] CRUD Berita (create, read, update, delete, upload thumbnail lokal, preview modal)
    - [x] Fitur Ganti Password Akun (enkripsi bcrypt)
  - [x] Integrasi Berita Asli Database ke Landing Page
  - [x] Fix: double submit berita dicegah (loading state + guard)
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan (opsional / **dilewati oleh pengguna**)
  - [x] Dikonfirmasi pengguna (skip)
- [ ] STEP 4 - Deploy & maintenance
  - [x] Setup Google Spreadsheet & salin `code.gs` + `setup.gs` ke Apps Script
  - [x] Script Properties `APPS_SCRIPT_SECRET` sudah dibuat di Apps Script
  - [ ] Jalankan `initTables` agar tabel Roles, Users, News terbentuk di Spreadsheet
  - [ ] Deploy Web App Apps Script & salin Web App URL
  - [ ] Buat file `.env.local` & sambungkan URL + Secret ke website
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Database:** Google Spreadsheet melalui Google Apps Script Web App. File `code.gs` dan `setup.gs` sudah siap di root project dan dicatat di `.gitignore`. Disertakan pula fallback engine lokal (`data/local_db.json`) agar aplikasi langsung bisa diuji coba tanpa hambatan.
- **Keamanan:** Password di-hash menggunakan `bcryptjs` sebelum disimpan. Sesi login menggunakan JWT `jose` tersimpan di HTTP-only cookie.
- **Akun Admin Awal:** `admin@gmail.com` / `123456`. Fitur penggantian password telah disediakan di Dashboard > Keamanan & Sandi.
- **Penyimpanan Media:** File thumbnail disimpan di `public/uploads/` secara lokal dengan modul abstraksi `lib/storage.ts`.
- **Catatan Penting Media:** Di Vercel production nanti, penyimpanan file disk bersifat read-only / efemeral. Di Step 4 akan ditawarkan migrasi ke cloud storage (seperti Vercel Blob / Cloudinary) secara mulus melalui modul `lib/storage.ts`.

## Cara Menjalankan
- `npm run dev` (buka http://localhost:3000)
- `npm run build` (build produksi - status: BERHASIL 17/17 rute)
