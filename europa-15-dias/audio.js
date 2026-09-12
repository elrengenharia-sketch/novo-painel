// Ambiente sonoro sintetizado: arpejo em movimento sobre acorde maior.
// Sem arquivos externos — funciona offline e só começa depois de um gesto do usuário.
(function () {
  "use strict";

  // root: nota base (Hz, registro médio) · chord: intervalos em semitons
  // bpm: andamento · beats: 3 = valsa, 4 = binário · pat: caminho do arpejo
  // wave: timbre · cut: brilho do filtro (Hz) · air: textura de fundo (0–1)
  const MOODS = {
    paris:      { root: 293.66, chord: [0, 4, 7, 11, 16], bpm: 112, beats: 3, pat: "up",     wave: "sawtooth", cut: 2600, air: 0.05 },
    brussels:   { root: 261.63, chord: [0, 4, 7, 9, 16],  bpm: 108, beats: 4, pat: "updown", wave: "triangle", cut: 2400, air: 0.05 },
    amsterdam:  { root: 293.66, chord: [0, 2, 7, 11, 14], bpm: 100, beats: 4, pat: "skip",   wave: "triangle", cut: 3200, air: 0.16 },
    cologne:    { root: 261.63, chord: [0, 4, 7, 12, 16], bpm: 104, beats: 4, pat: "up",     wave: "triangle", cut: 2800, air: 0.05 },
    luxembourg: { root: 277.18, chord: [0, 4, 7, 9, 14],  bpm: 100, beats: 4, pat: "updown", wave: "sine",     cut: 2400, air: 0.07 },
    strasbourg: { root: 311.13, chord: [0, 4, 7, 11, 14], bpm: 106, beats: 3, pat: "up",     wave: "sawtooth", cut: 2600, air: 0.06 },
    lucerne:    { root: 329.63, chord: [0, 7, 12, 16, 19], bpm: 96, beats: 4, pat: "updown", wave: "sine",     cut: 3600, air: 0.20 },
    milan:      { root: 311.13, chord: [0, 4, 7, 9, 16],  bpm: 120, beats: 4, pat: "skip",   wave: "sawtooth", cut: 3100, air: 0.06 },
    venice:     { root: 329.63, chord: [0, 4, 7, 11, 14], bpm: 104, beats: 3, pat: "updown", wave: "triangle", cut: 3000, air: 0.20 },
    vienna:     { root: 293.66, chord: [0, 4, 7, 11, 16], bpm: 168, beats: 3, pat: "up",     wave: "sawtooth", cut: 2800, air: 0.04 },
    budapest:   { root: 329.63, chord: [0, 4, 6, 11, 16], bpm: 124, beats: 4, pat: "skip",   wave: "sawtooth", cut: 3000, air: 0.10 },
    bratislava: { root: 293.66, chord: [0, 4, 7, 14, 16], bpm: 114, beats: 4, pat: "up",     wave: "triangle", cut: 2600, air: 0.07 },
    krakow:     { root: 277.18, chord: [0, 4, 7, 12, 16], bpm: 106, beats: 4, pat: "updown", wave: "triangle", cut: 2500, air: 0.06 },
    prague:     { root: 311.13, chord: [0, 4, 6, 11, 14], bpm: 112, beats: 4, pat: "skip",   wave: "sawtooth", cut: 2900, air: 0.08 }
  };

  const PATTERNS = {
    up:     [0, 1, 2, 3, 4, 3, 2, 1],
    updown: [0, 2, 4, 2, 1, 3, 4, 3],
    skip:   [0, 2, 1, 4, 2, 3, 0, 4]
  };

  let ctx = null, master = null, verb = null, dry = null;
  let padVoices = [], airGain = null, airFilter = null;
  let tickTimer = null, nextTime = 0, step = 0;
  let mood = MOODS.paris, current = null, enabled = false;

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // reverb curto: dá espaço sem virar catedral
    verb = ctx.createConvolver();
    verb.buffer = impulse(1.3, 3.4);
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.26;
    verb.connect(verbGain); verbGain.connect(master);

    dry = ctx.createGain();
    dry.gain.value = 0.9;
    dry.connect(master);

    // textura leve (água, ar) — discreta, só para dar lugar
    const len = ctx.sampleRate * 4;
    const nb = ctx.createBuffer(1, len, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.04 * w) / 1.04;
      nd[i] = last * 2.4;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = nb; noise.loop = true;
    airFilter = ctx.createBiquadFilter();
    airFilter.type = "bandpass"; airFilter.frequency.value = 2600; airFilter.Q.value = 0.6;
    airGain = ctx.createGain(); airGain.gain.value = 0;
    noise.connect(airFilter); airFilter.connect(airGain);
    airGain.connect(dry);
    noise.start();
    return true;
  }

  const hz = (root, semi) => root * Math.pow(2, semi / 12);

  // nota dedilhada: ataque rápido, cauda curta
  function pluck(freq, time, vel) {
    const osc = ctx.createOscillator();
    osc.type = mood.wave;
    osc.frequency.value = freq;

    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(mood.cut * 1.7, time);
    filt.frequency.exponentialRampToValueAtTime(mood.cut * 0.55, time + 0.32);
    filt.Q.value = 1.2;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vel, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);

    osc.connect(filt); filt.connect(g);
    g.connect(dry); g.connect(verb);
    osc.start(time); osc.stop(time + 0.6);
  }

  // baixo macio marcando o tempo forte
  function bass(freq, time) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.13, time + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);
    osc.connect(g); g.connect(dry);
    osc.start(time); osc.stop(time + 0.75);
  }

  function scheduleStep(n, time) {
    const pat = PATTERNS[mood.pat] || PATTERNS.up;
    const perBar = mood.beats * 2;
    const inBar = n % perBar;

    // arpejo em colcheias
    const deg = pat[n % pat.length];
    const oct = (Math.floor(n / pat.length) % 2) ? 12 : 0;
    const accent = inBar === 0 ? 1 : (inBar % 2 === 0 ? 0.72 : 0.5);
    pluck(hz(mood.root, mood.chord[deg] + oct), time, 0.1 * accent);

    // brilho uma oitava acima nos tempos fortes
    if (inBar === 0 || (mood.beats === 4 && inBar === 4)) {
      pluck(hz(mood.root, mood.chord[deg] + 24), time + 0.006, 0.035);
    }

    // baixo: valsa marca só o 1; binário marca 1 e 3
    if (inBar === 0) bass(hz(mood.root, -24), time);
    else if (mood.beats === 4 && inBar === 4) bass(hz(mood.root, mood.chord[2] - 24), time);
    // valsa: acompanhamento nos tempos 2 e 3
    else if (mood.beats === 3 && (inBar === 2 || inBar === 4)) {
      pluck(hz(mood.root, mood.chord[2]), time, 0.045);
      pluck(hz(mood.root, mood.chord[1]), time + 0.004, 0.04);
    }
  }

  function tick() {
    if (!enabled || !ctx) return;
    const stepDur = 60 / mood.bpm / 2;
    while (nextTime < ctx.currentTime + 0.14) {
      if (nextTime > ctx.currentTime - 0.05) scheduleStep(step, nextTime);
      nextTime += stepDur;
      step++;
    }
  }

  function setPad(t) {
    padVoices.forEach((v) => {
      v.gain.gain.cancelScheduledValues(t);
      v.gain.gain.setTargetAtTime(0, t, 0.5);
      try { v.osc.stop(t + 2.5); } catch (e) {}
    });
    padVoices = [];

    // colchão suave sob o arpejo, em registro médio
    [0, 2, 3].forEach((di, i) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = hz(mood.root, mood.chord[di] - 12);
      osc.detune.value = (i % 2 ? 1 : -1) * 5;

      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = mood.cut * 0.8;
      filt.Q.value = 0.8;

      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(0.032 / (i * 0.5 + 1), t, 1.4);

      osc.connect(filt); filt.connect(g);
      g.connect(dry); g.connect(verb);
      osc.start();
      padVoices.push({ osc: osc, gain: g });
    });
  }

  function apply(id) {
    if (!ctx || !enabled) return;
    mood = MOODS[id] || MOODS.paris;
    const t = ctx.currentTime;
    setPad(t);
    airGain.gain.setTargetAtTime(mood.air * 0.22, t, 1.5);
    airFilter.frequency.setTargetAtTime(mood.cut * 1.2, t, 1.5);
    // realinha o compasso na troca de capítulo
    step = 0;
    nextTime = Math.max(nextTime, t + 0.08);
    current = id;
  }

  const Ambience = {
    get enabled() { return enabled; },
    available: function () { return !!(window.AudioContext || window.webkitAudioContext); },
    start: function (id) {
      if (!ctx && !build()) return false;
      if (ctx.state === "suspended") ctx.resume();
      enabled = true;
      master.gain.setTargetAtTime(0.42, ctx.currentTime, 1.1);
      nextTime = ctx.currentTime + 0.1;
      step = 0;
      apply(id || current || "paris");
      if (!tickTimer) tickTimer = setInterval(tick, 25);
      return true;
    },
    stop: function () {
      if (!ctx) return;
      enabled = false;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    },
    toggle: function (id) {
      if (enabled) { this.stop(); return false; }
      return this.start(id);
    },
    setChapter: function (id) {
      if (id === current) return;
      if (!enabled) { current = id; return; }
      apply(id);
    }
  };

  window.Ambience = Ambience;
})();
