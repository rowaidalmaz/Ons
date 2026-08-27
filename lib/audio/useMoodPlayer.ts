"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MoodAudioType = "rain" | "pad" | "air" | "arp" | "arp-fast";

interface AudioNodeHandle {
  stop?: () => void;
  disconnect?: () => void;
}

/**
 * Ported directly from reference/manara.html's playMood()/stopAll() — a
 * generative Web Audio soundscape (rain noise, sine pads, bandpass "air"
 * noise, triangle-wave arpeggios), never streamed/licensed music. Must only
 * be used from a client component: AudioContext is browser-only, and it must
 * be created inside a user-gesture handler (a mood button click), never on
 * mount, to respect the browser autoplay policy.
 */
export function useMoodPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodeHandle[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const eqTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [eqLevels, setEqLevels] = useState<number[]>(Array(8).fill(20));
  const [volume, setVolumeState] = useState(0.5);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtor();
    }
    return ctxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop?.();
      } catch {
        // node may already be stopped
      }
      try {
        n.disconnect?.();
      } catch {
        // node may already be disconnected
      }
    });
    nodesRef.current = [];
    playingRef.current = false;
    setPlaying(false);
    if (eqTimerRef.current) {
      clearInterval(eqTimerRef.current);
      eqTimerRef.current = null;
    }
    setEqLevels(Array(8).fill(20));
  }, []);

  const makeNoiseBuffer = (ctx: AudioContext) => {
    const size = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  };

  const play = useCallback(
    (type: MoodAudioType) => {
      const ctx = ensureCtx();
      stopAll();

      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      masterGainRef.current = master;
      nodesRef.current.push(master);

      if (type === "rain") {
        const src = ctx.createBufferSource();
        src.buffer = makeNoiseBuffer(ctx);
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 700;
        src.connect(filter);
        filter.connect(master);
        src.start();
        nodesRef.current.push(src, filter);
      } else if (type === "pad") {
        [220, 224, 330].forEach((f) => {
          const o = ctx.createOscillator();
          o.type = "sine";
          o.frequency.value = f;
          const g = ctx.createGain();
          g.gain.value = 0.1;
          o.connect(g);
          g.connect(master);
          o.start();
          nodesRef.current.push(o, g);
        });
      } else if (type === "air") {
        const src = ctx.createBufferSource();
        src.buffer = makeNoiseBuffer(ctx);
        src.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1800;
        filter.Q.value = 0.6;
        const g = ctx.createGain();
        g.gain.value = 0.13;
        src.connect(filter);
        filter.connect(g);
        g.connect(master);
        src.start();
        nodesRef.current.push(src, filter, g);
      } else if (type === "arp" || type === "arp-fast") {
        const notes = [392, 440, 523.25, 587.33, 659.25];
        let i = 0;
        const speed = type === "arp-fast" ? 220 : 380;
        const g = ctx.createGain();
        g.gain.value = 0.16;
        g.connect(master);
        nodesRef.current.push(g);
        const arpInterval = setInterval(() => {
          if (!playingRef.current) return;
          const o = ctx.createOscillator();
          o.type = "triangle";
          o.frequency.value = notes[i % notes.length];
          const eg = ctx.createGain();
          eg.gain.setValueAtTime(0.2, ctx.currentTime);
          eg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          o.connect(eg);
          eg.connect(g);
          o.start();
          o.stop(ctx.currentTime + 0.32);
          i++;
        }, speed);
        nodesRef.current.push({ stop: () => clearInterval(arpInterval) });
      }

      playingRef.current = true;
      setPlaying(true);
      eqTimerRef.current = setInterval(() => {
        setEqLevels(
          Array.from({ length: 8 }, () => (playingRef.current ? 15 + Math.random() * 85 : 20)),
        );
      }, 180);
    },
    [ensureCtx, stopAll, volume],
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
  }, []);

  useEffect(() => stopAll, [stopAll]);

  return { playing, eqLevels, volume, play, stopAll, setVolume };
}
