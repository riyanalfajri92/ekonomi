**Versi 9.1:** bagian Uji masa depan sudah dirombak. Lihat [UJI_MASA_DEPAN.md](UJI_MASA_DEPAN.md) untuk fitur, rumus dan batas prediksi.

# Nadi — versi 9: ekonomi bergambar

Lihat [ROMBAKAN_9.md](ROMBAKAN_9.md) untuk alur visual, perbandingan 14 negara dan 17 kalkulator.

**Email GitHub gagal?** Penyebab sudah direproduksi dan diperbaiki. Baca [AUTOMASI_DIPERBAIKI.md](AUTOMASI_DIPERBAIKI.md) untuk bukti dan langkah memasang perbaikan.

# Nadi 8 — 60 indikator, tujuh pertanyaan tentang hidup kita

Website ID/EN untuk memahami kegiatan ekonomi, kehidupan masyarakat, APBN dan pilihan keuangan pribadi. Empat navigasi: **Baca ekonomi, Uji masa depan, Alat & pilihan, Sumber**.

Mulai dari `ROMBAKAN_8.md` untuk penjelasan baru: angka → makna → saluran pengaruh → dampak masyarakat → hubungan indikator. `VALIDASI_8.json` mencatat pemeriksaannya. Lihat `ROMBAKAN_7.md` untuk alur baru, registri 60 indikator, tambahan konektor dan batas otomatisasi. `VALIDASI_7.json` memuat hasil verifikasi versi ini. Lihat juga `MENUJU_9_DAN_BUKTI.md` untuk tabel seluruh permintaan dan bukti perbaikannya. `VALIDASI.md` mencatat pengujian; `PANDUAN_UPDATE.md` menjelaskan GitHub → Vercel.

## Hasil versi ini

- Laporan beralur dengan tujuh ringkasan perubahan, pembanding dan makna; bukan satu skor ekonomi.
- Konektor publik Kemnaker tanpa kunci API: TPT, partisipasi serta jumlah angkatan kerja, bekerja dan menganggur. Upah/kemiskinan/PDB BPS tetap memiliki batas pembaruan tersendiri.
- Histori inflasi 193 observasi pada paket saat ini; arsip World Bank CPI → yoy dan publikasi domestik, dengan celah tidak diisi.
- Laboratorium model tetap AR(1) untuk 1/3/6 bulan, benchmark nilai terakhir/median3, galat bergulir, cakupan rentang dan ledger sebelum hasil diketahui. Model tidak mengalahkan benchmark satu bulan dalam arsip ini; bukan sistem prediksi seluruh ekonomi.
- Matriks 15 kombinasi tekanan anggaran, pendapatan impas, kekurangan bulanan dan masa cadangan menutup defisit; 17 kalkulator dan planner terpadu.
- Sepuluh bank pembanding, keterkaitan bunga/hasil/LPS/rasio; 38 seri obligasi dari pengambilan langsung tabel BCA. Keberhasilan sumber berubah antar siklus.
- Visual APBN per Rp100 belanja, rekonsiliasi pusat/TKD serta perbedaan uang dibelanjakan dengan layanan diterima.

## Otomasi

GitHub Actions berjalan enam jam sekali dan saat kode di-push ke main/master; commit data tidak memicu loop. Kolektor memvalidasi dan menyimpan snapshot. Pengunjung tidak melakukan scraping. Vercel menyajikan snapshot tervalidasi; browser memeriksa versi tiap dua menit saat halaman terlihat.

Mengunggah kode tidak membuktikan seluruh sumber telah berhasil. Konfigurasi produksi dan kunci BPS perlu tersedia pada akun pemilik. Website mempertahankan angka valid terakhir dan tanggalnya ketika pengambilan gagal. `/api/health` tetap 503 bila gerbang data inti/produksi belum lolos.

## Menjalankan

Node.js 24. `npm ci --ignore-scripts`, `npm test`, `npm run build`, `npm run dev`. `npm run update-data` mencoba seluruh sumber; `npm run doctor` memeriksa kesiapan dan kehadiran konfigurasi tanpa mencetak nilai rahasia. Doctor keluar nonzero ketika syarat belum lolos.

Paket ini belum di-push atau dideploy ke akun GitHub/Vercel pemilik dari sesi pengembangan. Tidak mengklaim seluruh data real-time, seluruh cakupan lengkap, sertifikasi CFP, rekomendasi beli personal atau penilaian akademik 9/10.
