// Motor de cenas: desenha cada atração como estudo de luz e silhueta.
// Serve de camada-base sob a fotografia e assume sozinho quando a foto não carrega.
(function () {
  "use strict";

  const SKY = {
    dawn:       ["#1d2436", "#4b4258", "#9c6b5c", "#d9a071"],
    morning:    ["#2d4a63", "#6e94ac", "#b8cbd4", "#e3e0d2"],
    noon:       ["#2f5d84", "#6ea0c0", "#b9d2e0", "#e8ecec"],
    gold:       ["#28293f", "#71486a", "#c2724f", "#efb26b"],
    dusk:       ["#161c2e", "#39355a", "#7a4f63", "#c07a63"],
    night:      ["#070b16", "#111c33", "#22304d", "#3c4a68"],
    alpine:     ["#1b3b63", "#4e7fa8", "#a8c8dd", "#eef3f5"],
    interior:   ["#14110f", "#2e2319", "#5a3f25", "#9a6f38"],
    underground:["#0b0d12", "#1b2129", "#313c44", "#55646b"]
  };

  // arquétipo + parâmetros para cada tipo de cena
  const KIND = {
    "river-towers":   ["houses",   { spires: 2, water: 1 }],
    "colonnade":      ["palace",   { dome: 0, wings: 1 }],
    "tower":          ["tower",    { lattice: 1 }],
    "guild-square":   ["houses",   { gable: "step", tall: 1 }],
    "arcade":         ["vault",    { bays: 5 }],
    "terrace":        ["hill",     { town: 1, soft: 1 }],
    "canal-houses":   ["houses",   { gable: "bell", narrow: 1 }],
    "canal-boat":     ["water",    { boats: 3 }],
    "museum":         ["palace",   { dome: 0, towers: 2 }],
    "spires":         ["spires",   { count: 2 }],
    "roofline":       ["houses",   { gable: "tri", low: 1 }],
    "rail-bridge":    ["bridge",   { arches: 5, truss: 1 }],
    "cliff-valley":   ["hill",     { cliff: 1 }],
    "casemate":       ["vault",    { bays: 4, rough: 1 }],
    "low-village":    ["houses",   { gable: "tri", low: 1, water: 1 }],
    "half-timber":    ["houses",   { gable: "tri", narrow: 1, water: 1 }],
    "covered-bridge": ["bridge",   { arches: 3, roof: 1 }],
    "wood-bridge":    ["bridge",   { arches: 4, roof: 1, tower: 1 }],
    "snow-peak":      ["mountain", { peaks: 4, snow: 1 }],
    "lake-alps":      ["mountain", { peaks: 5, snow: 1, far: 1 }],
    "duomo":          ["spires",   { count: 7, spiky: 1 }],
    "glass-arcade":   ["vault",    { bays: 5, glass: 1 }],
    "venice-canal":   ["water",    { boats: 2, dome: 1 }],
    "baroque-palace": ["palace",   { dome: 1, wings: 1 }],
    "baroque-garden": ["palace",   { dome: 1, wings: 1, garden: 1 }],
    "hill-castle":    ["hill",     { castle: 1 }],
    "parliament":     ["spires",   { count: 3, wide: 1 }],
    "night-water":    ["water",    { boats: 1, glow: 1 }],
    "gate-tower":     ["tower",    { gate: 1 }],
    "white-fortress": ["palace",   { towers: 4, blocky: 1 }],
    "modern-bridge":  ["bridge",   { arches: 1, pylon: 1 }],
    "cloth-hall":     ["palace",   { arcadeRow: 1, towers: 1 }],
    "salt-cave":      ["vault",    { bays: 3, rough: 1, cave: 1 }],
    "statue-bridge":  ["bridge",   { arches: 6, statues: 1, tower: 1 }],
    "castle-panorama":["hill",     { castle: 1, town: 1 }],
    "clock-square":   ["spires",   { count: 2, clock: 1 }]
  };

  // arquétipo de fundo por trás de cada monumento
  const LMBG = {
    eiffel: "houses", notredame: "houses", louvre: "palace",
    grandplace: "houses", koelnerdom: "houses", strasbourgcath: "houses",
    kapellbruecke: "mountain", titlis: "mountain",
    duomomilano: "houses", galleria: "vault", venice: "water",
    stephansdom: "houses", schoenbrunn: "palace",
    parliament: "houses", fishermans: "hill",
    bratislavacastle: "hill", clothhall: "houses", saltchapel: "vault",
    charlesbridge: "houses", praguecastle: "hill", astroclock: "houses",
    canalhouses: "houses", corniche: "hill"
  };

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mix(a, b, t) {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const r = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return "rgb(" + r[0] + "," + r[1] + "," + r[2] + ")";
  }

  // ---- silhuetas ------------------------------------------------------------

  function silTower(ctx, x, base, w, h, p, r) {
    const cx = x + w / 2, topW = w * (p.gate ? 0.5 : 0.16);
    ctx.beginPath();
    ctx.moveTo(cx - w / 2, base);
    ctx.lineTo(cx - topW / 2, base - h);
    ctx.lineTo(cx + topW / 2, base - h);
    ctx.lineTo(cx + w / 2, base);
    ctx.closePath(); ctx.fill();
    if (p.gate) {
      ctx.beginPath();
      ctx.moveTo(cx - topW / 2, base - h);
      ctx.lineTo(cx, base - h - h * 0.28);
      ctx.lineTo(cx + topW / 2, base - h);
      ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, base - w * 0.34, w * 0.2, Math.PI, 0); ctx.rect(cx - w * 0.2, base - w * 0.34, w * 0.4, w * 0.34);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    if (p.lattice) {
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 1; i <= 2; i++) {
        const t = i / 3.2, y = base - h * t, ww = w * (1 - t * 0.78);
        ctx.fillRect(cx - ww / 2 + ww * 0.12, y, ww * 0.76, h * 0.018);
      }
      ctx.beginPath();
      ctx.arc(cx, base, w * 0.44, Math.PI, 0); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }

  function silSpires(ctx, x, base, w, h, p, r) {
    const n = p.count || 2, body = h * (p.wide ? 0.42 : 0.5);
    ctx.fillRect(x, base - body, w, body);
    for (let i = 0; i < n; i++) {
      const cx = x + w * ((i + 0.5) / n);
      const sh = h * (p.spiky ? (0.55 + r() * 0.45) : (i % 2 ? 0.82 : 1));
      const sw = w / n * (p.spiky ? 0.16 : 0.34);
      ctx.beginPath();
      ctx.moveTo(cx - sw, base - body);
      ctx.lineTo(cx, base - body - sh);
      ctx.lineTo(cx + sw, base - body - sh * (p.spiky ? 1 : 0.98));
      ctx.closePath(); ctx.fill();
    }
    if (p.clock) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(x + w * 0.5, base - body * 0.58, w * 0.07, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.globalCompositeOperation = "destination-out";
    const cols = Math.max(4, Math.round(w / 34));
    for (let i = 0; i < cols; i++) {
      const wx = x + w * ((i + 0.5) / cols);
      ctx.beginPath();
      ctx.arc(wx, base - body * 0.34, w / cols * 0.14, Math.PI, 0);
      ctx.rect(wx - w / cols * 0.14, base - body * 0.34, w / cols * 0.28, body * 0.3);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function silPalace(ctx, x, base, w, h, p, r) {
    const body = h * 0.62;
    ctx.fillRect(x, base - body, w, body);
    if (p.dome) {
      const cx = x + w / 2, dr = w * 0.11;
      ctx.beginPath(); ctx.arc(cx, base - body, dr, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - dr * 0.16, base - body - dr - h * 0.12, dr * 0.32, h * 0.12);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.38, base - body);
      ctx.lineTo(x + w * 0.5, base - body - h * 0.13);
      ctx.lineTo(x + w * 0.62, base - body);
      ctx.closePath(); ctx.fill();
    }
    const tw = p.towers || 0;
    for (let i = 0; i < tw; i++) {
      const cx = x + w * ((i + 0.5) / tw), tw2 = w * 0.05;
      ctx.fillRect(cx - tw2 / 2, base - body - h * 0.2, tw2, h * 0.2);
      if (p.blocky) { ctx.beginPath(); ctx.moveTo(cx - tw2, base - body - h * 0.2); ctx.lineTo(cx, base - body - h * 0.32); ctx.lineTo(cx + tw2, base - body - h * 0.2); ctx.closePath(); ctx.fill(); }
    }
    ctx.globalCompositeOperation = "destination-out";
    const cols = Math.max(8, Math.round(w / 26));
    for (let i = 0; i < cols; i++) {
      const wx = x + w * ((i + 0.5) / cols), ww = w / cols * 0.3;
      ctx.beginPath();
      ctx.arc(wx, base - body * 0.52, ww, Math.PI, 0);
      ctx.rect(wx - ww, base - body * 0.52, ww * 2, body * 0.3);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    if (p.garden) {
      for (let i = 0; i < 9; i++) {
        const gx = x + w * (i + 0.5) / 9;
        ctx.beginPath(); ctx.ellipse(gx, base + h * 0.03, w * 0.02, h * 0.035, 0, 0, 7); ctx.fill();
      }
    }
  }

  function silHouses(ctx, x, base, w, h, p, r) {
    const n = Math.max(6, Math.round(w / (p.narrow ? 46 : 72)));
    for (let i = 0; i < n; i++) {
      const bw = w / n, bx = x + i * bw;
      const bh = h * (p.low ? 0.34 + r() * 0.26 : 0.5 + r() * 0.42);
      ctx.fillRect(bx + bw * 0.06, base - bh, bw * 0.88, bh);
      const g = p.gable || "tri";
      if (g === "tri") {
        ctx.beginPath();
        ctx.moveTo(bx, base - bh); ctx.lineTo(bx + bw / 2, base - bh - bw * 0.4); ctx.lineTo(bx + bw, base - bh);
        ctx.closePath(); ctx.fill();
      } else if (g === "step") {
        let sy = base - bh;
        for (let s = 0; s < 3; s++) {
          const inset = bw * (0.1 + s * 0.13);
          ctx.fillRect(bx + inset, sy - bw * 0.12, bw - inset * 2, bw * 0.13);
          sy -= bw * 0.12;
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.06, base - bh);
        ctx.quadraticCurveTo(bx + bw / 2, base - bh - bw * 0.55, bx + bw * 0.94, base - bh);
        ctx.closePath(); ctx.fill();
      }
    }
    if (p.spires) {
      for (let i = 0; i < p.spires; i++) {
        const cx = x + w * (0.34 + i * 0.16), sw = w * 0.022;
        ctx.fillRect(cx - sw, base - h * 1.05, sw * 2, h * 1.05);
        ctx.beginPath(); ctx.moveTo(cx - sw * 1.6, base - h * 1.05); ctx.lineTo(cx, base - h * 1.34); ctx.lineTo(cx + sw * 1.6, base - h * 1.05); ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < n * 3; i++) {
      const wx = x + w * (i + 0.5) / (n * 3);
      ctx.fillRect(wx - w / (n * 9), base - h * (0.18 + r() * 0.24), w / (n * 4.5), h * 0.055);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function silBridge(ctx, x, base, w, h, p, r) {
    const n = p.arches || 4, deck = base - h * 0.42, span = w / n;
    ctx.fillRect(x, deck, w, h * 0.1);
    if (p.roof) {
      ctx.beginPath();
      ctx.moveTo(x, deck); ctx.lineTo(x + w * 0.5, deck - h * 0.16); ctx.lineTo(x + w, deck);
      ctx.closePath(); ctx.fill();
    }
    for (let i = 0; i < n; i++) {
      const cx = x + span * (i + 0.5);
      ctx.fillRect(cx - span * 0.1, deck, span * 0.2, base - deck);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx + span * 0.5, deck + h * 0.1, span * 0.38, Math.PI, 0);
      ctx.rect(cx + span * 0.5 - span * 0.38, deck + h * 0.1, span * 0.76, base - deck);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    if (p.pylon) {
      const cx = x + w * 0.62;
      ctx.fillRect(cx - w * 0.012, base - h * 1.15, w * 0.024, h * 1.15);
      ctx.beginPath(); ctx.arc(cx, base - h * 1.18, w * 0.05, 0, 7); ctx.fill();
      ctx.lineWidth = Math.max(1, w * 0.003); ctx.strokeStyle = ctx.fillStyle;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(cx, base - h * 1.1);
        ctx.lineTo(x + w * (0.1 + i * 0.09), deck); ctx.stroke();
      }
    }
    if (p.truss) {
      ctx.lineWidth = Math.max(1, w * 0.004); ctx.strokeStyle = ctx.fillStyle;
      for (let i = 0; i < n; i++) {
        const cx = x + span * i;
        ctx.beginPath();
        ctx.moveTo(cx, deck); ctx.lineTo(cx + span * 0.5, deck - h * 0.2); ctx.lineTo(cx + span, deck);
        ctx.stroke();
      }
    }
    if (p.tower) {
      [x + w * 0.04, x + w * 0.92].forEach((tx) => {
        ctx.fillRect(tx, base - h * 0.95, w * 0.045, h * 0.95 - (base - deck) * 0 );
        ctx.beginPath();
        ctx.moveTo(tx - w * 0.012, base - h * 0.95);
        ctx.lineTo(tx + w * 0.0225, base - h * 1.2);
        ctx.lineTo(tx + w * 0.057, base - h * 0.95);
        ctx.closePath(); ctx.fill();
      });
    }
    if (p.statues) {
      for (let i = 1; i < n; i++) {
        const sx = x + span * i;
        ctx.fillRect(sx - w * 0.006, deck - h * 0.1, w * 0.012, h * 0.1);
      }
    }
  }

  function silHill(ctx, x, base, w, h, p, r) {
    ctx.beginPath();
    ctx.moveTo(x, base);
    const peak = p.cliff ? 0.3 : 0.45;
    ctx.lineTo(x, base - h * 0.12);
    ctx.bezierCurveTo(x + w * 0.2, base - h * 0.2, x + w * (peak - 0.1), base - h * 0.9, x + w * peak, base - h * 0.92);
    ctx.bezierCurveTo(x + w * (peak + 0.18), base - h * 0.94, x + w * 0.8, base - h * 0.3, x + w, base - h * (p.cliff ? 0.5 : 0.14));
    ctx.lineTo(x + w, base); ctx.closePath(); ctx.fill();
    if (p.castle) {
      const cx = x + w * peak, cw = w * 0.17, cb = base - h * 0.9;
      ctx.fillRect(cx - cw / 2, cb - h * 0.16, cw, h * 0.16);
      for (let i = 0; i < 3; i++) {
        const tx = cx - cw / 2 + cw * (i / 2) - cw * 0.05;
        ctx.fillRect(tx, cb - h * 0.26, cw * 0.11, h * 0.1);
        ctx.beginPath();
        ctx.moveTo(tx - cw * 0.03, cb - h * 0.26); ctx.lineTo(tx + cw * 0.055, cb - h * 0.34); ctx.lineTo(tx + cw * 0.14, cb - h * 0.26);
        ctx.closePath(); ctx.fill();
      }
    }
    if (p.town) {
      for (let i = 0; i < 14; i++) {
        const tx = x + w * (0.06 + r() * 0.88);
        const ty = base - h * (0.06 + r() * 0.2);
        ctx.fillRect(tx, ty, w * 0.028, h * 0.06);
      }
    }
  }

  function silMountain(ctx, x, base, w, h, p, r, snowColor) {
    const n = p.peaks || 4;
    const pts = [[x, base]];
    for (let i = 0; i <= n; i++) {
      const px = x + w * (i / n);
      const py = base - h * (0.35 + r() * 0.62);
      pts.push([px, py]);
    }
    pts.push([x + w, base]);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath(); ctx.fill();
    if (p.snow && snowColor) {
      ctx.save(); ctx.clip();
      ctx.fillStyle = snowColor;
      for (let i = 1; i < pts.length - 1; i++) {
        const [px, py] = pts[i];
        ctx.beginPath();
        ctx.moveTo(px - w * 0.07, py + h * 0.16);
        ctx.lineTo(px, py - h * 0.01);
        ctx.lineTo(px + w * 0.07, py + h * 0.16);
        ctx.lineTo(px + w * 0.03, py + h * 0.1);
        ctx.lineTo(px - w * 0.02, py + h * 0.15);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
  }

  function silVault(ctx, x, base, w, h, p, r) {
    const n = p.bays || 4;
    for (let i = n; i >= 1; i--) {
      const t = i / n;
      const bw = w * t * 0.92, bh = h * (0.55 + t * 0.45);
      const cx = x + w / 2;
      ctx.globalAlpha = p.cave ? 0.5 : 0.42;
      ctx.beginPath();
      if (p.rough) {
        ctx.moveTo(cx - bw / 2, base);
        ctx.lineTo(cx - bw / 2 + bw * 0.06 * r(), base - bh * 0.55);
        ctx.quadraticCurveTo(cx, base - bh * (1 + r() * 0.1), cx + bw / 2 - bw * 0.06 * r(), base - bh * 0.55);
        ctx.lineTo(cx + bw / 2, base);
      } else {
        ctx.moveTo(cx - bw / 2, base);
        ctx.lineTo(cx - bw / 2, base - bh * 0.5);
        ctx.arc(cx, base - bh * 0.5, bw / 2, Math.PI, 0);
        ctx.lineTo(cx + bw / 2, base);
      }
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (p.glass) {
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 9; i++) {
        const gx = x + w * 0.5 + (i - 4) * w * 0.05;
        ctx.beginPath(); ctx.moveTo(x + w * 0.5, base - h); ctx.lineTo(gx, base); ctx.lineTo(gx + w * 0.01, base); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  function silWater(ctx, x, base, w, h, p, r) {
    ctx.fillRect(x, base - h * 0.18, w, h * 0.18);
    if (p.dome) {
      const cx = x + w * 0.72, dr = w * 0.07;
      ctx.beginPath(); ctx.arc(cx, base - h * 0.18, dr, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - dr * 0.12, base - h * 0.18 - dr - h * 0.09, dr * 0.24, h * 0.09);
    }
    for (let i = 0; i < 10; i++) {
      const bx = x + w * (i / 10) + w * 0.01;
      ctx.fillRect(bx, base - h * (0.18 + r() * 0.22), w * 0.035, h * 0.22);
    }
    const boats = p.boats || 0;
    for (let i = 0; i < boats; i++) {
      const bx = x + w * (0.2 + i * 0.28), by = base + h * 0.1;
      ctx.beginPath();
      ctx.moveTo(bx - w * 0.05, by); ctx.quadraticCurveTo(bx, by + h * 0.05, bx + w * 0.05, by);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(bx - w * 0.002, by - h * 0.09, w * 0.004, h * 0.09);
    }
  }

  const DRAW = {
    tower: silTower, spires: silSpires, palace: silPalace, houses: silHouses,
    bridge: silBridge, hill: silHill, mountain: silMountain, vault: silVault, water: silWater
  };

  // ---- composição -----------------------------------------------------------

  function draw(canvas, scene, accentHex) {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(2, Math.round(box.width)), H = Math.max(2, Math.round(box.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const art = scene.art || {};
    const pal = SKY[art.sky] || SKY.dusk;
    // monumento desenhado tem prioridade no primeiro plano;
    // o fundo recebe um arquétipo genérico que combine com ele
    const mark = (window.Landmarks && window.Landmarks[art.kind]) || null;
    const [arch, params] = mark
      ? [LMBG[art.kind] || "houses", {}]
      : (KIND[art.kind] || ["houses", {}]);
    const r = rng(hash(scene.name + art.kind));
    const interior = art.sky === "interior" || art.sky === "underground";
    const horizon = interior ? H * 0.9 : H * (art.water ? 0.66 : 0.78);

    // céu
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, mix(pal[0], pal[1], 0.3)); g.addColorStop(0.34, pal[1]);
    g.addColorStop(0.66, pal[2]); g.addColorStop(1, pal[3]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, horizon + 2);

    // disco de luz
    const sunX = W * (0.2 + r() * 0.6), sunY = horizon - H * (0.08 + r() * 0.18);
    const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.55);
    sg.addColorStop(0, art.sky === "night" ? "rgba(210,225,255,.5)" : "rgba(255,240,215,.62)");
    sg.addColorStop(0.35, "rgba(255,230,190,.14)");
    sg.addColorStop(1, "rgba(255,230,190,0)");
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, horizon + 2);
    if (!interior) {
      ctx.beginPath(); ctx.arc(sunX, sunY, H * (art.sky === "night" ? 0.022 : 0.034), 0, 7);
      ctx.fillStyle = art.sky === "night" ? "rgba(226,236,255,.92)" : "rgba(255,247,228,.9)";
      ctx.fill();
    }

    // chão / água
    ctx.fillStyle = art.water ? mix(pal[3], pal[0], 0.62) : mix(pal[3], "#0b0e13", 0.72);
    ctx.fillRect(0, horizon, W, H - horizon);

    // camadas de silhueta, do fundo para a frente
    const layers = interior ? 1 : 3;
    for (let L = 0; L < layers; L++) {
      const t = layers === 1 ? 1 : L / (layers - 1);
      const depth = 0.3 + t * 0.7;
      const base = horizon + (H - horizon) * (interior ? 0 : t * 0.14);
      const h = H * (interior ? 0.8 : (0.2 + depth * 0.26));
      const inset = (1 - depth) * W * 0.12;
      const isFront = L === layers - 1;
      // o monumento ocupa o centro e recebe mais altura: é o assunto da cena
      const mw = W * (interior ? 1 : 0.66), mx = (W - mw) / 2;
      const mh = H * (interior ? 0.84 : 0.5);

      // o primeiro plano vira silhueta escura: é o contraste que faz o monumento ler
      ctx.fillStyle = isFront
        ? mix(mix(accentHex, pal[0], 0.4), "#05070D", 0.5)
        : mix(pal[2], pal[0], 0.2 + t * 0.34);
      ctx.save();
      if (isFront && mark) {
        mark(ctx, mx, base, mw, mh, params, r);
      } else {
        DRAW[arch](ctx, -inset, base, W + inset * 2, h, isFront ? params : { ...params, low: 1 }, r,
          mix("#ffffff", pal[3], 0.18));
      }
      ctx.restore();

      // reflexo na água
      if (art.water && isFront && !interior) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.translate(0, base * 2); ctx.scale(1, -1);
        ctx.fillStyle = mix(pal[2], accentHex, 0.7);
        if (mark) mark(ctx, mx, base, mw, mh * 0.92, params, rng(hash(scene.name)));
        else DRAW[arch](ctx, -inset, base, W + inset * 2, h * 0.92, params, rng(hash(scene.name)), null);
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.fillStyle = mix(pal[3], pal[0], 0.55);
        for (let i = 0; i < 26; i++) {
          const wy = base + (H - base) * Math.pow(i / 26, 1.5);
          ctx.globalAlpha = 0.16 + (i / 26) * 0.2;
          ctx.fillRect(W * r() * 0.9, wy, W * (0.05 + r() * 0.22), Math.max(1, H * 0.004));
        }
        ctx.globalAlpha = 1;
      }
    }

    // névoa
    const hg = ctx.createLinearGradient(0, horizon - H * 0.22, 0, horizon + H * 0.06);
    hg.addColorStop(0, "rgba(255,255,255,0)");
    hg.addColorStop(1, art.sky === "night" ? "rgba(40,60,95,.34)" : "rgba(255,244,226,.3)");
    ctx.fillStyle = hg; ctx.fillRect(0, horizon - H * 0.22, W, H * 0.28);

    // vinheta + granulado
    const vg = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.2, W / 2, H * 0.5, H * 0.95);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(4,6,11,.34)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < (W * H) / 700; i++) {
      ctx.fillStyle = r() > 0.5 ? "#fff" : "#000";
      ctx.fillRect(r() * W, r() * H, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
  }

  window.SceneArt = { draw: draw };
})();
