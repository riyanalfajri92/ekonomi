# Nadi — dashboard ekonomi otomatis

Proyek untuk diunggah ke **GitHub**, lalu diimpor ke **Vercel**. Bukan HTML demo: program server mengambil sumber publik dan dashboard menampilkan angka nyata. Tidak memerlukan kunci API untuk cakupan versi ini. Belum ada deployment GitHub/Vercel milik pengguna yang dibuat dalam penyerahan ini.

## Apa yang sudah otomatis

- JISDOR dari tabel resmi Bank Indonesia: rupiah per USD, bukan kurs transaksi bank.
- Inflasi yoy bulanan dari tabel resmi BI.
- BI-Rate dan tanggal keputusan yang tercantum di tabel BI.
- Delapan seri tahunan World Bank: pertumbuhan riil, PDB per kapita dolar berjalan, pengangguran estimasi model ILO, transaksi berjalan, FDI, cadangan devisa dalam bulan impor, perdagangan/PDB, serta inflasi tahunan.
- Tautan edisi APBN Kita pada halaman DJPPR. Edisi bukan periode realisasi; angka PDF belum diekstrak.
- Judul dan tautan siaran pers dari halaman resmi BI. Tanggal berita belum diekstrak; urutan mengikuti halaman sumber.
- Tanggal observasi, waktu pengambilan dan pemeriksaan, perubahan antarobservasi, riwayat seri dan penjelasan berbasis aturan.
- Kalkulator utang, target tabungan, investasi, daya beli dan satu penawaran deposito. Asumsi kalkulator diisi pengguna, bukan penawaran bank otomatis.

**Belum otomatis:** IHSG, arus asing saham/SBN/SRBI, angka realisasi APBN di PDF, perbandingan produk bank nyata, TBP LPS, rasio bank, harga daerah, upah dan kemiskinan terkini. Bagian ini diberi label belum terhubung; tidak diisi angka simulasi. Data tahunan tidak ditampilkan sebagai data hari ini. Ini versi awal yang bekerja, bukan seluruh cakupan dashboard ekonomi yang direncanakan.

## Unggah ke GitHub dan deploy Vercel

1. Ekstrak ZIP. Buka folder `nadi-otomatis`.
2. Buat repositori GitHub baru, misalnya `nadi-ekonomi`. Public maupun private dapat digunakan sesuai hak akun/integrasi. Jika memakai tombol upload web GitHub, unggah **isi folder proyek** ke akar repositori. `package.json`, `vercel.json`, `api`, `lib`, `public`, `scripts`, `test`, dan `.github` harus sejajar. Jangan hanya mengunggah `index.html` atau menumpuk proyek di dalam folder lain. GitHub Desktop dapat mempermudah pengunggahan semua folder termasuk `.github`.
3. Di Vercel: **Add New → Project → Import Git Repository**, pilih repositori itu dan izinkan integrasi GitHub.
4. Root Directory: akar proyek. Framework Preset: **Other**. Build Command: `npm run build`. Output Directory: `public`. Node.js: **24.x**. Pengaturan ini sebagian sudah ditetapkan di berkas proyek. Tidak perlu environment variable untuk versi awal ini.
5. Klik **Deploy**. Tunggu sampai deployment berhasil.
6. Buka alamat Vercel dan periksa dashboard. Buka juga `https://ALAMAT-WEBMU/api/economy`: respons seharusnya JSON dengan `schemaVersion: 1`, `metrics`, `checks`, `checkedAt`, dan `snapshotId`. Jangan menilai otomatisasi hanya dari tampilan yang muncul; HTML dapat memakai snapshot cadangan saat API gagal.
7. Buka **Sumber & status**. Pastikan sumber yang diperlukan terbaca. `Data dari server` menandakan API berfungsi; `Snapshot cadangan` menandakan frontend beralih ke berkas cadangan. Tanggal observasi tetap mengikuti sumber.

**Mengunggah ZIP sebagai satu berkas ke GitHub tidak cukup.** Ekstrak dulu dan unggah seluruh isi proyek.

## Otomatis ketika pengunjung membuka halaman

Dashboard memanggil `/api/economy`. Fungsi Node.js Vercel mengambil sumber secara paralel dengan timeout 12 detik per sumber. Kegagalan satu sumber tidak mematikan seluruh dashboard. Respons disimpan di cache CDN selama 15 menit dan proses fungsi sampai 15 menit; pada kondisi tertentu data yang ditampilkan dapat mendekati 30 menit sejak pemeriksaan terakhir, ditambah jendela revalidasi. Ketika halaman tetap aktif, frontend memanggil ulang setiap lima menit; panggilan bisa dilayani cache.

Jadi, pembaruan tidak selalu seketika sumber menerbitkan angka. Web otomatis memeriksa ulang sesuai cache. Frekuensi publikasi sumber tetap berlaku: seri tahunan tidak menjadi seri harian.

Jika sumber gagal, fungsi memakai data terakhir di proses yang sama atau snapshot yang dibundel. Tidak ada database atau penyimpanan permanen untuk setiap permintaan server. Snapshot terjadwal di bawah menjadi cadangan permanen di repositori. Jika Vercel berhasil mengambil angka baru tetapi GitHub belum berhasil memperbarui snapshot, proses server lain masih bisa memakai snapshot lebih lama ketika sumber kemudian gagal; tanggal aslinya tetap terlihat.

## Cadangan otomatis walaupun tidak ada pengunjung

Workflow `.github/workflows/update-data.yml` disertakan dan tidak memerlukan secret:

1. Pastikan berkas workflow ada di **default branch** repositori.
2. Buka tab **Actions** dan aktifkan GitHub Actions jika diminta.
3. Pilih **Perbarui data ekonomi → Run workflow** untuk uji awal.
4. Workflow menjalankan tes, mengambil sumber, lalu commit `public/data/snapshot.json` memakai `GITHUB_TOKEN` bawaan dengan `contents: write`.
5. Jadwal yang disertakan berjalan pukul **07.23, 13.23, 19.23, dan 01.23 WIB**, berdasarkan cron UTC setiap enam jam. Waktu aktual bisa terlambat.
6. Pastikan job berwarna hijau dan snapshot di repositori berubah. Branch protection atau kebijakan organisasi bisa menolak commit bot. Dalam kondisi itu perlu menyesuaikan kebijakan repositori atau memilih penyimpanan terpisah; jangan menganggap cadangan terjadwal aktif.
7. Vercel yang terhubung biasanya membuat deployment untuk commit baru. Periksa apakah commit bot diterima oleh kebijakan akun/tim dan integrasi Vercel. Bila deployment bot ditolak, API permintaan pengunjung tetap berfungsi tetapi snapshot yang dibundel belum ikut berubah.

GitHub dapat menunda/melewatkan jadwal saat beban tinggi. Scheduled workflow di repositori public dapat dinonaktifkan setelah masa tidak aktif sesuai kebijakan GitHub. Monitor tab Actions dan aktifkan ulang bila perlu. Penggunaan GitHub Actions, fungsi Vercel, bandwidth, dan deployment mengikuti kuota/paket akun; tidak dijanjikan gratis tanpa batas. Tidak ada job yang dibuat di akun Anda hanya dengan mengunduh ZIP ini.

## Memastikan tanggalnya benar

- `period`: periode observasi, bukan waktu akses. Harian memakai YYYY-MM-DD; bulanan YYYY-MM; tahunan YYYY.
- `publishedAt`: null jika tanggal publikasi observasi tidak bisa dibuktikan.
- `fetchedAt`: kapan angka terakhir berhasil diambil.
- `checkedAt`: kapan sumber terakhir dicoba.
- `datasetUpdated`: tanggal pembaruan dataset World Bank, bukan tanggal publikasi observasi.
- `dataChangedAt`: berubah bila isi observasi/tautan yang dipantau berubah, bukan hanya karena pengecekan baru.
- `fallback`: data lama dipertahankan ketika sumber gagal. `old_observation`: umur observasi melewati ambang operasional, bukan kesimpulan ekonomi memburuk.

Snapshot awal dalam ZIP diambil dari sumber nyata pada sesi pengembangan; tanggal persis ada dalam JSON. Itu cadangan, bukan angka hardcode yang akan diganti tanggalnya saat web dibuka.

## Batas validasi dan analisis

Parser memeriksa header tabel, identitas seri/negara, format angka, periode masa depan dan batas nilai. Ini pemeriksaan teknis, bukan audit kebenaran sumber. Perubahan besar masih perlu dibaca manusia. Jika tata letak sumber berubah atau akses dibatasi, konektor perlu diperbaiki. Tidak ada bypass login atau captcha.

Inflasi bulanan BI tidak disambung dengan inflasi tahunan WDI. Pengangguran yang tampil bukan TPT BPS. FDI bukan arus asing portofolio. Kesehatan bank tidak ditebak dari bunga. Tidak ada skor ekonomi gabungan atau prediksi probabilistik. Penjelasan memakai aturan sehingga tidak memerlukan langganan API AI. Menambah analisis AI adalah pekerjaan tambahan.

## Sumber dan atribusi

- Bank Indonesia: https://www.bi.go.id/id/statistik/indikator/bi-rate.aspx ; https://www.bi.go.id/id/statistik/indikator/data-inflasi.aspx ; https://www.bi.go.id/id/statistik/informasi-kurs/jisdor/default.aspx
- Siaran pers BI: https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx
- APBN Kita DJPPR: https://djppr.kemenkeu.go.id/paparanapbnkita . Konektor menggunakan endpoint publik yang dipakai situs DJPPR sendiri; bukan kontrak API yang dijamin stabil.
- World Bank WDI: https://data.worldbank.org/country/indonesia . Identitas indikator dicantumkan pada `lib/catalog.mjs`, sumber dan tautan tiap seri tampil di dashboard. Ketentuan data: https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets . Periksa pengecualian sumber pihak ketiga pada seri terkait sebelum redistribusi skala besar.
- Dokumentasi Vercel: https://vercel.com/docs/functions/runtimes/node-js ; https://vercel.com/docs/git/vercel-for-github
- Dokumentasi jadwal GitHub: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule

## Pengembangan dan pemeriksaan lokal

Memerlukan Node.js 24. Tidak ada dependensi npm eksternal.

```sh
npm test
npm run update-data
npm run build
npm run dev
```

Buka `http://localhost:3000`. Membuka `public/index.html` langsung sebagai `file://` bukan cara menjalankan server.

Struktur: `public` untuk tampilan, kalkulator dan snapshot; `api/economy.js` untuk fungsi server; `lib` untuk sumber/parser/kolektor; `scripts` untuk pengembangan/pembaruan; `test` untuk validasi dan penanganan gagal; `.github/workflows` untuk jadwal cadangan. Semua kode dan konfigurasi diperlukan di repositori.
