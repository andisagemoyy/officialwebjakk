"use strict";

let poskoTrains = [];
let selectedPoskoNumber = "";
let poskoPoLabel = "";
let poskoTaspatRoute = "";
const workDrafts = {};
const poskoTrainDrafts = {};
const modeFieldIds = ["trainNumber","trainName","relation","locomotive","formation","weight","notes","schowingName","schowingNipp","officerName","officerNipp",...Array.from({length:5},(_,i)=>[`crewName${i}`,`crewNipp${i}`]).flat()];

function poskoFormationInput(items) {
  return items.map(item=>`${item.order}. ${item.code}`).join("\n");
}

function poskoRouteKey(relation) {
  const match=String(relation).match(/^\s*JAKK\s*[-–/]\s*([A-Z]{2,8})(?:\s*\([^)]*\))?\s*$/i);
  return match?`JAKK-${match[1].toUpperCase()}`:"";
}

function defaultPoskoTaspat(relation) {
  const key=poskoRouteKey(relation);
  return key==="JAKK-PSE"?[...DEFAULT_POSKO_TASPAT_PSE]:["JAKK-CPN","JAKK-JNG"].includes(key)?[...DEFAULT_POSKO_TASPAT_CPN]:[];
}

function setPoskoTaspat(values) {
  $("taspatFields").innerHTML="";
  for (const value of values.length?values:[""]) addTaspat(value,false);
}

function syncPoskoRelationTaspat() {
  const key=poskoRouteKey($("relation").value);
  if (!key || key===poskoTaspatRoute) return;
  poskoTaspatRoute=key;
  setPoskoTaspat(defaultPoskoTaspat($("relation").value));
}

function applyPoskoTrain(train) {
  if (selectedPoskoNumber && $("trainNumber").value.trim().toUpperCase() === selectedPoskoNumber) {
    poskoTrainDrafts[selectedPoskoNumber]={formation:$("formation").value,relation:$("relation").value,taspat:[...document.querySelectorAll(".taspat-input")].map(field=>field.value)};
  }
  const draft=poskoTrainDrafts[train.number];
  $("formation").value=draft?draft.formation:train.formation;
  $("notes").value="";
  $("relation").value=draft?draft.relation:train.relation;
  poskoTaspatRoute=poskoRouteKey($("relation").value);
  selectedPoskoNumber=train.number;
  setPoskoTaspat(draft?draft.taspat:defaultPoskoTaspat(train.relation));
}

// Membaca relasi KLB dari bagian pengumuman dan sarana dari bagian pengiriman.
// Tidak mengubah panjang nomor sarana atau menghilangkan angka nol awal.
function parseWamPosko(text) {
  const source = String(text).replace(/\r\n?/g,"\n");
  const shipments = [];
  const shipmentPattern = /^\s*[a-z]\.\s*([a-z]{2,8})\s*[-–]\s*([a-z]{2,8})\s*(\([^\n)]*\))?\s*kirim\s+([^\n]+)/gim;
  for (const match of source.matchAll(shipmentPattern)) {
    const payload = match[4].trim();
    const isLoks = /^loks?\b/i.test(payload);
    shipments.push({from:match[1].toUpperCase(),to:match[2].toUpperCase(),isLoks,
      formation:isLoks?[]:parseFormation(payload),via:(match[3]||"").replace(/^\(|\)$/g,""),payload,
      original:match[0].trim()});
  }
  const trains = [], excluded = [], seen = new Map(), conflicts = new Set();
  const pattern = /\b(D\d+\s*\/\s*\d{4,6})\s*\)?\s*(?:klb\s+)?(?:perpetak\s+)?kirim\s+(rangk(?:aian)?|loks?|kereta)\s+(?:lintas\s+)?([a-z]{2,8})\s*[\/-]\s*([a-z]{2,8})([^\n]*)/gi;
  for (const match of source.matchAll(pattern)) {
    const number = match[1].replace(/\s/g,"").toUpperCase();
    const from = match[3].toUpperCase(), to = match[4].toUpperCase();
    if (from !== "JAKK" || Number(number.slice(-1)) % 2 !== 0) {
      excluded.push(number); continue;
    }
    const isLoks = /^lok/i.test(match[2]);
    const petakRelation = `${from} - ${to}`;
    if (seen.has(number)) {
      if (seen.get(number) !== petakRelation) conflicts.add(number);
      continue;
    }
    seen.set(number,petakRelation);
    const candidates = shipments.filter(item=>item.from===from && item.isLoks===isLoks);
    const exact = candidates.filter(item=>item.to===to);
    // CPN (depo) dan JNG (stasiun) satu kelompok tujuan untuk pemadanan WAM.
    // Nama relasi tetap memakai kode tujuan yang tertulis pada pengiriman.
    const equivalent=exact.length===0&&["CPN","JNG"].includes(to)?candidates.filter(item=>["CPN","JNG"].includes(item.to)):[];
    const matches=exact.length?exact:equivalent;
    const shipment = matches.length===1?matches[0]:matches.length===0&&candidates.length===1?candidates[0]:null;
    const inline = isLoks?[]:parseFormation(match[5]);
    const formation = inline.length?inline:shipment?shipment.formation:[];
    const relation = shipment?`${shipment.from} - ${shipment.to}${shipment.via?` (${shipment.via.toUpperCase()})`:""}`:petakRelation;
    trains.push({number,name:isLoks?"KLB Posko · Loks":"KLB Posko · Rangkaian",relation,petakRelation,isLoks,
      aliases:[number.split("/")[1],from,to,...(shipment?[shipment.to]:[])],formation:isLoks?"Loks":poskoFormationInput(formation),
      source: inline.length?"Nomor sarana tercantum pada baris KLB dalam WAM.":shipment?`Pengiriman dalam WAM: ${shipment.original}`:isLoks?"WAM menyebut perjalanan Loks.":"Nomor sarana belum dapat dipasangkan. Isi manual sesuai WAM.",
      inferred:Boolean(shipment && shipment.to!==to && !inline.length)});
  }
  const po = source.match(/\bpo\d+\s*\/\s*\d+\b/i);
  const date = source.match(/\b(\d{1,2})\/(\d{1,2})\s*-?\s*['’]?\s*(\d{4}|\d{2})\b/);
  return {trains:trains.filter(train=>!conflicts.has(train.number)),shipments,excluded,conflicts:[...conflicts],
    label:[po?po[0].replace(/\s/g,"").toUpperCase():"",date?date[0]:""].filter(Boolean).join(" · ")};
}

function workModeKey(type) {return type==="POSKO"?"POSKO":type==="LOKPULANG"?"LOKPULANG":"REGULAR";}

function saveWorkMode() {
  workDrafts[workModeKey(activeType)] = {
    fields:Object.fromEntries(modeFieldIds.map(id=>[id,$(id).value])),
    taspat:[...document.querySelectorAll(".taspat-input")].map(field=>field.value),search:$("trainSearch").value
  };
}

function restoreWorkMode() {
  const mode = workModeKey(activeType);
  const draft = workDrafts[mode];
  $("taspatFields").innerHTML = "";
  if (draft) {
    for (const id of modeFieldIds) $(id).value=draft.fields[id]??"";
    $("trainSearch").value=draft.search;
    for (const value of draft.taspat) addTaspat(value,false);
    if (activeType==="POSKO") poskoTaspatRoute=poskoRouteKey($("relation").value);
  } else {
    for (const id of modeFieldIds) $(id).value="";
    $("weight").value="479.7";
    if (mode==="LOKPULANG") {
      $("relation").value="JAKK - JNG";
      for (const value of DEFAULT_LOK_PULANG_TASPAT) addTaspat(value,false);
      selectTrain(DAFTAR_LOK_PULANG.find(train=>train.number==="L61-2")||DAFTAR_LOK_PULANG[0]);
    } else if (mode==="POSKO") {
      $("relation").value="JAKK - ";
      addTaspat("",false);
      if (poskoTrains.length) selectTrain(poskoTrains[0]);
    } else {
      addTaspat(DEFAULT_TASPAT,false);
      selectTrain(DAFTAR_KA[0]);
    }
  }
  if (mode==="LOKPULANG") $("relation").value="JAKK - JNG";
  $("validationMessage").hidden=true;
  modeFieldIds.forEach(id=>$(id).removeAttribute("aria-invalid"));
  closeOptions();
}

function configureWorkMode() {
  const posko = activeType==="POSKO";
  const lokPulang = activeType==="LOKPULANG";
  document.querySelectorAll(".posko-only").forEach(element=>element.hidden=!posko);
  document.querySelectorAll(".lok-pulang-only").forEach(element=>element.hidden=!lokPulang);
  $("trainNameField").hidden=posko;
  $("trainName").required=!posko;
  $("weightField").hidden=posko||lokPulang;
  $("formationFields").hidden=lokPulang;
  $("formation").required=!lokPulang;
  $("locomotiveSectionTitle").textContent=lokPulang?"Lokomotif":"Lokomotif dan rangkaian";
  $("relation").readOnly=lokPulang;
  $("notesField").hidden=posko;
  $("taspatSectionTitle").textContent=posko?"TASPAT":"TASPAT dan catatan";
  $("weight").required=!posko&&!lokPulang;
  $("locomotive").required=!posko;
  $("locomotiveLabel").textContent=posko?"Nomor lokomotif · boleh dikosongkan":"Nomor lokomotif";
  $("trainNumberLabel").textContent=posko?"Nomor KLB genap":lokPulang?"Nomor KA lok pulang":"Nomor KA";
  $("trainSectionTitle").textContent=posko?"KLB berangkat dari JAKK":lokPulang?"Lok pulang JAKK–JNG":"Kereta api";
  $("trainSearchLabel").textContent=posko?"Pilih nomor KLB atau relasi dari WAM":lokPulang?"Cari nomor atau nama lok pulang":"Cari nomor atau nama KA";
  $("trainSearch").placeholder=posko?"Contoh: 10054, 10090, JAKK - PSE":lokPulang?"Contoh: L61-2, L63, L7001, Manahan":"Contoh: R26, R14, R7002, Muria";
  $("trainNumber").placeholder=lokPulang?"L61-2":"R26";
  $("formation").placeholder=posko?"Terisi dari WAM, atau isi nomor sarana manual.\nUntuk lokomotif saja: Loks":"1. P 01803\n2. T1 00904\n3. K1 02346\n4. K1 02529";
  $("crewHint").textContent=posko?"Hanya MAS dan ASMAS. Boleh kosong; tersedia ruang tulis untuk bolpoin pada hasil cetak.":lokPulang?"Hanya MAS dan ASMAS. Jika kosong, kedua baris tetap tampil dengan ruang tulis nama dan NIPP. Tanggal berada di sebelah kanan.":"MAS, ASMAS, dan KDR tetap dicetak dengan ruang nama/NIPP jika kosong. TKA dan PENGAWALAN hanya tampil jika diisi.";
  [...document.querySelectorAll(".crew-row")].forEach((row,i)=>{row.hidden=(posko||lokPulang)&&i>1;row.querySelectorAll("input").forEach(field=>field.disabled=(posko||lokPulang)&&i>1);});
  $("schowingHeading").innerHTML=posko?'Petugas Schowing <span class="optional">opsional</span>':'Petugas Schowing / TKA <span class="optional">opsional</span>';
}

function readWamPosko(initial=false) {
  const parsed = parseWamPosko($("wamText").value);
  if (!initial && !$("wamText").value.trim()) {
    $("wamStatus").textContent="Tempel isi WAM terlebih dahulu.";
    $("wamStatus").dataset.error="true";return;
  }
  poskoTrains=parsed.trains;poskoPoLabel=parsed.label;
  if (!initial) {Object.keys(poskoTrainDrafts).forEach(key=>delete poskoTrainDrafts[key]);selectedPoskoNumber="";}
  $("wamStatus").dataset.error=String(!poskoTrains.length);
  $("wamStatus").textContent=`${parsed.label?parsed.label+" · ":""}${poskoTrains.length} KLB genap berangkat dari JAKK terbaca.${parsed.conflicts.length?" Nomor dengan relasi berbeda diabaikan: "+parsed.conflicts.join(", ")+".":""}${!poskoTrains.length?" Periksa format WAM, atau isi nomor KLB, relasi, dan rangkaian manual.":""} Tanggal LAPKA otomatis mengikuti hari ini di Jakarta.`;
  if (!initial && activeType==="POSKO") {
    const preferred=poskoTrains.find(train=>train.number===$("trainNumber").value.trim().toUpperCase())||poskoTrains[0];
    if (preferred) selectTrain(preferred);
    else {$("trainNumber").value="";$("trainName").value="";$("relation").value="JAKK - ";$("formation").value="";$("notes").value="";$("trainSearch").value="";selectedPoskoNumber="";render();}
  }
  renderPoskoSummary();
}

function renderPoskoSummary() {
  const current=$("trainNumber").value.trim().toUpperCase();
  $("wamSummary").innerHTML=poskoTrains.map((train,i)=>`<button type="button" class="wam-entry" data-posko-index="${i}" aria-pressed="${train.number===current}"><strong>${escapeHTML(train.number)} · ${escapeHTML(train.relation)}</strong><span>${escapeHTML(train.formation.replace(/\n/g,", ")||"Rangkaian perlu diisi manual")}</span></button>`).join("");
  const selected=poskoTrains.find(train=>train.number===current);
  $("poskoFormationSource").textContent=selected?`${selected.source}${selected.inferred?`\nPetak KLB: ${selected.petakRelation}. Relasi laporan: ${selected.relation}.`:""}`:"Rangkaian diisi manual. Nomor sarana dan nomor urut akan dipakai pada hasil cetak.";
}

function validatePosko() {
  const data=formData(), problems=[];
  for (const id of ["trainNumber","relation","formation"]) $(id).removeAttribute("aria-invalid");
  if (!/^D\d+\/\d{4,6}$/.test(data.number) || Number(data.number.slice(-1))%2!==0) problems.push(["trainNumber","Gunakan nomor KLB genap, misalnya D1/10054."]);
  if (!poskoRouteKey(data.relation)) problems.push(["relation","Relasi harus berangkat dari JAKK, misalnya JAKK - CPN (via THB - MATRAMAN)."]);
  const formation=data.formation;
  if (!data.isLoks && (!formation.length || formation.some(item=>!Number.isSafeInteger(item.order)||item.order<1) || new Set(formation.map(item=>item.order)).size!==formation.length)) problems.push(["formation","Isi nomor sarana dengan nomor urut yang berbeda, atau tulis Loks untuk lokomotif saja."]);
  if (problems.length) {
    problems.forEach(([id])=>$(id).setAttribute("aria-invalid","true"));
    $("validationMessage").textContent=problems.map(item=>item[1]).join(" ");$("validationMessage").hidden=false;
    $(problems[0][0]).scrollIntoView({block:"center",behavior:"smooth"});$(problems[0][0]).focus({preventScroll:true});return false;
  }
  $("validationMessage").hidden=true;return true;
}

function initPosko() {
  $("wamText").value="";
  $("wamStatus").dataset.error="false";
  $("wamStatus").textContent="Tempel WAM / PO untuk mengisi nomor KLB, relasi, dan rangkaian secara otomatis.";
  renderPoskoSummary();
  $("readWam").addEventListener("click",()=>readWamPosko());
  $("wamText").addEventListener("paste",()=>setTimeout(()=>readWamPosko(),0));
  $("wamText").addEventListener("input",()=>{$("wamStatus").textContent="WAM berubah. Klik Baca WAM untuk memperbarui nomor KLB dan rangkaian.";});
  $("wamSummary").addEventListener("click",event=>{const button=event.target.closest("[data-posko-index]");if(button&&activeType==="POSKO")selectTrain(poskoTrains[Number(button.dataset.poskoIndex)]);});
}
