# Nadi 6 — tabel perbaikan menuju target 9/10
31 Oktober 2026. Status berikut menilai bukti implementasi, bukan sertifikasi profesor atau jaminan akurasi investasi. Dokumen ini menggantikan penilaian versi 5.1 untuk paket terbaru.

**Dikerjakan** = tersedia dan diperiksa di paket. **Parsial** = tersedia tetapi cakupan atau sumber belum lengkap. **Perlu produksi** = tidak dapat dibuktikan dari lingkungan pengembangan tanpa koneksi milik pemilik. Target 9 bukan menaikkan angka penilaian sendiri; kebutuhan wajib harus memiliki bukti kelulusan.

| No | Permintaan / bidang | Perbaikan dan syarat mutu target 9 | Hasil eksekusi versi 6 |
|---:|---|---|---|
| 1 | Tujuan untuk orang awam | Satu pertanyaan utama: kondisi ekonomi, pengalaman masyarakat, pilihan pribadi. | Dikerjakan: empat navigasi dan lima bab laporan terhubung. |
| 2 | Bukan tempelan | Satu model analisis bersama; pendalaman berada pada konteks yang sama. | Dikerjakan; komposisi lama sudah dihapus pada versi 5, rumus yang benar dipertahankan. |
| 3 | Ringkasan kondisi | Angka, pembanding, tanggal dan konsekuensi langsung. | Dikerjakan: tujuh bacaan perubahan yang menghitung ulang narasinya. |
| 4 | Pertumbuhan dan penggeraknya | Pisahkan level/laju, tahunan/triwulanan, pertumbuhan/kontribusi. | Parsial: PDB, konsumsi, PMTB, pemerintah, ekspor/impor, tiga sektor dan indeks produksi tersedia. Komponen triwulanan lengkap belum terhubung. |
| 5 | Daya beli | Upah riil dihitung dari upah dan inflasi bulan sama, bukan inflasi hari ini. | Dikerjakan untuk rata-rata buruh; pembaruan upah otomatis BPS belum terbukti. Bukan median seluruh keluarga. |
| 6 | Pekerjaan | Baca TPT bersama partisipasi dan jumlah bekerja/menganggur, bukan lowongan internet. | Dikerjakan: konektor publik Kemnaker berhasil tanpa kunci; lima indikator diambil, jumlah bekerja + menganggur direkonsiliasi terhadap angkatan kerja. Ini publikasi ulang resmi, bukan sumber upah/kemiskinan. |
| 7 | Mutu kerja | Jam kerja, setengah pengangguran, informalitas, upah menurut kelompok. | Parsial: konteks tahunan pekerjaan rentan tersedia; seri domestik rinci terkini belum lengkap. |
| 8 | Kemiskinan dan ketimpangan | Periode cocok; batas kemiskinan tidak sama dengan bebas kerentanan. | Parsial: BPS kemiskinan beserta pembanding, Gini WDI/PIP dan konsumsi per kapita tersedia. BPS masih memakai data awal. |
| 9 | Isu sosial | Tunjukkan perbedaan kesempatan dan layanan, bukan rata-rata saja. | Dikerjakan sebagai konteks tahunan: air kota–desa, NEET perempuan–laki-laki, kesehatan, sanitasi dan pendidikan. Tidak dipromosikan menjadi kondisi harian. |
| 10 | Harga kebutuhan setempat | Keranjang pangan, sewa dan perbedaan wilayah yang terbarui. | Belum lengkap. Inflasi nasional tidak dijadikan pengganti keranjang keluarga atau biaya sewa lokal. |
| 11 | Fiskal seimbang dengan moneter | Penerimaan → belanja → program → pembiayaan; nominal tidak sama dengan layanan. | Dikerjakan: APBN Kita, perbandingan belanja/bansos, pagu dan sisa bersyarat; tambahan visual setiap Rp100 belanja dengan rekonsiliasi pusat + TKD. |
| 12 | Ruang fiskal lengkap | Pajak/PNBP, biaya bunga, utang, jatuh tempo, mata uang dan kewajiban kontinjensi. | Parsial: penerimaan, saldo primer, bunga tersirat dan beban penerimaan tersedia; profil utang dan jatuh tempo terstruktur belum lengkap. Tidak memberi vonis ketahanan fiskal menyeluruh. |
| 13 | Moneter dan transmisi | Hubungkan bunga/kurs/yield dengan kontrak kredit, biaya dolar dan harga aset. | Dikerjakan; sumber BI dan kurva ADB berhasil pada pemeriksaan akhir. |
| 14 | Arus asing | Instrumen dan rentang harus sama; stok kepemilikan bukan transaksi neto. | Parsial: SRBI tersedia. IHSG serta arus saham/SBN lengkap belum memiliki konektor yang tervalidasi. |
| 15 | Stabilitas keuangan | Statistik industri dan risiko sistem, bukan hanya rasio individual. | Parsial: laporan bank individual tersedia; statistik industri terkini belum lengkap. |
| 16 | Histori untuk prediksi | Data cukup panjang, definisi tepat dan celah terlihat. | Dikerjakan: 193 observasi inflasi; arsip CPI bulanan World Bank diubah menjadi yoy, disandingkan dengan publikasi domestik. Delapan bulan yang hilang tidak diisi. |
| 17 | Model prediksi | Protokol tetap, pelatihan hanya data sebelum asal ramalan, benchmark sederhana. | Dikerjakan: AR(1) 1/3/6 bulan, benchmark nilai terakhir dan median3; 156/152/146 uji pada paket hasil pengambilan ini. Bukan model seluruh ekonomi. |
| 18 | Ketidakpastian | Galat dan cakupan interval diuji, tanpa peluang buatan. | Dikerjakan sebagai riset: MAE/RMSE dan rentang galat berurutan; cakupan historis ditampilkan. Belum kalibrasi prospektif atau vintage. |
| 19 | Akuntabilitas prediksi | Perkiraan pertama tidak boleh diubah setelah hasil diketahui. | Dikerjakan: ledger per model, asal dan horizon; aktual pertama dipisahkan dari revisi. Semua catatan sesi ini tetap lokal, bukan rekam produksi. |
| 20 | Prediksi PDB/pekerjaan/kurs | Model dan histori yang benar-benar diuji untuk tiap sasaran. | Belum tersedia. Tidak mengganti ketidakhadiran model dengan narasi yang disebut ramalan. |
| 21 | Dampak ke anggaran pribadi | Hasil uang, titik impas dan tindakan yang mengikuti input. | Dikerjakan: matriks 15 kombinasi guncangan, kebutuhan pendapatan impas, kekurangan bulanan dan masa cadangan menutup defisit. |
| 22 | Banyak kalkulator gratis | Utang, arus kas, dana darurat, pendidikan, pensiun, proteksi, tujuan dan investasi. | Dikerjakan: 17 alat dan perencana terpadu; tanpa akun, input dihitung di perangkat. Tidak mengaku layanan CFP berlisensi. |
| 23 | Sepuluh bank | Tarif harus mengikuti nominal, tenor, kanal dan tanggal; bukan daftar angka promosi. | Parsial operasional: 10 pembanding. Delapan konektor pernah berhasil pada siklus pertama; pemeriksaan akhir tujuh berhasil, Panin HTTP 503, BNI/BTN dijeda. Bukan peringkat sepuluh terbesar berdasarkan aset. |
| 24 | Risiko bank di sebelah bunga | Angka CAR/NPL/likuiditas, periode, basis laporan, tren dan referensi yang berlaku. | Dikerjakan dengan kelengkapan berbeda. Enam pengambilan laporan berhasil pada siklus akhir; tidak semua bank memiliki seluruh rasio. Tidak ada skor aman palsu. |
| 25 | LPS | Batas bunga dan periode; jangan menetapkan penjaminan dari bunga saja. | Dikerjakan: pengungkapan resmi Mandiri terbaca; penilaian seluruh syarat LPS tetap terpisah. Bukan koneksi langsung regulator. |
| 26 | Harga obligasi | Harga nasabah, tanggal, bid/ask dan instrumen nyata. | Dikerjakan: tabel resmi BCA berhasil diambil langsung; 38 seri FR. Harga indikatif, bukan transaksi executable atau feed tick real-time. |
| 27 | Obligasi murah/mahal | YTM, PV, bunga berjalan, durasi dan asumsi di samping harga; data usang menahan klasifikasi. | Dikerjakan: interpolasi acuan 2/5/10 tahun, batas tanggal/tenor dan sensitivitas; histori harga mulai disimpan tanpa merekayasa masa lalu. Pajak/biaya/settlement belum lengkap. |
| 28 | Rating dan obligasi korporasi | Rating per seri, outlook, masa berlaku, agunan dan spread kredit. | Belum lengkap. Seri pemerintah tidak diberi rating korporasi rekaan atau label aman. Perlu sumber kredit/kuotasi yang sesuai. |
| 29 | Rilis berbagai lembaga | Konektor terpisah dan tanggal publikasi sebenarnya. | Parsial: BI dan Bappebti berhasil pada siklus akhir; Kemendag berhasil pada siklus pertama tetapi gagal berikutnya. Kemenkeu/OJK belum lulus pengambilan akhir. Publikasi APBN Kemenkeu terhubung terpisah. BEI belum lengkap. |
| 30 | Katadata / Google Finance / pasar prediksi | Bedakan konteks jurnalistik, data berlisensi, harga indikatif dan probabilitas pasar. | Tidak menyalin feed yang hak/definisinya belum jelas. Tidak menyebut Google Finance sebagai API obligasi Indonesia atau peluang pasar sebagai hasil model sendiri. |
| 31 | ID/EN dan identitas pembuat | Cerita, alat dan kesimpulan dapat dibaca dalam dua bahasa; tautan satu tab. | Dikerjakan; foto Riyan, bukanaktivis.id dan profil.bukanaktivis.id tetap tersedia. Judul berita asli tetap ditandai. |
| 32 | Tanggal otomatis | Pisahkan observasi, publikasi, pengambilan berhasil dan pemeriksaan. | Dikerjakan. Pengambilan arsip lama tidak mengganti timestamp angka terkini. |
| 33 | Sumber gagal / cadangan | Nilai valid terakhir bertanggal asli; satu kegagalan tidak menghapus sumber lain. | Dikerjakan dan terjadi nyata pada siklus berulang. Parser gagal atau periode mundur ditolak per seri. |
| 34 | Otomasi tanpa perintah ulang | Jadwal enam jam dan pemicu saat kode masuk; pengunjung membaca data tervalidasi. | Kode dikerjakan: Actions pada push main/master dan jadwal. Commit data tidak memicu loop. Dua siklus seluruh sumber diuji lokal; bukan bukti GitHub milik pengguna. |
| 35 | Otomasi sampai Vercel | Cocokkan identitas snapshot dan run di produksi, bukan sekadar HTTP 200. | Perlu produksi: PUBLIC_SITE_URL serta integrasi Git/hook pemilik. Skrip verifikasi dan doctor tersedia. Tidak ada push/deploy akun pemilik dari sesi ini. |
| 36 | Monitor dan pemulihan | Status keterlambatan, endpoint kesehatan dan alarm independen. | Parsial: heartbeat dan /api/health tersedia, gerbang jujur tetap 503 bila belum siap. Monitor eksternal belum dikonfigurasi. |
| 37 | Validasi statistik | Tolak tanggal mustahil/masa depan, histori konflik, kurva rusak, harga silang dan fiskal tidak cocok. | Dikerjakan; penolakan lokal tidak merusak pembaruan kelompok lain. |
| 38 | Visualisasi dan sejarah | Grafik tidak menyambung bulan hilang; CSV tidak memangkas histori diam-diam. | Dikerjakan: garis terputus pada celah; grafik 12 observasi terakhir, CSV seluruh histori tersimpan. |
| 39 | UI dan perangkat sempit | Tidak ada luapan halaman; tabel lebar menggulir di dalam wadahnya. | Diperiksa pada viewport isi 375px: beranda, prospek, kalkulator, deposito, obligasi, sumber dan planner. Cacat luapan prospek ditemukan dan diperbaiki. Bukan uji perangkat fisik atau audit aksesibilitas independen. |
| 40 | Cache dan pembaruan pembaca | Server lama tidak menimpa snapshot baru; jangan salah menyebut cache lama sebagai putus jaringan. | Dikerjakan: respons lebih lama/konflik dibedakan dari paket rusak dan kegagalan jaringan. |
| 41 | Kualitas kode dan dependensi | Tes perilaku numerik, isolasi sumber, histori dan data kosong; pemeriksaan paket. | 98 tes lulus, 64 modul lolos build; npm audit mencatat 0 kerentanan yang diketahui saat diperiksa. Ini bukan audit keamanan independen. |
| 42 | Delivery mudah dipahami | Pembaca awam dapat menjelaskan pesan, tanggal, batas dan langkah setelah membaca. | Desain dan narasi diperbaiki; studi pemahaman pembaca belum dilaksanakan. Tidak diberi nilai 9 otomatis dari penilaian pengembang sendiri. |

## Bukti dan arti hasil

`BUKTI_SUMBER.json` menyimpan ringkasan dua siklus seluruh sumber dan satu pengambilan histori. `VALIDASI.md` memuat pengujian. Timestamp sumber tetap asli dan hasil pemeriksaan dapat berubah antar siklus. Keberhasilan satu kali membuktikan konektor pernah bekerja, bukan SLA ketersediaan.

Model satu bulan pada arsip ini memiliki MAE sekitar 0,38 pp, sedikit lebih besar dari benchmark nilai terakhir sekitar 0,37 pp. Karena itu website tidak menyatakan AR(1) unggul hanya karena lebih rumit. Interval merupakan eksperimen berbasis galat historis; korelasi dan perubahan rezim dapat mengganggu cakupan. Tidak ada klaim akurasi 9/10.

## Langkah yang masih menghalangi kelulusan penuh

1. Sambungkan paket ke repo dan deployment pemilik; buktikan versi baru sampai ke domain, beberapa siklus terjadwal, kegagalan dan pemulihannya.
2. BPS_API_KEY harus disimpan sebagai Actions secret untuk seri upah/kemiskinan/PDB yang belum terhubung otomatis; pengembangan ini belum menguji kunci milik pemilik. Jangan mengirim kuncinya melalui chat atau HTML.
3. PUBLIC_SITE_URL sebagai repository variable, serta hook Vercel bila diperlukan. Jalankan `npm run doctor` dalam lingkungan yang memiliki konfigurasi tersebut. Tidak adanya variabel di lingkungan pengembangan bukan bukti pengaturan repo pemilik belum ada.
4. Lengkapi sumber yang masih parsial, khususnya profil fiskal, pasar modal/arus asing, statistik industri bank dan data lokal. Feed harus memiliki definisi dan izin yang sesuai; tidak diganti dengan angka rekaan.
5. Uji ke pembaca nyata dan lanjutkan evaluasi prospektif. Target 12 hasil prospektif adalah pilihan editorial untuk validasi lanjutan, bukan kewajiban internasional untuk menggunakan alat simulasi atau menerbitkan eksperimen berlabel jelas.

Tidak ada perubahan desain yang dapat membuktikan langkah-langkah tersebut telah berlangsung. Kode dan paket telah dikerjakan; status layanan operasional 9/10 belum disertifikasi dari sesi ini.
