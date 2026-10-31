# Memasang versi baru pada repositori ekonomi yang sama

Paket ini belum mengubah repositori GitHub atau deployment Vercel Anda. Langkah berikut memasang perubahan ke proyek yang sudah ada.

1. Di GitHub Desktop pilih repositori **ekonomi**. Klik **Fetch origin**, lalu **Pull origin** bila tersedia. Ini mengambil perubahan snapshot yang mungkin dibuat bot.
2. Simpan salinan folder repositori sebagai cadangan bila ada perubahan pribadi. Jika GitHub Desktop menunjukkan perubahan pribadi yang belum disimpan, commit perubahan itu terlebih dahulu.
3. Ekstrak ZIP terbaru dan buka folder `nadi-otomatis`. Tampilkan berkas tersembunyi di Finder dengan **Command + Shift + titik**.
4. Salin isi proyek ke dalam folder repositori **ekonomi** yang sama. Gabungkan subfolder dan ganti berkas proyek yang namanya sama. Jangan menghapus atau mengganti folder `.git` milik repositori. Berkas `.gitattributes` yang dibuat GitHub Desktop boleh tetap ada.
5. Pastikan `package-lock.json`, `lib/extensions.mjs`, `lib/forecast.mjs`, `public/content.js`, dan `.github/workflows/update-data.yml` ikut masuk. Mengganti `index.html` saja tidak cukup.
6. Kembali ke GitHub Desktop. Isi Summary **Perbarui Nadi: ID-EN, deposito, APBN dan prospek**, lalu **Commit to main → Push origin**.
7. Vercel akan membangun versi baru. Pengaturan tetap **Other**, `npm run build`, output `public`, Node **24.x**. Jangan membuat proyek baru. Tunggu sampai status Ready; jika gagal, baca deployment log.
8. Buka web dan coba tombol **EN**, menu **Deposito**, **Prospek & sinyal**, serta **Sumber & status**. Pastikan header tidak hanya menggunakan snapshot cadangan tanpa menyadarinya.
9. GitHub → Actions → **Perbarui data ekonomi → Run workflow**. Versi baru menjalankan `npm ci` sebelum pembaruan. Periksa job hijau dan commit snapshot; jangan hanya mengandalkan jadwal yang belum pernah diuji.

Setelah terpasang, program mengambil pembaruan sumber dan menghitung ulang tampilan. Tidak perlu mengedit angka tiap hari. Jika penyedia mengubah format atau memblokir akses, konektor tetap dapat memerlukan pemeliharaan; web menunjukkan status gagal dan tanggal data terakhir.

### Tambahan versi ini

Salin juga `public/planner.js`, `public/bonds.js`, `lib/fiscal-detail.mjs` dan pengujian barunya. Menu Lab keuangan sekarang memiliki perencana terpadu; menu Obligasi memiliki simulator valuasi dengan angka ilustrasi. Input pribadi tidak dikirim ke server. Baca batas cakupan terbaru di VALIDASI.md sebelum mengumumkan fitur.

### Foto pembuat

Bagian “Di balik Nadi” ditampilkan di dekat footer, dalam ID/EN. Sertakan folder `public/assets` ketika menyalin pembaruan. Foto asli ada di `public/assets/riyan-al-fajri.png`; tampilan memakai CSS dan pemuatan malas. Kedua tautan pembuat terbuka pada tab yang sama.
