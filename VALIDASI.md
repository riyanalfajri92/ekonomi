# Validasi Nadi 6 — 31 Oktober 2026

## Pemeriksaan kode

**98 pengujian otomatis lulus; 64 modul lolos build.** Pemeriksaan meliputi rumus finansial, pembanding periode, perubahan narasi, data kosong ID/EN, isolasi sumber gagal, rollback, tanggal/angka historis rusak, validasi fiskal, kurva/harga obligasi, cache, ledger serta kebocoran masa depan dalam model.

Tes baru menguji parser Kemnaker, transformasi CPI → yoy dari fixture berkas resmi World Bank, konflik arsip terhadap publikasi domestik, AR(1) multi-horizon, rentang yang tidak memakai galat masa depan, celah yang tidak diinterpolasi, ledger multi-horizon, titik impas anggaran, rekonsiliasi visual APBN dan ekspor CSV seluruh histori.

`npm audit --omit=dev` melaporkan 0 kerentanan yang diketahui saat diperiksa. Tidak berarti audit keamanan independen telah dilakukan.

## Dua siklus sumber nyata

Ringkasan disimpan dalam `BUKTI_SUMBER.json`. Kedua siklus berlabel **local-verification / all-sources**, bukan GitHub produksi. Tidak ada identitas produksi yang direka.

- Siklus pertama: delapan tabel deposito berhasil, 38 kuotasi FR terbaca, Kemnaker berhasil, APBN/ADB/WDI/seri struktural berhasil. Sejumlah sumber BI dan berita mengalami timeout.
- Setelah timeout sumber BI disesuaikan dan implementasi baru diperiksa, siklus terakhir: inflasi, JISDOR, BI-Rate, indikator tambahan BI, survei konsumen dan berita BI berhasil. APBN, WDI, kurva ADB dan 38 kuotasi FR berhasil. Lima indikator ketenagakerjaan Kemnaker berhasil.
- Siklus terakhir: tujuh tabel deposito berhasil. Panin HTTP 503; data terakhir dipertahankan. BNI/BTN tetap dijeda setelah penyaringan keamanan terdahulu; tidak diakali atau dicoba terus-menerus.
- Enam konektor laporan bank berhasil pada siklus terakhir; kelengkapan rasio dan basis laporan berbeda. OCBC timeout, Danamon tidak menemukan laporan setara/lebih baru, BNI/BTN dijeda.
- Bappebti berhasil; Kemenkeu/OJK/Kemendag berita belum lolos siklus terakhir. Kemendag pernah berhasil pada siklus pertama. APBN Kemenkeu adalah konektor terpisah yang berhasil.
- API BPS belum berhasil tanpa kunci. Keberhasilan Kemnaker tidak mengubah status upah/kemiskinan/PDB yang masih data awal.
- OECD API dicoba untuk histori dan menerima HTTP 500. Arsip World Bank berhasil diunduh. Workbook Dallas Fed berhasil dibaca tetapi berisi agregat, sehingga tidak dipakai sebagai data Indonesia. PDF APBN tambahan untuk perluasan indikator timeout; tidak dibuatkan angka tambahan.

## Prediksi dan statistik

Pada snapshot paket, terdapat 193 observasi inflasi gabungan. CPI bulanan World Bank Indonesia dikonversi menjadi yoy dengan pembanding 12 bulan. Publikasi domestik dipertahankan saat periode bertumpuk; konflik material ditolak. Ada celah April–November 2025 yang tidak diisi. Sumber historis ditulis terpisah dari pengambilan angka terkini.

AR(1) berprotokol tetap memakai maksimal 60 pasangan berurutan, minimal 24, phi dibatasi untuk kestabilan. Uji bergulir 1/3/6 bulan masing-masing 156/152/146 dalam snapshot ini; jendela yang melintasi celah dilewati. MAE satu bulan sekitar 0,38 pp versus benchmark 0,37 pp. Tidak mengklaim model unggul. Rentang galat hanya memakai hasil target lama yang sudah tercapai pada asal ramalan; cakupan historis ditampilkan, bukan jaminan peluang mendatang.

Backtest memakai revisi data terkini, bukan vintage. Catatan prospektif lokal tidak dihitung sebagai rekam produksi. Tidak ada model tervalidasi untuk seluruh PDB, pekerjaan, kemiskinan, kurs atau harga obligasi. Skenario pribadi merupakan hitungan bersyarat, tidak memiliki peluang kejadian yang direka.

## Browser dan tampilan

Model multi-horizon, matriks anggaran dan perubahan angka saat pendapatan diturunkan diperiksa di browser. Kesimpulan berubah; pendapatan impas dan kekurangan bulanan ikut berubah.

Viewport isi 375 piksel diperiksa untuk beranda, prospek, kalkulator, deposito, obligasi, sumber dan planner. Luapan prospek semula 714 piksel ditemukan, diperbaiki; hasil akhirnya lebar konten sama dengan viewport 375 piksel. Tabel lebar menggulir pada wadahnya, bukan seluruh halaman. Ini uji browser dengan iframe sempit, bukan perangkat fisik atau audit pembaca layar.

Versi sebelumnya telah memeriksa pergantian ID/EN, input tetap bertahan, tombol menuju planner dan histori/CSV. Garis histori kini terputus pada celah periode; ekspor CSV memakai semua observasi tersimpan.

## Yang belum dibuktikan

Belum ada push/deployment akun pemilik, BPS API berautentikasi, PUBLIC_SITE_URL, beberapa siklus GitHub terjadwal, pemulihan produksi atau monitor eksternal yang diuji dari sini. `/api/health` tetap memerlukan perhatian ketika data inti/produksi belum siap. Kode baru tidak mengubah fakta ini.

Cakupan rinci, bank, pajak/settlement obligasi, feed pasar modal, hasil layanan pemerintah serta studi pemahaman pembaca masih memiliki batas sebagaimana tabel `MENUJU_9_DAN_BUKTI.md`. Tidak ada klaim mutu keseluruhan 9/10 dari jumlah tes atau tampilan saja.
