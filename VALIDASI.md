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
