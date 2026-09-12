// Ambiente sonoro sintetizado: um acorde e uma textura por capítulo.
// Sem arquivos externos — funciona offline e só começa depois de um gesto do usuário.
(function () {
  "use strict";

  // root = nota base (Hz) · chord = intervalos em semitons · air = ruído (0–1)
  // bell = intervalo médio entre sinos (s, 0 = sem sino) · cut = corte do filtro (Hz)
  const MOODS = {
    paris:      { root: 146.83, chord: [0, 7, 16, 23], wave: "sawtooth", air: 0.10, bell: 0,  cut: 900,  q: 3 },
    brussels:   { root: 130.81, chord: [0, 7, 12, 16], wave: "triangle", air: 0.08, bell: 0,  cut: 820,  q: 2 },
    amsterdam:  { root: 110.00, chord: [0, 7, 14, 21], wave: "sine",     air: 0.30, bell: 0,  cut: 1500, q: 1 },
    cologne:    { root: 98.00,  chord: [0, 7, 12, 19], wave: "sine",     air: 0.06, bell: 11, cut: 700,  q: 4 },
    luxembourg: { root: 123.47, chord: [0, 5, 12, 17], wave: "triangle", air: 0.12, bell: 0,  cut: 640,  q: 3 },
    strasbourg: { root: 138.59, chord: [0, 4, 11, 16], wave: "sawtooth", air: 0.09, bell: 14, cut: 880,  q: 3 },
    lucerne:    { root: 164.81, chord: [0, 7, 12, 19], wave: "sine",     air: 0.34, bell: 0,  cut: 2200, q: 1 },
    italy:      { root: 155.56, chord: [0, 4, 7, 14],  wave: "sawtooth", air: 0.22, bell: 0,  cut: 1200, q: 2 },
    vienna:     { root: 130.81, chord: [0, 4, 7, 16],  wave: "sawtooth", air: 0.07, bell: 0,  cut: 1000, q: 3 },
    budapest:   { root: 116.54, chord: [0, 3, 10, 15], wave: "triangle", air: 0.26, bell: 0,  cut: 760,  q: 3 },
    bratislava: { root: 110.00, chord: [0, 5, 10, 17], wave: "sine",     air: 0.16, bell: 0,  cut: 820,  q: 2 },
    krakow:     { root: 103.83, chord: [0, 3, 7, 14],  wave: "triangle", air: 0.10, bell: 17, cut: 600,  q: 4 },
    prague:     { root: 98.00,  chord: [0, 3, 10, 14], wave: "sawtooth", air: 0.12, bell: 9,  cut: 720,  q: 4 }
  };

  let ctx = null, master = null, verb = null, dry = null;
  let voices = [], noiseGain = null, noiseFilter = null, bellTimer = null;
  let current = null, enabled = false;

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
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

    verb = ctx.createConvolver();
    verb.buffer = impulse(3.4, 2.6);
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.55;
    verb.connect(verbGain); verbGain.connect(master);

    dry = ctx.createGain();
    dry.gain.value = 0.65;
    dry.connect(master);

    // leito de ruído (água, vento, sala)
    const len = ctx.sampleRate * 4;
    const nb = ctx.createBuffer(1, len, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      nd[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = nb; noise.loop = true;
    noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass"; noiseFilter.frequency.value = 700; noiseFilter.Q.value = 0.7;
    noiseGain = ctx.createGain(); noiseGain.gain.value = 0;
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain);
    noiseGain.connect(dry); noiseGain.connect(verb);
    noise.start();

    // LFO lento na frequência do filtro: dá movimento de respiração
    const lfo = ctx.createOscillator(), lfoAmt = ctx.createGain();
    lfo.frequency.value = 0.06; lfoAmt.gain.value = 240;
    lfo.connect(lfoAmt); lfoAmt.connect(noiseFilter.frequency);
    lfo.start();
    return true;
  }

  function clearVoices(t) {
    voices.forEach((v) => {
      v.gain.gain.cancelScheduledValues(t);
      v.gain.gain.setTargetAtTime(0, t, 0.9);
      try { v.osc.stop(t + 4); } catch (e) {}
    });
    voices = [];
  }

  function apply(id) {
    if (!ctx || !enabled) return;
    const m = MOODS[id] || MOODS.paris;
    const t = ctx.currentTime;
    clearVoices(t);
    if (bellTimer) { clearInterval(bellTimer); bellTimer = null; }

    m.chord.forEach((semi, i) => {
      const osc = ctx.createOscillator();
      osc.type = m.wave;
      osc.frequency.value = m.root * Math.pow(2, semi / 12);
      osc.detune.value = (i % 2 ? 1 : -1) * (4 + i * 2);

      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = m.cut; filt.Q.value = m.q;

      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(0.16 / (i + 1.3), t, 2.2);

      // leve oscilação de amplitude por voz
      const trem = ctx.createOscillator(), tremAmt = ctx.createGain();
      trem.frequency.value = 0.05 + i * 0.017;
      tremAmt.gain.value = 0.03;
      trem.connect(tremAmt); tremAmt.connect(g.gain); trem.start();

      osc.connect(filt); filt.connect(g);
      g.connect(dry); g.connect(verb);
      osc.start();
      voices.push({ osc: osc, gain: g });
    });

    noiseGain.gain.setTargetAtTime(m.air * 0.32, t, 2.5);
    noiseFilter.frequency.setTargetAtTime(m.cut * 1.4, t, 2.5);

    if (m.bell) {
      const ring = () => {
        if (!enabled || !ctx) return;
        const now = ctx.currentTime;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = m.root * Math.pow(2, (m.chord[1 + Math.floor(Math.random() * 2)] + 24) / 12);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
        o.connect(g); g.connect(verb); g.connect(dry);
        o.start(now); o.stop(now + 6);
      };
      bellTimer = setInterval(ring, m.bell * 1000);
      setTimeout(ring, 1800);
    } else {
      noiseGain.gain.setTargetAtTime(m.air * 0.32, t, 2.5);
    }
    current = id;
  }

  const Ambience = {
    get enabled() { return enabled; },
    available: function () { return !!(window.AudioContext || window.webkitAudioContext); },
    start: function (id) {
      if (!ctx && !build()) return false;
      if (ctx.state === "suspended") ctx.resume();
      enabled = true;
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 1.6);
      apply(id || current || "paris");
      return true;
    },
    stop: function () {
      if (!ctx) return;
      enabled = false;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
      if (bellTimer) { clearInterval(bellTimer); bellTimer = null; }
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
