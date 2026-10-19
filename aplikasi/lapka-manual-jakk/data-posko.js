"use strict";

// TASPAT JAKK-PSE disalin dari DOCX contoh pengguna. JAKK-CPN memakai
// tiga bagian yang sama dan tambahan JNG-JNG dari revisi pengguna.
const DEFAULT_POSKO_TASPAT_PSE = [
  "antara sta PSE-PSE km 5+400 s.d 6+800 jalur 1, 2, 3 kecepatan 40,",
  "antara sta PSE-PSE km taspat 2 kec 20 km/jam Wesel inggris 21B1/B2 jalur 4, 5, 6, di km.6+200 - H1 di km.5+300 - H2 di km kecepatan 20,",
  "antara sta PSE-PSE km Wesel inggris 11A2/A3 ke jalur 1, 2, 3, taspat 2A di km. 5+400 Taspat 2B di km. 5+500 Taspat H1 di k kecepatan 20,"
];
const DEFAULT_POSKO_TASPAT_CPN = [
  ...DEFAULT_POSKO_TASPAT_PSE,
  "antara sta JNG-JNG km S.2 (20 KPJ) jalur hilir eksisting di km 2+600 s.d. S.2H di KM 2+200 S.2HH di KM 1+900 kecepatan 20"
];
