# Panduan Aset Media & Gambar

Dokumen ini mencatat daftar gambar yang digunakan pada website company profile **CyberSecurity**, lokasi file, serta resolusi ideal jika Anda ingin menggantinya di kemudian hari.

---

## Daftar Gambar

| Nama File | Path | Ukuran Rekomendasi | Keterangan & Letak |
|---|---|---|---|
| **Logo Usaha** | `/public/images/logo.png` | 512 x 512 px (PNG transparan) | Logo perisai sirkuit siber, tampil di Navbar dan Footer |
| **SOC Operations Center** | `/public/images/soc-center.png` | 1200 x 800 px (16:9 atau 3:2) | Pratinjau pusat komando SOC pada Hero Section & Thumbnail Berita 1 & 3 |
| **Tim Analis & Hacker** | `/public/images/team-collaboration.png` | 1200 x 800 px (16:9 atau 3:2) | Foto tim kolaborasi riset ancaman pada Section About & Thumbnail Berita 2 |

---

## Cara Mengganti Gambar

1. Siapkan file gambar baru dengan rasio/resolusi di atas.
2. Beri nama file yang sama (misal `logo.png` atau `soc-center.png`).
3. Ganti file di dalam folder `public/images/`.
4. Jika ingin menambahkan file baru dengan nama berbeda, perbarui konfigurasinya di `src/config/site.ts`.

