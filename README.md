> Revisi 5.1: lihat `ASESMEN_5_1.md`. Ringkasan perubahan, gerbang prediksi dan asumsi simulator diperbaiki.

# Nadi 5 — ekonomi kita, artinya untuk kita

Rombakan antarmuka dan struktur bacaan, bukan lapisan tambahan pada halaman lama. Empat pintu: **Baca ekonomi → Prospek → Pilihanmu → Sumber**.

## Satu laporan

Halaman utama menelusuri kegiatan ekonomi → penghasilan/pekerjaan/distribusi → dukungan APBN → ketahanan pembiayaan → pilihan pribadi. Grafik penggerak ekonomi dapat diklik untuk histori, sumber dan CSV. Data tahunan dibedakan dari triwulan dan pengamatan terbaru.

Sepuluh seri baru World Bank/WDI-PIP: konsumsi rumah tangga, investasi tetap, konsumsi pemerintah, ekspor, impor, konsumsi per kapita, pertanian, industri termasuk konstruksi, jasa, dan Gini. Pengambilan langsung berhasil; semuanya merupakan konteks tahunan, bukan data hari ini. Sepuluh seri struktural sosial versi sebelumnya tetap dipakai dalam alur kehidupan masyarakat.

Prospek membedakan observasi, ekspektasi survei, model eksperimental dan skenario. Pilihanmu menyatukan 17 kalkulator, rencana terpadu, sepuluh bank pembanding dan enam kuotasi FR awal. Input pribadi tetap di perangkat.

## Satu mesin data

GitHub Actions setiap enam jam → konektor resmi → validasi per seri → snapshot/histori/health → commit → Vercel. API hanya menyajikan snapshot. Pembaruan tanpa perubahan tidak merender ulang bacaan; respons API lama tidak boleh mengganti snapshot lebih baru.

Cadangan resmi BI sudah berhasil diuji untuk inflasi, JISDOR dan BI-Rate. Status pengambilan, usia observasi dan kesiapan produksi dipisahkan. BPS membutuhkan konfigurasi/akses pemilik; harga seri obligasi dan sebagian bank belum lulus refresh. Konektor yang menerima penyaringan keamanan dijeda.

## Jalankan/pasang

Node 24: `npm ci`, `npm test`, `npm run build`, `npm run dev`.

Salin seluruh isi folder ke akar repositori GitHub, termasuk `.github`. Ikuti **PANDUAN_UPDATE.md** untuk Actions, BPS_API_KEY, verifikasi produksi dan Vercel. Belum ada push/deployment ke akun pengguna dari lingkungan ini.

- **KONSEP_EKSEKUSI.md**: struktur yang diterapkan dan batas analisis.
- **PERUBAHAN.md**: bagian yang diganti, dipertahankan dan diuji.
- **VALIDASI.md**: bukti serta keterbatasan material.

Tidak ada klaim kualitas 10/10, semua data live, prediksi terkalibrasi, bank pasti aman atau rekomendasi investasi personal.
