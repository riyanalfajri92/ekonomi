# Nadi 12 — satu cerita, tiga langkah

## Konsep yang diterapkan

**Kondisi sekarang → kemungkinan ke depan → rencana hidupmu.**

Setiap pembaca dapat berhenti pada ringkasan, membuka contoh sehari-hari, atau mendalami seluruh angka. Pola bacaan: **apa yang berubah → apa artinya → contoh/perumpamaan → dampaknya → alat untuk mengambil langkah**.

| Bagian utama | Yang dibaca masyarakat | Materi yang tetap tersedia |
|---|---|---|
|Kondisi sekarang|Produksi, biaya kebutuhan, pekerjaan dan ruang anggaran; contoh angka, tanggal dan saluran dampak|60 indikator, grafik, histori, fiskal, sosial, perbankan, konteks dunia, sumber dan rilis resmi|
|Arah ke depan|Apa yang diperkirakan bertambah atau berkurang, kapan, rentangnya, dampak dan persiapan|20 sasaran, 17 proyeksi eksperimental yang dapat dihitung, pengujian akurasi dan metode, skenario keluarga serta ketahanan|
|Rencanamu|Mengatur uang bulanan, cadangan, cicilan, pendidikan dan tujuan lain|17 kalkulator, rencana terpadu, deposito/10 bank, serta obligasi|

Navigasi utama mengikuti tiga bagian tersebut. Sumber/status tetap tersedia melalui bilah pemeriksaan dan bagian bawah halaman.

## Perubahan komunikasi

- Pembuka mengaitkan ekonomi dengan hidup pembaca; angka produksi, harga, pekerjaan dan beban bunga diberi tanggal sendiri.
- Tujuh adegan memiliki contoh/perumpamaan: laju produksi, keranjang Rp1 juta, TPT per 1.000 angkatan kerja, bunga per Rp100 pendapatan negara, tagihan US$100, kredit bermasalah dalam portofolio acuan, dan setoran bulanan untuk sebuah tujuan.
- Contoh inflasi, kurs, TPT, NPL dan fiskal dihitung dari data yang sama dengan angkanya. Perubahan tanda, nilai dan periode mengubah contoh yang tampil.
- Perumpamaan ditempatkan dalam rincian yang bisa dibuka. Ilustrasi aritmetika ditandai sebagai ilustrasi; angka nasional dibedakan dari keadaan pribadi.
- Kalimat prediksi menyebut besarnya perubahan dan maknanya. Contoh: produksi diperkirakan **bertambah** 5,07% meskipun lajunya lebih pelan; pertumbuhan positif yang melambat tetap dibaca sebagai pertambahan produksi.
- Tautan contoh belanja membawa inflasi sumber ke kalkulator daya beli; tautan tagihan dolar membawa kurs sumber ke kalkulator tujuan dolar. Asumsi dan periodenya terlihat, serta dapat diedit.
- Nama kebutuhan menjadi pintu masuk kalkulator. Panduan ① isi angka ② baca hasil/gambar ③ ubah asumsi membantu membandingkan rencana.
- Kamus singkat menjelaskan PDB, inflasi, daya beli, persen/poin persentase, perbandingan tahunan, rentang perkiraan, hasil bruto/bersih, dan likuiditas.
- Materi 60 indikator dipertahankan pada rincian adegan; peta dan berita resmi dapat dibuka saat diperlukan.
- Seluruh elemen baru tersedia dalam ID/EN.

## Bukti otomasi: status terbaru berbeda dari email kegagalan lama

Pemeriksaan langsung repositori publik pada 4 November 2026:

| Run | Waktu mulai WIB | Hasil |
|---|---|---|
|41842293365|4 November 2026, 20.53 WIB|success; tidak ada langkah gagal|
|41810580917|4 November 2026, 16.53 WIB|success; tidak ada langkah gagal|
|41798677264|4 November 2026, 15.19 WIB|failure pada pemeriksaan kesiapan versi sebelumnya|

Bukti run:
- https://github.com/riyanalfajri92/ekonomi/actions/runs/41842293365
- https://github.com/riyanalfajri92/ekonomi/actions/runs/41810580917

API produksi mengembalikan run **41842293365-1**, snapshot **f20f34ac024a277f**, dan heartbeat **on-time**. Artinya pembaruan run itu telah sampai ke produksi. Kesiapan analitik masih `false`, terpisah dari keberhasilan workflow. Sumber yang kurang lengkap tetap dilaporkan.

Paket ini mempertahankan cron enam jam, kolektor, cache sumber, validasi, ledger prediksi, commit snapshot, dan jalur Vercel. Waktu rilis ekonomi mengikuti lembaganya: data triwulanan tidak menjadi data harian. Pengambilan ulang tanpa observasi baru tidak mengganti periode angka.

Tiga sasaran prediksi tenaga kerja/upah tetap ditahan sampai histori BPS sesuai dan cukup. `BPS_API_KEY` ditempatkan sebagai GitHub Actions secret, bukan di berkas publik. Jalur histori berkunci perlu diuji setelah kunci tersedia. Keberhasilan GitHub tidak berarti semua sumber berhasil atau seluruh analisis sudah siap.

## Memasang paket

1. Ekstrak ZIP.
2. Salin **isi** folder `nadi-otomatis` ke akar repositori `ekonomi` yang sama, termasuk `.github`, `scripts`, `lib`, `public`, `test`, `package.json`, `package-lock.json`, dan `vercel.json`.
3. Commit dan push melalui GitHub Desktop. Jangan hanya mengunggah ZIP atau HTML.
4. Jika `.github` tidak terlihat di Finder, tekan **Cmd+Shift+Period**. Alternatif: `node scripts/install-workflow.mjs`, lalu commit workflow yang dibuat.
5. Periksa Actions dan deployment Vercel; sesudah berhasil, muat ulang situs.

Paket versi 12 disiapkan dan diuji secara lokal; belum didorong ke repositori pemilik dari sesi ini. Keberhasilan run publik di atas adalah bukti otomasi versi 11 yang sudah terpasang.
