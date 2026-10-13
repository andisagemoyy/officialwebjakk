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

// WAM/PO yang diberikan pengguna. Dapat diganti dengan WAM berikutnya di formulir.
const DEFAULT_WAM_POSKO = `PO d      jakarta          po1/167      10/10-'26         1215

=cta=
ks/b cpn jng pse kmo kpb jakk jakg ac tpk
by mri

1. menunjuk nota dinas kupt depo kereta jakarta no.40/KT.204/X/DO.1/2026
   tanggal 10 oktober 2026 perihal PO1 pengiriman / penarikan kereta
   lok posko pagi dan sore dengan rute sbb :
   a. Cpn - Jakg kirim K1 018136 (tidak lepas Jakg) P 06403
   b. Jakg - Jakk kirim K1 018136
   c. Jakk - Cpn kirim K1 08221 (tidak lepas Cpn) K1 08602, K1 02411
   d. Cpn - Jakk kirim K1 08221
   e. Jakk - Tpk kirim Loks
   f. Tpk - Jakg kirim Gd 421017, Gd 4214283, Gd 4214384, Gd 421019, Gd 4214274
   g. Jakg - Pse kirim Loks
   h. Pse - Cpn kirim P 06702

2. terkait point 1 (satu) diatas ks/b cpn jng pse kmo kpb jakk jakg ac tpk
   hi sabtu, 10 oktober 2026 untuk atur pengumuman perjalanan klb sbb :
   a) klb d1/satu nol nol empat tujuh (klb d1/10047) klb perpetak kirim rangk jng/kpb
      langsiran jakg
   b) klb d1/satu nol nol lima sembilan (klb d1/10059) klb perpetak kirim rangk kpb/jakk
   c) klb d1/satu nol nol lima empat (klb d1/10054) klb perpetak kirim rangk jakk/kpb
   d) klb d1/satu nol nol empat empat (klb d1/10044) klb perpetak kirim rangk kpb/mri
      via 
   e) klb d1/satu nol nol tujuh delapan (klb d1/10078) klb perpetak kirim rangk mri/jng
   f) klb d1/satu nol nol tujuh tiga (klb d1/10073) klb perpetak kirim rangk jng/jakk
   g) klb d1/satu nol nol sembilan nol (klb d1/10090) klb perpetak kirim loks jakk/pse
   h) klb d1/satu nol satu dua sembilan (klb d1/10129) klb perpetak kirim loks pse/tpk
   i) klb d1/satu nol satu dua empat (klb d1/10124) klb perpetak kirim rangk tpk/pse
   j) klb d1/satu nol satu tiga tujuh (klb d1/10137) klb perpetak kirim rangk pse/kpb
      langsiran jakg
   k) klb d1/satu nol satu tiga empat (klb d1/10134) klb perpetak kirim loks kpb/pse
   l) klb d1/satu nol nol enam dua (klb d1/10062) klb perpetak kirim rangk pse/jng

3. ks/b ppka cpn jng pse kmo kpb jakk jakg ac tpk pengumuman perjalanan klb perpetak
   diatas mengacu pada pd.19 jilid 1 pasal 20 dan pasal 24

4. kdt kupt crew ka cpn thb puk pse jakk jakg tpk siapkan sarana dan awak ka nya

5. pusdalopka 1 jak atur dan kendalikan perka agar tetap aman lancar dan terkendali
kadaop 1 jak
cc yth :
1. deputi 1.1 dan 1.2 daop 1 jak
2. man op opsar sar ang daop 1 jak
3. kapusdalopka 1 jak
4. qc op jj stl laa sar daop 1 jak
5. asman perka opsar 1 jak`;
