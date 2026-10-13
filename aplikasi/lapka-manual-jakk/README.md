# LAPKA Manual JAKK

Buka `index.html` dengan Chrome, Edge, atau Safari. Semua proses berjalan di perangkat dan tidak membutuhkan server, API key, instalasi paket, atau koneksi internet.

## Penggunaan dinas rangkaian

1. Cari nomor/nama KA, lalu pilih hasil pencarian. Nomor dan nama tetap dapat diedit.
2. Isi nama dan NIPP kru yang bertugas. **MAS, ASMAS, dan KDR selalu dicetak**, termasuk saat kosong, dengan ruang menulis nama dan NIPP tanpa titik-titik. Nama memiliki kolom sekitar 52 mm, NIPP 27 mm, dan tanggal/relasi pada kolom kanan. TKA dan PENGAWALAN hanya dicetak jika nama atau NIPP diisi; nomor urut otomatis berlanjut tanpa celah. Aturan ini berlaku pada LAPKA dinas rangkaian dan LKDR, termasuk ekspor Word.
3. Isi nomor lokomotif, lalu tempel daftar rangkaian beserta nomor urut, misalnya `1. P 01803` dan `2. T1 00904`. Hasilnya `(1) P01803, (2) T100904`. Nomor urut yang diberikan dan angka nol awal dipertahankan. Format `(1)`, `1)`, `1:`, `1-`, atau nomor diikuti spasi juga diterima. Jika tanpa nomor urut, penomoran dibuat otomatis. Periksa ringkasan sarana yang terbaca di bawah kolom.
4. Berat awal `479.7` ton mengikuti contoh; dapat diubah. TASPAT awal mengikuti contoh dan dapat diedit, ditambah, atau dihapus.
5. Catatan dan Petugas Schowing/TKA boleh kosong. Isi nama dan NIPP PPKA/PAP.
6. Pilih tab LAPKA, LKDR, **CETAK LAPKA KLB POSKO MANUAL**, atau **CETAK LAPKA LOK PULANG MANUAL**, kemudian **Cetak / Simpan PDF** atau **Unduh Word**. Setiap hasil hanya memuat dokumen yang dipilih.

## KLB Posko Manual

1. Pilih **CETAK LAPKA KLB POSKO MANUAL**.
2. Tempel WAM/PO di kolom yang tersedia. Setelah ditempel, pembacaan berjalan otomatis. Untuk perubahan yang diketik manual, klik **Baca WAM dan isi otomatis**.
3. Hanya KLB dengan asal relasi **JAKK** dan nomor **genap** yang ditampilkan. Nomor KLB dan rangkaian otomatis masuk ke formulir. Relasi laporan pengiriman rangkaian mengikuti rute pengiriman dalam WAM, termasuk rute via. Perjalanan Loks tetap memakai relasi KLB.
4. Untuk WAM PO1/167 tanggal 10 Oktober 2026, laporan **D1/10054 · JAKK - CPN (VIA THB - MATRAMAN)** memuat `(1) K108221, (2) K108602, (3) K102411`, serta **D1/10090 · JAKK - PSE** memuat `Loks`. Petak `JAKK - KPB` hanya ditampilkan sebagai keterangan sumber KLB untuk D1/10054.
5. Isi lokomotif, MAS, dan ASMAS bila tersedia. Ketiganya boleh kosong; hasil cetak menyediakan ruang tulis **tanpa titik-titik**. Posko tidak memuat kru KDR, TKA, atau PENGAWALAN, nomor dokumen dinas rangkaian, maupun berat rangkaian. Petugas Schowing dan PPKA/PAP dapat diisi nama serta NIPP.
6. **CATATAN khusus TASPAT.** JAKK - PSE otomatis memuat tiga bagian dari DOCX contoh. JAKK - CPN otomatis memuat ketiganya dan tambahan JNG - JNG dari revisi pengguna. Seluruh teks dapat diedit, ditambah, atau dihapus. Jika relasi diubah menjadi PSE/CPN, TASPAT otomatis menyesuaikan. Ungkapan kecepatan otomatis tebal.

Pembacaan WAM mendukung baris seperti `c) klb d1/10054 klb perpetak kirim rangk jakk/kpb` dan daftar pengiriman seperti `c. Jakk - Cpn (...) kirim K1 08221, K1 08602, K1 02411`. Bentuk `kirim rangkaian lintas jakk/jakg` juga didukung, termasuk jika `kirim` ditulis pada baris lanjutan sesudah `klb perpetak`. Angka dari nomor KLB dipakai, bukan ejaan angkanya. Untuk pemadanan sarana, pengiriman dengan asal, jenis, dan tujuan sama diprioritaskan. Jika tujuan petaknya berbeda, satu-satunya pengiriman berjenis sama dari JAKK dipakai, dan sumbernya ditampilkan di formulir. Jika ada beberapa pengiriman yang tidak dapat dibedakan, rangkaian dibiarkan untuk diisi manual. Daftar, sumber, dan hasil pembacaan tetap terlihat sebelum dicetak.

Isian dinas rangkaian, Posko, dan Lok Pulang dipisahkan saat berpindah tab. Rangkaian, relasi, dan TASPAT yang diedit untuk setiap pilihan KLB disimpan sementara selama halaman terbuka. Membaca WAM baru memperbarui isian berdasarkan WAM dan TASPAT awal untuk relasinya. Tanggal laporan selalu hari ini di Jakarta; tanggal PO hanya ditampilkan sebagai keterangan sumber.

Untuk cetak/PDF: gunakan **A4 portrait**, skala **100%**, dan nonaktifkan header/footer bawaan browser. Margin halaman 10 mm. Laporan ditempatkan di **separuh atas A4**; bagian bawah dibiarkan kosong. Jika isi panjang, ukuran laporan menyesuaikan ruang atas. Garis batas setengah halaman hanya muncul pada pratinjau, tidak ikut dicetak. PDF mengikuti dialog cetak perangkat. Word memakai A4 dan diunduh sebagai `.docx` asli yang dapat diedit.

Tulisan **kecepatan 20** serta nilai kecepatan lain dalam kolom TASPAT otomatis dicetak tebal. Logo KAI pada tab browser disematkan di berkas agar tetap muncul saat offline.

## Lok Pulang Manual

1. Pilih **CETAK LAPKA LOK PULANG MANUAL**, lalu cari nomor atau nama KA. Ada 24 pilihan dari kategori Lok Pulang berangkat dalam proyek JAKK sebelumnya, termasuk **L61-2 — Manahan**.
2. Nomor menggunakan akhiran **-2** sesuai keberangkatan dari JAKK. Jika mengetik `L61`, hasil menjadi `L61-2`; ini penanda keberangkatan, bukan operasi pengurangan. Awalan `D1/` dan huruf tambahan pada nomor sumber dipertahankan. Nomor sumber `L57F` ditampilkan sebagai `L57F-2` sesuai ketentuan pengguna.
3. Relasi selalu **JAKK - JNG** dan tidak dapat diubah. Hanya kolom **MAS** dan **ASMAS** yang tampil. Kedua baris selalu dicetak, termasuk ketika nama/NIPP kosong. Tersedia ruang tulis tanpa titik-titik: nama sekitar 62 mm dan kolom NIPP 27 mm. Tanggal serta relasi sejajar pada kolom sebelah kanan. Nomor urut tetap 1 MAS, 2 ASMAS, 3 LOK, 4 TASPAT, 5 Catatan.
4. Isi nomor lokomotif. Laporan Lok Pulang tidak memuat daftar sarana maupun berat rangkaian.
5. Empat TASPAT PSE/JNG yang diberikan pengguna terisi otomatis dan bisa diedit, ditambah, atau dihapus. Ungkapan **kecepatan 40** dan **kecepatan 20** dicetak tebal. Catatan perjalanan dan petugas tetap tersedia.
6. Format mengikuti `manual l plg.docx`: O.82, judul LAPKA, `DINAS LOK`, daftar bernomor, TASPAT, catatan, Petugas Schowing/TKA, PPKA/PAP, serta keterangan kru manual. Nomor dokumen `MANUAL/LAPKA/JAKK/MM/YYYY`; tanggal mengikuti hari ini di Jakarta. Data contoh nama/NIPP dan lok tidak diisi otomatis.

## Tampilan dan gulir

Pilih tombol **Terang** atau **Gelap** di bagian atas. Tema awal mengikuti pengaturan perangkat; pilihan manual tersimpan di perangkat dan dipakai saat membuka halaman kembali. Jika penyimpanan perangkat dibatasi, tombol tema tetap berfungsi selama halaman terbuka.

Gambar kartun Jakarta Kota yang diberikan pengguna menjadi **latar seluruh halaman**, mengikuti ukuran layar tanpa pengulangan. Foto tidak ditempel di header atau banner. Gambar asli disertakan tanpa perubahan; pemotongan pada layar mengikuti rasio layar. Header, banner teks, formulir, dan panel pratinjau tetap memakai warna solid dalam tema terang maupun gelap sehingga foto hanya terlihat di belakang dan di sela panel. Tema dan latar hanya tampil di layar; dokumen cetak/Word tetap putih dengan teks hitam dan penanda MANUAL merah.

Formulir dan pratinjau memakai **satu gulir halaman**. Kolom kanan tidak lagi memakai posisi sticky, sehingga kedua kolom bergerak bersama saat mouse digulir. Tautan **Lihat pratinjau** dan **Kembali ke isian** memudahkan berpindah bagian, termasuk di HP.

## Tanggal dan nomor dokumen

Tanggal selalu memakai hari sekarang di zona waktu `Asia/Jakarta`, termasuk ketika perangkat memakai zona waktu lain. Jika halaman melewati tengah malam, tanggal diperbarui otomatis. Format nomor:

- `MANUAL/LAPKA/JAKK/MM/YYYY`
- `MANUAL/LKDR/JAKK/MM/YYYY`

`MM` adalah bulan (01–12) dan `YYYY` tahun dari tanggal Jakarta saat dokumen dibuat.

## Daftar KA

`daftar-ka.js` berisi 24 pilihan dinas rangkaian berangkat berdasarkan pasangan lok dinas dalam `JAKK-Standalone.html`, versi terakhir diperbarui 3 Oktober 2026, dari proyek laporan pergerakan JAKK milik Andisa. Nomor `Lxx-1` dipetakan ke `Rxx` sesuai pasangan dinas lok/rangkaian; awalan `D1/` serta akhiran `A`/`C` dipertahankan. Nama MURIA mengikuti pembaruan pengguna per 1 Oktober 2026.

Pencarian `R7002` menemukan nomor sumber `D1/R7002A`. Alias pencarian tidak mengubah nomor pada dokumen. Nomor dan nama dapat disunting di formulir jika ada perubahan operasional. Data bukan pembaruan jadwal langsung.

Untuk menambah pilihan, tambahkan objek pada `DAFTAR_KA`:

```js
{number: "RXXXX", name: "Nama KA", relation: "JAKK - GMR", aliases: ["RXXXX"]}
```

## Berkas

- `index.html`: struktur formulir.
- `styles.css`: tampilan HP/desktop, tema, latar, ruang kru, serta format cetak.
- `theme.js`: tema perangkat, tombol dark/light, dan penyimpanan pilihan.
- `assets/background-jakk.png`: gambar latar asli dari pengguna.
- `app.js`: tanggal, pengisian, nomor urut, pratinjau, cetak, dan pembuatan DOCX.
- `daftar-ka.js`: pilihan nomor dan nama KA.
- `data-posko.js`: WAM awal yang diberikan pengguna.
- `daftar-lok-pulang.js`: 24 pilihan lok pulang dan empat TASPAT awal.
- `posko.js`: filter keberangkatan JAKK, pemadanan sarana, formulir dan ekspor Posko.

Unggah semua berkas tersebut dalam folder yang sama jika ingin dipasang di GitHub Pages atau hosting statis. Isian formulir tidak disimpan setelah halaman dimuat ulang.

Versi `LAPKA-Manual-JAKK.html` menggabungkan HTML, CSS, data KA, dan JavaScript dalam satu file. Buka langsung dengan browser tanpa mengekstrak paket.

Pemeriksaan: sintaks JavaScript, tanggal Jakarta termasuk pergantian bulan/tahun, kru kosong/parsial, urutan sarana, pemisahan laporan, serta DOCX dan hasil render Word telah diperiksa. Interaksi dan tampilan browser belum diuji langsung karena mesin browser tidak tersedia di lingkungan pengembangan.

Revisi 9 Oktober 2026: format nomor urut dan nomor sarana pada contoh pengguna sudah diuji; LAPKA/LKDR hasil DOCX dirender sebagai A4 satu halaman, dengan isi contoh berakhir pada 107,9 mm dari atas (di dalam batas 148,5 mm). Favicon KAI dan format tebal pada kecepatan sudah diverifikasi.

Pembaruan tampilan: logo KAI menggantikan tulisan JAKK pada header. Palet antarmuka memakai putih, arang, dan aksen oranye.

Revisi Posko 10 Oktober 2026: relasi JAKK - CPN via THB - Matraman, CATATAN hanya TASPAT, ruang MAS/ASMAS/LOK tanpa titik-titik, TASPAT awal per relasi, nomor genap, ambiguitas sarana, dan format tebal diperiksa. Dua hasil Word Posko dirender sebagai A4 satu halaman; teks terakhir berada pada 110,0 mm dan 104,0 mm dari atas, di dalam separuh atas A4. Mesin browser tidak tersedia untuk pemeriksaan visual dan interaksi langsung.

Revisi Lok Pulang 10 Oktober 2026: 24 nomor/nama dicocokkan dengan sumber proyek; akhiran -2, pencarian, hanya MAS/ASMAS, relasi tetap, pemisahan isian antar-tab, dan empat TASPAT diperiksa. Dua hasil Word dengan kru lengkap/kosong dirender sebagai A4 satu halaman. Teks terakhir berada pada 103,7 mm dan 95,4 mm dari atas, di dalam separuh atas A4. Tampilan/interaksi browser belum diuji langsung.

Revisi tampilan 10 Oktober 2026: kedua baris MAS/ASMAS Lok Pulang selalu tersedia dengan ruang nama/NIPP dan tanggal di kolom kanan. Word dengan isian lengkap, kosong, dan parsial dirender serta diperiksa; seluruhnya satu halaman A4 dengan akhir teks 103,7 mm dari atas. Tema perangkat, pilihan tersimpan, tombol terang/gelap, dan pembatasan penyimpanan diperiksa melalui simulasi JavaScript. Perilaku gulir menggunakan alur halaman biasa tanpa penanganan wheel khusus. Mesin browser tidak tersedia untuk uji visual/interaksi browser langsung.

Revisi WAM PO1/124 10 Oktober 2026: kata lintas di antara jenis kiriman dan relasi kini dikenali. Contoh PO tanggal 7 Oktober 2026 menghasilkan satu keberangkatan **D1/10054 · JAKK - JAKG (Jakarta Gudang)** dengan sarana **(1) GD4214090**. D1/10059 JAKG - JAKK dikecualikan karena arah masuk. TASPAT JAKK - JAKG diisi manual; tanggal laporan tetap hari ini. Pembacaan huruf besar, CRLF, baris lanjutan, pengisian formulir, serta WAM sebelumnya diperiksa.

Revisi ruang kru dan background 10 Oktober 2026: MAS, ASMAS, dan KDR dinas rangkaian tetap tersedia pada LAPKA/LKDR meskipun kosong. Kolom nama/NIPP menyediakan ruang tulis tanpa titik-titik dan tanggal berada di kanan. TKA/PENGAWALAN kosong tetap dilewati. Foto pengguna menjadi wallpaper halaman tanpa pengulangan; gambar terpisah pada banner dihapus, dan seluruh panel tetap solid.

Pemeriksaan revisi ruang kru: LAPKA/LKDR kosong dan LKDR parsial dengan TKA/PENGAWALAN dirender dan diperiksa. Ketiganya satu halaman A4; akhir teks masing-masing 106.8 mm, 106.8 mm, 114.4 mm dari atas. Nama/NIPP kosong tetap memiliki kolom tulis, NIPP dengan nol awal dipertahankan, dan nomor urut berlanjut tanpa celah. WAM PO1/124, WAM Posko sebelumnya, serta simulasi tema tetap lulus. Wallpaper dan panel diverifikasi dari struktur HTML/CSS; tampilan browser belum diuji langsung.
