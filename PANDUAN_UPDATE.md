# Memasang Nadi 5 pada GitHub → Vercel

## Berkas

Ekstrak ZIP. Salin **seluruh isi** folder `nadi-otomatis` ke akar repo `ekonomi`, termasuk `.github`. Cadangkan versi lama. Jangan menaruh folder berlapis `ekonomi/nadi-otomatis/public`. Pada GitHub Desktop: periksa perubahan → Commit → Push origin.

Vercel: Node.js 24, Framework Other, Root Directory akar repo, Build Command `npm run build`, Output Directory `public`. `vercel.json` sudah mengatur dua API. Website pengguna belum dipush atau diubah dari sini.

## Konfigurasi sekali

| Pengaturan GitHub | Nama | Fungsi |
|---|---|---|
| Actions secret | `BPS_API_KEY` | Kunci resmi Web API BPS; jangan taruh pada HTML atau commit |
| Actions repository variable | `PUBLIC_SITE_URL` | Alamat HTTPS website produksi, untuk verifikasi versi setelah deploy |
| Actions secret, opsional | `VERCEL_DEPLOY_HOOK` | Hook Vercel jika integrasi Git tidak menerbitkan commit bot |

Aktifkan Actions dan izin workflow menulis repo. Hook dibuat di pengaturan proyek Vercel dan diperlakukan sebagai rahasia. Gunakan integrasi Git yang sudah ada jika berfungsi; hook dapat menyebabkan deployment tambahan.

## Buktikan otomasi

1. Actions → Perbarui data ekonomi → Run workflow pada default branch.
2. Periksa tabel setiap sumber dan artefak `nadi-data-…`. Jangan menyimpulkan semua sumber berhasil dari satu status hijau.
3. Commit bot menyimpan snapshot/health/runs. Integrasi Git atau hook opsional menerbitkan versi.
4. Jika `PUBLIC_SITE_URL` diatur, workflow memeriksa apakah `/api/health` menyajikan snapshotId **dan runId** yang sama. HTTP 200 dari versi lama tidak cukup.
5. Gerbang kesiapan data inti berada di langkah terakhir. Workflow dapat merah ketika data awal BPS/usia data belum layak, sementara pembaruan valid sumber lain tetap tersimpan dan diterbitkan. Baca blocker yang dicetak.
6. Lakukan tiga siklus penuh serta uji satu rilis data baru. Belum ada bukti siklus produksi milikmu dari lingkungan ini.
7. Aktifkan notifikasi GitHub Actions. Untuk jadwal yang tidak pernah berjalan, gunakan monitor HTTP independen pada `https://DOMAINMU/api/health`. HTTP 503 meminta perhatian; JSON menjelaskan penyebab. Monitor eksternal belum dikonfigurasi oleh paket.

Jadwal enam jam: **01.23, 07.23, 13.23, 19.23 WIB**. GitHub dapat menunda jadwal. Peringatan internal setelah 9 jam, lewat toleransi setelah 18 jam. Sumber tahunan tidak diwajibkan berubah setiap pemeriksaan.

## Saat ada masalah

- Angka valid terakhir tetap bertanggal asli; tidak menjadi nol atau diberi tanggal hari ini.
- Data rusak/periode mundur ditolak per seri. Sumber lain dapat tetap diperbarui.
- Tiga indikator BI mempunyai cadangan pada halaman indikator resmi; jalur itu sudah diuji langsung.
- Alternatif fiskal HTML belum lulus pengambilan native (HTTP 500). PDF tetap jalur utama.
- Konektor BNI/BTN yang menerima penyaringan keamanan dijeda. Perlu kanal resmi yang diizinkan. Harga seri obligasi dan sejumlah bank belum otomatis terverifikasi.
- Tidak ada sistem tanpa pemeliharaan: perubahan format atau akses bisa membutuhkan perbaikan konektor.

## Mengedit dan menjalankan

Node 24: `npm ci`, `npm test`, `npm run build`, `npm run dev`.

`npm run update-data` menjalankan seluruh sumber yang diizinkan. Untuk pemeriksaan terbatas: `npm run update-data -- --sources=bi-extra,worldbank,social-structural`. Pemeriksaan lokal/terbatas **tidak** dianggap bukti pipeline produksi penuh.

`npm run check-readiness` memeriksa gerbang data. Exit nonzero saat blocker tersisa memang disengaja. `npm run build` memeriksa integritas kode/snapshot, bukan menjamin semua sumber hidup.

Desain/narasi: `public/report.js`, `report-model.js`, `governance.js`, `app.js`, `style.css`. Alat: `toolkit.js`/`toolkit-math.js`, `planner.js`, `scenario.js`, `deposits.js`, `bonds.js`. Gaya alat: `tool-ui.css`. Konektor penggerak historis: `lib/drivers.mjs`. Kolektor: `lib`. Setelah edit, tes/build lalu Commit/Push. Baca KONSEP_EKSEKUSI.md dan VALIDASI.md.
