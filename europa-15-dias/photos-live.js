// Resolve as fotografias consultando a API do Wikimedia Commons no momento da exibição.
// Assim os endereços e os créditos vêm da fonte, em vez de dependerem de nomes fixos.
// Onde a rede ou a política da página bloqueia a consulta, nada acontece:
// a cena desenhada em Canvas permanece no lugar.
(function () {
  "use strict";

  const API = "https://commons.wikimedia.org/w/api.php";

  const TERMS = {
    paris: ["Île de la Cité Paris Seine", "Louvre Palace courtyard Paris", "Eiffel Tower from Trocadéro"],
    brussels: ["Grand-Place Brussels guildhalls", "Galeries Royales Saint-Hubert Brussels", "Mont des Arts Brussels view"],
    amsterdam: ["Jordaan canal Amsterdam houses", "Amsterdam canal cruise boat", "Museumplein Rijksmuseum Amsterdam"],
    cologne: ["Cologne Cathedral exterior Rhine", "Cologne Altstadt old town houses", "Hohenzollern Bridge Cologne night"],
    luxembourg: ["Chemin de la Corniche Luxembourg City", "Bock Casemates Luxembourg", "Grund Luxembourg City Alzette"],
    strasbourg: ["Strasbourg Cathedral facade", "Petite France Strasbourg canal", "Barrage Vauban Strasbourg"],
    lucerne: ["Kapellbrücke Chapel Bridge Lucerne", "Mount Titlis snow Switzerland", "Lake Lucerne Alps panorama"],
    italy: ["Milan Cathedral Duomo facade", "Galleria Vittorio Emanuele II Milan interior", "Grand Canal Venice Rialto"],
    vienna: ["St Stephen's Cathedral Vienna", "Schönbrunn Palace Vienna garden", "Belvedere Palace Vienna"],
    budapest: ["Fisherman's Bastion Buda Castle Budapest", "Hungarian Parliament Building Danube Budapest", "Széchenyi Thermal Bath Budapest"],
    bratislava: ["Bratislava old town Michael's Gate", "Bratislava Castle Danube", "SNP Bridge Danube Bratislava"],
    krakow: ["Main Market Square Kraków Cloth Hall", "Wawel Castle Kraków Vistula", "Wieliczka Salt Mine Saint Kinga Chapel"],
    prague: ["Charles Bridge Prague", "Prague Castle Malá Strana panorama", "Prague Astronomical Clock Old Town Square"]
  };

  const REJECT = /(map|mapa|plan|diagram|logo|coat of arms|flag|seal|icon|chart|graph|drawing|engraving|\.svg|\.png)/i;

  const strip = (html) => {
    const d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  };

  let blocked = false;

  async function search(term) {
    if (blocked) return null;
    const url = API + "?" + new URLSearchParams({
      action: "query", format: "json", origin: "*",
      generator: "search", gsrsearch: term + " filetype:bitmap",
      gsrnamespace: "6", gsrlimit: "8",
      prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "1600"
    });
    let data;
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      data = await res.json();
    } catch (e) {
      blocked = true; // CSP ou rede indisponível — desiste de vez
      return null;
    }
    const pages = data && data.query && data.query.pages;
    if (!pages) return null;

    const list = Object.values(pages)
      .filter((p) => p.imageinfo && p.imageinfo[0])
      .map((p) => ({ title: p.title, i: p.imageinfo[0], idx: p.index || 99 }))
      .filter((p) => !REJECT.test(p.title))
      .filter((p) => p.i.width && p.i.height && p.i.width >= p.i.height * 1.15)
      .sort((a, b) => a.idx - b.idx);

    const hit = list[0];
    if (!hit) return null;
    const meta = hit.i.extmetadata || {};
    return {
      src: hit.i.thumburl || hit.i.url,
      by: strip(meta.Artist && meta.Artist.value) || "Wikimedia Commons",
      lic: strip(meta.LicenseShortName && meta.LicenseShortName.value) || "CC",
      href: hit.i.descriptionurl || "https://commons.wikimedia.org/"
    };
  }

  const done = {};

  async function resolveChapter(ch, onScene) {
    if (blocked || done[ch.id]) return;
    done[ch.id] = true;
    const terms = TERMS[ch.id] || [];
    for (let i = 0; i < ch.scenes.length; i++) {
      const term = terms[i];
      if (!term) continue;
      const found = await search(term);
      if (!found) continue;
      const sc = ch.scenes[i];
      sc.photo = found.src;
      sc.credit = found;
      if (onScene) onScene(ch, i, sc);
      if (blocked) return;
    }
  }

  window.LivePhotos = {
    get blocked() { return blocked; },
    resolveChapter: resolveChapter
  };
})();
