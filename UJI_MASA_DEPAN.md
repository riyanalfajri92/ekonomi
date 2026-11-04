# Nadi 9.1 — Uji masa depan

Alur: pengamatan ekonomi → jalur dampak → empat skenario → keuangan keluarga → ketahanan anggaran/utang/bank → proyeksi statistik dan status sumber. Versi ID/EN. Semua simulasi pribadi berada di perangkat.

## Yang berfungsi
- Lima bacaan ekonomi dinamis, dengan ilustrasi dan histori saat tersedia. Angka dan analisis dihitung dari snapshot.
- Empat preset dapat diubah: dasar, kebutuhan lebih mahal, penghasilan turun, tekanan gabungan. Tombol mengisi guncangan keluarga dan anggaran, lalu menghitung ulang. Preset tidak memiliki probabilitas kejadian.
- Diagram sisa uang sekarang/dasar/tekanan dengan titik nol dan posisi negatif yang benar; kebutuhan hidup, cicilan, daya beli serta cadangan menutup defisit. Matriks sensitivitas dan urutan persiapan dipertahankan.
- Uji sensitivitas APBN periode yang sama: penerimaan, belanja, saldo, tambahan pembiayaan defisit dan bunga/penerimaan. Bunga tetap pada uji ini. Tidak mengekstrapolasi realisasi kumulatif menjadi ramalan akhir tahun.
- Dinamika rasio utang lima tahun memakai bunga nominal, pertumbuhan nominal, saldo primer dan penyesuaian stok-arus. Angka awal contoh ditandai; tidak dianggap angka pemerintah.
- Contoh stress test modal bank: PD×LGD×EAD, laba, rugi pasar tambahan dan ATMR stress. Contoh portofolio terpisah dari laporan bank nyata; kerugian tambahan harus konsisten dengan pencadangan dalam modal awal.
- Tautan ke 17 kalkulator, laporan bank, metodologi dan status sumber.

## Status prediksi dan pembaruan
Model statistik yang telah tersedia tetap AR(1) inflasi dengan benchmark dan pengujian historis. Nowcast PDB, proyeksi pengangguran, mikrosimulasi kemiskinan dan probabilitas krisis belum diestimasi/validasi pada versi ini; tidak menerbitkan angka buatan untuk mengisinya. Simulasi utang/anggaran/bank adalah hasil bersyarat dari asumsi, bukan ramalan probabilistik.

Catatan pengujian awal versi9.1: sumber inflasi utama mengalami timeout. Versi10 telah menambahkan jalur rilis resmi yang berhasil mengambil Oktober2026; proyeksi kembali aktif. Data September 2026 dipertahankan dengan tanggal aslinya; proyeksi terbaru ditahan oleh aturan kesegaran data. Panel menerangkan statusnya, bukan menghilang. Kolektor berikutnya mencoba sesuai jadwal. Setelah data yang sesuai berhasil masuk, proyeksi dihitung ulang otomatis.

## Validasi
125 tes lulus, 79 modul lolos sintaks/import. Browser: preset gabungan mengubah arus kas dan sensitivitas APBN; perubahan pendapatan membuat defisit dan petunjuk persiapan ikut berubah; surplus primer mengubah lintasan utang; PD mengubah CAR stress; navigasi anchor dan bahasa ID/EN diperiksa.

Kode ini belum diterapkan pada GitHub/Vercel milik pengguna oleh sesi ini. Unggah isi folder termasuk .github, commit dan push, lalu periksa Actions dan deployment. Perbaikan otomasi versi 9 tetap ada.
