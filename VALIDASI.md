# Validasi Nadi 5.1 — 31 Oktober 2026

## Hasil yang terbukti

- **87 pengujian otomatis lulus.** Mencakup rumus finansial, pembanding seperiode, perubahan interpretasi, tanggal mustahil, histori/revisi, validasi fiskal, kurva yield rusak, rollback per sumber, readiness lewat waktu, ledger proyeksi, loading tanpa data dan render ID/EN.
- **57 modul lolos pemeriksaan build** atas sintaks, impor dan snapshot. Ini bukan audit keamanan independen atau sertifikasi kualitas analisis.
- API pengunjung diuji dengan jaringan eksternal yang sengaja dibuat gagal: API tetap menyajikan snapshot dan tidak mengubah waktu pengambilan sumber.
- Pengujian langsung terbatas pada sumber yang diizinkan: indeks APBN terbaca (PDF sama menggunakan ekstraksi tersimpan; waktu pengambilan PDF tidak diganti), indikator tambahan BI terbaca, WDI dan 10 seri struktural terbaca, kurva ADB terbaca.
- Tabel utama inflasi/JISDOR/BI-Rate mengalami timeout. **Alternatif halaman indikator resmi BI berhasil** mengambil ketiga indikator tersebut dengan definisi dan tanggal aslinya; histori lama dipertahankan.
- Pemeriksaan browser versi 5: navigasi empat halaman, grafik komponen permintaan dan dialog histori/CSV, kalkulator arus kas berubah menjadi defisit ketika pendapatan diturunkan, pergantian ID/EN mempertahankan input, tabel 10 bank, harga/YTM/PV obligasi dan prospek triwulan tampil.
- Pengambilan langsung versi 5: **10 seri tambahan WDI berhasil**, periode terbaru 2025: konsumsi rumah tangga/nirlaba, PMTB, konsumsi pemerintah, ekspor, impor, konsumsi per kapita riil, pertanian, industri termasuk konstruksi, jasa dan Gini. Angka terbaru tidak disamakan dengan kondisi harian.
- Bukti browser versi 4 sebelumnya: beranda dan pendalaman fiskal terbaca, Data & metode serta ledger tampil dalam ID/EN, panel terbuka tetap bertahan setelah tombol pembaruan diklik. Pengujian versi sebelumnya juga memverifikasi perubahan input arus kas mengubah kesimpulan surplus/defisit.

## Keterbatasan material

| Kelompok | Bukti dan batas |
|---|---|
| BI | Cadangan resmi tiga indikator lulus pengambilan langsung. Timeout tabel utama tetap tercatat; keberhasilan alternatif tidak disamakan keberhasilan semua sumber. |
| BPS | Data awal merujuk rilis resmi. API membutuhkan BPS_API_KEY pemilik. Pembaruan BPS berautentikasi belum diuji; homepage tidak menghasilkan seri lengkap dalam pengujian sebelumnya. |
| Fiskal | Jalur PDF dan data ekstraksi tersedia; identitas pendapatan − belanja = saldo diuji. Alternatif HTML ditemukan dari indeks resmi dan parser diuji, tetapi pengambilan native halaman Kemenkeu mendapat HTTP 500: belum lulus live. |
| Struktural | Sepuluh seri tahunan berhasil diambil; observasi 2023–2025. Definisi tetap terpisah dari BPS dan data hari ini. |
| Deposito | Sepuluh bank pembanding tampil; keberhasilan dan periode berbeda. Tidak mengklaim semuanya terbarui otomatis atau merupakan peringkat sepuluh terbesar berdasarkan aset. |
| Bank | Rasio tersedia berbeda per bank; tabel kelengkapan hanya menghitung laporan dengan CAR/NPL yang terbaca. Capability kesiapan lebih ketat daripada keberadaan nama bank. |
| Akses terlindungi | Konektor BNI/BTN yang sebelumnya menerima penyaringan keamanan dijeda. Tidak mengakali kontrol akses atau melakukan retry tanpa batas. |
| Obligasi | Kurva ADB terbaca. Enam kuotasi FR awal 30 Oktober 2026 dari sumber resmi BCA; refresh harga per seri belum lulus server. Harga indikatif bukan tawaran transaksi executable. |
| Berita | BI, OJK, Kemendag, Bappebti dan konektor Kemenkeu tersedia dalam kode; hanya hasil yang benar-benar diperoleh ditampilkan. Kemenkeu baru belum lulus pengambilan native. Tidak mengklaim BEI/all-agency feed aktif. |
| Belum tersambung | IHSG, arus saham/SBN lengkap, komponen PDB triwulanan domestik, sewa/biaya lokal/distribusi sosial lengkap, rating obligasi korporasi. |

## Operasi produksi belum dibuktikan

Run pada paket berlabel **local-verification / selected-sources**, bukan GitHub Actions produksi. Belum ada konfigurasi kunci BPS, hook Vercel, PUBLIC_SITE_URL atau monitor independen milik pengguna yang dilakukan dari sini. Belum ada tiga siklus penuh dan satu rilis baru yang melewati produksi.

Readiness memang **belum lolos**. `/api/health` merespons 503 saat blocker data inti/produksi tersisa. Website tetap dapat membaca observasi valid terakhir. Build lulus tidak diartikan seluruh sumber hidup; workflow dapat merah pada gerbang terakhir sambil tetap menyimpan pembaruan valid.

Bukti tiap run: snapshot/health/runs dan artifact Actions. Ini bukan arsip lengkap respons mentah atau data vintage independen. Fingerprint dan histori tidak membuktikan seluruh revisi intrahari tersimpan. Monitor eksternal diperlukan untuk mendeteksi jadwal yang berhenti.

## Analisis dan prediksi

Upah riil memakai pertumbuhan upah dan inflasi yoy bulan sama, bukan inflasi terbaru yang berbeda bulan. Rata-rata buruh tidak mewakili semua orang. Mekanisme ekonomi tidak disebut sebagai bukti sebab-akibat.

Perbandingan belanja pusat/bansos memakai periode tahun sebelumnya yang sama. Belanja nominal bukan volume layanan. Realisasi/pagu bukan skor keberhasilan. Kebutuhan rata-rata sisa bulan merupakan hitungan bersyarat, bukan ramalan defisit atau manfaat bantuan.

Model inflasi fixed median3 identik di server/UI. Sepuluh observasi masih sampel pendek, tanpa interval terkalibrasi. Ledger menyimpan penerbitan dan hasil pertama; catatan lokal awal tidak dianggap rekam akurasi produksi. Skenario pribadi bukan ramalan.

PV obligasi memakai interpolasi yield pemerintah dan model flat-yield, bukan kurva diskonto spot. Sensitivitas ±25 bps adalah asumsi, bukan interval statistik. Tanggal tidak sebanding, tenor di luar kurva dan harga usang membatasi klasifikasi. Pajak, biaya, settlement dan likuiditas belum lengkap. Tidak ada rating pemerintah idAAA rekaan atau rekomendasi beli personal.

Rasio bank merupakan laporan berkala, bukan kas real-time. Bunga tinggi tidak membuktikan masalah. LPS terpisah dari penilaian bank. Belum dilakukan studi pemahaman pembaca, audit aksesibilitas atau pemeriksaan perangkat fisik seluler. Karena itu belum ada klaim 10/10.

## Perombakan versi 5

Enam komposisi halaman lama dihapus. Beranda memakai satu model pembacaan yang menyambungkan produksi, masyarakat, APBN dan ketahanan. Diagram pertumbuhan memiliki titik nol; komponen tidak dijumlahkan sebagai kontribusi PDB. Indeks produksi sejak 2019 hanya merantai observasi tahunan berurutan. Gini bukan persentase penduduk. Konsumsi per kapita tidak dianggap median daya beli.

Pengujian tambahan mencakup sumber inflasi tepat bulan upah, periode bersama seri tahunan, data kosong, batas kedaluwarsa survei, data mundur dari cache, serta parser sumber dengan negara dan rentang yang salah. Ini melengkapi pengujian rumus keuangan yang dipertahankan.

## Revisi asesmen 5.1

Sembilan tes tambahan mencakup pembanding bulan sama, perubahan fiskal, kelayakan eksperimen, rekam prediksi prospektif, perubahan narasi upah, render kosong, parser BPS perubahan pp, cache dengan identitas berbeda pada timestamp sama dan default simulator yang tidak memakai model lemah.

Pembanding TPT/kemiskinan ditinjau lewat indeks rilis resmi; pembukaan langsung menerima HTTP 403. Status data awal dan waktu pengambilan lama tidak diubah menjadi sukses otomatis. Ringkasan kini tujuh bacaan; tabel pada layar sempit disusun vertikal melalui CSS, belum diuji pada perangkat fisik.
