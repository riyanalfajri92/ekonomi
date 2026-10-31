# Bukti validasi dan batas cakupan

Pemeriksaan pengembangan: 31 Oktober 2026. Periode masing-masing angka berbeda; tanggal ini bukan periode seluruh data.

32 pengujian otomatis lulus, meliputi kegagalan/cadangan, rollback periode, pemisahan periode publikasi/pengamatan, pemetaan tier deposito, tanda perubahan yield, rekonsiliasi fiskal, perubahan narasi, PV/YTM dan perencanaan pribadi. Build produksi diperiksa. Tampilan desktop diperiksa di browser; verifikasi produksi pada akun pengguna tetap diperlukan.

| Kelompok | Sudah tersedia | Batas yang perlu diketahui |
|---|---|---|
| BI dan indikator inti | Pengambilan sumber resmi, histori yang tersedia, periode dan status | Sebagian permintaan dapat timeout; cache bukan feed real-time |
| APBN | PDF penuh, pendapatan/belanja/saldo, komponen dan pembanding berlabel beserta halaman | Kategori tematik tumpang tindih tidak dijumlahkan; perubahan format PDF dapat menggagalkan ekstraksi |
| Deposito | 10 bank pembanding: BCA, Mandiri, BNI, BTN, CIMB Niaga, Danamon, OCBC, Maybank, Mega, Panin | Bukan klaim peringkat 10 terbesar berdasarkan aset. BNI/BTN memblokir akses otomatis dalam pengujian. Beberapa koneksi lain pernah timeout; status cadangan tetap terlihat |
| Rasio bank | Tabel terhubung ke baris deposito, periode, basis individual/konsolidasi, rasio dan perubahan yang tersedia | Tidak semua bank memiliki semua rasio. Ekstraksi PDF BCA/CIMB/Mega/OCBC/Panin dan rilis Mandiri diuji. Pembaruan bank lain belum seluruhnya berhasil. Bukan peringkat keamanan atau kondisi kas real-time |
| LPS | Pembanding tingkat bunga dan masa berlaku, selisih terhadap penawaran | Memenuhi batas bunga saja tidak membuktikan seluruh syarat penjaminan terpenuhi |
| Obligasi | Yield pemerintah tenor 2/5/10 tahun dari AsianBondsOnline ADB; perubahan harian/mingguan; simulasi PV/YTM | Data penutupan, bukan bid/offer yang dapat dieksekusi. Harga dan rating per seri korporasi belum terhubung; belum ada rekomendasi beli aktual |
| Masyarakat BPS | Nilai awal resmi GDP triwulanan, TPT, upah dan kemiskinan; adapter API terdokumentasi | API memerlukan BPS_API_KEY. Parsing diuji dengan fixture; autentikasi/pembaruan API langsung belum diuji tanpa kunci. HTML beranda tidak memberi data terstruktur dalam pengujian |
| Berita | BI, publikasi APBN, tambahan Kemendag/Bappebti/OJK | Kemendag/Bappebti berhasil diambil; OJK pernah timeout. Tanggal yang tidak terverifikasi ditulis tidak tersedia. BEI belum terhubung |
| Prospek | Pembacaan bersyarat lintas harga, kegiatan, fiskal, pembiayaan dan rumah tangga; skenario pribadi | Bukan ramalan pasti; proyeksi hanya ditampilkan bila prasyarat seri terpenuhi |
| Pasar saham | Belum ada feed IHSG/transaksi asing saham terverifikasi | Tidak digantikan angka rekaan; cakupan ini belum selesai |

## Arti otomatis

Program dan jadwal sudah ada dalam paket. Agar berjalan di internet, pengguna harus memasang seluruh proyek, mengaktifkan Actions dengan izin tulis, mengonfigurasi BPS_API_KEY untuk BPS, dan memastikan commit bot memicu Vercel. Kegagalan sumber ditampilkan; tidak disembunyikan. Belum ada bukti deployment akun pengguna atau seluruh koneksi berhasil terus-menerus.
