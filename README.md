# Nadi v2 — Ekonomi kita, dijelaskan dengan sederhana

Dashboard untuk menjembatani pengumuman angka ekonomi dengan pengalaman sehari-hari. Antarmuka dan penjelasan ID | EN; angka referensi diambil dari sumber resmi, lengkap dengan periode dan status. Proyek untuk GitHub → Vercel. Bukan halaman HTML tunggal.

## Memperbarui proyek yang sudah dideploy

Lihat **PANDUAN_UPDATE.md**. Jangan membuat repositori atau proyek Vercel baru. Versi ini menambah dependensi PDF, `package-lock.json`, serta langkah `npm ci` pada workflow GitHub. Unggah semua perubahan, bukan hanya folder `public`.

## Data yang diperiksa otomatis

| Kelompok | Yang diambil | Periode/frekuensi |
|---|---|---|
| BI | JISDOR, inflasi yoy, BI-Rate | Harian hari kerja / bulanan / keputusan |
| BI indikator | Cadangan devisa bulanan, INDONIA, transaksi neto nonresiden SRBI | Mengikuti tanggal/rentang sumber |
| Survei BI | IKK dari PDF laporan; PMI-BI aktual dan perkiraan triwulan berikutnya | Bulanan / triwulanan |
| APBN Kita DJPPR | Edisi dan tautan PDF; pendapatan, belanja, saldo, saldo/PDB pada ringkasan kumulatif | Mengikuti publikasi |
| BCA & Mandiri | Bunga deposito Rupiah reguler per nominal dan tenor | Tabel resmi saat diperiksa; berubah mengikuti bank |
| Pengungkapan Mandiri tentang LPS | TBP Rupiah/valas bank umum dan periode efektif | Mengikuti pengungkapan bank, bukan API langsung LPS |
| World Bank WDI | 8 seri tahunan: PDB, PDB/kapita, pengangguran model ILO, transaksi berjalan, FDI, cadangan dalam bulan impor, perdagangan/PDB, inflasi tahunan | Tahunan; bukan keadaan harian |
| Siaran pers BI | Judul, tautan, tanggal publikasi artikel jika dapat dibaca | Mengikuti halaman sumber |
| Prospek | Sinyal berdasarkan kriteria, proyeksi PMI resmi, model inflasi sederhana | Dihitung ulang dari data yang lolos pemeriksaan |

Total 16 seri indikator, di luar angka ringkasan APBN, tabel deposito, pengungkapan TBP dan berita. Angka tidak ditulis manual sebagai pengganti respons yang gagal.

**Belum terhubung:** IHSG, asing saham dan SBN, semua bank, promo/kanal deposito, rasio individual bank, data upah/kemiskinan/harga daerah BPS terkini. SRBI bukan total arus asing. Tidak ada skor kesehatan bank. Kalkulator memakai asumsi yang diisi pengguna; bukan sumber tarif pasar otomatis.

## Cara kerja otomatis

- Saat dibuka, halaman menampilkan snapshot cadangan terlebih dahulu, lalu memanggil `/api/economy`.
- Vercel mengambil sumber paralel. Tabel BI/World Bank dicek identitas, format dan unitnya. Ekstraksi APBN hanya dari empat halaman awal dan template ringkasan yang dikenali; pendapatan dikurangi belanja harus cocok dengan saldo dalam toleransi pembulatan. Tidak menebak tabel yang berubah.
- Deposito memakai pemetaan tier yang diuji. Jika batas tier atau format berubah, angka baru ditahan; pemetaan perlu ditinjau manusia. Ini bukan janji konektor tidak pernah memerlukan perawatan.
- Cache CDN 15 menit dan cache proses hingga 15 menit dapat membuat umur pengecekan mendekati 30 menit, ditambah revalidasi. Halaman aktif memeriksa ulang setiap lima menit melalui cache. Bukan pembaruan tick-by-tick.
- Workflow `.github/workflows/update-data.yml` memeriksa sumber dan menyimpan `public/data/snapshot.json` setiap enam jam, bila Actions aktif dan izin tulis tersedia. Jadwal dapat terlambat/dinonaktifkan GitHub.
- Jika sumber gagal, angka, periode dan waktu pengambilan terakhir dipertahankan dengan status `fallback`. Jika belum ada data valid, nilai kosong. Tanggal pemeriksaan tidak mengubah tanggal data.
- Tidak ada database terpisah. Data terakhir proses server tidak dijamin bertahan lintas instance; snapshot yang dibundel dalam deployment menjadi cadangan. Commit snapshot oleh Actions perlu diterima integrasi Vercel agar snapshot deployment ikut diperbarui.

**“Terbaru” berarti data terbaru yang berhasil diambil dari sumber yang dicakup, sesuai jadwal dan cache. Tidak berarti semua sumber selalu tersedia, semua angka menggambarkan hari ini, atau data tidak mungkin terlambat.**

## ID | EN dan tautan penulis

Pilihan bahasa mengubah navigasi, analisis, metadata, tabel dan kalkulator. Nama sumber, label tier bank dan judul asli rilis tetap menggunakan bahasa sumber; versi EN memberikan konteks berbahasa Inggris serta pengungkapan judul asli Indonesia. Tidak ada layanan penerjemahan AI yang diaktifkan.

Tombol `bukanaktivis.id` dan `profil.bukanaktivis.id` membuka di tab yang sama.

## Prospek dan kriteria

- IKK >100: optimisme sesuai definisi survei BI; bukan bukti kenaikan pendapatan semua keluarga.
- PMI-BI >50: ekspansi sesuai definisi PMI-BI; bukan pertumbuhan PDB atau PMI penyedia lain.
- Inflasi terhadap rentang sasaran BI: diperiksa dengan tahun observasi yang sesuai. “Dalam sasaran” bukan berarti semua harga murah.
- SRBI: tanda net buy/sell pada rentang transaksi sumber. Tidak diagregasi dengan pasar lain yang belum tersedia.
- Perkiraan PMI-BI triwulan berikutnya berasal dari BI, dibedakan dari aktual.
- Model inflasi satu periode bulanan setelah data terakhir: memilih median tiga bulan atau nilai terakhir menggunakan uji bergulir. Menampilkan MAE dan benchmark, minimal delapan observasi bulanan tanpa celah. Hanya sekitar lima titik uji pada seri tabel awal; model sangat sederhana, bukan prediksi ekonomi menyeluruh.
- Pemilihan model memakai hasil uji yang sama; itu bukan evaluasi independen setelah seleksi. Data revisi saat ini, bukan arsip vintage waktu nyata. MAE bukan interval probabilitas, dan tidak ada probabilitas resesi atau imbal hasil yang dibuat-buat.
- Jika data inti gagal diperiksa, proyeksi model dihentikan; proyeksi resmi yang tersimpan tetap bertanggal dan harus dibaca sebagai proyeksi pada tanggal tersebut.

## Deposito dan risiko

Tabel mencakup deposito reguler Rupiah BCA dan Mandiri saja. Tarif nominal per tahun, bukan hasil bersih. Promo, dana baru, bunga negosiasi, produk syariah, kanal lain, penalti, biaya serta basis hari kontrak tidak termasuk. Minimum pembukaan Mandiri belum diekstrak; verifikasi langsung.

Uji bunga terhadap TBP hanya berjalan jika pengungkapan bank berhasil dibaca, belum lebih 24 jam sejak pengambilan, periode berlaku aktif dan data bukan snapshot cadangan. Di bawah TBP belum berarti seluruh syarat penjaminan terpenuhi. Cashback dan ketentuan lain harus dinilai sesuai aturan regulator. LCR, NSFR, CAR/KPMM, NPL/NPF belum dikumpulkan; tidak ada peringkat keamanan atau dugaan masalah likuiditas bank.

## Deploy pertama kali

1. Unggah seluruh isi folder `nadi-otomatis` ke akar repositori GitHub, termasuk `.github`, `package.json`, `package-lock.json`, `vercel.json`, `lib`, `api`, `public`, `scripts`, `test` dan dokumen.
2. Vercel → Add New → Project → Import repositori. Framework **Other**, Root Directory `./`, Build Command `npm run build`, Output Directory `public`, Node **24.x**. Tidak perlu kunci API untuk cakupan versi ini.
3. Vercel menginstal dependensi dari lockfile. `pdf-parse` diperlukan untuk membaca PDF resmi. Konfigurasi fungsi menyertakan file worker PDF dan snapshot.
4. Setelah deploy, buka `/api/economy` pada alamat web. Periksa `checks`, `fiscal.status`, `deposits`, `lps`, dan `forecast`; jumlah indikator terisi saja tidak membuktikan semua sumber sedang berhasil.
5. GitHub → Actions → **Perbarui data ekonomi** → Run workflow. Pastikan job hijau dan snapshot tersimpan. Workflow harus ada di default branch. Kebijakan organisasi/branch protection dapat menolak commit bot; perbaiki izin sesuai kebutuhan repositori.
6. Periksa apakah commit bot diterima oleh integrasi Vercel. Jika tidak, snapshot yang dibundel belum ikut berubah, walaupun API permintaan pengunjung tetap dapat bekerja.

Kuota GitHub Actions, deployment, fungsi dan bandwidth mengikuti paket masing-masing. Tidak dijanjikan gratis tanpa batas. Tidak ada layanan berbayar atau tugas dalam akun pengguna yang dibuat otomatis oleh pengunduhan ZIP.

## Pengembangan

```sh
npm ci --ignore-scripts
npm test
npm run update-data
npm run build
npm run dev
```

Buka http://localhost:3000. Jangan menjalankan sebagai `file://`. Seluruh dependensi berasal dari npm dan dipatok oleh lockfile. Node.js 24 diperlukan.

## Sumber

BI: https://www.bi.go.id/id/statistik/indikator/default.aspx ; https://www.bi.go.id/id/statistik/indikator/bi-rate.aspx ; https://www.bi.go.id/id/statistik/indikator/data-inflasi.aspx ; https://www.bi.go.id/id/statistik/informasi-kurs/jisdor/default.aspx ; https://www.bi.go.id/id/publikasi/laporan/default.aspx?kategori=survei+konsumen ; https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx

APBN: https://djppr.kemenkeu.go.id/paparanapbnkita . Endpoint halaman publik DJPPR dipakai sesuai situsnya; bukan kontrak API yang dijamin stabil. Link PDF ditemukan ulang dari halaman tersebut.

Bank: https://www.bca.co.id/individu/produk/simpanan/deposito-berjangka ; https://www.bankmandiri.co.id/web/guest/suku-bunga-dana ; https://www.bankmandiri.co.id/en/tingkat-bunga-penjamin . Regulator: https://lps.go.id/ . Pengungkapan TBP bank tidak disamarkan sebagai koneksi langsung ke LPS.

World Bank: https://data.worldbank.org/country/indonesia ; ketentuan https://www.worldbank.org/en/about/legal/terms-of-use-for-datasets . Identitas seri ada di katalog dan tautan tiap kartu. Periksa pengecualian sumber pihak ketiga bila memperluas redistribusi.

Vercel: https://vercel.com/docs/functions/runtimes/node-js ; GitHub schedules: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule . Parser PDF: https://github.com/mehmet-kozan/pdf-parse .

Tambahan: perencana pribadi terpadu, simulator obligasi dan rincian belanja APBN. Baca VALIDASI.md: koneksi yang timeout belum seluruhnya teratasi; sepuluh bank dan rasio individual belum tersedia. Paket ini tidak memperbarui GitHub/Vercel Anda sampai di-commit dan di-push.
