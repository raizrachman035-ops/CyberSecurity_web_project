# Panduan Setup Database Google Spreadsheet & Apps Script

Dokumen ini memandu Anda (langkah demi langkah) untuk menghubungkan website **CyberSecurity** ke Google Spreadsheet melalui Google Apps Script.

---

## Mengapa Memakai Google Apps Script?
Google Spreadsheet berfungsi sebagai database gratis, transparan, dan mudah dipantau secara langsung oleh Anda. Agar aman, browser pengunjung **tidak pernah mengakses spreadsheet secara langsung**. Seluruh panggilan dikirim ke server Next.js kita, lalu diteruskan ke Google Apps Script menggunakan **kunci rahasia (secret token)**.

---

## Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet Anda, misalnya: **`CyberSecurity Database`**.
3. Di menu atas, klik **Extensions (Ekstensi)** > **Apps Script**.
4. Tab editor Apps Script akan terbuka. Beri nama proyek di kiri atas, misalnya **`CyberSecurity Backend`**.

---

## Langkah 2: Salin Kode `code.gs` dan `setup.gs`
1. Di editor Apps Script, Anda akan melihat file bawaan bernama `Code.gs`.
   - Buka file **`code.gs`** di root folder proyek ini di komputer Anda.
   - Salin seluruh isinya dan gantikan isi `Code.gs` di editor Apps Script.
2. Di panel kiri Apps Script, klik tombol **`+` (Add a file)** > pilih **Script**.
   - Beri nama file: **`setup`**.
   - Buka file **`setup.gs`** di root folder proyek ini.
   - Salin seluruh isinya dan tempel ke file `setup.gs` di editor Apps Script.
3. Klik ikon disket **Save project** (Ctrl + S) di toolbar atas.

---

## Langkah 3: Inisiasi Tabel Otomatis
1. Pada dropdown fungsi di toolbar atas (di sebelah tombol "Debug"), pilih fungsi: **`initTables`**.
2. Klik tombol **Run (Jalankan)**.
3. Google akan meminta izin (*Authorization Required*):
   - Klik **Review permissions** > pilih akun Google Anda.
   - Klik **Advanced** (di kiri bawah pop-up) > klik **Go to CyberSecurity Backend (unsafe)**.
   - Klik **Allow**.
4. Tunggu beberapa detik hingga muncul status *Execution completed*.
5. Buka kembali tab Google Spreadsheet Anda: Anda akan melihat 3 sheet otomatis terbentuk dengan rapi:
   - **`Roles`** (berisi role `admin` dan `user`).
   - **`Users`** (berisi akun awal `admin@gmail.com`).
   - **`News`** (berisi 3 artikel berita keamanan awal).

> [!NOTE]
> Fungsi `initTables()` bersifat **idempoten** (aman dijalankan ulang kapan saja tanpa menduplikasi data).

---

## Langkah 4: Buat Kunci Rahasia (Script Properties)
1. Di editor Apps Script, klik ikon gerigi **Project Settings** (di panel kiri paling bawah).
2. Gulir ke bawah ke bagian **Script Properties**, lalu klik **Edit script properties** > **Add script property**.
3. Masukkan:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** Buat token acak yang kuat (misalnya: `cyber_secret_9988_a1b2c3d4_secure`)
4. Klik **Save script properties**.

---

## Langkah 5: Deploy sebagai Web App
1. Di kanan atas editor Apps Script, klik tombol biru **Deploy** > pilih **New deployment**.
2. Klik ikon gerigi di sebelah kiri *Select type* > pilih **Web app**.
3. Isi konfigurasi berikut:
   - **Description:** `Production API v1`
   - **Execute as:** **`Me (email Anda)`** *(Sangat penting)*
   - **Who has access:** **`Anyone`** *(Sangat penting)*
4. Klik tombol **Deploy**.
5. Salin **Web app URL** yang muncul (formatnya: `https://script.google.com/macros/s/.../exec`).

---

## Langkah 6: Sambungkan ke Website Lokal
1. Buat file **`.env.local`** di root folder proyek ini di komputer Anda.
2. Isi dengan URL dan Secret yang baru saja Anda buat:

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID_ANDA/exec
APPS_SCRIPT_SECRET=cyber_secret_9988_a1b2c3d4_secure
AUTH_SECRET=rahasia_jwt_super_aman_cybersecurity_2026
```

3. Simpan file `.env.local`. Sekarang website Anda sudah terhubung langsung ke Google Spreadsheet!

---

## Cara Memperbarui Deployment (Jika Ada Perubahan Kode Apps Script)
Jika di kemudian hari kode `code.gs` atau `setup.gs` diperbarui:
1. Buka editor Apps Script dan tempel perubahannya. Simpan (Ctrl + S).
2. Klik **Deploy** > **Manage deployments**.
3. Klik ikon pensil (Edit) di deployment aktif Anda.
4. Pada dropdown **Version**, pilih **New version**.
5. Klik **Deploy**. URL tetap sama dan perubahan langsung aktif!

