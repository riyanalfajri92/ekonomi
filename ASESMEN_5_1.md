# Asesmen Nadi 5 → 5.1
31 Oktober 2026 · penilaian pengembang terhadap paket, bukan audit profesor independen atau sertifikasi.

## Putusan

Belum 10/10. Bermanfaat sebagai pembacaan ekonomi dan alat simulasi, tetapi belum komprehensif sebagai sistem prediksi dan belum terbukti sebagai layanan seluruh data otomatis di produksi. Skor di bawah merupakan penilaian editorial kasar, bukan hasil pengukuran ilmiah. Penambahan jumlah indikator tidak otomatis menaikkan kualitas.

| Lensa | Nilai sebelum revisi ini | Alasan utama | Perbaikan yang dikerjakan |
|---|---:|---|---|
| Ekonomi dan sosial | 7/10 | Produksi, konsumsi, upah, distribusi, APBN sudah terhubung. Masih kurang pembanding yang langsung terbaca, komponen triwulanan, mutu pekerjaan dan variasi lokal. | Ringkasan tujuh bacaan: upah riil, harga, pengangguran, kemiskinan, konsumsi riil per kapita, Gini dan belanja pusat; pembanding dan konsekuensi terhitung. |
| Keuangan pribadi | 7/10 | Rumus dan alat cukup luas; belum studi kesesuaian pengguna. Asumsi simulator diam-diam mengikuti model yang belum layak. | Default memakai observasi inflasi dengan periode, bukan model eksperimen. Tombol rencana lengkap diperbaiki menuju planner. |
| Pasar, bank dan obligasi | 5/10 | Sepuluh bank tersedia namun kelengkapan rasio berbeda; enam seri FR bukan seluruh pasar. Tidak ada feed transaksi andal atau rating korporasi lengkap. | Tidak menaikkan klaim. Tetap pisahkan kuotasi tersimpan, perhitungan PV, risiko kredit, penjaminan dan kecocokan tujuan. |
| Prediktif | 3/10 | Median tiga inflasi hanya eksperimen pendek; observasi upah dan fiskal bukan ramalan. Tidak ada model PDB/pekerjaan/kurs tervalidasi. | Prospek dirombak: gerbang prediksi, laboratorium galat, kondisi yang dipantau, lalu simulasi. Model lemah tidak ditampilkan sebagai ramalan utama. |
| IT: kode dan tata data | 7/10 | Validasi, isolasi kegagalan sumber, histori, fingerprint dan heartbeat sudah ada. Cache dengan waktu sama tetapi identitas berbeda masih berpotensi menimpa revisi. | Tolak konflik identitas snapshot pada waktu proses sama. Status kegagalan koneksi pembaca menyebut penggunaan data tersimpan. Parser BPS mengambil pembanding eksplisit bulan sama. |
| IT: otomasi produksi | 3/10 | Belum ada bukti jadwal berjalan di repositori dan deployment pemilik, kunci BPS, atau rangkaian siklus penuh. | Tidak menganggap tes lokal sebagai produksi. Panduan dan gerbang status tetap eksplisit. Tidak ada klaim sudah live. |
| Komunikasi | 7/10 | Alur lebih utuh, ID/EN dan bukti tersedia; pembaca masih harus menggali arah perubahan. Belum diuji ke pembaca awam dan perangkat fisik. | Ringkasan dengan angka sebelum→sesudah, arti perubahan dan sumber; versi sempit disusun vertikal, bukan tabel lebar yang dipaksakan. |

Tidak memberi nilai sesudah otomatis 9 atau 10 hanya karena perubahan kode selesai. Keandalan, pemahaman dan akurasi harus diukur.

## Standar mutu yang dipakai

DQAF IMF mencakup integritas, ketepatan metodologi, akurasi/keandalan, kelayakan layanan dan aksesibilitas. Kerangka ini rujukan prinsip, bukan klaim bahwa Nadi telah diaudit IMF.
https://data.imf.org/en/Resource-Pages/Additional-Data-Resources

Evaluasi prediksi harus membandingkan galat di luar data pelatihan terhadap benchmark, memakai urutan waktu, membedakan backtest dengan prediksi sebelum hasil diketahui, dan menjelaskan ketidakpastian. Rujukan: Hyndman & Athanasopoulos, Forecasting: Principles and Practice, bab 5.
https://otexts.com/fpp3/toolbox.html

Gerbang internal Nadi mensyaratkan 24 uji historis, MAE lebih kecil dari benchmark nilai terakhir, 12 target produksi unik yang tercatat sebelum evaluasi hasil, serta sumber dalam toleransi. Angka ambang ini pilihan editorial, bukan standar internasional. Lolos tidak membuktikan interval terkalibrasi, kestabilan rezim atau sebab-akibat. Catatan lokal tidak dihitung sebagai rekam produksi.

## Makna analitis yang harus tetap dibedakan

- Inflasi menurun belum berarti harga turun. Daya beli juga bergantung penghasilan dan keranjang belanja.
- Konsumsi riil per kapita melambat tidak sama dengan tingkat konsumsi menurun atau median keluarga memburuk.
- TPT menurun belum membuktikan kualitas kerja membaik. Perlu jam kerja, setengah pengangguran, informalitas dan upah distribusional.
- Kemiskinan menurun belum menjamin rumah tangga di atas garis tahan guncangan.
- Belanja nominal naik bukan volume layanan naik dengan persentase sama. Perlu komposisi, harga, penerima dan hasil.
- Bunga/penerimaan membaca beban; bukan ukuran lengkap ruang fiskal. Perlu utang, jatuh tempo, mata uang, penerimaan struktural dan kewajiban kontinjensi.
- Harga obligasi di bawah PV model hanya murah terhadap asumsi model. Yield curve, likuiditas, pajak, biaya dan settlement dapat mengubah kesimpulan.
- CAR/NPL/LCR laporan berkala bukan kas hari ini atau jaminan bank aman. LPS merupakan pemeriksaan terpisah.

## Bukti data BPS pada revisi ini

Tautan pekerjaan/upah yang memakai /assets/pressrelease diperbaiki menjadi URL rilis resmi yang ditemukan dalam pencarian. URL pertumbuhan dan kemiskinan yang tampak pendek ternyata juga muncul dalam indeks pencarian resmi; tidak diubah menjadi slug tebakan.

Pembanding TPT Februari 2025 = 4,76 berasal dari 4,68 + penurunan 0,08 pp yang disebut rilis; kemiskinan Maret 2025 = 8,47 berasal dari 8,07 + penurunan 0,40 pp. Parser otomatis diperluas untuk pembanding eksplisit sebulan sama, dengan uji agar perubahan terhadap semester lain tidak keliru dipakai sebagai yoy. Sumber dan metode derivasi disimpan. Ini dua titik pembanding, bukan histori panjang.

Konten rilis diperoleh dari indeks pencarian resmi. Pembukaan langsung ketiga halaman mendapat HTTP 403. Karena itu timestamp pengambilan lama dan status initial_verified dipertahankan. Pemeriksaan referensi tidak dianggap keberhasilan konektor BPS otomatis.

## Pekerjaan yang masih diperlukan sebelum klaim mutu penuh

| Prioritas | Bukti kelulusan yang diperlukan | Ketergantungan |
|---|---|---|
| 1 · Produksi | Workflow berjalan terjadwal, snapshot valid tiba di domain yang sama, kegagalan dan pemulihan terlihat, termasuk minimal satu rilis baru. | Akses/kunci dan konfigurasi GitHub–Vercel pemilik. |
| 2 · Data inti | BPS otomatis; komponen PDB triwulanan, mutu pekerjaan, harga kebutuhan lokal; utang/jatuh tempo serta penerimaan fiskal; statistik industri bank. | Sumber terverifikasi, definisi dan histori yang memadai. |
| 3 · Harga produk | Sepuluh tawaran deposito dan rasio dapat diperiksa ulang; kuotasi obligasi memiliki tanggal/settlement serta hak penggunaan. | Konektor sumber atau perjanjian feed, bukan tampilan publik saja. |
| 4 · Prediksi | Histori cukup, model tetap, benchmark, rolling holdout, evaluasi sebelum hasil, galat per horizon dan interval yang benar-benar diuji. | Pengumpulan waktu; tidak dapat diganti dengan desain atau menaikkan skor. |
| 5 · Komunikasi | Pembaca awam bisa menjelaskan kembali pesan, periode, batas dan tindakan. Uji perangkat sempit, pembaca layar, keyboard dan performa. | Pengujian pengguna dan audit independen. |

Target uji pemahaman yang diusulkan: setidaknya 10 pembaca dengan variasi usia/literasi; minimal 8 dapat menjawab lima pertanyaan dasar tanpa dibantu. Ini target produk, bukan bukti uji sudah dilaksanakan. Target operasi: tidak ada data usang tanpa label, tidak ada kesimpulan tanpa input valid, seluruh perubahan penting bisa ditelusuri.

## Kesimpulan implementasi

Versi 5.1 memperbaiki disiplin analisis dan kejujuran prediksi; tidak menambah model kompleks tanpa bukti. Infrastruktur yang sudah benar dipertahankan. Tidak ada push ke GitHub atau deployment pemilik dari sesi ini. Tidak ada indikator baru yang diklaim real-time hanya karena data bisa ditemukan di internet.
