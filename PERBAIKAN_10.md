# Nadi 10 — otomasi diperbaiki dan perbandingan diperluas

## Temuan produksi terverifikasi — 4 November 2026

Dua run terbaru `41798677264` dan `41794355457` pada repository `riyanalfajri92/ekonomi` berhasil menjalankan npm test, pengambilan data, validasi, commit snapshot dan langkah deployment. Kegagalannya ada pada langkah terakhir `Gerbang kesiapan data inti`.

API produksi `https://nadi.bukanaktivis.id/api/health` mengembalikan snapshot `55171e629973ced8`, run `41798677264-1`, heartbeat on-time, tetapi readiness false karena data awal BPS dan APBN cadangan. Jadi mesin koleksi telah berjalan dan hasil run telah sampai ke situs; status pekerjaan GitHub gagal karena gerbang kelengkapan analitik.

Pada inspeksi ini, package.json sudah versi 9.1, tetapi `.github/workflows/update-data.yml` masih versi lama dengan perintah check-readiness tanpa --report-only. Kondisi ini konsisten dengan folder .github yang belum ikut ditimpa; penyebab cara penyalinannya tidak dapat dipastikan dari data publik.

## Perbaikan

- `scripts/check-readiness.mjs` kini aman untuk workflow lama: perintah tanpa opsi melaporkan kekurangan sebagai warning, exit0. `--strict` tetap exit1 bila belum siap. Kesalahan fatal koleksi, data invalid dan deployment tetap gagal.
- Workflow baru tetap memakai --report-only dan menyimpan log tes saat gagal. Salinan terlihat ada di `ops/update-data.workflow.yml`; `node scripts/install-workflow.mjs` memasangnya ke .github bila folder tersembunyi terlewat.
- Pengambilan inti dibatasi empat tugas bersamaan agar tidak membanjiri sumber; unduhan PDF diberi batas waktu45detik dan batas ukuran tetap berlaku.
- Konektor baru menemukan tautan rilis inflasi resmi dari indeks BI. Tidak menebak alamat rilis bulan berikutnya. Parser memisahkan inflasi yoy terbaru, mtm dan pembanding bulan sebelumnya.
- Parser menangani penekanan HTML yang memecah kata (contoh `pa</strong><strong>da`). Ini ditemukan pada HTML rilis BI asli.
- Jika rilis alternatif berhasil menyediakan komponen inflasi, kegagalan jalur analisis lain tidak menimpanya dengan nilai cadangan yang lebih lama.
- Ringkasan sumber membedakan mesin pembaruan, ketersediaan angka dan kesiapan analisis. Kegagalan sumber tetap terlihat; tanggal asli dipertahankan.

## Bukti pengambilan penuh

Run lokal 4November2026 16.37–16.41 WIB, scope all-sources, status partial, dataState changed, tanpa penolakan snapshot:
- Inflasi umum Oktober2026 3,23%; inti2,56%; pangan bergejolak5,81%, dari rilis resmi BI berdasarkan BPS.
- JISDOR4November2026 Rp18.140/USD.
- Seluruh20seri perbandingan negara berhasil diambil ulang, termasuk OWID.
- Model inflasi kembali menghasilkan target November2026, Januari2027 dan April2027 setelah data terbaru masuk. Ini model eksperimental dengan benchmark, bukan model seluruh ekonomi.

## 20 indikator perbandingan

Pertumbuhan riil; PDB riil per penduduk PPP; inflasi tahunan; pengangguran modelILO; air dasar; pembayaran kesehatan langsung; investasi tetap/PDB; konsumsi rumah tangga dan NPISH/PDB; manufaktur/PDB; perdagangan/PDB; ekspor/PDB; partisipasi angkatan kerja; partisipasi perempuan; pekerjaan rentan; pengangguran muda; penggunaan internet; akses listrik; sanitasi dasar; belanja kesehatan/PDB; harapan hidup.

14negara, tiga kelompok pembanding, lima kategori bergambar. Semua negara di setiap grafik selalu memakai tahun yang sama. Riwayat, perubahan tahunan Indonesia, metadata sumber dan makna awam tersedia. Klasifikasi pendapatan mengikuti metadata WorldBank. Total60kombinasi indikator/kelompok lolos pemeriksaan.

## Yang tetap perlu konfigurasi/perbaikan lanjutan

- BPS_API_KEY diperlukan untuk jalur API resmi BPS; run publik yang diperiksa memakai jalur laman dan mengalami403. Pengguna memasang kunci sebagai GitHub repository secret, bukan di HTML/public.
- Tiga seri awal BPS (upah, kemiskinan, PDB triwulanan) belum seluruhnya terverifikasi refresh dalam pengujian penuh ini. Tidak menggantinya dengan proksi tahunan berlabel sama.
- Konektor BNI/BTN yang sebelumnya menghadapi penyaringan keamanan tetap dijeda. Tidak menganggap data awalnya feed aktif.
- Sebagian laporan bank dan berita lembaga masih gagal discovery/akses. Nilai dan tanggal terakhir tetap terlihat.
- Tidak mengklaim20model prediksi sudah aktif.20 pada modul ini adalah indikator perbandingan negara. Model statistik aktif saat ini terbatas pada inflasi, disertai skenario keuangan.

## Cara memasang

1. EkstrakZIP, timpa isi folder repository ekonomi dengan isi nadi-otomatis (bukan ZIP, bukan folder bertingkat).
2. Pastikan scripts/check-readiness.mjs ikut terganti. Perbaikan ini melindungi workflow lama sekalipun .github terlewat.
3. Sertakan .github. Pada Finder: Command+Shift+Titik menampilkan folder tersembunyi. Atau jalankan node scripts/install-workflow.mjs pada root repository untuk menyalin template ops.
4. Commit dan Push origin. Di GitHub Actions, jalankan Perbarui data ekonomi pada main. Periksa langkah koleksi dan ringkasannya, bukan sekadar jumlah data.
5. Pasang BPS_API_KEY melalui Settings → Secrets and variables → Actions bila ingin memakai jalur API resmi BPS. Jangan kirim kunci ke chat atau commit ke repo.
6. PUBLIC_SITE_URL dapat diisi https://nadi.bukanaktivis.id untuk pemeriksaan otomatis versi deployment. Tanpa variabel itu, langkah lama dapat sukses karena pemeriksaan dilewati. Inspeksi API publik pada audit di atas tetap membuktikan snapshot run lama telah sampai ke produksi.

Paket baru ini belum di-push ke repository pemilik oleh sesi ini. Keberhasilan run GitHub setelah instalasi perlu diperiksa di akun pemilik. Seluruh60indikator bacaan,17kalkulator,ID/EN,ilustrasi dan fitur sebelumnya dipertahankan.
