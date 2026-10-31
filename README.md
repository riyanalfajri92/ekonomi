# Nadi — ekonomi kita, artinya bagi kita

Dashboard ID/EN dengan alur ekonomi → kehidupan masyarakat → rencana pribadi. Angka, periode pengamatan, sumber dan status pembaruan ditampilkan terpisah. Analisis berbasis aturan berubah mengikuti data; penjelasan konsep tetap tersedia.

## Jalankan

Node.js 24. Jalankan `npm ci`, `npm test`, lalu `npm run dev`. Untuk validasi produksi: `npm run build`. Vercel memakai konfigurasi `vercel.json` dalam paket ini.

## Pasang dan perbarui

Ikuti **PANDUAN_UPDATE.md**. Unggah seluruh isi folder ini, termasuk `.github`, ke akar repositori. Jangan hanya HTML. GitHub Actions mengambil data berkala dan menyimpan snapshot; integrasi GitHub–Vercel menerbitkan commit tersebut. API Vercel memeriksa sumber inti ketika dikunjungi, dengan cache.

**Penting:** koneksi BPS memerlukan `BPS_API_KEY` resmi di GitHub Actions. Tanpa itu, data BPS awal tetap diberi status belum terverifikasi otomatis. Beberapa halaman bank memblokir pengambilan otomatis; paket tidak mengakali blokir tersebut. Lihat **VALIDASI.md** untuk batas setiap kelompok sumber.

## Materi

- Narasi ekonomi dan rumah tangga, grafik inflasi, fiskal APBN dengan referensi halaman dan pembanding yang tersedia.
- Sepuluh bank pembanding: tenor, nominal, kanal bunga, simulasi hasil bersih, pembanding LPS dan rasio bank yang tersedia.
- Kurva imbal hasil obligasi pemerintah dari ADB; kalkulator PV, YTM, durasi dan skenario. Bukan harga transaksi per seri.
- Perencanaan arus kas, dana darurat, utang, tujuan, pensiun dan uji tekanan. Ambang dapat diubah; bukan standar universal atau layanan CFP bersertifikat.
- Rilis resmi, sumber/status, ID/EN dan tautan profil pembuat.

Data yang tidak tersedia tidak direkayasa. Tidak ada klaim semua bank aman, harga obligasi real-time, atau rekomendasi beli berbasis harga yang belum tersedia.
