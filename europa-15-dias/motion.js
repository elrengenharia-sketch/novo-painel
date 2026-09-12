// Camada viva sobre a cena: luz que desloca, água que cintila, partículas.
// Um único loop de animação serve o slide visível; os demais ficam parados.
(function () {
  "use strict";

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rnd(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // que partículas cada céu pede
  function kindOf(sky) {
    if (sky === "night") return "stars";
    if (sky === "alpine") return "snow";
    if (sky === "interior" || sky === "underground") return "dust";
    if (sky === "dawn" || sky === "gold" || sky === "dusk") return "embers";
    return "haze";
  }

  const TONE = {
    stars:  "rgba(214,228,255,",
    snow:   "rgba(255,255,255,",
    dust:   "rgba(210,178,120,",
    embers: "rgba(255,208,150,",
    haze:   "rgba(255,250,240,"
  };

  function Field(canvas, scene) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = scene;
    this.art = scene.art || {};
    this.kind = kindOf(this.art.sky);
    this.r = rnd(scene.name.length * 7919 + (this.art.kind || "").length * 104729);
    this.parts = [];
    this.t = 0;
    this.size();
  }

  Field.prototype.size = function () {
    const box = this.c.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = Math.max(2, Math.round(box.width));
    this.H = Math.max(2, Math.round(box.height));
    this.c.width = this.W * this.dpr;
    this.c.height = this.H * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.horizon = (this.art.sky === "interior" || this.art.sky === "underground")
      ? this.H * 0.9 : this.H * (this.art.water ? 0.62 : 0.74);
    this.seed();
  };

  Field.prototype.seed = function () {
    const n = this.kind === "haze" ? 26 : this.kind === "stars" ? 70 : 46;
    this.parts = [];
    for (let i = 0; i < n; i++) {
      const top = this.kind === "stars" ? this.horizon * 0.86 : this.H;
      this.parts.push({
        x: this.r() * this.W,
        y: this.r() * top,
        z: 0.3 + this.r() * 0.7,
        p: this.r() * 6.28,
        s: 0.4 + this.r() * 1.5
      });
    }
    // faixas de brilho na água
    this.glints = [];
    if (this.art.water) {
      for (let i = 0; i < 30; i++) {
        this.glints.push({
          y: this.r(),
          x: this.r(),
          w: 0.04 + this.r() * 0.24,
          p: this.r() * 6.28,
          sp: 0.25 + this.r() * 0.7
        });
      }
    }
  };

  Field.prototype.frame = function (dt) {
    const ctx = this.ctx, W = this.W, H = this.H;
    this.t += dt;
    const t = this.t;
    ctx.clearRect(0, 0, W, H);

    // bruma de luz que passeia devagar
    const gx = W * (0.5 + Math.sin(t * 0.045) * 0.34);
    const gy = this.horizon - H * (0.16 + Math.cos(t * 0.031) * 0.07);
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, H * 0.62);
    const warm = this.art.sky === "night" ? "rgba(150,185,255," : "rgba(255,226,178,";
    g.addColorStop(0, warm + (0.2 + Math.sin(t * 0.12) * 0.05) + ")");
    g.addColorStop(0.5, warm + "0.05)");
    g.addColorStop(1, warm + "0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, this.horizon + 4);

    // água: cintilância horizontal
    if (this.art.water) {
      const top = this.horizon, span = H - top;
      ctx.save();
      ctx.beginPath(); ctx.rect(0, top, W, span); ctx.clip();
      for (let i = 0; i < this.glints.length; i++) {
        const q = this.glints[i];
        const y = top + span * Math.pow(q.y, 1.4);
        const wob = Math.sin(t * q.sp + q.p);
        const x = (q.x * W + wob * W * 0.04 + W) % W;
        const w = W * q.w * (0.7 + 0.3 * Math.abs(wob));
        const a = 0.05 + 0.14 * (0.5 + 0.5 * Math.sin(t * q.sp * 1.7 + q.p));
        ctx.fillStyle = "rgba(255,244,224," + (a * (0.35 + q.y)) + ")";
        ctx.fillRect(x - w / 2, y, w, Math.max(1, H * 0.0035));
      }
      ctx.restore();
    }

    // partículas
    const tone = TONE[this.kind];
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i];
      let x = p.x, y = p.y, a = 0;

      if (this.kind === "stars") {
        a = 0.25 + 0.6 * Math.abs(Math.sin(t * (0.4 + p.z) + p.p));
        a *= 1 - y / (this.horizon * 0.9);
      } else if (this.kind === "snow") {
        p.y += dt * 16 * p.z;
        p.x += Math.sin(t * 0.6 + p.p) * dt * 12 * p.z;
        if (p.y > H) { p.y = -8; p.x = this.r() * W; }
        x = p.x; y = p.y; a = 0.28 * p.z;
      } else if (this.kind === "dust") {
        p.y -= dt * 4 * p.z;
        p.x += Math.sin(t * 0.25 + p.p) * dt * 7;
        if (p.y < -8) { p.y = H + 8; p.x = this.r() * W; }
        x = p.x; y = p.y;
        a = (0.1 + 0.16 * Math.abs(Math.sin(t * 0.5 + p.p))) * p.z;
      } else if (this.kind === "embers") {
        p.y -= dt * 7 * p.z;
        p.x += Math.sin(t * 0.4 + p.p) * dt * 9;
        if (p.y < -8) { p.y = H + 8; p.x = this.r() * W; }
        x = p.x; y = p.y;
        a = (0.08 + 0.2 * Math.abs(Math.sin(t * 0.7 + p.p))) * p.z;
      } else {
        p.x += dt * 5 * p.z;
        if (p.x > W + 20) { p.x = -20; p.y = this.r() * this.horizon; }
        x = p.x; y = p.y + Math.sin(t * 0.3 + p.p) * 4;
        a = 0.05 * p.z;
      }

      if (a <= 0.004) continue;
      const s = p.s * (this.kind === "haze" ? 9 : 1.5) * p.z;
      ctx.fillStyle = tone + a.toFixed(3) + ")";
      if (this.kind === "haze") {
        ctx.beginPath(); ctx.ellipse(x, y, s * 3, s, 0, 0, 6.3); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(x, y, s, 0, 6.3); ctx.fill();
      }
    }
  };

  // ---- orquestração --------------------------------------------------------

  let fields = new Map(), active = null, raf = null, last = 0;

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (active) active.frame(dt);
  }

  const Motion = {
    attach: function (canvas, scene) {
      const f = new Field(canvas, scene);
      fields.set(canvas, f);
      return f;
    },
    play: function (canvas, scene) {
      if (reduce) { active = null; return; }
      let f = fields.get(canvas);
      if (!f || f.scene !== scene) { f = this.attach(canvas, scene); }
      f.size();
      active = f;
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    },
    pause: function () { if (raf) { cancelAnimationFrame(raf); raf = null; } },
    resume: function () { if (!raf && active) { last = performance.now(); raf = requestAnimationFrame(loop); } },
    resize: function () { fields.forEach((f) => f.size()); }
  };

  window.Motion = Motion;
})();
