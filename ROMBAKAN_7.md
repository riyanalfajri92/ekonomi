# Nadi 7 — dari ekonomi ke kehidupan, lalu rencana pribadi

## Perubahan menyeluruh

Halaman utama memakai satu alur editorial: ekonomi → penghasilan dan daya beli → keadaan masyarakat → uang negara dan layanan → saluran risiko → alat pribadi. Tampilan desktop dan lebar 390px memakai sistem desain yang sama.

`public/story.js` menyusun narasi dari snapshot saat halaman dirender. Pernyataan upah riil menggunakan perubahan upah dan inflasi pada periode yang sesuai. Jika pembanding tidak tersedia, kesimpulan numerik ditahan. Label periode dan kualitas menyertai angka; tanggal pemeriksaan tidak mengganti periode data.

`public/indicator-catalog.js` memuat 50 indikator utama dan 10 lanjutan. Setiap indikator memiliki definisi/perhitungan, kegunaan dalam bahasa awam, sumber yang dituju, frekuensi dan status cakupan. Registri bukan 60 feed yang sudah aktif. Nilai parsial/tahunan tidak diperlakukan sebagai pengganti rilis domestik terkini.

## Kalkulator dan pilihan

17 kalkulator tetap tersedia: arus kas, kekayaan bersih, dana darurat, tujuan hidup, pendidikan, pensiun, pinjaman, KPR, kendaraan, refinancing, pelunasan tambahan, investasi, daya beli, deposito, perlindungan keluarga, biaya investasi dan tujuan dolar. Planner terpadu serta skenario pribadi tetap tersedia.

Tautan cerita mengarah langsung ke alat, misalnya `#pilihan/tool/power`, `#pilihan/tool/reserve`, dan `#pilihan/tool/education`. Perubahan input memperbarui hasil dan penjelasannya. Input perhitungan pribadi tidak dikirim ke server.

Deposito tetap membandingkan sepuluh bank yang ada pada paket, bukan klaim sepuluh bank terbesar berdasarkan aset. Sumber yang gagal tetap bertanggal asli. Kondisi bank dan batas bunga penjaminan tidak digabung menjadi skor aman tunggal.

Obligasi tetap menggunakan harga indikatif per seri dari tabel BCA dan pendekatan PV terhadap yield acuan yang tersedia. Label murah/mahal adalah hasil model bersyarat, bukan harga wajar regulator, rekomendasi beli personal atau cakupan semua obligasi korporasi.

## Tambahan otomasi

Kolektor baru `lib/monetary-detail.mjs` mengambil inflasi inti dan volatile food dari analisis inflasi resmi BI sesuai periode headline, serta pertumbuhan M2 dari rilis BI yang ditemukan di daftar berita. Parser memeriksa judul/periode, angka yoy dan rentang nilai. Kegagalan mempertahankan pengamatan valid terakhir, tanpa mengganti waktu berhasil diambil.

Workflow GitHub Actions enam jam sekali dipertahankan. Vercel menyajikan snapshot tervalidasi. Browser memeriksa versi setiap dua menit ketika halaman terlihat. Pengunjung tidak melakukan scraping sumber resmi.

## Batas yang tetap perlu ditindaklanjuti

- BPS API memerlukan kredensial pemilik yang disimpan sebagai GitHub secret `BPS_API_KEY`; jangan menaruhnya pada kode publik.
- Beberapa kanal publikasi/APBN dan bank dapat timeout, mengubah format, atau memerlukan kanal akses resmi alternatif. Rute BNI/BTN yang sebelumnya menampilkan penyaringan keamanan tetap dijeda, tidak dilewati.
- Data pasar BEI dan redistribusi kuotasi memerlukan kepastian hak penggunaan.
- Registri ICOR, TFP, stress test dan indikator tanpa input tervalidasi tidak menghasilkan angka rekaan.
- Model statistik yang tersedia masih terbatas pada inflasi. Skenario pribadi bukan prediksi seluruh ekonomi.
- Pengujian sumber lokal tidak membuktikan jadwal GitHub atau deployment akun pemilik berjalan. Periksa log Actions dan kecocokan snapshot produksi.

## Menggunakan pembaruan

Ganti isi repositori lama dengan seluruh isi folder `nadi-otomatis`, termasuk `.github`, lalu commit dan push. Pertahankan koneksi proyek Vercel yang sudah ada. Jalankan workflow pembaruan secara manual sekali, periksa log, kemudian periksa situs dan `/api/health`. Status 503 pada health berarti gerbang kesiapan belum lolos; jangan mengubahnya menjadi hijau secara paksa.

Lihat `VALIDASI_7.json` untuk hasil pemeriksaan pengembangan. Paket ini tidak mengubah akun GitHub atau Vercel pemilik secara langsung.
