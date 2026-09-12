(function () {
  "use strict";

  const T = window.TRIP;
  const deck = document.getElementById("deck");
  const rail = document.getElementById("rail");
  const hint = document.getElementById("hint");
  const SCENE_MS = 7000;

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- montagem dos slides -------------------------------------------------

  const slides = [];

  function stageFor(scenes, accent) {
    const stage = el("div", "stage");
    const canvas = el("canvas");
    canvas.setAttribute("aria-hidden", "true");
    stage.appendChild(canvas);
    scenes.forEach((sc, i) => {
      const img = el("img");
      img.alt = sc.name;
      img.decoding = "async";
      img.loading = i === 0 ? "eager" : "lazy";
      img.dataset.i = i;
      if (sc.photo) {
        img.addEventListener("error", () => { img.dataset.failed = "1"; }, { once: true });
        img.src = sc.photo;
      } else {
        img.dataset.failed = "1";
      }
      stage.appendChild(img);
    });
    const tint = el("div", "tint");
    tint.style.background = accent;
    stage.appendChild(tint);
    stage.appendChild(el("div", "scrim"));
    return stage;
  }

  // capa
  const coverScenes = [
    T.chapters[12].scenes[1], // Praga
    T.chapters[7].scenes[2],  // Veneza
    T.chapters[9].scenes[1],  // Budapeste
    T.chapters[6].scenes[1]   // Titlis
  ];
  {
    const s = el("section", "slide slide-hero");
    s.dataset.kind = "cover";
    s.appendChild(stageFor(coverScenes, "#3F7BA8"));
    s.appendChild(el("div", "hero-wrap", `
      <p class="eyebrow">Uma viagem para nós dois</p>
      <h1 class="hero-title">Europa<em>em 15 dias</em></h1>
      <p class="hero-copy">Do primeiro café em Paris à última noite em Viena.
        Doze países ligados por trilhos, cidades e histórias — entre
        ${T.meta.start} e ${T.meta.end} de ${T.meta.month} de ${T.meta.year}.</p>
      <div class="hero-meta">
        <div><strong>${T.meta.start}&#8202;–&#8202;${T.meta.end}</strong><span>${T.meta.month} ${T.meta.year}</span></div>
        <div><strong>${T.meta.countries}</strong><span>países</span></div>
        <div><strong>${T.meta.stops}</strong><span>destinos</span></div>
        <div><strong>${T.meta.days}</strong><span>dias</span></div>
      </div>
      <button class="start" id="begin"><span class="dot"></span> Iniciar a viagem</button>
    `));
    deck.appendChild(s);
    slides.push({ node: s, kind: "cover", scenes: coverScenes, accent: "#3F7BA8", audio: "paris" });
  }

  // capítulos
  T.chapters.forEach((ch, ci) => {
    const s = el("section", "slide slide-chapter");
    s.dataset.kind = "chapter";
    s.dataset.side = ci % 2 ? "right" : "left";
    s.style.setProperty("--accent", ch.accent);
    s.appendChild(stageFor(ch.scenes, ch.accent));

    const rows = ch.scenes.map((sc, i) => `
      <li>
        <button class="scene-row" data-scene="${i}">
          <span class="scene-time">${esc(sc.time)}</span>
          <span class="scene-name">${esc(sc.name)}</span>
          <span class="scene-note">${esc(sc.note)}</span>
        </button>
      </li>`).join("");

    s.appendChild(el("div", "chapter-body", `
      <div class="panel">
        <div class="ch-head">
          <span class="ch-n">${ch.n} / 13</span>
          <span class="ch-country">${esc(ch.country)}</span>
          <span class="ch-dates">${esc(ch.days)} · ${esc(ch.dates)}</span>
        </div>
        <h2 class="ch-city">${esc(ch.city)}${ch.sub ? `<em>${esc(ch.sub)}</em>` : ""}</h2>
        <p class="ch-intro">${esc(ch.intro)}</p>
        <ul class="scenes">${rows}</ul>
        <p class="transit"><b>Como seguir</b><span>${esc(ch.transit)}</span></p>
      </div>
    `));
    s.appendChild(el("div", "scene-hud"));
    deck.appendChild(s);
    slides.push({ node: s, kind: "chapter", scenes: ch.scenes, accent: ch.accent, audio: ch.id, ch: ch });
  });

  // calendário + logística
  {
    const rows = T.calendar.map((d) => `
      <div class="cal-row">
        <div class="cal-day">${d.d}<small>ABR</small></div>
        <div class="cal-main">
          <span class="cal-place">${esc(d.place)}</span>
          <span class="cal-detail">${esc(d.detail)}</span>
          <span class="cal-route">${esc(d.route)}</span>
        </div>
      </div>`).join("");
    const logs = T.logistics.map((l) => `
      <div class="log-item"><h3>${esc(l.t)}</h3><p>${esc(l.d)}</p></div>`).join("");
    const s = el("section", "slide");
    s.dataset.kind = "sheet";
    s.appendChild(el("div", "sheet", `
      <p class="eyebrow">Calendário</p>
      <h2>Quinze dias,<em>sem perder o fio.</em></h2>
      <div class="cal">${rows}</div>
      <p class="eyebrow" style="margin-top:44px">Logística</p>
      <div class="log-grid">${logs}</div>
    `));
    deck.appendChild(s);
    slides.push({ node: s, kind: "sheet", scenes: [], accent: "#C9A24B", audio: "vienna" });
  }

  // fecho
  {
    const s = el("section", "slide");
    s.dataset.kind = "end";
    s.appendChild(stageFor([T.chapters[8].scenes[0]], "#A66B47"));
    s.appendChild(el("div", "end", `
      <p>${esc(T.meta.dedication)}</p>
      <span>${T.meta.start} a ${T.meta.end} de ${T.meta.month} de ${T.meta.year}</span>
    `));
    deck.appendChild(s);
    slides.push({ node: s, kind: "end", scenes: [T.chapters[8].scenes[0]], accent: "#A66B47", audio: "vienna" });
  }

  // trilho
  T.chapters.forEach((ch, i) => {
    const b = el("button", "rail-stop", `<b>${esc(ch.city)}</b>`);
    b.title = ch.city + " · " + ch.dates;
    b.addEventListener("click", () => go(i + 1));
    rail.appendChild(b);
  });

  // ---- estado --------------------------------------------------------------

  let idx = 0, scene = 0, timer = null, auto = true;

  function paintCanvas(slide, at) {
    const i = at == null ? (slide === slides[idx] ? scene : 0) : at;
    const sc = slide.scenes[i] || slide.scenes[0];
    if (!sc || !window.SceneArt) return;
    const canvas = slide.node.querySelector("canvas");
    if (canvas) {
      try { window.SceneArt.draw(canvas, sc, slide.accent); } catch (e) {}
    }
  }

  function showScene(n, restart) {
    const slide = slides[idx];
    if (!slide.scenes.length) return;
    scene = (n + slide.scenes.length) % slide.scenes.length;
    const sc = slide.scenes[scene];

    paintCanvas(slide);

    slide.node.querySelectorAll(".stage img").forEach((img) => {
      const on = Number(img.dataset.i) === scene && !img.dataset.failed;
      img.classList.toggle("is-on", on);
      img.classList.toggle("is-out", !on);
    });

    slide.node.querySelectorAll(".scene-row").forEach((row, i) => {
      row.classList.toggle("is-live", i === scene);
    });

    const hud = slide.node.querySelector(".scene-hud");
    if (hud) {
      const cr = sc.credit;
      const total = slide.scenes.length;
      const ticks = slide.scenes.map((_, i) =>
        `<i class="${i < scene ? "done" : i === scene ? "live" : ""}"></i>`).join("");
      const creditHtml = cr
        ? `<a class="credit" href="${esc(cr.href)}" target="_blank" rel="noopener">Foto: ${esc(cr.by)} · ${esc(cr.lic)} · Wikimedia Commons</a>`
        : `<span class="credit generated">Cena desenhada em tempo real</span>`;
      hud.innerHTML =
        `<span class="now"><i></i>${esc(sc.name)}</span>` +
        `<span class="ticks" style="--dur:${SCENE_MS}ms">${ticks}</span>` +
        `<span class="now" style="color:var(--bone-faint)">${String(scene + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>` +
        creditHtml;
    }

    if (restart !== false) arm();
  }

  function arm() {
    clearTimeout(timer);
    if (!auto) return;
    const slide = slides[idx];
    if (slide.scenes.length < 2) return;
    timer = setTimeout(() => showScene(scene + 1), SCENE_MS);
  }

  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === idx) return;
    slides[idx].node.classList.remove("is-on");
    idx = n; scene = 0;
    const slide = slides[idx];
    slide.node.classList.add("is-on");

    document.body.classList.toggle("is-cover", slide.kind === "cover");
    rail.querySelectorAll(".rail-stop").forEach((s, i) => {
      s.classList.toggle("here", i === idx - 1);
      s.classList.toggle("seen", i < idx - 1);
    });
    document.getElementById("prev").disabled = idx === 0;
    document.getElementById("next").disabled = idx === slides.length - 1;

    if (window.Ambience) window.Ambience.setChapter(slide.audio);

    if (slide.scenes.length) showScene(0);
    else clearTimeout(timer);

    if (idx > 0 && hint) hint.style.opacity = "0";
  }

  // ---- controles -----------------------------------------------------------

  document.getElementById("next").addEventListener("click", () => go(idx + 1));
  document.getElementById("prev").addEventListener("click", () => go(idx - 1));

  document.getElementById("begin").addEventListener("click", () => {
    if (window.Ambience && window.Ambience.available()) {
      if (window.Ambience.start(slides[1].audio)) setSoundUI(true);
    }
    go(1);
  });

  function setSoundUI(on) {
    const b = document.getElementById("sound");
    b.setAttribute("aria-pressed", String(on));
    document.getElementById("sound-icon").innerHTML = on
      ? '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a9 9 0 0 1 0 12"/>'
      : '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>';
  }
  document.getElementById("sound").addEventListener("click", () => {
    if (!window.Ambience || !window.Ambience.available()) return;
    setSoundUI(window.Ambience.toggle(slides[idx].audio) === true);
  });
  setSoundUI(false);

  document.getElementById("auto").addEventListener("click", (e) => {
    auto = !auto;
    e.currentTarget.setAttribute("aria-pressed", String(auto));
    document.getElementById("auto-icon").innerHTML = auto
      ? '<path d="M9 6v12M15 6v12"/>'
      : '<path d="M7 5l12 7-12 7z"/>';
    if (auto) arm(); else clearTimeout(timer);
  });

  document.getElementById("full").addEventListener("click", () => {
    const d = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      (d.requestFullscreen || d.webkitRequestFullscreen || function () {}).call(d);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
    }
  });

  // tocar na imagem troca de cena; tocar numa linha vai direto para ela
  deck.addEventListener("click", (e) => {
    const row = e.target.closest(".scene-row");
    if (row) { showScene(Number(row.dataset.scene)); return; }
    if (e.target.closest(".panel") || e.target.closest(".sheet") || e.target.closest("a") || e.target.closest("button")) return;
    if (slides[idx].scenes.length > 1) showScene(scene + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(idx + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(idx - 1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); showScene(scene + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); showScene(scene - 1); }
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(slides.length - 1);
  });

  let tx = 0, ty = 0, tt = 0;
  deck.addEventListener("touchstart", (e) => {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; tt = Date.now();
  }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Date.now() - tt > 700) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (e.target.closest(".sheet")) return;
      go(idx + (dx < 0 ? 1 : -1));
    } else if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.4) {
      if (e.target.closest(".sheet")) return;
      if (slides[idx].scenes.length > 1) showScene(scene + (dy < 0 ? 1 : -1));
    }
  }, { passive: true });

  let rt = null;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => slides.forEach((s) => { if (s.scenes.length) paintCanvas(s); }), 180);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(timer); else arm();
  });

  // estado inicial
  slides[0].node.classList.add("is-on");
  document.body.classList.add("is-cover");
  document.getElementById("prev").disabled = true;
  slides.forEach((s) => { if (s.scenes.length) paintCanvas(s); });
  showScene(0);
})();
