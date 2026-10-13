"use strict";

const ROLES = ["MAS", "ASMAS", "KDR", "TKA", "PENGAWALAN"];
const DEFAULT_TASPAT = "antara sta JAKK-GMR km 0+300 kecepatan 20";
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const $ = id => document.getElementById(id);
const escapeHTML = text => String(text ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[char]));
const escapeXML = escapeHTML;
let activeType = "LAPKA";
let lastDate = "";
let taspatCounter = 0;
let options = [];
let optionIndex = -1;
let toastTimer;
const originalTitle = document.title;

function jakartaDate(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Jakarta", year:"numeric", month:"2-digit", day:"2-digit"}).formatToParts(now).filter(part => part.type !== "literal").map(part => [part.type, part.value]));
  return {iso:`${parts.year}-${parts.month}-${parts.day}`, month:parts.month, year:parts.year, day:parts.day, text:`${parts.day} ${MONTHS[Number(parts.month)-1]} ${parts.year}`};
}

function buildCrewFields() {
  $("crewFields").innerHTML = ROLES.map((role, i) => `<div class="crew-row"><span class="crew-role">${role}</span><label><span class="sr-only">Nama ${role}</span><input id="crewName${i}" placeholder="Nama" aria-label="Nama ${role}"></label><label><span class="sr-only">NIPP ${role}</span><input id="crewNipp${i}" placeholder="NIPP" inputmode="numeric" spellcheck="false" aria-label="NIPP ${role}"></label></div>`).join("");
}

function addTaspat(value = "", focus = true) {
  const id = ++taspatCounter;
  const row = document.createElement("div");
  row.className = "taspat-row";
  row.innerHTML = `<div class="taspat-label"><label for="taspat${id}">TASPAT</label><button class="remove-taspat" type="button" aria-label="Hapus TASPAT">Hapus</button></div><textarea id="taspat${id}" class="taspat-input" rows="2" placeholder="Lokasi, kilometer, dan batas kecepatan"></textarea>`;
  row.querySelector("textarea").value = value;
  row.querySelector("button").addEventListener("click", () => {row.remove(); renameTaspat(); render(); $("addTaspat").focus();});
  $("taspatFields").appendChild(row);
  renameTaspat();
  render();
  if (focus) row.querySelector("textarea").focus();
}

function renameTaspat() {
  document.querySelectorAll(".taspat-row").forEach((row, index) => {
    row.querySelector("label").textContent = `TASPAT ${index+1}`;
    row.querySelector("button").setAttribute("aria-label", `Hapus TASPAT ${index+1}`);
  });
}

function selectTrain(train) {
  if (activeType === "POSKO") applyPoskoTrain(train);
  $("trainNumber").value = train.number;
  $("trainName").value = train.name;
  if (activeType !== "POSKO") $("relation").value = activeType==="LOKPULANG"?"JAKK - JNG":train.relation;
  $("trainSearch").value = `${train.number} · ${train.name}`;
  if (activeType === "POSKO") {
    selectedPoskoNumber = train.number;
  }
  closeOptions();
  render();
}

function showOptions() {
  const currentLabel = `${$("trainNumber").value} · ${$("trainName").value}`;
  const query = $("trainSearch").value.trim() === currentLabel ? "" : $("trainSearch").value.trim().toLocaleLowerCase("id");
  const roster = activeType === "POSKO" ? poskoTrains : activeType==="LOKPULANG" ? DAFTAR_LOK_PULANG : DAFTAR_KA;
  options = roster.filter(train => !query || [train.number, train.name, train.relation, ...train.aliases].some(value => value.toLocaleLowerCase("id").includes(query)));
  optionIndex = -1;
  $("trainOptions").innerHTML = options.length ? options.map((train, i) => `<button type="button" class="train-option" id="trainOption${i}" role="option" aria-selected="false" data-index="${i}"><span>${escapeHTML(train.number)} · ${escapeHTML(train.name)}</span><small>${escapeHTML(train.relation)}</small></button>`).join("") : '<p class="empty-options">Tidak ditemukan. Isi nomor dan nama KA di kolom bawah.</p>';
  $("trainOptions").hidden = false;
  $("trainSearch").setAttribute("aria-expanded", "true");
  $("trainSearch").removeAttribute("aria-activedescendant");
}

function closeOptions() {
  $("trainOptions").hidden = true;
  $("trainSearch").setAttribute("aria-expanded", "false");
  $("trainSearch").removeAttribute("aria-activedescendant");
}

function searchKeyboard(event) {
  if (event.key === "Escape") return closeOptions();
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if ($("trainOptions").hidden) showOptions();
    if (!options.length) return;
    optionIndex = event.key === "ArrowDown" ? (optionIndex+1)%options.length : (optionIndex <= 0 ? options.length-1 : optionIndex-1);
    document.querySelectorAll(".train-option").forEach((option, i) => {option.classList.toggle("active", i === optionIndex); option.setAttribute("aria-selected", String(i === optionIndex));});
    $("trainSearch").setAttribute("aria-activedescendant", `trainOption${optionIndex}`);
    $(`trainOption${optionIndex}`).scrollIntoView({block:"nearest"});
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (!$("trainOptions").hidden && options.length) {selectTrain(options[Math.max(optionIndex,0)]); $("trainSearch").focus();}
  }
}

function parseFormation(value) {
  // Contoh: "1. P 01803", "2. T1 00904", "(3) K102346".
  // Spasi di dalam nomor sarana disatukan; angka nol awal tetap berupa teks.
  const source = String(value).toUpperCase().replace(/\r\n?/g, "\n")
    .replace(/[ \t]+(?=\d+\s*[.):\-]\s*[A-Z])/g, "\n");
  const pattern = /(?:(?:\(\s*(\d+)\s*\)|(\d+)\s*[.):\-]\s*|(\d+)\s+(?=[A-Z]))\s*)?(\b[A-Z]{1,3}(?:[ \t]*\d+)+)\b/g;
  const result = [];
  let nextOrder = 1;
  for (const match of source.matchAll(pattern)) {
    const code = match[4].replace(/[ \t]+/g, "");
    if ((code.match(/\d/g) || []).length < 4) continue;
    const explicit = match[1] || match[2] || match[3];
    const order = explicit ? Number(explicit) : nextOrder;
    result.push({order, code});
    nextOrder = order + 1;
  }
  return result;
}

function speedParts(text) {
  const result = [];
  const pattern = /\bkecepatan\s+\d+(?:[.,]\d+)?(?:\s*km\s*\/\s*jam)?/gi;
  let position = 0;
  for (const match of String(text).matchAll(pattern)) {
    if (match.index > position) result.push({text:text.slice(position,match.index),bold:false});
    result.push({text:match[0],bold:true});
    position = match.index+match[0].length;
  }
  if (position < text.length) result.push({text:text.slice(position),bold:false});
  return result;
}
function taspatHTML(text) {
  return speedParts(text).map(part => part.bold ? `<strong>${escapeHTML(part.text)}</strong>` : escapeHTML(part.text)).join("");
}

function formData() {
  const date = jakartaDate();
  const value = id => $(id).value.trim();
  return {
    date, type:activeType,
    number:activeType==="LOKPULANG"?normalizeLokPulangNumber(value("trainNumber")):value("trainNumber").toUpperCase(), name:value("trainName").toUpperCase(), relation:activeType==="LOKPULANG"?"JAKK - JNG":value("relation").toUpperCase(),
    crew:ROLES.map((role,i) => ({role, name:value(`crewName${i}`).toUpperCase(), nipp:value(`crewNipp${i}`)})).filter((person,i) => ["POSKO","LOKPULANG"].includes(activeType) ? i < 2 : i < 3 || person.name || person.nipp),
    isLoks:/^loks?\.?$/i.test(value("formation")),
    locomotive:value("locomotive").toUpperCase(), formation:parseFormation(value("formation")), weight:value("weight").replace(",", "."),
    taspat:Array.from(document.querySelectorAll(".taspat-input"), field => field.value.trim()).filter(Boolean), notes:activeType === "POSKO" ? "" : value("notes"),
    schowing:{name:value("schowingName").toUpperCase(), nipp:value("schowingNipp")},
    officer:{name:value("officerName").toUpperCase(), nipp:value("officerNipp")}
  };
}

function docTitle(type) {return type === "LKDR" ? "LAPORAN KONDEKTUR (LKDR)" : "LAPORAN PERJALANAN KERETA API (LAPKA)";}
function docNumber(data) {return `MANUAL/${data.type==="LOKPULANG"?"LAPKA":data.type}/JAKK/${data.date.month}/${data.date.year}`;}
function formationText(data) {return data.formation.map(item => `(${item.order}) ${item.code}`).join(", ");}
function lokPulangCrew(data) {return ROLES.slice(0,2).map(role=>data.crew.find(person=>person.role===role)||{role,name:"",nipp:""});}
function reportCrew(data) {
  if (data.type === "LOKPULANG") return lokPulangCrew(data);
  return ROLES.map((role,i)=>data.crew.find(person=>person.role===role)||{role,name:"",nipp:""}).filter((person,i)=>i<3||person.name||person.nipp);
}

function reportHTML(data) {
  if (data.type === "POSKO") return poskoReportHTML(data);
  const lokPulang=data.type==="LOKPULANG";
  const documentKind=data.type==="LKDR"?"LKDR":"LAPKA";
  const esc = escapeHTML;
  const people=reportCrew(data);
  const crew = people.map(person => `<li><div class="${lokPulang?"lok-crew-line":"doc-crew-line"}"><strong>${person.role}</strong><span class="crew-write-name">${person.name?esc(person.name):"&nbsp;"}</span><span class="crew-write-nipp">(${person.nipp?esc(person.nipp):"&nbsp;".repeat(20)})</span><span class="crew-duty-date">${esc(data.date.text)} dinas ${esc(data.relation)}</span></div></li>`).join("");
  const signature = (heading,person) => `<div><p class="doc-signature-heading">${heading}</p><p class="doc-signature-name">${esc(person.name || "..................................")}</p><p class="doc-signature-nipp">Nipp. ${esc(person.nipp)}</p></div>`;
  const formation=lokPulang?"":`<li><strong>RANGKAIAN</strong> ${esc(formationText(data))}${data.formation.length ? "." : ""}<br>Berat : <strong><u>${esc(data.weight)}</u></strong> Ton</li>`;
  const body=`<p class="doc-model">${documentKind === "LAPKA" ? "O.82" : "O.83"}</p><div class="doc-header"><div><p class="doc-title">${docTitle(data.type)}</p><p>No. <span class="manual-red">MANUAL</span>/${documentKind}/JAKK/${esc(data.date.month)}/${esc(data.date.year)}</p></div><div><p class="doc-service-title">KA ${esc(data.number || "........")}, DINAS ${lokPulang?"LOK":"RANGKAIAN"} ${esc(data.name || "........................")}, Tgl ${esc(data.date.text)}</p><p>KA PNP Relasi ${esc(data.relation)}</p></div></div><ol class="doc-list">${crew}<li><strong>LOK</strong> ${esc(data.locomotive || (lokPulang?"":"........................"))}</li>${formation}<li><strong>TASPAT :</strong>${data.taspat.map(text => `<p class="doc-taspat">${taspatHTML(text)}</p>`).join("")}</li><li>Catatan lain dalam perjalanan :<div class="doc-note">${esc(data.notes)}</div></li></ol><div class="doc-signatures">${signature("Petugas Schowing/TKA",data.schowing)}${signature("PPKA / PAP",data.officer)}</div><p class="doc-footer">Keterangan : (*) Input Kru KA Manual</p>`;
  return lokPulang?`<div class="lok-pulang-report">${body}</div>`:body;
}

function reportFrame(data) {
  return `<div class="half-sheet"><div class="report-content">${reportHTML(data)}</div></div>`;
}

function fitPaper() {
  const stage = document.querySelector(".paper-stage");
  const available = stage.clientWidth - parseFloat(getComputedStyle(stage).paddingLeft) - parseFloat(getComputedStyle(stage).paddingRight);
  const scale = Math.min(1, available/(210/25.4*96));
  stage.style.setProperty("--paper-scale", Math.max(.1,scale));
  const content = $("documentPreview").querySelector(".report-content");
  const frame = $("documentPreview").querySelector(".half-sheet");
  if (content && frame) {
    const fit = Math.min(1, frame.clientHeight/Math.max(content.scrollHeight,1));
    content.style.setProperty("--report-fit", fit);
  }
}

function render() {
  const data = formData();
  lastDate = data.date.iso;
  $("todayLabel").textContent = data.date.text;
  $("dateDisplay").value = data.date.text;
  $("selectedInfo").textContent = `${data.number || "Nomor KA belum diisi"} · ${data.name || "Nama KA belum diisi"}`;
  $("documentPreview").innerHTML = reportFrame(data);
  $("formationSummary").textContent = data.formation.length ? `${data.formation.length} sarana terbaca: ${formationText(data)}` : "Tempel nomor urut dan nomor sarana untuk melihat hasil pembacaan.";
  if (activeType === "POSKO") {
    if (data.isLoks) $("formationSummary").textContent = "Loks — perjalanan lokomotif.";
    renderPoskoSummary();
  }
  $("previewHeading").textContent = activeType === "POSKO" ? "LAPKA KLB Posko Manual" : activeType === "LOKPULANG" ? "LAPKA Lok Pulang Manual" : activeType === "LAPKA" ? "Laporan Perjalanan Kereta Api" : "Laporan Kondektur";
  $("printButton").setAttribute("aria-label", `Cetak atau simpan PDF ${activeType}`);
  $("wordButton").setAttribute("aria-label", `Unduh Word ${activeType}`);
  requestAnimationFrame(fitPaper);
}

function setDocumentType(type) {
  const changedMode = workModeKey(activeType) !== workModeKey(type);
  if (changedMode) saveWorkMode();
  activeType = type;
  configureWorkMode();
  if (changedMode) restoreWorkMode();
  document.querySelectorAll(".document-tabs button").forEach(tab => {const selected = tab.dataset.type === type; tab.setAttribute("aria-selected",String(selected)); tab.tabIndex = selected ? 0 : -1;});
  $("previewPanel").setAttribute("aria-labelledby", type === "POSKO" ? "tabPosko" : type === "LOKPULANG" ? "tabLokPulang" : type === "LAPKA" ? "tabLapka" : "tabLkdr");
  render();
}

function validate() {
  if (activeType === "POSKO") return validatePosko();
  if (activeType === "LOKPULANG") return validateLokPulang();
  const required = ["trainNumber","trainName","relation","locomotive","formation","weight"];
  for (const id of required) $(id).removeAttribute("aria-invalid");
  const missing = required.filter(id => !$(id).value.trim());
  const weight = $("weight").value.trim().replace(",", ".");
  if (weight && (!/^\d+(\.\d+)?$/.test(weight) || Number(weight) <= 0)) missing.push("weight");
  const formation = parseFormation($("formation").value);
  const invalidOrder = formation.some(item => !Number.isSafeInteger(item.order) || item.order < 1);
  const repeatedOrder = new Set(formation.map(item=>item.order)).size !== formation.length;
  if ((!formation.length || invalidOrder || repeatedOrder) && !missing.includes("formation")) missing.push("formation");
  if (missing.length) {
    missing.forEach(id => $(id).setAttribute("aria-invalid","true"));
    $("validationMessage").textContent = invalidOrder || repeatedOrder ? "Periksa nomor urut rangkaian: gunakan nomor positif dan jangan mengulang nomor yang sama." : missing.includes("weight") && weight ? "Berat harus berupa angka lebih dari 0. Lengkapi juga kolom yang ditandai." : "Lengkapi nomor KA, nama KA, relasi, lokomotif, rangkaian, dan berat sebelum membuat dokumen.";
    $("validationMessage").hidden = false;
    $(missing[0]).scrollIntoView({block:"center",behavior:"smooth"});
    $(missing[0]).focus({preventScroll:true});
    return false;
  }
  $("validationMessage").hidden = true;
  return true;
}

function normalizeLokPulangNumber(value) {
  const number=String(value).replace(/\s+/g,"").toUpperCase();
  return /^(?:D\d+\/)?L\d+[A-Z]*$/.test(number)?`${number}-2`:number;
}

function validateLokPulang() {
  $("trainNumber").value=normalizeLokPulangNumber($("trainNumber").value);
  const required=["trainNumber","trainName","locomotive"];
  required.forEach(id=>$(id).removeAttribute("aria-invalid"));
  const missing=required.filter(id=>!$(id).value.trim());
  if (!/^(?:D\d+\/)?L\d+[A-Z]*-2$/.test($("trainNumber").value) && !missing.includes("trainNumber")) missing.push("trainNumber");
  if (missing.length) {
    missing.forEach(id=>$(id).setAttribute("aria-invalid","true"));
    $("validationMessage").textContent="Lengkapi nomor lok pulang berakhiran -2, nama KA, dan nomor lokomotif. Contoh: L61-2, MANAHAN, CC2061374.";
    $("validationMessage").hidden=false;$(missing[0]).scrollIntoView({block:"center",behavior:"smooth"});$(missing[0]).focus({preventScroll:true});return false;
  }
  $("relation").value="JAKK - JNG";$("validationMessage").hidden=true;return true;
}

function filename(data, extension) {return `${data.type === "POSKO" ? "LAPKA-KLB-POSKO" : data.type==="LOKPULANG" ? "LAPKA-LOK-PULANG" : data.type}-${data.number.replace(/[^a-z0-9_-]/gi,"-")}-${data.date.iso}.${extension}`;}
function preparePrint() {
  const data = formData();
  $("documentPreview").innerHTML = reportFrame(data);
  fitPaper();
  const fit = $("documentPreview").querySelector(".report-content").style.getPropertyValue("--report-fit") || "1";
  $("printRoot").innerHTML = `<article class="document-paper">${reportFrame(data)}</article>`;
  $("printRoot").querySelector(".report-content").style.setProperty("--report-fit",fit);
  document.title = filename(data,"pdf").replace(/\.pdf$/,"");
}

function printReport() {
  if (!validate()) return;
  closeOptions();
  render();
  preparePrint();
  window.print();
}

function toast(text) {
  $("toast").textContent = text; $("toast").hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => {$("toast").hidden = true;}, 3500);
}

// DOCX asli (OOXML dalam ZIP) tanpa CDN atau pustaka eksternal.
// ZIP memakai metode store agar dapat dibuat di browser, termasuk saat offline.
function makeZip(entries) {
  const encoder = new TextEncoder();
  const locals = [], centrals = [];
  let offset = 0;
  const crcTable = Uint32Array.from({length:256},(_,n) => {for(let i=0;i<8;i++) n = n&1 ? 0xedb88320^(n>>>1) : n>>>1; return n>>>0;});
  const crc32 = bytes => {let crc=0xffffffff; for(const byte of bytes) crc=crcTable[(crc^byte)&255]^(crc>>>8); return (crc^0xffffffff)>>>0;};
  for(const [name,text] of entries) {
    const nameBytes=encoder.encode(name), bytes=encoder.encode(text), crc=crc32(bytes);
    const local=new Uint8Array(30+nameBytes.length); const lv=new DataView(local.buffer);
    lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x800,true); lv.setUint16(12,0x21,true);
    lv.setUint32(14,crc,true); lv.setUint32(18,bytes.length,true); lv.setUint32(22,bytes.length,true); lv.setUint16(26,nameBytes.length,true); local.set(nameBytes,30);
    locals.push(local,bytes);
    const central=new Uint8Array(46+nameBytes.length); const cv=new DataView(central.buffer);
    cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0x800,true); cv.setUint16(14,0x21,true);
    cv.setUint32(16,crc,true); cv.setUint32(20,bytes.length,true); cv.setUint32(24,bytes.length,true); cv.setUint16(28,nameBytes.length,true); cv.setUint32(42,offset,true); central.set(nameBytes,46);
    centrals.push(central); offset+=local.length+bytes.length;
  }
  const centralSize=centrals.reduce((sum,item)=>sum+item.length,0);
  const end=new Uint8Array(22), ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(8,entries.length,true); ev.setUint16(10,entries.length,true); ev.setUint32(12,centralSize,true); ev.setUint32(16,offset,true);
  return new Blob([...locals,...centrals,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}

function docxBlob(data) {
  if (data.type === "POSKO") return poskoDocxBlob(data);
  const lokPulang=data.type==="LOKPULANG";
  const documentKind=data.type==="LKDR"?"LKDR":"LAPKA";
  const x=escapeXML;
  const scale = Math.min(1,Math.max(.1,data.printScale || 1));
  const fontSize = Math.max(2,Math.floor((lokPulang?18:16)*scale));
  const run=(text,bold=false,underline=false,color="") => `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${fontSize}"/>${bold?"<w:b/>":""}${underline?'<w:u w:val="single"/>':""}${color?`<w:color w:val="${color}"/>`:""}</w:rPr><w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
  const br='<w:r><w:br/></w:r>';
  const multiline=text=>String(text).split(/\r?\n/).map(line=>run(line)).join(br);
  const paragraph=(content,after=0,before=0) => `<w:p><w:pPr><w:spacing w:before="${Math.round(before*scale)}" w:after="${Math.round(after*scale)}" w:line="240" w:lineRule="auto"/></w:pPr>${content}</w:p>`;
  const cell=(content,width) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="top"/></w:tcPr>${content}</w:tc>`;
  const table=(left,right,leftWidth=6894) => `<w:tbl><w:tblPr><w:tblW w:w="10772" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="${leftWidth}"/><w:gridCol w:w="${10772-leftWidth}"/></w:tblGrid><w:tr>${cell(left,leftWidth)}${cell(right,10772-leftWidth)}</w:tr></w:tbl>`;
  const numbered=(number,content) => `<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="220"/></w:tabs><w:ind w:left="220" w:hanging="220"/><w:spacing w:after="${Math.round(30*scale)}" w:line="240" w:lineRule="auto"/></w:pPr>${run(`${number}.`)}<w:r><w:tab/></w:r>${content}</w:p>`;
  let body=paragraph(run(documentKind==="LAPKA"?"O.82":"O.83",true),60);
  body+=table(paragraph(run(docTitle(data.type),true,true)+br+run("No. ",true)+run("MANUAL",true,false,"FF0000")+run(`/${documentKind}/JAKK/${data.date.month}/${data.date.year}`,true)),paragraph(run(`KA ${data.number}, DINAS ${lokPulang?"LOK":"RANGKAIAN"} ${data.name}, Tgl ${data.date.text}`,true,true)+br+run(`KA PNP Relasi ${data.relation}`,true)));
  body+=paragraph("",30);
  let number=0;
  const people=reportCrew(data);
  {
    const widths=lokPulang?[1014,3515,1531,4712]:[1581,2948,1531,4712];
    const rows=people.map(person=>{
      const role=`<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="220"/></w:tabs><w:spacing w:after="${Math.round(30*scale)}" w:line="240" w:lineRule="auto"/></w:pPr>${run(`${++number}.`)}<w:r><w:tab/></w:r>${run(person.role,true)}</w:p>`;
      const content=[role,paragraph(run(person.name||"\u00a0"),30),paragraph(run(`(${person.nipp||"\u00a0".repeat(20)})`),30),paragraph(run(`${data.date.text} dinas ${data.relation}`),30)];
      return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${content.map((value,i)=>cell(value,widths[i])).join("")}</w:tr>`;
    }).join("");
    body+=`<w:tbl><w:tblPr><w:tblW w:w="10772" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map(width=>`<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${rows}</w:tbl>`;
  }
  body+=numbered(++number,run("LOK ",true)+run(data.locomotive));
  if (!lokPulang) body+=numbered(++number,run("RANGKAIAN ",true)+run(formationText(data)+".")+br+run("Berat : ")+run(data.weight,true,true)+run(" Ton"));
  const taspatRuns=text=>String(text).split(/\r?\n/).map(line=>speedParts(line).map(part=>run(part.text,part.bold)).join("")).join(br);
  body+=numbered(++number,run("TASPAT :",true)+data.taspat.map(text=>br+taspatRuns(text)).join(""));
  body+=numbered(++number,run("Catatan lain dalam perjalanan :")+(data.notes?br+multiline(data.notes):""));
  body+=paragraph("",0,480);
  const signature=(heading,person) => paragraph(run(heading,true,true),480)+paragraph(run(person.name||"..................................",true)+br+run(`Nipp. ${person.nipp}`,true));
  body+=table(signature("Petugas Schowing/TKA",data.schowing),signature("PPKA / PAP",data.officer),7325);
  body+=paragraph(run("Keterangan : (*) Input Kru KA Manual"),0,180);
  body+='<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567" w:header="283" w:footer="283"/></w:sectPr>';
  const xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const documentXML=xml+`<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`;
  const stylesXML=(xml+'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="16"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="0"/></w:pPr></w:style></w:styles>').replace('w:sz w:val="16"',`w:sz w:val="${fontSize}"`);
  return makeZip([
    ["[Content_Types].xml",xml+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'],
    ["_rels/.rels",xml+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml",documentXML],
    ["word/styles.xml",stylesXML],
    ["word/_rels/document.xml.rels",xml+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>']
  ]);
}

function downloadWord() {
  if (!validate()) return;
  render(); fitPaper();
  const data=formData();
  data.printScale=Number($("documentPreview").querySelector(".report-content").style.getPropertyValue("--report-fit")) || 1;
  const blob=docxBlob(data), url=URL.createObjectURL(blob), link=document.createElement("a");
  link.href=url; link.download=filename(data,"docx"); document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
  toast(`${activeType} berhasil dibuat. Periksa hasilnya di folder unduhan.`);
}

buildCrewFields();
addTaspat(DEFAULT_TASPAT,false);
selectTrain(DAFTAR_KA[0]);
$("reportForm").addEventListener("submit", event=>event.preventDefault());
$("reportForm").addEventListener("input", event=>{event.target.removeAttribute("aria-invalid"); $("validationMessage").hidden=true; if(activeType==="POSKO"&&event.target.id==="relation")syncPoskoRelationTaspat(); if(!["trainSearch","wamText"].includes(event.target.id)) render();});
$("trainSearch").addEventListener("focus",()=>{ $("trainSearch").select(); showOptions();});
$("trainSearch").addEventListener("input",showOptions);
$("trainSearch").addEventListener("keydown",searchKeyboard);
$("trainSearch").addEventListener("blur",()=>setTimeout(()=>{if(!$("trainOptions").contains(document.activeElement)) closeOptions();},120));
$("trainOptions").addEventListener("click",event=>{const option=event.target.closest(".train-option"); if(option) selectTrain(options[Number(option.dataset.index)]);});
document.addEventListener("pointerdown",event=>{if(!event.target.closest(".search-wrap")) closeOptions();});
$("addTaspat").addEventListener("click",()=>addTaspat());
document.querySelectorAll(".document-tabs button").forEach(tab=>{
  tab.addEventListener("click",()=>setDocumentType(tab.dataset.type));
  tab.addEventListener("keydown",event=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(event.key)){event.preventDefault();const tabs=[...document.querySelectorAll(".document-tabs button")];const index=tabs.indexOf(tab);const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;setDocumentType(tabs[next].dataset.type);tabs[next].focus();}});
});
$("printButton").addEventListener("click",printReport);
$("wordButton").addEventListener("click",downloadWord);
window.addEventListener("beforeprint",preparePrint);
window.addEventListener("afterprint",()=>{document.title=originalTitle;});
window.addEventListener("pageshow",render);
document.addEventListener("visibilitychange",()=>{if(!document.hidden) render();});
setInterval(()=>{if(jakartaDate().iso!==lastDate) render();},30000);
if(typeof ResizeObserver!=="undefined") new ResizeObserver(fitPaper).observe(document.querySelector(".paper-stage"));
else window.addEventListener("resize",fitPaper);
initPosko();
