> Pembaruan versi10: baca PERBAIKAN_10.md terlebih dahulu. check-readiness tanpa opsi kini advisory; gunakan --strict untuk gerbang rilis ketat. Diagnosis tes di bawah adalah kegagalan terdahulu; kegagalan run terbaru terjadi pada gerbang kesiapan.

# Mengapa email GitHub gagal terus? — audit 4 November 2026

## Penyebab terverifikasi

Repositori: `riyanalfajri92/ekonomi`. Dua run yang diperiksa:
- https://github.com/riyanalfajri92/ekonomi/actions/runs/41787137723
- https://github.com/riyanalfajri92/ekonomi/actions/runs/41705027368

Keduanya berhasil checkout, setup Node dan instalasi, lalu gagal di `npm test`. Langkah `npm run update-data` dan seluruh publikasi dilewati. Ini bukan akibat belum ada rilis ekonomi baru.

Kode commit `7873fb1cf044ce0d641bbbc1b9c3e61f423b491c` diunduh dan kegagalannya berhasil direproduksi: 111/112 tes lulus. Tes `initial BPS and unverified deployment cannot pass production readiness` membaca snapshot produksi yang berubah, lalu mengharuskan blocker `production-pipeline` selalu ada. Begitu snapshot mencatat run GitHub, asumsi itu salah. Setelah mengganti contoh tes dengan fixture tetap, 112/112 lulus pada kode reproduksi.

## Perbaikan dalam paket ini

1. `test/automation.test.mjs`: kesiapan awal diuji dengan data contoh tetap. Tes API membandingkan hasil dengan kesiapan sebenarnya, sehingga tetap sah ketika layanan siap.
2. `.github/workflows/update-data.yml`: hasil tes disimpan sebagai `test-results.log` dan artifact diunggah juga saat tes gagal. Laporan kesiapan data inti tidak lagi membatalkan koleksi yang berhasil.
3. `scripts/check-readiness.mjs --report-only`: melaporkan blocker tanpa gagal. Perintah tanpa opsi tetap menjadi gerbang ketat untuk evaluasi peluncuran.
4. `scripts/verify-production.mjs`: memastikan snapshot ID dan run ID yang benar telah sampai di produksi. HTTP503 akibat kesiapan analitik yang belum lengkap dicatat terpisah dari bukti pengiriman versi. Versi salah, koneksi gagal dan kesalahan deployment tetap gagal.
5. `lib/run-outcome.mjs` + `scripts/update-data.mjs`: membedakan `changed`/`unchanged` dari sukses/gagal pengambilan. Kegagalan lama sumber lain tidak mengotori hasil pengujian sumber pilihan.
6. `lib/collect.mjs`: pengulangan terbatas untuk timeout/koneksi dan HTTP429/502/503/504. Data invalid tidak diterima karena retry.
7. `lib/world-context.mjs`: koneksi World Bank dan OWID dalam kolektor terjadwal yang sama. Periode tahun tetap milik data sumber.

Peringatan Node20 pada actions/checkout@v4 dan setup-node@v4 bukan langkah yang menggagalkan dua run yang diperiksa; keduanya berhasil. Runtime proyek sudah Node24.

## Agar perbaikan berlaku di GitHub dan Vercel

1. Ekstrak ZIP. Salin **isi** `nadi-otomatis` ke folder lokal repositori `ekonomi`, termasuk `.github`; timpa file lama. Jangan menaruh satu folder `nadi-otomatis` lagi di dalam root repositori.
2. GitHub Desktop: tinjau Changes, isi judul misalnya `Fix automation tests and add illustrated Nadi`, Commit, lalu Push origin.
3. Buka GitHub → repositori ekonomi → Actions → Perbarui data ekonomi → Run workflow → branch main. Kode baru harus sudah ada di main. Menjalankan kode lama akan mengulang kegagalan.
4. Pastikan langkah tes, koleksi, validasi dan simpan snapshot berhasil. Artifact run berisi log tes, snapshot, health dan runs. Bagian summary menjelaskan sumber berhasil dan sumber yang tertunda.
5. Pada Settings → Actions → General → Workflow permissions, pastikan bot diizinkan menulis repository. Workflow sudah meminta `contents: write`; kebijakan organisasi/branch tetap dapat membatasi push. Jangan menghapus branch protection; gunakan alur PR bila diwajibkan.
6. Hubungkan Vercel ke repository dan branch yang sama. `VERCEL_DEPLOY_HOOK` opsional dapat dipasang sebagai repository secret bila diperlukan untuk memicu deployment. Nilainya rahasia; jangan ditaruh di file public.
7. Isi repository variable `PUBLIC_SITE_URL=https://nadi.bukanaktivis.id` untuk verifikasi versi produksi. Jika kosong, langkah ini menyatakan belum dikonfigurasi; tidak membuktikan deployment otomatis.
8. Setelah itu jadwal setiap enam jam memeriksa sumber. Rilis bulanan/tahunan akan tetap bertanggal bulan/tahun sumber sampai pembaruan atau revisi tersedia.

Perbaikan ini sudah diuji lokal, belum di-push ke akun GitHub pemilik oleh sesi ini. Keberhasilan end-to-end produksi baru terbukti setelah run GitHub dan verifikasi deployment di akun pemilik selesai.

## Membaca status

- **Berhasil, unchanged**: koneksi dan pembacaan sukses, isi data sama. Tidak memerlukan tindakan.
- **Berhasil, changed**: ada angka/riwayat/revisi yang berubah; snapshot baru diterbitkan.
- **Partial**: sebagian sumber berhasil, sebagian gagal atau data ditolak. Sumber berhasil tetap diperbarui; sumber lain mempertahankan nilai dan tanggal terakhir.
- **Failed**: tidak ada pengambilan berhasil pada run terkait, atau kesalahan fatal validasi. Periksa langkah merah/log. Run berikutnya mencoba lagi.
- **Belum siap**: kelengkapan/kesegaran data inti belum memenuhi aturan analitik. Ini tetap terlihat walaupun mesin koleksi sedang berjalan.

World Bank/OWID berhasil diuji dengan 14 negara dan 7 seri. Pengambilan ulang menghasilkan status `ok` dan `dataState: unchanged`, membuktikan ketiadaan angka baru tidak dianggap gagal.
