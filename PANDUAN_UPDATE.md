# Memasang pembaruan otomatis

1. Ekstrak ZIP. Salin **isi** folder `nadi-otomatis` ke folder lokal repositori `ekonomi`, menggantikan versi lama. Sertakan `.github/workflows/update-data.yml`, `api`, `lib`, `public`, `scripts`, `test`, package files dan `vercel.json`. Di Finder tekan Command–Shift–titik untuk menampilkan folder tersembunyi bila diperlukan. Jangan unggah `node_modules`.
2. Di GitHub Desktop, periksa Changes, isi Summary, klik Commit lalu Push origin. Mengubah file lokal belum mengubah website sebelum commit tersebut diterbitkan Vercel.
3. Di Vercel, hubungkan repositori yang sama. Gunakan root repositori, Node 24, Build Command `npm run build`, Output Directory `public`, Framework Preset Other. Pertahankan `vercel.json` dan pastikan deployment produksi berhasil.
4. Di GitHub, buka Settings → Actions → General. Izinkan workflow dan beri Workflow permissions **Read and write permissions**, agar bot dapat menyimpan snapshot. Kebijakan organisasi atau branch protection mungkin memerlukan penyesuaian oleh pemilik repo.
5. Untuk data masyarakat BPS: daftar/ajukan kunci melalui layanan resmi https://webapi.bps.go.id/. Simpan kunci sebagai repository secret **BPS_API_KEY** di Settings → Secrets and variables → Actions. Jangan tulis kunci ke kode atau kirim ke chat. Adapter mengikuti dokumentasi resmi, tetapi autentikasi langsung belum diuji tanpa kunci milik Anda.
6. Buka Actions → Perbarui data ekonomi → Run workflow pada branch utama. Periksa log dan commit snapshot yang dihasilkan. Workflow hijau tidak berarti semua sumber berhasil: periksa juga Sumber & status di website.
7. Pastikan commit bot memicu deployment Vercel dan periode/sumber di website sesuai hasil snapshot. Jadwal otomatis memerlukan workflow berada pada default branch. GitHub dapat menunda jadwal; pada repo publik tanpa aktivitas, jadwal juga dapat dinonaktifkan GitHub.

## Kapan diperbarui?

Workflow dijadwalkan setiap enam jam: sekitar 01.23, 07.23, 13.23 dan 19.23 WIB. Koleksi ini mencakup PDF bank, APBN, kurva obligasi, rilis lembaga dan BPS jika kunci tersedia. API kunjungan memeriksa sumber inti dengan cache normal 15 menit; saat ada kegagalan cache dipersingkat menjadi dua menit. Browser memeriksa kembali sekitar dua menit. Ini pemeriksaan berkala, bukan jaminan angka baru setiap kunjungan.

## Kalau sumber gagal

Nilai terakhir dipertahankan bersama periode dan waktu pengambilan aslinya. Status menunjukkan cadangan/kegagalan, bukan mengubah tanggal angka menjadi hari ini. Pemeriksaan berikutnya mencoba kembali; data yang lolos validasi menggantikannya. Sumber diblokir, halaman berubah atau API belum dikonfigurasi memerlukan perbaikan konektor/akses yang sah. Mengganti sumber harus menjaga definisi dan periode pembanding.

## Mengedit desain

Edit `public/style.css`, `public/story.js`, `public/app.js` dan modul terkait. Commit dan Push; Vercel membangun ulang. Jangan edit snapshot angka dengan tangan untuk menyamarkan data usang. Uji `npm test` dan `npm run build` sebelum Push.

## Pemeriksaan peluncuran

Periksa halaman awal, Prospek, Deposito, Obligasi dan Lab pada ID/EN serta layar ponsel. Cek Sumber & status, periode angka, tautan sumber dan nominal deposito. Jalankan workflow manual dan pastikan commit/deployment berantai berhasil. Paket ini belum di-push atau di-deploy ke akun Anda dari sesi ini.
