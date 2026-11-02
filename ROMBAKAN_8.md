# Nadi 8 — indikator menjadi isi dan alur utama

## Yang diperbaiki

Kritik pembaca: penjelasan lama terlalu sering mengatakan apa yang tidak dapat disimpulkan, sementara arti angka, mekanisme dan dampak bagi kehidupan belum dijelaskan. Registri 60 indikator diletakkan sebagai lampiran di bawah cerita.

Versi ini mengganti halaman utama dengan tujuh pertanyaan yang bersama-sama mengorganisasikan seluruh 60 indikator. Setiap indikator muncul tepat satu kali dan ditautkan dengan indikator terkait:

1. Kegiatan ekonomi: produksi, permintaan, investasi, manufaktur, keyakinan dan produktivitas.
2. Daya beli: harga, pangan, upah dan konsumsi riil.
3. Kesempatan dan kesejahteraan: pekerjaan, jam kerja, informalitas, kemiskinan, ketimpangan dan partisipasi.
4. Uang negara: penerimaan, belanja, bantuan, subsidi, transfer, saldo, bunga dan utang.
5. Hubungan luar negeri: kurs, cadangan, perdagangan, arus modal dan pembayaran utang.
6. Bank: bunga, uang beredar, kredit, modal, kualitas aset, likuiditas dan penjaminan.
7. Pilihan keuangan: harga saham, kurva yield, valuasi obligasi, spread, sensitivitas dan cicilan pribadi.

## Struktur setiap bacaan

- Nilai dan periode yang tersedia.
- Interpretasi angka: positif/negatif, di atas/di bawah titik pembanding, atau perbandingan dengan pengamatan sebelumnya.
- Mekanisme ekonomi: bagaimana ukuran itu berhubungan dengan produksi, permintaan, biaya, pendanaan atau kesejahteraan.
- Dampak bagi masyarakat: penghasilan, belanja dapur, pekerjaan, layanan, tabungan dan cicilan.
- Hubungan ke indikator lain melalui tautan langsung.
- Rumus, histori, sumber, cakupan dan batas di dalam rincian bukti.

Status teknis cakupan 41/60 dipindahkan ke halaman Sumber. Status koneksi tidak dihilangkan. Angka yang belum tersedia tetap dibedakan dari pengamatan; penjelasan mekanismenya menjadi panduan membaca tanpa membuat angka atau diagnosis kondisi terkini.

## Contoh

IKK 118,1 dibaca sebagai 18,1 poin di atas batas 100, menunjukkan sisi optimistis. Optimisme dapat mendorong rencana pembelian. Bagi pedagang dan jasa, ini sinyal potensi permintaan; konsumsi riil dan penghasilan memberi pembacaan pendukung.

Upah nominal dan inflasi dipasangkan pada periode sama sebelum perubahan riil dihitung. Ringkasan membedakan rilis upah Februari dari inflasi September. PDB triwulanan dilabeli triwulan, bukan pertumbuhan satu bulan.

Saldo APBN menghubungkan pendapatan dan belanja dengan kebutuhan pembiayaan. Saldo primer dan bunga menunjukkan bagaimana sebagian penerimaan terserap kewajiban, lalu dihubungkan dengan dukungan program serta layanan.

## Dinamika dan otomasi

`indicator-insights.js` mengubah pembacaan ketika nilai dan arah berubah. `economy-observatory.js` menjahit indikator ke ringkasan dan hubungan antarbab. Keduanya membaca snapshot yang sama dengan dashboard dan diperbarui saat browser menerima snapshot baru.

Workflow pengambilan enam jam, validasi, timestamp asli, tiga konektor moneter tambahan, 17 kalkulator, skenario pribadi, planner, sepuluh bank dan analisis obligasi dari versi sebelumnya dipertahankan. Versi ini tidak mengubah izin data atau mengklaim menambah 19 feed yang belum tersedia.

## Dasar pembacaan

- BI: definisi IKK optimistis di atas 100 dan publikasi survei konsumen.
  https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_287226.aspx
- BI: saluran transmisi bunga, kredit, konsumsi, investasi, kurs dan jeda waktu.
  https://www.bi.go.id/id/fungsi-utama/moneter/default.aspx
- Definisi statistik dan rumus mengikuti sumber asli yang ditautkan pada setiap indikator. Hubungan kausal umum adalah penjelasan mekanisme; kesamaan arah pengamatan tidak diperlakukan sebagai estimasi kausal.

## Hasil pengembangan

Pengujian mencakup pembalikan IKK, PMI, inflasi/deflasi, defisit/surplus dan kecocokan periode upah/harga. Seluruh 60 indikator memiliki penjelasan dan hubungan. Pengujian program tidak menggantikan audit statistik independen atau membuktikan operasi produksi pemilik.

Paket masih perlu menggantikan isi repositori GitHub pemilik untuk mengubah situs Vercel. Lihat `PANDUAN_UPDATE.md`.
