# Nadi 11 — Uji Masa Depan benar-benar diganti

Halaman yang diubah adalah **Uji masa depan** (`#prospek`), bukan fitur perbandingan negara. Perbandingan 20 indikator internasional dan 17 kalkulator tetap tersedia.

## Apa yang sekarang bekerja

- Direktori 20 sasaran dalam tiga kelompok: usaha/produksi, penghasilan/biaya hidup, pembiayaan/ketahanan.
- **17 sasaran menghasilkan proyeksi eksperimental**, tiga menunggu histori BPS/Sakernas yang memadai.
- Grafik pengamatan menuju titik proyeksi; rentang galat empiris jika sampel cukup.
- Horizon bulanan 1/3/6 bulan, triwulanan 1/2/4 triwulan, dan semesteran 1/2 semester ketika datanya mencukupi. Horizon dihitung dari periode terakhir sumber; periode yang telah berjalan tetapi belum dilaporkan diberi label perkiraan periode belum teramati.
- Pengujian bergulir, MAE/RMSE, pembanding nilai terakhir, jumlah uji, cakupan rentang, CSV histori dan CSV hasil uji.
- Bacaan dampak dan persiapan berubah sesuai sasaran serta hasil model.
- Simulator keluarga, skenario guncangan, dan uji ketahanan tetap tersedia setelah bagian prediksi utama.
- ID/EN untuk pemilih, hasil, makna, status, dan metode.

## Daftar dan sumber

| No | Sasaran | Seri dan frekuensi | Status paket |
|---|---|---|---|
|1|PDB riil|BPS melalui BI SEKI VII.4, harga konstan 2010, yoy triwulanan|Dihitung|
|2|Konsumsi rumah tangga riil|Komponen rumah tangga SEKI VII.4, yoy triwulanan|Dihitung|
|3|PMTB riil|SEKI VII.4, yoy triwulanan|Dihitung|
|4|Industri pengolahan|SEKI VII.2, yoy triwulanan|Dihitung|
|5|Perdagangan|SEKI VII.2, yoy triwulanan|Dihitung|
|6|Penjualan eceran riil|BI SPE, yoy bulanan; angka prakiraan survei dikeluarkan|Dihitung|
|7|Inflasi umum|BPS/BI nasional, yoy bulanan|Dihitung|
|8|Inflasi inti|Arsip analisis inflasi BI HTML/PDF dan rilis terkini, yoy bulanan|Dihitung|
|9|Inflasi pangan bergejolak|Volatile food BI/BPS; deflasi memakai tanda negatif|Dihitung|
|10|TPT|BPS Sakernas nasional, Februari/Agustus|Ditahan: histori terlalu pendek|
|11|Pertumbuhan upah nominal|Upah buruh BPS, yoy bulan yang sama|Ditahan: histori terlalu pendek|
|12|Pertumbuhan upah riil|Pertumbuhan upah nominal dan inflasi bulan yang sama|Ditahan: histori terlalu pendek|
|13|Nilai ekspor barang|SEKI V.10 fob, neraca pembayaran, yoy bulanan|Dihitung|
|14|Nilai impor barang|SEKI V.19 cif, neraca pembayaran, yoy bulanan|Dihitung|
|15|Kurs rupiah/dolar|Kurs tengah BI akhir bulan dalam SSKI; berbeda dari JISDOR harian|Dihitung|
|16|Kredit|SEKI I.4 bank umum dan BPR, yoy bulanan|Dihitung|
|17|Simpanan masyarakat|SEKI I.17 bank umum dan BPR, yoy bulanan|Dihitung|
|18|Bunga kredit konsumsi rupiah|SEKI I.26 bank umum, bulanan|Dihitung|
|19|Bunga deposito rupiah 3 bulan|SEKI I.28 bank umum, bulanan|Dihitung|
|20|NPL gross|OJK melalui SSKI; dilanjutkan rilis resmi RDKB dengan periode observasi eksplisit|Dihitung|

**Perbedaan cakupan ditulis di halaman.** Simpanan masyarakat SEKI tidak disamakan diam-diam dengan semua rilis DPK OJK. Ekspor/impor neraca pembayaran tidak disamakan dengan angka kepabeanan BPS. Kurs tengah akhir bulan tidak disambung dengan JISDOR. Data tahunan World Bank tidak menggantikan target bulanan/triwulanan ini.

## Model dan keterbatasan

Protokol `rolling-ar1-naive-v1`: AR(1) dengan maksimum 60 pasangan berurutan, φ dibatasi −0,98 sampai 0,98. Acuan awal adalah nilai terakhir. AR digunakan hanya setelah sedikitnya 12 galat AR yang targetnya telah diketahui pada asal ramalan mengalahkan galat acuan. Setiap asal ramalan mengulang estimasi dari data yang tersedia sampai asal tersebut. Pengujian strategi juga mengikuti aturan itu, bukan memilih pemenang menggunakan hasil masa depan.

Rentang menggunakan kuantil absolut galat yang sudah selesai saat kalibrasi, minimum 12 galat. Cakupan nominal 80% tidak menjamin peluang 80% untuk masa depan. Rentang dibatasi domain indikator. Grafik menggambar jarak waktu dan memutus celah; observasi hilang tidak diisi.

Ini peramalan statistik univariat eksperimental dengan histori revisi terkini, belum evaluasi vintage atau model struktural kausal. Sebagian titik mempertahankan nilai terakhir jika model AR belum lebih berguna. Tidak ada probabilitas krisis/rese​si yang dibuat-buat; skenario guncangan terpisah dari ramalan.

Prediksi yang diterbitkan dicatat di `economyPredictionArchive`; titik terbit dan aktual pertama dibekukan, revisi berikutnya disimpan terpisah. Hasil lokal tidak dianggap rekam akurasi produksi.

## Otomasi

1. GitHub Actions berjalan tiap enam jam sesuai jadwal yang sudah ada.
2. Kolektor membaca workbook SEKI/SSKI, arsip inflasi HTML/PDF, SPE, dan rilis NPL OJK.
3. Workbook diperiksa tanpa menjalankan makro atau formula. Python `xlrd==2.0.1` disiapkan oleh workflow baru. Batas ukuran dan waktu berlaku.
4. Tanggal sumber dibaca dari isi. Tabel ringkasan akhir tahun tidak dibaca sebagai bulan. Periode yang mundur tidak menggantikan data lebih baru.
5. Cache pengambilan maksimum 24 jam untuk sumber prediksi membantu membatasi beban. Pemeriksaan cache tidak memajukan waktu pengambilan asli.
6. Validasi → hitung ulang 20 sasaran → ledger → snapshot → commit → Vercel. Pengunjung membaca snapshot dan tidak melakukan scraping.

`npm run update-data -- --sources=predictions` menguji ulang bagian prediksi saja. `npm run update-data` menjalankan seluruh koneksi lama dan baru. Kegagalan satu koneksi tercatat; sumber valid lainnya tetap diproses. Jadwal berikutnya mencoba lagi.

### Tiga sasaran BPS

`BPS_API_KEY` perlu ditambahkan sebagai **GitHub Actions secret**, bukan dalam kode atau formulir publik. Kolektor histori baru memeriksa rilis ketenagakerjaan hingga 14 tahun, memisahkan Februari/Agustus, dan menghitung pertumbuhan upah hanya terhadap bulan sama tahun sebelumnya. Hasilnya tetap harus lulus validasi dan minimum histori/uji sebelum prediksi diterbitkan. Jalur berkunci ini belum diuji langsung karena kunci tidak tersedia dalam sesi ini; mengisi kunci belum merupakan bukti 20/20 aktif.

## Memasang pembaruan

Ekstrak ZIP. Salin seluruh isi folder `nadi-otomatis` ke akar repositori yang sama, termasuk `.github`, `scripts`, `lib`, `public`, `test`, `package.json`, dan `package-lock.json`. Commit lalu push. Jangan mengunggah ZIP sebagai isi website.

Jika folder `.github` tidak terlihat di Finder, tekan Cmd+Shift+Period. Alternatif: setelah menyalin berkas, jalankan `node scripts/install-workflow.mjs` lalu commit workflow yang dibuat. Salinan workflow terlihat juga tersedia di `ops/update-data.workflow.yml`.

Buka Actions → Perbarui data ekonomi → Run workflow. Periksa hasil koneksi prediksi dan tampilan **Uji masa depan** sesudah deployment Vercel selesai. Paket baru ini belum didorong ke GitHub atau dipasang ke Vercel pemilik dari sesi ini.
