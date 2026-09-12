// Monumentos desenhados com a proporção real de cada um.
// Assinatura igual à dos arquétipos: (ctx, x, base, w, h, p, r) — cor já definida.
// A cor é usada como silhueta; recortes usam destination-out para abrir vãos.
(function () {
  "use strict";

  const cut = (ctx, fn) => {
    ctx.globalCompositeOperation = "destination-out";
    fn();
    ctx.globalCompositeOperation = "source-over";
  };

  // traça um perfil simétrico a partir de meia-largura em função da altura
  function profile(ctx, cx, base, H, halfAt, steps) {
    const n = steps || 44;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const t = i / n, y = base - H * t, hw = halfAt(t);
      i === 0 ? ctx.moveTo(cx - hw, y) : ctx.lineTo(cx - hw, y);
    }
    for (let i = n; i >= 0; i--) {
      const t = i / n, y = base - H * t, hw = halfAt(t);
      ctx.lineTo(cx + hw, y);
    }
    ctx.closePath();
  }

  // agulha gótica: corpo que afina e termina em ponta, com pináculos
  function spire(ctx, cx, base, wBase, H, openwork) {
    const body = H * 0.58, tip = H * 0.42;
    ctx.beginPath();
    ctx.moveTo(cx - wBase / 2, base);
    ctx.lineTo(cx - wBase * 0.34, base - body);
    ctx.lineTo(cx, base - body - tip);
    ctx.lineTo(cx + wBase * 0.34, base - body);
    ctx.lineTo(cx + wBase / 2, base);
    ctx.closePath(); ctx.fill();
    if (openwork) {
      cut(ctx, () => {
        for (let i = 1; i <= 5; i++) {
          const t = i / 6.5, y = base - body * t;
          const hw = wBase * (0.5 - t * 0.16) * 0.52;
          ctx.beginPath();
          ctx.arc(cx, y - hw * 0.5, hw, Math.PI, 0);
          ctx.rect(cx - hw, y - hw * 0.5, hw * 2, body * 0.1);
          ctx.fill();
        }
        // vão na agulha
        for (let i = 1; i <= 3; i++) {
          const t = i / 4.4;
          const yy = base - body - tip * t;
          const hw = wBase * 0.2 * (1 - t);
          ctx.beginPath(); ctx.moveTo(cx - hw, yy);
          ctx.lineTo(cx, yy - tip * 0.13); ctx.lineTo(cx + hw, yy);
          ctx.closePath(); ctx.fill();
        }
      });
    }
  }

  function rose(ctx, cx, cy, rad) {
    cut(ctx, () => {
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 6.3); ctx.fill();
    });
    ctx.beginPath(); ctx.arc(cx, cy, rad * 0.2, 0, 6.3); ctx.fill();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 6.283;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      ctx.lineTo(cx + Math.cos(a + 0.16) * rad, cy + Math.sin(a + 0.16) * rad);
      ctx.closePath(); ctx.fill();
    }
  }

  function windows(ctx, x, base, w, h, cols, arch) {
    cut(ctx, () => {
      for (let i = 0; i < cols; i++) {
        const wx = x + w * ((i + 0.5) / cols), ww = (w / cols) * 0.3;
        if (arch) {
          ctx.beginPath();
          ctx.arc(wx, base - h * 0.55, ww, Math.PI, 0);
          ctx.rect(wx - ww, base - h * 0.55, ww * 2, h * 0.34);
          ctx.fill();
        } else {
          ctx.fillRect(wx - ww, base - h * 0.62, ww * 2, h * 0.3);
        }
      }
    });
  }

  const L = {};

  // ---- Paris ---------------------------------------------------------------

  // Torre Eiffel: 330 m de altura, 125 m de base. Perfil exponencial,
  // plataformas a 57, 115 e 276 m, e o arco entre os pés.
  L.eiffel = function (ctx, x, base, w, h, p, r) {
    const H = h * 1.15, cx = x + w / 2;
    const halfAt = (t) => H * (0.0085 + 0.175 * Math.exp(-4.0 * t));

    profile(ctx, cx, base, H, halfAt); ctx.fill();
    // vaza o interior, deixando os pés como bandas
    cut(ctx, () => { profile(ctx, cx, base, H, (t) => Math.max(0, halfAt(t) - H * 0.016)); ctx.fill(); });

    // plataformas
    [[0.173, 1.45, 0.02], [0.348, 1.5, 0.016], [0.837, 2.4, 0.012]].forEach(([t, ext, th]) => {
      const hw = halfAt(t) * ext;
      ctx.fillRect(cx - hw, base - H * t - H * th, hw * 2, H * th * 1.6);
    });

    // mastro central acima da 2ª plataforma + antena
    ctx.fillRect(cx - H * 0.0075, base - H * 0.86, H * 0.015, H * 0.52);
    ctx.fillRect(cx - H * 0.004, base - H, H * 0.008, H * 0.145);

    // treliça: barras horizontais e diagonais
    ctx.lineWidth = Math.max(1, H * 0.0045);
    ctx.strokeStyle = ctx.fillStyle;
    for (let i = 1; i < 16; i++) {
      const t = 0.02 + (i / 16) * 0.8, hw = halfAt(t);
      ctx.beginPath();
      ctx.moveTo(cx - hw, base - H * t); ctx.lineTo(cx + hw, base - H * t); ctx.stroke();
      if (t < 0.34) {
        const t2 = t + 0.05, hw2 = halfAt(t2);
        ctx.beginPath();
        ctx.moveTo(cx - hw, base - H * t); ctx.lineTo(cx - hw2 * 0.2, base - H * t2);
        ctx.moveTo(cx + hw, base - H * t); ctx.lineTo(cx + hw2 * 0.2, base - H * t2);
        ctx.stroke();
      }
    }

    // o arco da base
    cut(ctx, () => {
      const ah = H * 0.135, aw = halfAt(0) * 0.98;
      ctx.beginPath();
      ctx.moveTo(cx - aw, base);
      ctx.quadraticCurveTo(cx - aw * 0.55, base - ah, cx, base - ah * 0.92);
      ctx.quadraticCurveTo(cx + aw * 0.55, base - ah, cx + aw, base);
      ctx.closePath(); ctx.fill();
    });
  };

  // Notre-Dame: duas torres quadradas de 69 m, nave, flecha e rosácea
  L.notredame = function (ctx, x, base, w, h, p, r) {
    const nave = h * 0.52, tw = w * 0.2, th = h * 0.82;
    ctx.fillRect(x + w * 0.16, base - nave, w * 0.68, nave);
    [x + w * 0.16, x + w * 0.64].forEach((tx) => {
      ctx.fillRect(tx, base - th, tw, th);
      cut(ctx, () => {
        const ww = tw * 0.16;
        [0.3, 0.62].forEach((o) => {
          const wx = tx + tw * o + ww;
          ctx.beginPath();
          ctx.arc(wx, base - th * 0.86, ww, Math.PI, 0);
          ctx.rect(wx - ww, base - th * 0.86, ww * 2, th * 0.2);
          ctx.fill();
        });
      });
    });
    // flecha
    const sx = x + w * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx - w * 0.035, base - nave);
    ctx.lineTo(sx, base - h * 1.02); ctx.lineTo(sx + w * 0.035, base - nave);
    ctx.closePath(); ctx.fill();
    // arcobotantes
    ctx.lineWidth = Math.max(1, w * 0.008); ctx.strokeStyle = ctx.fillStyle;
    for (let i = 0; i < 4; i++) {
      const bx = x + w * (0.2 + i * 0.17);
      ctx.beginPath();
      ctx.moveTo(bx, base);
      ctx.quadraticCurveTo(bx + w * 0.05, base - nave * 0.6, bx + w * 0.1, base - nave * 0.95);
      ctx.stroke();
    }
    rose(ctx, x + w * 0.5, base - nave * 0.62, w * 0.075);
  };

  // Louvre: a pirâmide de vidro diante das alas do palácio
  L.louvre = function (ctx, x, base, w, h, p, r) {
    const pal = h * 0.46;
    ctx.fillRect(x, base - pal, w, pal);
    // pavilhão central com frontão
    ctx.fillRect(x + w * 0.38, base - pal - h * 0.1, w * 0.24, h * 0.1);
    windows(ctx, x, base, w, pal, 16, true);
    // pirâmide: 35 m de base, 21,6 m de altura
    const px = x + w * 0.5, pw = w * 0.3, ph = pw * 0.617;
    ctx.beginPath();
    ctx.moveTo(px - pw / 2, base); ctx.lineTo(px, base - ph); ctx.lineTo(px + pw / 2, base);
    ctx.closePath(); ctx.fill();
    cut(ctx, () => {
      ctx.lineWidth = Math.max(1, w * 0.004);
      ctx.strokeStyle = "#000";
      for (let i = 1; i < 7; i++) {
        const t = i / 7;
        ctx.beginPath();
        ctx.moveTo(px - (pw / 2) * (1 - t), base - ph * t);
        ctx.lineTo(px + (pw / 2) * (1 - t), base - ph * t); ctx.stroke();
      }
      for (let i = 1; i < 5; i++) {
        const o = (i / 5 - 0.5) * pw;
        ctx.beginPath(); ctx.moveTo(px + o, base); ctx.lineTo(px, base - ph); ctx.stroke();
      }
    });
  };

  // ---- Bruxelas ------------------------------------------------------------

  // Grand-Place: torre da prefeitura fora do eixo + empenas das guildas
  L.grandplace = function (ctx, x, base, w, h, p, r) {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const bw = w / n, bx = x + i * bw, bh = h * (0.44 + (i % 3) * 0.06);
      ctx.fillRect(bx + bw * 0.05, base - bh, bw * 0.9, bh);
      // empena em degraus com volutas
      let sy = base - bh;
      for (let s = 0; s < 4; s++) {
        const ins = bw * (0.08 + s * 0.1);
        ctx.fillRect(bx + ins, sy - bw * 0.1, bw - ins * 2, bw * 0.11);
        sy -= bw * 0.1;
      }
      ctx.beginPath(); ctx.arc(bx + bw * 0.5, sy, bw * 0.05, 0, 6.3); ctx.fill();
      windows(ctx, bx, base, bw, bh, 2, true);
    }
    // torre da prefeitura, 96 m, deslocada do centro
    const tx = x + w * 0.3, tw = w * 0.09;
    ctx.fillRect(tx, base - h * 0.72, tw, h * 0.72);
    spire(ctx, tx + tw / 2, base - h * 0.72, tw * 1.5, h * 0.42, true);
    windows(ctx, tx, base - h * 0.3, tw, h * 0.4, 1, true);
  };

  // ---- Colônia -------------------------------------------------------------

  // Dom: duas agulhas vazadas de 157 m, altíssimas e estreitas
  L.koelnerdom = function (ctx, x, base, w, h, p, r) {
    const nave = h * 0.4;
    ctx.fillRect(x + w * 0.2, base - nave, w * 0.6, nave);
    // transepto com telhado alto
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, base - nave);
    ctx.lineTo(x + w * 0.5, base - nave - h * 0.12);
    ctx.lineTo(x + w * 0.8, base - nave);
    ctx.closePath(); ctx.fill();
    windows(ctx, x + w * 0.2, base, w * 0.6, nave, 7, true);
    // as duas agulhas
    [0.26, 0.74].forEach((o) => {
      const cx = x + w * o, tw = w * 0.14;
      ctx.fillRect(cx - tw / 2, base - h * 0.58, tw, h * 0.58);
      windows(ctx, cx - tw / 2, base - h * 0.16, tw, h * 0.42, 2, true);
      spire(ctx, cx, base - h * 0.58, tw, h * 0.46, true);
    });
  };

  // ---- Strasbourg ----------------------------------------------------------

  // Notre-Dame de Strasbourg: assimétrica, uma só agulha a 142 m
  L.strasbourgcath = function (ctx, x, base, w, h, p, r) {
    const nave = h * 0.46;
    ctx.fillRect(x + w * 0.24, base - nave, w * 0.52, nave);
    const bx = x + w * 0.24, bw = w * 0.52;
    ctx.fillRect(bx, base - h * 0.6, bw, h * 0.6 - 0);
    windows(ctx, bx, base, bw, h * 0.6, 5, true);
    rose(ctx, bx + bw * 0.5, base - h * 0.4, w * 0.08);
    // torre norte, única, com a agulha
    const tx = bx + bw * 0.22, tw = bw * 0.34;
    ctx.fillRect(tx, base - h * 0.78, tw, h * 0.78);
    windows(ctx, tx, base - h * 0.42, tw, h * 0.36, 2, true);
    spire(ctx, tx + tw / 2, base - h * 0.78, tw * 0.9, h * 0.4, true);
    // plataforma no lado sul, inacabado
    ctx.fillRect(bx + bw * 0.66, base - h * 0.66, bw * 0.3, h * 0.66);
  };

  // ---- Lucerna -------------------------------------------------------------

  // Kapellbrücke: ponte coberta de madeira na diagonal + Wasserturm octogonal
  L.kapellbruecke = function (ctx, x, base, w, h, p, r) {
    const deck = base - h * 0.2;
    // tabuleiro levemente inclinado
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x, deck + h * 0.04);
    ctx.lineTo(x + w, deck - h * 0.04);
    ctx.lineTo(x + w, deck + h * 0.1); ctx.lineTo(x, deck + h * 0.18);
    ctx.closePath(); ctx.fill();
    // telhado de duas águas correndo sobre a ponte
    ctx.beginPath();
    ctx.moveTo(x, deck + h * 0.04);
    ctx.lineTo(x, deck - h * 0.1);
    ctx.lineTo(x + w, deck - h * 0.18);
    ctx.lineTo(x + w, deck - h * 0.04);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // estacas na água
    for (let i = 0; i < 9; i++) {
      const px = x + w * (0.05 + i * 0.107);
      const dy = deck + h * 0.16 - (i / 9) * h * 0.08;
      ctx.fillRect(px, dy, w * 0.012, h * 0.22);
    }
    // Wasserturm: torre octogonal de pedra
    const tx = x + w * 0.66, tw = w * 0.1;
    ctx.fillRect(tx, base - h * 0.74, tw, h * 0.74);
    ctx.beginPath();
    ctx.moveTo(tx - tw * 0.16, base - h * 0.74);
    ctx.lineTo(tx + tw * 0.5, base - h * 0.94);
    ctx.lineTo(tx + tw * 1.16, base - h * 0.74);
    ctx.closePath(); ctx.fill();
    windows(ctx, tx, base - h * 0.3, tw, h * 0.44, 1, true);
  };

  // Titlis: pico nevado, teleférico e a ponte suspensa
  L.titlis = function (ctx, x, base, w, h, p, r) {
    const peaks = [[0.0, 0.34], [0.18, 0.72], [0.36, 0.52], [0.56, 0.96], [0.78, 0.6], [1, 0.4]];
    ctx.beginPath(); ctx.moveTo(x, base);
    peaks.forEach(([px, py]) => ctx.lineTo(x + w * px, base - h * py));
    ctx.lineTo(x + w, base); ctx.closePath(); ctx.fill();
    // neve nas cristas
    ctx.save(); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,.5)";
    peaks.forEach(([px, py]) => {
      if (py < 0.5) return;
      ctx.beginPath();
      ctx.moveTo(x + w * px - w * 0.07, base - h * (py - 0.18));
      ctx.lineTo(x + w * px, base - h * py);
      ctx.lineTo(x + w * px + w * 0.07, base - h * (py - 0.18));
      ctx.lineTo(x + w * px + w * 0.02, base - h * (py - 0.12));
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
    // cabo do teleférico com uma cabine
    ctx.lineWidth = Math.max(1, w * 0.003); ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.04, base - h * 0.5);
    ctx.quadraticCurveTo(x + w * 0.3, base - h * 0.72, x + w * 0.56, base - h * 0.92);
    ctx.stroke();
    ctx.fillRect(x + w * 0.27, base - h * 0.66, w * 0.035, h * 0.05);
    // ponte suspensa entre dois pontos altos
    ctx.beginPath();
    ctx.moveTo(x + w * 0.56, base - h * 0.9);
    ctx.quadraticCurveTo(x + w * 0.67, base - h * 0.82, x + w * 0.78, base - h * 0.58);
    ctx.stroke();
  };

  // ---- Itália --------------------------------------------------------------

  // Duomo de Milão: fachada larga e floresta de pináculos, Madonnina ao centro
  L.duomomilano = function (ctx, x, base, w, h, p, r) {
    const body = h * 0.5;
    ctx.fillRect(x + w * 0.06, base - body, w * 0.88, body);
    // frontão triangular escalonado
    ctx.beginPath();
    ctx.moveTo(x + w * 0.06, base - body);
    ctx.lineTo(x + w * 0.5, base - body - h * 0.2);
    ctx.lineTo(x + w * 0.94, base - body);
    ctx.closePath(); ctx.fill();
    // floresta de pináculos
    const n = 17;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const px = x + w * (0.08 + t * 0.84);
      const d = Math.abs(t - 0.5);
      const ph = h * (0.5 - d * 0.62) * (0.62 + (i % 2) * 0.2);
      const pw = w * 0.017;
      const py = base - body - h * 0.2 * (1 - d * 1.9);
      ctx.fillRect(px - pw / 2, py, pw, ph * 0.4);
      ctx.beginPath();
      ctx.moveTo(px - pw, py); ctx.lineTo(px, py - ph * 0.44); ctx.lineTo(px + pw, py);
      ctx.closePath(); ctx.fill();
    }
    // Madonnina no ponto mais alto
    ctx.beginPath(); ctx.arc(x + w * 0.5, base - body - h * 0.44, w * 0.013, 0, 6.3); ctx.fill();
    windows(ctx, x + w * 0.06, base, w * 0.88, body, 9, true);
  };

  // Galleria Vittorio Emanuele: abóbada de ferro e vidro com cúpula central
  L.galleria = function (ctx, x, base, w, h, p, r) {
    const cx = x + w / 2, span = w * 0.72, top = base - h * 0.72;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(cx - span / 2, base - h * 0.5, span, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(cx - span / 2, base - h * 0.5);
    ctx.arc(cx, base - h * 0.5, span / 2, Math.PI, 0);
    ctx.closePath(); ctx.fill();
    // cúpula
    ctx.beginPath(); ctx.arc(cx, top + h * 0.1, span * 0.24, Math.PI, 0); ctx.fill();
    ctx.globalAlpha = 1;
    // nervuras de ferro
    cut(ctx, () => {
      ctx.lineWidth = Math.max(1, w * 0.0055); ctx.strokeStyle = "#000";
      for (let i = 1; i < 12; i++) {
        const a = Math.PI + (i / 12) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, base - h * 0.5);
        ctx.lineTo(cx + Math.cos(a) * span * 0.5, base - h * 0.5 + Math.sin(a) * span * 0.5);
        ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, base - h * 0.5, span * 0.5 * (i / 4), Math.PI, 0); ctx.stroke();
      }
    });
  };

  // Veneza: campanile de San Marco, cúpula da Salute e uma gôndola
  L.venice = function (ctx, x, base, w, h, p, r) {
    // Salute, à direita
    const dx = x + w * 0.76, dr = w * 0.1;
    ctx.fillRect(dx - dr, base - h * 0.3, dr * 2, h * 0.3);
    ctx.beginPath(); ctx.arc(dx, base - h * 0.3, dr, Math.PI, 0); ctx.fill();
    ctx.fillRect(dx - dr * 0.1, base - h * 0.3 - dr - h * 0.07, dr * 0.2, h * 0.07);
    // Palácio Ducal, arcadas baixas
    ctx.fillRect(x + w * 0.28, base - h * 0.26, w * 0.34, h * 0.26);
    windows(ctx, x + w * 0.28, base, w * 0.34, h * 0.26, 9, true);
    // campanile: 98 m, fuste quadrado, cela, pirâmide
    const cx = x + w * 0.18, cw = w * 0.075;
    ctx.fillRect(cx - cw / 2, base - h * 0.88, cw, h * 0.88);
    ctx.fillRect(cx - cw * 0.62, base - h * 0.88, cw * 1.24, h * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.56, base - h * 0.98);
    ctx.lineTo(cx, base - h * 1.14); ctx.lineTo(cx + cw * 0.56, base - h * 0.98);
    ctx.closePath(); ctx.fill();
    cut(ctx, () => {
      const ww = cw * 0.18;
      ctx.beginPath();
      ctx.arc(cx, base - h * 0.8, ww, Math.PI, 0);
      ctx.rect(cx - ww, base - h * 0.8, ww * 2, h * 0.06); ctx.fill();
    });
    // gôndola
    const gx = x + w * 0.5, gy = base + h * 0.1;
    ctx.beginPath();
    ctx.moveTo(gx - w * 0.075, gy);
    ctx.quadraticCurveTo(gx, gy + h * 0.045, gx + w * 0.075, gy);
    ctx.quadraticCurveTo(gx + w * 0.05, gy - h * 0.012, gx - w * 0.075, gy);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(gx - w * 0.085, gy - h * 0.055, w * 0.007, h * 0.055);
    ctx.fillRect(gx + w * 0.03, gy - h * 0.07, w * 0.005, h * 0.07);
  };

  // ---- Viena ---------------------------------------------------------------

  // Stephansdom: agulha sul de 136 m, torre norte baixa e telhado em ziguezague
  L.stephansdom = function (ctx, x, base, w, h, p, r) {
    const nave = h * 0.34;
    ctx.fillRect(x + w * 0.2, base - nave, w * 0.62, nave);
    // telhado muito inclinado
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, base - nave);
    ctx.lineTo(x + w * 0.48, base - nave - h * 0.26);
    ctx.lineTo(x + w * 0.82, base - nave - h * 0.16);
    ctx.lineTo(x + w * 0.82, base - nave);
    ctx.closePath(); ctx.fill();
    // padrão de telhas em losango
    cut(ctx, () => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 3; j++) {
          const zx = x + w * (0.26 + i * 0.077), zy = base - nave - h * (0.05 + j * 0.06);
          ctx.beginPath();
          ctx.moveTo(zx, zy - h * 0.016); ctx.lineTo(zx + w * 0.016, zy);
          ctx.lineTo(zx, zy + h * 0.016); ctx.lineTo(zx - w * 0.016, zy);
          ctx.closePath(); ctx.fill();
        }
      }
    });
    // torre sul, alta
    const sx = x + w * 0.26, sw = w * 0.1;
    ctx.fillRect(sx - sw / 2, base - h * 0.6, sw, h * 0.6);
    windows(ctx, sx - sw / 2, base - h * 0.22, sw, h * 0.38, 1, true);
    spire(ctx, sx, base - h * 0.6, sw, h * 0.48, true);
    // torre norte, inacabada, com cúpula
    const nx = x + w * 0.78, nw = w * 0.085;
    ctx.fillRect(nx - nw / 2, base - h * 0.46, nw, h * 0.46);
    ctx.beginPath(); ctx.arc(nx, base - h * 0.46, nw * 0.58, Math.PI, 0); ctx.fill();
    ctx.fillRect(nx - nw * 0.05, base - h * 0.52 - nw * 0.5, nw * 0.1, nw * 0.5);
  };

  // Schönbrunn: palácio barroco longo, corpo central destacado, jardim
  L.schoenbrunn = function (ctx, x, base, w, h, p, r) {
    const body = h * 0.4;
    ctx.fillRect(x + w * 0.02, base - body, w * 0.96, body);
    ctx.fillRect(x + w * 0.36, base - body - h * 0.12, w * 0.28, h * 0.12);
    // frontão e lanternim
    ctx.beginPath();
    ctx.moveTo(x + w * 0.4, base - body - h * 0.12);
    ctx.lineTo(x + w * 0.5, base - body - h * 0.2);
    ctx.lineTo(x + w * 0.6, base - body - h * 0.12);
    ctx.closePath(); ctx.fill();
    windows(ctx, x + w * 0.02, base, w * 0.96, body, 22, true);
    // parterre em canteiros
    for (let i = 0; i < 12; i++) {
      const gx = x + w * (0.06 + i * 0.078);
      ctx.beginPath();
      ctx.ellipse(gx, base + h * 0.05, w * 0.022, h * 0.03, 0, 0, 6.3); ctx.fill();
    }
  };

  // ---- Budapeste -----------------------------------------------------------

  // Parlamento: cúpula central de 96 m e alas simétricas na margem do Danúbio
  L.parliament = function (ctx, x, base, w, h, p, r) {
    const body = h * 0.34, cx = x + w / 2;
    ctx.fillRect(x, base - body, w, body);
    windows(ctx, x, base, w, body, 26, true);
    // cúpula central
    const dr = w * 0.085;
    ctx.fillRect(cx - dr * 1.1, base - body - h * 0.1, dr * 2.2, h * 0.1);
    ctx.beginPath(); ctx.arc(cx, base - body - h * 0.1, dr, Math.PI, 0); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - dr * 0.4, base - body - h * 0.1 - dr);
    ctx.lineTo(cx, base - body - h * 0.1 - dr - h * 0.16);
    ctx.lineTo(cx + dr * 0.4, base - body - h * 0.1 - dr);
    ctx.closePath(); ctx.fill();
    // agulhas neogóticas ao longo da fachada
    for (let i = 0; i < 14; i++) {
      const t = i / 13;
      if (Math.abs(t - 0.5) < 0.1) continue;
      const px = x + w * (0.03 + t * 0.94), pw = w * 0.014;
      const ph = h * (0.16 + (i % 2) * 0.07);
      ctx.fillRect(px - pw / 2, base - body - ph * 0.4, pw, ph * 0.4);
      ctx.beginPath();
      ctx.moveTo(px - pw, base - body - ph * 0.4);
      ctx.lineTo(px, base - body - ph); ctx.lineTo(px + pw, base - body - ph * 0.4);
      ctx.closePath(); ctx.fill();
    }
  };

  // Bastião dos Pescadores: torres cônicas e arcadas sobre a colina
  L.fishermans = function (ctx, x, base, w, h, p, r) {
    const wall = h * 0.28;
    ctx.fillRect(x, base - wall, w, wall);
    cut(ctx, () => {
      for (let i = 0; i < 9; i++) {
        const ax = x + w * ((i + 0.5) / 9), aw = (w / 9) * 0.3;
        ctx.beginPath();
        ctx.arc(ax, base - wall * 0.5, aw, Math.PI, 0);
        ctx.rect(ax - aw, base - wall * 0.5, aw * 2, wall * 0.5); ctx.fill();
      }
    });
    // torres cônicas
    [0.12, 0.34, 0.66, 0.88].forEach((o, i) => {
      const tx = x + w * o, tw = w * (i === 1 || i === 2 ? 0.1 : 0.075);
      const th = h * (i === 1 || i === 2 ? 0.44 : 0.34);
      ctx.fillRect(tx - tw / 2, base - wall - th, tw, th);
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.66, base - wall - th);
      ctx.lineTo(tx, base - wall - th - h * 0.2);
      ctx.lineTo(tx + tw * 0.66, base - wall - th);
      ctx.closePath(); ctx.fill();
    });
    // agulha da Igreja de Matias ao fundo
    const mx = x + w * 0.5;
    ctx.fillRect(mx - w * 0.022, base - wall - h * 0.66, w * 0.044, h * 0.66);
    spire(ctx, mx, base - wall - h * 0.66, w * 0.05, h * 0.24, true);
  };

  // ---- Bratislava ----------------------------------------------------------

  // Castelo: bloco branco com quatro torres de canto, no alto
  L.bratislavacastle = function (ctx, x, base, w, h, p, r) {
    // colina
    ctx.beginPath();
    ctx.moveTo(x, base); ctx.lineTo(x, base - h * 0.1);
    ctx.bezierCurveTo(x + w * 0.3, base - h * 0.34, x + w * 0.7, base - h * 0.34, x + w, base - h * 0.08);
    ctx.lineTo(x + w, base); ctx.closePath(); ctx.fill();
    const bw = w * 0.46, bx = x + w * 0.27, bh = h * 0.3, bb = base - h * 0.3;
    ctx.fillRect(bx, bb - bh, bw, bh);
    windows(ctx, bx, bb, bw, bh, 8, false);
    // quatro torres de canto
    [0, 1].forEach((s) => {
      const tx = s ? bx + bw - w * 0.055 : bx;
      ctx.fillRect(tx, bb - bh - h * 0.12, w * 0.055, h * 0.12 + bh);
      ctx.beginPath();
      ctx.moveTo(tx - w * 0.012, bb - bh - h * 0.12);
      ctx.lineTo(tx + w * 0.0275, bb - bh - h * 0.24);
      ctx.lineTo(tx + w * 0.067, bb - bh - h * 0.12);
      ctx.closePath(); ctx.fill();
    });
    // telhado de quatro águas
    ctx.beginPath();
    ctx.moveTo(bx - w * 0.02, bb - bh);
    ctx.lineTo(bx + bw * 0.5, bb - bh - h * 0.1);
    ctx.lineTo(bx + bw + w * 0.02, bb - bh);
    ctx.closePath(); ctx.fill();
  };

  // ---- Cracóvia ------------------------------------------------------------

  // Rynek: Sukiennice alongada e as torres desiguais de Santa Maria
  L.clothhall = function (ctx, x, base, w, h, p, r) {
    const body = h * 0.26, bx = x + w * 0.04, bw = w * 0.6;
    ctx.fillRect(bx, base - body, bw, body);
    cut(ctx, () => {
      for (let i = 0; i < 11; i++) {
        const ax = bx + bw * ((i + 0.5) / 11), aw = (bw / 11) * 0.32;
        ctx.beginPath();
        ctx.arc(ax, base - body * 0.52, aw, Math.PI, 0);
        ctx.rect(ax - aw, base - body * 0.52, aw * 2, body * 0.52); ctx.fill();
      }
    });
    // ático com arcos e telhado
    ctx.fillRect(bx, base - body - h * 0.07, bw, h * 0.07);
    ctx.beginPath();
    ctx.moveTo(bx - w * 0.015, base - body - h * 0.07);
    ctx.lineTo(bx + bw * 0.5, base - body - h * 0.15);
    ctx.lineTo(bx + bw + w * 0.015, base - body - h * 0.07);
    ctx.closePath(); ctx.fill();
    // Santa Maria: duas torres de alturas diferentes
    const t1 = x + w * 0.74, t2 = x + w * 0.88;
    ctx.fillRect(t1 - w * 0.035, base - h * 0.72, w * 0.07, h * 0.72);
    spire(ctx, t1, base - h * 0.72, w * 0.075, h * 0.3, true);
    ctx.fillRect(t2 - w * 0.032, base - h * 0.54, w * 0.064, h * 0.54);
    ctx.beginPath();
    ctx.moveTo(t2 - w * 0.045, base - h * 0.54);
    ctx.lineTo(t2, base - h * 0.66); ctx.lineTo(t2 + w * 0.045, base - h * 0.54);
    ctx.closePath(); ctx.fill();
  };

  // Wieliczka: câmara de sal com escoras de madeira e candelabro
  L.saltchapel = function (ctx, x, base, w, h, p, r) {
    // abóbada escavada
    for (let i = 3; i >= 1; i--) {
      const t = i / 3, bw = w * t * 0.96, bh = h * (0.5 + t * 0.48), cx = x + w / 2;
      ctx.globalAlpha = 0.46;
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, base);
      ctx.lineTo(cx - bw / 2 + bw * 0.05, base - bh * 0.5);
      ctx.quadraticCurveTo(cx, base - bh * 1.06, cx + bw / 2 - bw * 0.05, base - bh * 0.5);
      ctx.lineTo(cx + bw / 2, base);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // escoras de madeira cruzadas
    ctx.lineWidth = Math.max(1.5, w * 0.008); ctx.strokeStyle = ctx.fillStyle;
    [0.16, 0.84].forEach((o) => {
      const px = x + w * o;
      ctx.beginPath();
      ctx.moveTo(px, base); ctx.lineTo(px, base - h * 0.5);
      ctx.moveTo(px, base - h * 0.5); ctx.lineTo(px + (o < 0.5 ? w * 0.1 : -w * 0.1), base - h * 0.62);
      ctx.stroke();
    });
    // candelabro de cristais de sal
    const cx = x + w / 2;
    ctx.fillRect(cx - w * 0.004, base - h * 0.92, w * 0.008, h * 0.2);
    for (let i = 0; i < 3; i++) {
      const ry = base - h * (0.72 - i * 0.05), rw = w * (0.1 - i * 0.026);
      ctx.lineWidth = Math.max(1, w * 0.004);
      ctx.beginPath(); ctx.ellipse(cx, ry, rw, h * 0.014, 0, 0, 6.3); ctx.stroke();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * 6.283;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * rw, ry + Math.sin(a) * h * 0.014, w * 0.007, 0, 6.3);
        ctx.fill();
      }
    }
  };

  // ---- Praga ---------------------------------------------------------------

  // Ponte Carlos: arcos, torre gótica e as estátuas no parapeito
  L.charlesbridge = function (ctx, x, base, w, h, p, r) {
    const deck = base - h * 0.34, n = 8, span = w / n;
    ctx.fillRect(x, deck, w, h * 0.08);
    for (let i = 0; i < n; i++) {
      const cx2 = x + span * (i + 0.5);
      ctx.fillRect(cx2 - span * 0.09, deck, span * 0.18, base - deck);
      cut(ctx, () => {
        ctx.beginPath();
        ctx.arc(cx2 + span * 0.5, deck + h * 0.08, span * 0.38, Math.PI, 0);
        ctx.rect(cx2 + span * 0.5 - span * 0.38, deck + h * 0.08, span * 0.76, base - deck);
        ctx.fill();
      });
    }
    // estátuas sobre os pilares
    for (let i = 1; i < n; i++) {
      const sx = x + span * i;
      ctx.fillRect(sx - w * 0.005, deck - h * 0.075, w * 0.01, h * 0.075);
      ctx.beginPath(); ctx.arc(sx, deck - h * 0.082, w * 0.008, 0, 6.3); ctx.fill();
    }
    // torre da ponte, gótica
    const tx = x + w * 0.12, tw = w * 0.1;
    ctx.fillRect(tx - tw / 2, deck - h * 0.62, tw, h * 0.62);
    windows(ctx, tx - tw / 2, deck - h * 0.2, tw, h * 0.42, 1, true);
    ctx.beginPath();
    ctx.moveTo(tx - tw * 0.7, deck - h * 0.62);
    ctx.lineTo(tx, deck - h * 0.86); ctx.lineTo(tx + tw * 0.7, deck - h * 0.62);
    ctx.closePath(); ctx.fill();
    [-1, 1].forEach((s) => {
      ctx.fillRect(tx + s * tw * 0.56 - w * 0.012, deck - h * 0.7, w * 0.024, h * 0.1);
    });
  };

  // Castelo de Praga: São Vito com duas agulhas sobre os telhados de Malá Strana
  L.praguecastle = function (ctx, x, base, w, h, p, r) {
    // telhados baixos em primeiro plano
    for (let i = 0; i < 12; i++) {
      const bw = w / 12, bx = x + i * bw, bh = h * (0.14 + (i % 4) * 0.045);
      ctx.fillRect(bx, base - bh, bw * 0.92, bh);
      ctx.beginPath();
      ctx.moveTo(bx - bw * 0.05, base - bh);
      ctx.lineTo(bx + bw * 0.46, base - bh - bw * 0.3);
      ctx.lineTo(bx + bw * 0.97, base - bh);
      ctx.closePath(); ctx.fill();
    }
    // muralha do castelo
    const cb = base - h * 0.3;
    ctx.fillRect(x + w * 0.18, cb - h * 0.2, w * 0.68, h * 0.2);
    windows(ctx, x + w * 0.18, cb, w * 0.68, h * 0.2, 16, false);
    // São Vito: nave alta e duas agulhas gêmeas
    const vx = x + w * 0.46;
    ctx.fillRect(vx - w * 0.11, cb - h * 0.46, w * 0.22, h * 0.46);
    ctx.beginPath();
    ctx.moveTo(vx - w * 0.11, cb - h * 0.46);
    ctx.lineTo(vx, cb - h * 0.56); ctx.lineTo(vx + w * 0.11, cb - h * 0.46);
    ctx.closePath(); ctx.fill();
    [-0.075, 0.075].forEach((o) => spire(ctx, vx + w * o, cb - h * 0.52, w * 0.055, h * 0.4, true));
    // torre sul, mais robusta
    ctx.fillRect(x + w * 0.66, cb - h * 0.4, w * 0.075, h * 0.4);
    ctx.beginPath(); ctx.arc(x + w * 0.6975, cb - h * 0.4, w * 0.045, Math.PI, 0); ctx.fill();
  };

  // Relógio Astronômico: torre da prefeitura, mostradores e as torres do Týn
  L.astroclock = function (ctx, x, base, w, h, p, r) {
    // casas da praça
    for (let i = 0; i < 6; i++) {
      const bw = w / 6, bx = x + i * bw, bh = h * (0.3 + (i % 3) * 0.06);
      ctx.fillRect(bx + bw * 0.04, base - bh, bw * 0.92, bh);
      let sy = base - bh;
      for (let s = 0; s < 3; s++) {
        const ins = bw * (0.1 + s * 0.12);
        ctx.fillRect(bx + ins, sy - bw * 0.1, bw - ins * 2, bw * 0.11);
        sy -= bw * 0.1;
      }
      windows(ctx, bx, base, bw, bh, 2, false);
    }
    // torre da prefeitura com os dois mostradores
    const tx = x + w * 0.26, tw = w * 0.13;
    ctx.fillRect(tx - tw / 2, base - h * 0.8, tw, h * 0.8);
    ctx.fillRect(tx - tw * 0.66, base - h * 0.8, tw * 1.32, h * 0.08);
    ctx.beginPath();
    ctx.moveTo(tx - tw * 0.6, base - h * 0.88);
    ctx.lineTo(tx, base - h * 1.04); ctx.lineTo(tx + tw * 0.6, base - h * 0.88);
    ctx.closePath(); ctx.fill();
    [0.42, 0.6].forEach((o, k) => {
      const cy = base - h * o, rad = tw * (k ? 0.3 : 0.33);
      cut(ctx, () => { ctx.beginPath(); ctx.arc(tx, cy, rad, 0, 6.3); ctx.fill(); });
      ctx.lineWidth = Math.max(1, w * 0.003); ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath(); ctx.arc(tx, cy, rad, 0, 6.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, cy, rad * 0.4, 0, 6.3); ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * 6.283;
        ctx.beginPath();
        ctx.moveTo(tx + Math.cos(a) * rad * 0.72, cy + Math.sin(a) * rad * 0.72);
        ctx.lineTo(tx + Math.cos(a) * rad, cy + Math.sin(a) * rad); ctx.stroke();
      }
    });
    // torres do Týn ao fundo
    [0.68, 0.83].forEach((o) => {
      const bx = x + w * o;
      ctx.fillRect(bx - w * 0.035, base - h * 0.74, w * 0.07, h * 0.74);
      spire(ctx, bx, base - h * 0.74, w * 0.075, h * 0.3, true);
      [-1, 1].forEach((s) => {
        ctx.beginPath();
        ctx.moveTo(bx + s * w * 0.03, base - h * 0.76);
        ctx.lineTo(bx + s * w * 0.042, base - h * 0.86);
        ctx.lineTo(bx + s * w * 0.054, base - h * 0.76);
        ctx.closePath(); ctx.fill();
      });
    });
  };

  // ---- Amsterdam / Luxemburgo ---------------------------------------------

  // Casas de canal: fachadas estreitas, empenas variadas, ponte e bicicletas
  L.canalhouses = function (ctx, x, base, w, h, p, r) {
    const n = 11;
    for (let i = 0; i < n; i++) {
      const bw = w / n, bx = x + i * bw, bh = h * (0.5 + ((i * 7) % 5) * 0.07);
      ctx.fillRect(bx + bw * 0.07, base - bh, bw * 0.86, bh);
      const g = i % 3;
      let sy = base - bh;
      if (g === 0) { // empena em degraus
        for (let s = 0; s < 4; s++) {
          const ins = bw * (0.1 + s * 0.09);
          ctx.fillRect(bx + ins, sy - bw * 0.11, bw - ins * 2, bw * 0.12);
          sy -= bw * 0.11;
        }
      } else if (g === 1) { // empena de campânula
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.07, sy);
        ctx.quadraticCurveTo(bx + bw * 0.5, sy - bw * 0.62, bx + bw * 0.93, sy);
        ctx.closePath(); ctx.fill();
      } else { // bico triangular com gancho de içamento
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.04, sy);
        ctx.lineTo(bx + bw * 0.5, sy - bw * 0.44);
        ctx.lineTo(bx + bw * 0.96, sy); ctx.closePath(); ctx.fill();
        ctx.fillRect(bx + bw * 0.47, sy - bw * 0.5, bw * 0.06, bw * 0.1);
      }
      cut(ctx, () => {
        for (let f = 0; f < 4; f++) {
          for (let c = 0; c < 2; c++) {
            ctx.fillRect(bx + bw * (0.22 + c * 0.34), base - bh + h * 0.03 + f * bh * 0.21,
              bw * 0.22, bh * 0.13);
          }
        }
      });
    }
    // ponte em arco sobre o canal
    const bx2 = x + w * 0.62, bwd = w * 0.3;
    ctx.fillRect(bx2, base - h * 0.05, bwd, h * 0.035);
    cut(ctx, () => {
      ctx.beginPath();
      ctx.arc(bx2 + bwd * 0.5, base - h * 0.015, bwd * 0.3, Math.PI, 0); ctx.fill();
    });
    // bicicletas encostadas no parapeito
    for (let i = 0; i < 4; i++) {
      const wx = x + w * (0.08 + i * 0.1);
      ctx.lineWidth = Math.max(1, w * 0.0035); ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath(); ctx.arc(wx, base - h * 0.022, w * 0.013, 0, 6.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(wx + w * 0.032, base - h * 0.022, w * 0.013, 0, 6.3); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wx, base - h * 0.022); ctx.lineTo(wx + w * 0.016, base - h * 0.055);
      ctx.lineTo(wx + w * 0.032, base - h * 0.022); ctx.stroke();
    }
  };

  // Luxemburgo: a cidade alta sobre o vale, casamatas na rocha e o Grund
  L.corniche = function (ctx, x, base, w, h, p, r) {
    // penhasco
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x, base - h * 0.24);
    ctx.bezierCurveTo(x + w * 0.22, base - h * 0.3, x + w * 0.34, base - h * 0.74, x + w * 0.52, base - h * 0.76);
    ctx.bezierCurveTo(x + w * 0.72, base - h * 0.78, x + w * 0.86, base - h * 0.4, x + w, base - h * 0.3);
    ctx.lineTo(x + w, base); ctx.closePath(); ctx.fill();
    // muralha no alto
    ctx.fillRect(x + w * 0.28, base - h * 0.86, w * 0.48, h * 0.11);
    cut(ctx, () => {
      for (let i = 0; i < 7; i++) {
        ctx.fillRect(x + w * (0.3 + i * 0.066), base - h * 0.88, w * 0.026, h * 0.035);
      }
    });
    // torres e casas da cidade alta
    [0.34, 0.5, 0.66].forEach((o, i) => {
      const tx = x + w * o, tw = w * 0.05;
      ctx.fillRect(tx - tw / 2, base - h * (0.98 + i * 0.02), tw, h * 0.14);
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.7, base - h * (0.98 + i * 0.02));
      ctx.lineTo(tx, base - h * (1.1 + i * 0.02));
      ctx.lineTo(tx + tw * 0.7, base - h * (0.98 + i * 0.02));
      ctx.closePath(); ctx.fill();
    });
    // casamatas: vãos escavados na rocha
    cut(ctx, () => {
      for (let i = 0; i < 5; i++) {
        const ax = x + w * (0.3 + i * 0.1), ay = base - h * (0.42 + (i % 2) * 0.1);
        const aw = w * 0.022;
        ctx.beginPath();
        ctx.arc(ax, ay, aw, Math.PI, 0);
        ctx.rect(ax - aw, ay, aw * 2, h * 0.045); ctx.fill();
      }
    });
    // casario do Grund, embaixo
    for (let i = 0; i < 8; i++) {
      const bx = x + w * (0.04 + i * 0.055), bh = h * (0.08 + (i % 3) * 0.025);
      ctx.fillRect(bx, base - bh, w * 0.042, bh);
      ctx.beginPath();
      ctx.moveTo(bx - w * 0.006, base - bh);
      ctx.lineTo(bx + w * 0.021, base - bh - h * 0.03);
      ctx.lineTo(bx + w * 0.048, base - bh); ctx.closePath(); ctx.fill();
    }
  };

  window.Landmarks = L;
})();
