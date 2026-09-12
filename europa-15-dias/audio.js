// Trilha sonora sintetizada: bateria, baixo, acordes e melodia.
// Cada cidade tem seu próprio tema — andamento, progressão, groove e motivo.
//
// Para usar uma música sua no lugar: coloque o endereço de um MP3 em
// CUSTOM_TRACK abaixo. Precisa ser um link direto para o arquivo.
const CUSTOM_TRACK = "";

(function () {
  "use strict";

  const MAJOR = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];

  // prog = progressão em semitons a partir da tônica, com qualidade
  // motif = [passo no compasso, grau da escala, duração em passos]
  const MOTIFS = {
    lirico:  [[0, 4, 3], [3, 2, 2], [6, 4, 2], [8, 6, 4], [12, 5, 3]],
    saltado: [[0, 0, 2], [2, 2, 2], [4, 4, 2], [6, 2, 2], [8, 4, 3], [11, 6, 2], [14, 4, 2]],
    calmo:   [[0, 2, 6], [6, 4, 4], [10, 6, 5]],
    animado: [[0, 4, 2], [2, 4, 1], [3, 5, 2], [6, 4, 2], [8, 2, 2], [10, 4, 2], [12, 6, 4]],
    valsa:   [[0, 4, 4], [4, 6, 4], [8, 5, 3], [11, 4, 2], [13, 2, 3]]
  };

  const I = "M", m = "m";
  const THEMES = {
    paris:      { root: 293.66, bpm: 112, groove: "straight", motif: "lirico",
                  prog: [[0,I],[9,m],[5,I],[7,I]], lead: "triangle" },
    brussels:   { root: 261.63, bpm: 108, groove: "straight", motif: "saltado",
                  prog: [[0,I],[5,I],[7,I],[0,I]], lead: "square" },
    amsterdam:  { root: 293.66, bpm: 104, groove: "shuffle", motif: "calmo",
                  prog: [[0,I],[7,I],[9,m],[5,I]], lead: "triangle" },
    cologne:    { root: 261.63, bpm: 116, groove: "four",     motif: "animado",
                  prog: [[0,I],[9,m],[2,m],[7,I]], lead: "sawtooth" },
    luxembourg: { root: 277.18, bpm: 100, groove: "straight", motif: "calmo",
                  prog: [[0,I],[5,I],[9,m],[7,I]], lead: "triangle" },
    strasbourg: { root: 311.13, bpm: 110, groove: "straight", motif: "lirico",
                  prog: [[0,I],[7,I],[5,I],[9,m]], lead: "triangle" },
    lucerne:    { root: 329.63, bpm: 96,  groove: "straight", motif: "calmo",
                  prog: [[0,I],[5,I],[7,I],[5,I]], lead: "sine" },
    milan:      { root: 311.13, bpm: 124, groove: "four",     motif: "animado",
                  prog: [[0,I],[9,m],[5,I],[7,I]], lead: "sawtooth" },
    venice:     { root: 329.63, bpm: 102, groove: "shuffle",  motif: "lirico",
                  prog: [[0,I],[4,m],[5,I],[7,I]], lead: "triangle" },
    budapest:   { root: 329.63, bpm: 126, groove: "four",     motif: "animado",
                  prog: [[0,I],[9,m],[7,I],[5,I]], lead: "sawtooth" },
    bratislava: { root: 293.66, bpm: 114, groove: "straight", motif: "saltado",
                  prog: [[0,I],[7,I],[9,m],[5,I]], lead: "square" },
    krakow:     { root: 277.18, bpm: 106, groove: "straight", motif: "lirico",
                  prog: [[0,I],[9,m],[5,I],[0,I]], lead: "triangle" },
    prague:     { root: 311.13, bpm: 118, groove: "shuffle",  motif: "animado",
                  prog: [[0,I],[5,I],[9,m],[7,I]], lead: "sawtooth" },
    vienna:     { root: 293.66, bpm: 120, groove: "valsa",    motif: "valsa",
                  prog: [[0,I],[7,I],[0,I],[5,I]], lead: "sawtooth" }
  };

  // ---- grooves: posições no compasso de 16 passos ---------------------------
  const GROOVE = {
    straight: { kick: [0, 6, 8], snare: [4, 12], hat: [0,2,4,6,8,10,12,14], bass: [0,3,6,8,11,14] },
    four:     { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2,6,10,14], bass: [0,2,4,6,8,10,12,14] },
    shuffle:  { kick: [0, 7, 8], snare: [4, 12], hat: [0,3,4,7,8,11,12,15], bass: [0,4,7,8,12,15] },
    valsa:    { kick: [0], snare: [4, 8], hat: [0,2,4,6,8,10], bass: [0], oompah: [4, 8] }
  };

  let ctx = null, master = null, bus = {}, verb = null;
  let tickTimer = null, nextTime = 0, step = 0;
  let theme = THEMES.paris, current = null, enabled = false;
  let audioEl = null;

  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }
  let noiseBuf = null;
  function noise() {
    if (!noiseBuf) {
      const len = ctx.sampleRate * 2;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf; s.loop = true;
    return s;
  }

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    // teto suave para a mistura não estourar quando tudo toca junto
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.release.value = 0.25;
    master.connect(comp); comp.connect(ctx.destination);

    verb = ctx.createConvolver();
    verb.buffer = impulse(1.1, 3.6);
    const vg = ctx.createGain(); vg.gain.value = 0.2;
    verb.connect(vg); vg.connect(master);

    ["drums", "bass", "chord", "lead"].forEach((n) => {
      const g = ctx.createGain();
      g.gain.value = { drums: 0.5, bass: 0.5, chord: 0.26, lead: 0.3 }[n];
      g.connect(master);
      bus[n] = g;
    });
    bus.chord.connect(verb);
    bus.lead.connect(verb);
    return true;
  }

  const hz = (root, semi) => root * Math.pow(2, semi / 12);

  // ---- instrumentos --------------------------------------------------------

  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(128, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.09);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
    o.connect(g); g.connect(bus.drums);
    o.start(t); o.stop(t + 0.2);
  }

  function snare(t) {
    const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    n.connect(f); f.connect(g); g.connect(bus.drums);
    n.start(t); n.stop(t + 0.16);
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = "triangle"; o.frequency.value = 188;
    og.gain.setValueAtTime(0.3, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(og); og.connect(bus.drums);
    o.start(t); o.stop(t + 0.12);
  }

  function hat(t, open) {
    const n = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "highpass"; f.frequency.value = 7200;
    const d = open ? 0.16 : 0.035;
    g.gain.setValueAtTime(open ? 0.16 : 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    n.connect(f); f.connect(g); g.connect(bus.drums);
    n.start(t); n.stop(t + d + 0.02);
  }

  function bassNote(freq, t, len) {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = "sawtooth"; o.frequency.value = freq;
    f.type = "lowpass"; f.Q.value = 5;
    f.frequency.setValueAtTime(1100, t);
    f.frequency.exponentialRampToValueAtTime(320, t + len * 0.8);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.42, t + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(f); f.connect(g); g.connect(bus.bass);
    o.start(t); o.stop(t + len + 0.05);
  }

  function chordStab(freqs, t, len) {
    freqs.forEach((fr, i) => {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "sawtooth"; o.frequency.value = fr;
      o.detune.value = (i % 2 ? 6 : -6);
      f.type = "lowpass"; f.frequency.value = 2400; f.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(f); f.connect(g); g.connect(bus.chord);
      o.start(t); o.stop(t + len + 0.05);
    });
  }

  function leadNote(freq, t, len) {
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = theme.lead; o.frequency.value = freq;
    f.type = "lowpass"; f.Q.value = 3;
    f.frequency.setValueAtTime(4200, t);
    f.frequency.exponentialRampToValueAtTime(1500, t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.34, t + 0.02);
    g.gain.setTargetAtTime(0.22, t + 0.05, 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    // leve vibrato, para a melodia não soar rígida
    const lfo = ctx.createOscillator(), amt = ctx.createGain();
    lfo.frequency.value = 5.2; amt.gain.value = freq * 0.006;
    lfo.connect(amt); amt.connect(o.frequency);
    lfo.start(t); lfo.stop(t + len + 0.05);
    o.connect(f); f.connect(g); g.connect(bus.lead);
    o.start(t); o.stop(t + len + 0.05);
  }

  // ---- sequenciador --------------------------------------------------------

  function scheduleStep(n, t) {
    const g = GROOVE[theme.groove] || GROOVE.straight;
    const perBar = theme.groove === "valsa" ? 12 : 16;
    const s = n % perBar;
    const bar = Math.floor(n / perBar);
    const [ro, qual] = theme.prog[bar % theme.prog.length];
    const stepDur = 60 / theme.bpm / 4;

    // bateria
    if (g.kick.indexOf(s) >= 0) kick(t);
    if (g.snare.indexOf(s) >= 0) snare(t);
    if (g.hat.indexOf(s) >= 0) hat(t, s % 8 === 6);

    // baixo na fundamental do acorde
    if (g.bass.indexOf(s) >= 0) {
      const oct = s === 0 ? -24 : (s % 8 === 0 ? -24 : -12);
      bassNote(hz(theme.root, ro + oct), t, stepDur * 2.2);
    }

    // acordes: contratempo no groove comum, oom-pah na valsa
    const triad = qual === "m" ? [0, 3, 7] : [0, 4, 7];
    const voicing = triad.map((iv) => hz(theme.root, ro + iv - 12));
    if (theme.groove === "valsa") {
      if (g.oompah.indexOf(s) >= 0) chordStab(voicing, t, stepDur * 2.6);
    } else if (s === 4 || s === 12 || s === 10) {
      chordStab(voicing, t, stepDur * 2);
    }

    // melodia
    const motif = MOTIFS[theme.motif] || MOTIFS.lirico;
    for (let i = 0; i < motif.length; i++) {
      const [ms, deg, len] = motif[i];
      if (ms !== s) continue;
      // a cada duas voltas a frase sobe um grau, para não repetir igual
      const lift = Math.floor(bar / theme.prog.length) % 2 ? 1 : 0;
      const semi = MAJOR[Math.min(MAJOR.length - 1, deg + lift)];
      leadNote(hz(theme.root, semi), t, stepDur * len * 0.92);
    }
  }

  function tick() {
    if (!enabled || !ctx) return;
    const stepDur = 60 / theme.bpm / 4;
    while (nextTime < ctx.currentTime + 0.18) {
      if (nextTime > ctx.currentTime - 0.05) scheduleStep(step, nextTime);
      nextTime += stepDur;
      step++;
    }
  }

  function apply(id) {
    theme = THEMES[id] || THEMES.paris;
    current = id;
    if (!ctx || !enabled) return;
    // recomeça no primeiro tempo do compasso ao trocar de cidade
    step = 0;
    nextTime = Math.max(nextTime, ctx.currentTime + 0.06);
  }

  // ---- faixa própria, se houver -------------------------------------------

  function useTrack() {
    if (!CUSTOM_TRACK) return false;
    if (!audioEl) {
      audioEl = new Audio(CUSTOM_TRACK);
      audioEl.loop = true;
      audioEl.volume = 0.45;
    }
    return true;
  }

  const Ambience = {
    get enabled() { return enabled; },
    available: function () {
      return !!CUSTOM_TRACK || !!(window.AudioContext || window.webkitAudioContext);
    },
    start: function (id) {
      if (useTrack()) {
        enabled = true;
        audioEl.play().catch(() => {});
        return true;
      }
      if (!ctx && !build()) return false;
      if (ctx.state === "suspended") ctx.resume();
      enabled = true;
      master.gain.setTargetAtTime(0.34, ctx.currentTime, 0.8);
      step = 0;
      nextTime = ctx.currentTime + 0.1;
      apply(id || current || "paris");
      if (!tickTimer) tickTimer = setInterval(tick, 25);
      return true;
    },
    stop: function () {
      enabled = false;
      if (audioEl) { audioEl.pause(); return; }
      if (!ctx) return;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    },
    toggle: function (id) {
      if (enabled) { this.stop(); return false; }
      return this.start(id);
    },
    setChapter: function (id) {
      if (id === current) return;
      if (audioEl) { current = id; return; }
      if (!enabled) { current = id; theme = THEMES[id] || theme; return; }
      apply(id);
    }
  };

  window.Ambience = Ambience;
})();
