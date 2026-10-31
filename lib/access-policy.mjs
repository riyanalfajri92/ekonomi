// Previously observed security screening: do not retry protected routes or evade safeguards.
// Re-enable only after a legitimate supported source/channel is established and tested.
export const PAUSED_SOURCES=new Map([
 ['deposit-bni','Rute sumber sebelumnya menampilkan penyaringan keamanan; konektor dijeda. Gunakan kanal resmi yang mengizinkan akses.'],
 ['deposit-btn','Rute sumber sebelumnya menampilkan penyaringan keamanan; konektor dijeda. Gunakan kanal resmi yang mengizinkan akses.'],
 ['health-bni','Konektor domain dijeda setelah penyaringan keamanan; laporan awal tidak dianggap feed aktif.'],
 ['health-btn','Konektor domain dijeda setelah penyaringan keamanan; laporan awal tidak dianggap feed aktif.']
]);
