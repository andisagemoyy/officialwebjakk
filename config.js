/* Ubah bagian url jika nama folder atau nama file aplikasimu berbeda.
   Path relatif dihitung dari index.html halaman utama.
   Semua file pendukung aplikasi harus ikut dimasukkan ke foldernya. */
window.JAKK_APPS = [
  { id: 'lapka', title: 'LAPKA MANUAL JAKK', category: 'Administrasi', description: 'Aplikasi pembuatan lapka manual stasiun jakarta kota', icon: 'document', url: 'aplikasi/lapka-manual-jakk/index.html' },
  { id: 'laporan', title: 'LAPORAN KERETA API', category: 'Pelaporan', description: 'Aplikasi laporan keberangkatan/kedatangan kereta api di grup WA', icon: 'clipboard', url: 'aplikasi/laporan-kereta-api/index.html' },
  { id: 'jadwal', title: 'PANTAUAN JADWAL KA JAKK', category: 'Jadwal', description: 'Aplikasi pantauan jam datang dan berangkat kereta api termasuk KRL.', icon: 'clock', url: 'aplikasi/pantauan-jadwal-ka-jakk/index.html' },
  { id: 'rolink', title: 'PANTAUAN KERETA (ROLINK)', category: 'Pantauan', description: 'Aplikasi untuk membuat pantauan kereta api jarak jauh untuk besok.', icon: 'train', url: 'aplikasi/pantauan-kereta-rolink/index.html' },
  { id: 'langsir', title: 'FORM LANGSIR KERTAS TIKET', category: 'Langsir', description: 'Aplikasi pembuatan form langsir dengan kertas 2 ply.', icon: 'ticket', url: 'aplikasi/form-langsir-kertas-tiket/index.html' },
  { id: 'sf-keberangkatan', title: 'PANTAUAN SF KEBERANGKATAN KERETA JAKK', category: 'Stamformasi', description: 'Akses aplikasi pantauan stamformasi (SF) kereta untuk keberangkatan dari Jakarta Kota.', icon: 'train', url: 'aplikasi/pantauan-sf-keberangkatan-jakk/index.html' }
];
