# Validasi Nadi v2

Tanggal pengembangan: 31 Oktober 2026 WIB. Waktu pengambilan terbaru ada di `public/data/snapshot.json`.

- Pengambilan langsung runtime pengembangan berhasil membaca 16 seri indikator, ringkasan APBN, dua tabel deposito, pengungkapan TBP pada Mandiri, dan tanggal siaran pers BI.
- Uji pertama seluruh 11 kelompok koneksi berhasil. Uji berikutnya mengalami timeout pada survei konsumen; nilai terakhir dan tanggal pengambilan dipertahankan. Hasil tiap uji terlihat pada snapshot, bukan disamarkan sebagai keberhasilan seluruh sumber.
- APBN ringkasan diuji terhadap PDF resmi: unit triliun Rupiah, periode kumulatif, pendapatan dikurangi belanja cocok dengan saldo; halaman sumber disimpan. Hanya template ringkasan di awal PDF yang dicakup.
- Bank: BCA sembilan tier, Mandiri lima tier, tarif reguler Rupiah; batas tier, tenor, efektif/perubahan halaman dan sumber diperiksa. Bukan seluruh bank atau seluruh penawaran.
- 16 tes otomatis lulus: parser angka/tanggal, periode masa depan, identitas seri, null, rollback periode, fallback termasuk rentang transaksi, sumber resmi berita, pasangan edisi APBN, rekonsiliasi fiskal, cakupan TBP, tanda/rentang SRBI, uji bergulir tanpa memakai observasi mendatang, hitungan keuangan, pembedaan PMI aktual/proyeksi, dan perubahan batas tier bank.
- Pemeriksaan sintaks dan build lulus. Parser PDF diuji dengan worker lokal eksplisit; Vercel menyertakan berkas worker dalam konfigurasi.
- Browser: navigasi ID/EN, metadata Inggris, tabel deposito, pemakaian tarif bank ke kalkulator, dan halaman sinyal/prospek diperiksa. Nilai contoh BCA 3% untuk Rp100 juta setahun dengan asumsi pajak 20% menghasilkan bunga bersih Rp2,4 juta.
- Di server pratinjau browser, akses sumber keluar gagal. Penanda cadangan dan penghentian proyeksi model terlihat; ini menguji jalur gagal. Pengambilan sumber langsung dari runtime pengembangan berhasil. Bukan bukti koneksi deployment Vercel pengguna yang baru.
- Tautan penulis disetel tanpa target baru agar membuka di tab sama.
- Belum menjalankan workflow atau mendorong perubahan ke repositori pengguna. Belum melakukan deployment v2 di Vercel pengguna. Periksa Actions, build log dan status sumber setelah memasang paket.
- Tampilan desktop diperiksa; perangkat mobile fisik belum diuji.

Model inflasi masih eksperimen dengan seri pendek; tidak ada klaim akurasi masa depan, probabilitas resesi, prediksi saham, atau kesehatan bank individual.

## Tambahan 31 Oktober: perencanaan pribadi, obligasi dan rincian fiskal

- Perencana pribadi menggabungkan arus kas, dana darurat, seluruh cicilan, uji pendapatan/biaya, kekayaan bersih, tujuan dan pensiun. Perhitungan memakai aset khusus yang terpisah; mencegah penjumlahan dana tujuan melebihi total aset. Ambang cadangan/cicilan merupakan asumsi pengguna, bukan skor CFP resmi.
- Simulator obligasi kupon tetap menghitung PV, YTM termasuk biaya pembelian dan durasi modifikasi; uji yield ±1 poin. Berlaku untuk pembelian pada tanggal kupon. Tidak mengandung harga pasar terkini atau rekomendasi seri aktual.
- APBN: sebelas rincian belanja diekstrak dari PDF resmi Oktober 2026 yang sudah diunduh, masing-masing disertai halaman dan periode kumulatif. Kolektor berikutnya membaca seluruh halaman PDF, bukan hanya ringkasannya. Format belum dikenal tidak menghasilkan rincian baru.
- Timeout pengambilan HTML dapat dicoba sekali lagi. Cache hasil yang mengandung kegagalan menjadi 120 detik per lapisan, bukan 900 detik; permintaan berikut memicu percobaan. Ini bukan jaminan sumber pulih atau jadwal tepat 120 detik. Pemeriksaan halaman aktif setiap dua menit. Cache berlapis tetap dapat memperpanjang waktu pemeriksaan.
- Kegagalan ekstraksi PDF APBN dicatat terpisah dari keberhasilan membaca indeks publikasi. Ringkasan terkini tidak memasukkan indikator fallback.
- Uji jaringan terbaru masih mengalami beberapa timeout BI/APBN. Belum ada sumber alternatif otomatis yang diverifikasi untuk semuanya. Tidak menyatakan koneksi sudah andal.
- Belum selesai: sepuluh bank deposito dan rasio individual bank, berita lintas seluruh lembaga, indikator BPS terkini, feed obligasi aktual. Deposito masih dua bank. Jangan meluncurkan fitur ini sebagai cakupan lengkap atau seluruhnya real-time.
