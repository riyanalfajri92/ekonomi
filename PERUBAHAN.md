# Nadi 5: yang benar-benar diganti

| Bagian | Sebelumnya | Sekarang |
|---|---|---|
| Struktur | Tujuh halaman dengan pembuka dan panel berulang | Empat pintu dengan satu laporan utama dan satu area pilihan |
| Halaman utama | Komposisi beberapa generasi komponen | Ditulis ulang dalam report.js dengan lima bab dan transisi |
| Model bacaan | Beberapa model ringkasan terpisah | report-model.js menyatukan dependensi, periode bersama dan jenis bukti |
| Penggerak ekonomi | Dominan PDB total dan mekanisme umum | Sepuluh seri tahunan otomatis; permintaan, sektor, konsumsi per kapita dan distribusi |
| Sejarah | Grafik laju | Laju dan indeks level sejak 2019 dibedakan; indeks ditahan bila tahun berlubang |
| Grafik | Pendalaman tersebar | Baris penggerak membuka dialog histori, bukti dan CSV |
| Masyarakat | Halaman terpisah | Terhubung dengan penghasilan, kesempatan, perbedaan kelompok dan layanan |
| Prospek | Pembuka teknis/model dan beberapa susunan lama | Lima pertanyaan: penghasilan, kegiatan, APBN, harga dan biaya uang |
| Pilihan pribadi | Kalkulator/produk sebagai halaman sendiri-sendiri | Satu area bertab: kalkulator, rencana terpadu, deposito/bank, obligasi |
| Gaya | Akumulasi aturan beberapa desain lama | Stylesheet utama ditulis ulang; aturan alat dipisahkan |
| Navigasi | State halaman tanpa tautan langsung | Hash route yang dapat ditautkan, histori browser dan anchor bab |
| Pembaruan browser | Potensi menerima versi cache lebih lama | Respons lebih lama ditolak; input/bacaan dipertahankan |

Enam komposisi lama dihapus: story.js, edition.js, society.js, reading-model.js, quality.js dan outlook.js. Mesin skenario dipisahkan menjadi scenario.js. Rumus keuangan yang sudah diuji tetap dipakai; data dan sumbernya tidak direkayasa demi tampilan.

Konektor baru drivers.mjs masuk ke koleksi terjadwal, validasi, admission/rollback, fingerprint, log perubahan dan peta sumber. Bukan angka yang hanya ditempel ke HTML.

Hal yang tidak diklaim selesai: autentikasi BPS pemilik, seluruh refresh bank/kuotasi obligasi, seri domestik terperinci, pemantauan independen dan pengujian beberapa siklus produksi pemilik.

## 5.1 — revisi setelah asesmen

Ringkasan tujuh perubahan dengan pembanding, gerbang prediksi dan laboratorium evaluasi. Observasi tidak disebut ramalan. Default simulator memakai inflasi teramati, tombol rencana lengkap menuju planner. Konflik snapshot/cache dengan timestamp sama ditolak. Bukti dan kekurangan tercatat di ASESMEN_5_1.md.
