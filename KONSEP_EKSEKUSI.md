> Versi terkini dan status terperinci: `MENUJU_9_DAN_BUKTI.md`.

# Nadi 6 — konsep yang diterapkan

Tujuan: memahami kondisi ekonomi Indonesia, perbedaan pengalaman masyarakat dan pilihan keuangan pribadi dalam bahasa sederhana. Kedalaman ditempatkan pada bukti dan metode, bukan istilah sulit di pembuka.

## Arsitektur pengalaman

**Baca ekonomi** adalah laporan utama dengan lima bab:

1. Kegiatan ekonomi: produksi, permintaan dan sejarah. Pertumbuhan tahunan konsumsi/investasi/pemerintah/perdagangan dibaca dalam tahun yang sama; tiga sektor nilai tambah tersedia di pendalaman. Bukan dekomposisi triwulan terbaru dan bukan kontribusi yang bisa dihitung dengan menjumlahkan laju.
2. Kehidupan: upah riil dari pembanding bulan sama, pekerjaan, kemiskinan, konsumsi per kapita, ketimpangan, kesempatan pemuda dan layanan dasar. Perbandingan kelompok menggunakan irisan tahun.
3. Dukungan negara: penerimaan → belanja/program → pembiayaan; pertumbuhan belanja pusat dibanding bansos, realisasi/pagu, saldo primer dan bunga/penerimaan. Anggaran tidak disamakan hasil layanan.
4. Ketahanan: bunga, kurs, yield dan konteks eksternal. Stok dan arus tidak ditukar; SRBI bukan seluruh dana asing. Belum ada vonis stabilitas sistem keuangan tanpa data industri lengkap.
5. Langkah: apa yang perlu dipantau dan alat yang relevan. Tidak ada rekomendasi seragam bagi semua pembaca.

**Prospek** menata empat bacaan kondisi, laboratorium harga dan matriks skenario. Laboratorium versi 6 memakai AR(1) horizon 1/3/6 bulan dengan benchmark dan evaluasi galat. Uraian arsitektur sebelumnya berikut merupakan konteks perkembangan: penghasilan, kegiatan usaha, ruang APBN, tekanan harga dan biaya uang. Jenis bukti ditulis: observasi, ekspektasi survei, eksperimen model atau sensitivitas. Ekspektasi survei yang periodenya lewat kembali dibaca sebagai konteks observasi, bukan ramalan masa depan.

**Pilihanmu** menghubungkan arus kas, cadangan, utang dan tujuan dengan 17 kalkulator, rencana terpadu, deposito dan obligasi. Satu kerangka visual, empat tab. Nilai awal adalah contoh; input tidak dikirim ke server. Bunga dan kupon bukan ukuran keamanan/kecocokan tunggal.

**Sumber** menampilkan tanggal, kelengkapan, status, usia observasi, cara pembaruan, log revisi, catatan proyeksi dan batas cakupan. Kehadiran angka tidak dianggap bukti refresh berhasil.

## Disiplin analisis

Setiap bab mengikuti temuan → pembanding → jalur dampak → makna → pendalaman. Mekanisme tidak dinyatakan sebagai sebab yang sudah dibuktikan. Data hilang tidak menjadi nol. Bukti yang melewati usia relevan dibaca sebagai historis; kegagalan sumber membatasi bacaan yang bergantung padanya.

Pertumbuhan nasional tidak sama dengan uang masyarakat. Konsumsi total tidak sama dengan konsumsi per kapita atau distribusi. PDB tahunan dan triwulanan tidak disambung sebagai satu grafik. Indeks level sejak 2019 dihitung dengan merangkai pertumbuhan tahunan, ditahan bila ada tahun hilang; tidak mengukur pendapatan keluarga.

Gini WDI/PIP berindeks 0–100, bukan seri BPS 0–1 yang langsung disambung tanpa pemeriksaan konsep/periode. Air dasar bukan air dikelola aman. NEET bukan pengangguran muda. Pembayaran kesehatan nasional bukan persentase penghasilan keluarga.

## Data dan otomasi

Sepuluh indikator penggerak/distribusi historis baru berhasil diperoleh lewat API resmi World Bank. Bersama sepuluh indikator struktural sosial, indikator inti BI/BPS/APBN dan produk, data masuk melalui satu pipeline:

GitHub Actions → konektor resmi → admission/validasi → snapshot/histori/revisi → commit → Vercel → API snapshot → bacaan.

Snapshot tidak dibuat ulang oleh pengunjung. Sumber alternatif harus setara definisi, satuan dan periode. Cadangan BI untuk inflasi/JISDOR/BI-Rate sudah lulus pengambilan langsung. Sumber tahunan tidak menggantikan BPS terkini.

Perubahan angka dibedakan dari pemeriksaan ulang. Waktu pengamatan, publikasi jika tersedia, pengambilan valid dan pemeriksaan dipisahkan. Data invalid/periode mundur mengembalikan seri itu ke data terakhir, tidak menggugurkan semua pembaruan.

Jadwal enam jam dapat terlambat. Heartbeat serta endpoint /api/health disediakan. PUBLIC_SITE_URL dapat memverifikasi runId dan snapshotId setelah deploy; hook Vercel opsional. Monitor eksternal perlu diatur pemilik karena jadwal yang berhenti tidak dapat mengandalkan dirinya sendiri untuk memberi kabar.

## Prediksi dan keuangan

Model inflasi median tiga observasi tetap dan identik pada server/UI. Evaluasi bergulir memakai benchmark last-value; sampel masih pendek, tanpa interval probabilitas terkalibrasi. Ledger menyimpan proyeksi pertama, aktual pertama dan revisi. Catatan lokal belum menjadi rekam akurasi produksi.

Skenario pribadi menghitung dampak penghasilan, biaya, bunga, USD dan durasi dengan asumsi eksplisit. Bukan prediksi nasib pengunjung. Kebutuhan belanja APBN tersisa adalah hitungan aritmetis bersyarat, bukan ramalan realisasi/defisit atau bantuan.

Deposito: hasil bersih, syarat LPS dan kondisi bank dipisahkan. Bila tersedia, CAR disandingkan minimum profil dalam laporan dengan catatan buffer belum tercakup. Tidak ada peringkat aman universal.

Obligasi: harga beli/jual, YTM, bunga berjalan, PV acuan dan durasi berdampingan. Acuan memakai interpolasi yield, bukan spot curve atau harga wajar resmi; sensitivitas ±25 bps bukan interval statistik. Tanggal usang atau tenor di luar kurva menahan klasifikasi. Pajak, biaya, likuiditas dan settlement membatasi penilaian.

## Gerbang yang belum selesai

- Kunci/akses BPS, seluruh kuotasi bank dan harga seri obligasi belum terbukti otomatis di produksi pemilik.
- Komponen PDB domestik triwulanan, distribusi pengeluaran rinci, sewa/harga lokal, industri perbankan terkini, IHSG dan arus saham/SBN lengkap belum tersambung.
- Pemantauan independen serta beberapa siklus produksi pemilik belum dijalankan dari sini.
- Belum ada studi pemahaman pembaca awam, audit aksesibilitas independen atau validasi prediksi prospektif yang panjang.

Target mutu: semua kesimpulan penting dapat dilacak, definisi/periode tidak dipertukarkan, batas data memengaruhi bacaan, pembaruan terbukti sampai produksi, dan alat membantu keputusan yang konteksnya dipahami. Target itu tidak disamakan klaim nilai 10/10.
