"use strict";

// Lok pulang dari JAKK-Standalone.html versi 3 (3 Oktober 2026).
// Hanya kategori Lok Pulang, action Ber; lok dinas/KA langsir tidak disertakan.
// L57F pada sumber diberi akhiran -2 sesuai ketentuan pengguna.
const DAFTAR_LOK_PULANG = [
  {
    "number": "L25-2",
    "name": "MURIA",
    "relation": "JAKK - JNG",
    "aliases": [
      "L25-2",
      "L25"
    ],
    "sourceNumber": "L25-2"
  },
  {
    "number": "L127-2",
    "name": "Pangandaran",
    "relation": "JAKK - JNG",
    "aliases": [
      "L127-2",
      "L127"
    ],
    "sourceNumber": "L127-2"
  },
  {
    "number": "L57F-2",
    "name": "Purwojaya",
    "relation": "JAKK - JNG",
    "aliases": [
      "L57F"
    ],
    "sourceNumber": "L57F"
  },
  {
    "number": "L35-2",
    "name": "Gajayana",
    "relation": "JAKK - JNG",
    "aliases": [
      "L35-2",
      "L35"
    ],
    "sourceNumber": "L35-2"
  },
  {
    "number": "L45-2",
    "name": "Taksaka",
    "relation": "JAKK - JNG",
    "aliases": [
      "L45-2",
      "L45"
    ],
    "sourceNumber": "L45-2"
  },
  {
    "number": "L15-2",
    "name": "Argo Dwipangga",
    "relation": "JAKK - JNG",
    "aliases": [
      "L15-2",
      "L15"
    ],
    "sourceNumber": "L15-2"
  },
  {
    "number": "L19-2",
    "name": "MURIA",
    "relation": "JAKK - JNG",
    "aliases": [
      "L19-2",
      "L19"
    ],
    "sourceNumber": "L19-2"
  },
  {
    "number": "L37-2",
    "name": "Brawijaya",
    "relation": "JAKK - JNG",
    "aliases": [
      "L37-2",
      "L37"
    ],
    "sourceNumber": "L37-2"
  },
  {
    "number": "L31-2",
    "name": "Pandalungan",
    "relation": "JAKK - JNG",
    "aliases": [
      "L31-2",
      "L31"
    ],
    "sourceNumber": "L31-2"
  },
  {
    "number": "L41-2",
    "name": "Sembrani",
    "relation": "JAKK - JNG",
    "aliases": [
      "L41-2",
      "L41"
    ],
    "sourceNumber": "L41-2"
  },
  {
    "number": "L3-2",
    "name": "Anggrek",
    "relation": "JAKK - JNG",
    "aliases": [
      "L3-2",
      "L3"
    ],
    "sourceNumber": "L3-2"
  },
  {
    "number": "L63-2",
    "name": "Manahan",
    "relation": "JAKK - JNG",
    "aliases": [
      "L63-2",
      "L63"
    ],
    "sourceNumber": "L63-2"
  },
  {
    "number": "D1/L7001A-2",
    "name": "Gajayana Tambahan",
    "relation": "JAKK - JNG",
    "aliases": [
      "D1/L7001A-2",
      "D1/L7001A",
      "L7001A"
    ],
    "sourceNumber": "D1/L7001A-2"
  },
  {
    "number": "L17-2",
    "name": "MURIA",
    "relation": "JAKK - JNG",
    "aliases": [
      "L17-2",
      "L17"
    ],
    "sourceNumber": "L17-2"
  },
  {
    "number": "D1/L7007C-2",
    "name": "Tambahan YK - GMR",
    "relation": "JAKK - JNG",
    "aliases": [
      "D1/L7007C-2",
      "D1/L7007C",
      "L7007C"
    ],
    "sourceNumber": "D1/L7007C-2"
  },
  {
    "number": "L133-2",
    "name": "Parahyangan",
    "relation": "JAKK - JNG",
    "aliases": [
      "L133-2",
      "L133"
    ],
    "sourceNumber": "L133-2"
  },
  {
    "number": "L13-2",
    "name": "Argo Lawu",
    "relation": "JAKK - JNG",
    "aliases": [
      "L13-2",
      "L13"
    ],
    "sourceNumber": "L13-2"
  },
  {
    "number": "L137-2",
    "name": "Parahyangan",
    "relation": "JAKK - JNG",
    "aliases": [
      "L137-2",
      "L137"
    ],
    "sourceNumber": "L137-2"
  },
  {
    "number": "L39-2",
    "name": "Sembrani",
    "relation": "JAKK - JNG",
    "aliases": [
      "L39-2",
      "L39"
    ],
    "sourceNumber": "L39-2"
  },
  {
    "number": "D1/L75-2",
    "name": "Mataram",
    "relation": "JAKK - JNG",
    "aliases": [
      "D1/L75-2",
      "D1/L75",
      "L75"
    ],
    "sourceNumber": "D1/L75-2"
  },
  {
    "number": "L1-2",
    "name": "Anggrek",
    "relation": "JAKK - JNG",
    "aliases": [
      "L1-2",
      "L1"
    ],
    "sourceNumber": "L1-2"
  },
  {
    "number": "L61-2",
    "name": "Manahan",
    "relation": "JAKK - JNG",
    "aliases": [
      "L61-2",
      "L61"
    ],
    "sourceNumber": "L61-2"
  },
  {
    "number": "L29F-2",
    "name": "Argo Anjasmoro",
    "relation": "JAKK - JNG",
    "aliases": [
      "L29F-2",
      "L29F"
    ],
    "sourceNumber": "L29F-2"
  },
  {
    "number": "D1/L7049-2",
    "name": "Pandalungan",
    "relation": "JAKK - JNG",
    "aliases": [
      "D1/L7049-2",
      "D1/L7049",
      "L7049"
    ],
    "sourceNumber": "D1/L7049-2"
  }
];

// Empat TASPAT JAKK-JNG yang diberikan pengguna.
const DEFAULT_LOK_PULANG_TASPAT = [...DEFAULT_POSKO_TASPAT_CPN];
