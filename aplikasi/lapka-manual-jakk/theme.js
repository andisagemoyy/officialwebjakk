"use strict";

// Dijalankan di head agar tema sudah sesuai sebelum halaman tampil.
(() => {
  const key = "lapka-jakk-theme";
  const media = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  const stored = () => {try {const value=localStorage.getItem(key);return ["dark","light"].includes(value)?value:null;} catch {return null;}};
  const apply = (theme, remember=false) => {
    document.documentElement.dataset.theme=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content",theme==="dark"?"#10151e":"#f5f4f1");
    document.querySelectorAll("[data-set-theme]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.setTheme===theme)));
    if (remember) {try {localStorage.setItem(key,theme);} catch {}}
  };
  apply(stored() || (media?.matches?"dark":"light"));
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("[data-set-theme]").forEach(button=>button.addEventListener("click",()=>apply(button.dataset.setTheme,true)));
    apply(document.documentElement.dataset.theme);
  });
  media?.addEventListener?.("change",event=>{if(!stored())apply(event.matches?"dark":"light");});
})();
