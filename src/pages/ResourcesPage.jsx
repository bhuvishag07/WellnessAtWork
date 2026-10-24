import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Wind,
  Volume2,
  VolumeX,
  ChevronRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';
import Modal from '../components/Modal';

export const ResourcesPage = () => {
  const { wellnessResources } = useWellness();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  // Interactive Breathing Widget State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = React.useRef(null);
  const activeNodesRef = React.useRef([]);

  const stopZenChime = () => {
    try {
      activeNodesRef.current.forEach(({ osc, gain, ctx }) => {
        try {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
          osc.stop(ctx.currentTime + 0.06);
        } catch {}
      });
      activeNodesRef.current = [];
    } catch {
      // AudioContext unavailable
    }
  };

  const playZenChime = (freq = 528) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop any prior active chime
      stopZenChime();

      // Dual-oscillator Tibetan meditation bell (fundamental + resonant overtone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const masterGain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(freq - 2, ctx.currentTime + 2.4);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(freq * 1.5 - 3, ctx.currentTime + 1.8);

      // Bell envelope: soft attack, gentle exponential decay
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 2.5);
      osc2.stop(ctx.currentTime + 2.5);

      activeNodesRef.current = [
        { osc: osc1, gain: masterGain, ctx },
        { osc: osc2, gain: masterGain, ctx }
      ];
    } catch {
      // AudioContext unavailable or autoplay prevented
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playZenChime(528);
    } else {
      stopZenChime();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopZenChime();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setPhaseSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              let nextPhase = 'Inhale';
              let pitch = 528;
              if (currentPhase === 'Inhale') {
                nextPhase = 'Hold (Full)';
                pitch = 594;
              } else if (currentPhase === 'Hold (Full)') {
                nextPhase = 'Exhale';
                pitch = 440;
              } else if (currentPhase === 'Exhale') {
                nextPhase = 'Hold (Empty)';
                pitch = 396;
              }
              if (soundEnabled) {
                playZenChime(pitch);
              }
              return nextPhase;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [breathingActive, soundEnabled]);

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('Inhale');
    setPhaseSeconds(4);
    stopZenChime();
  };

  const getPhaseScale = () => {
    switch (breathPhase) {
      case 'Inhale': return 'scale-110 bg-peri';
      case 'Hold (Full)': return 'scale-110 bg-rose';
      case 'Exhale': return 'scale-90 bg-butter';
      case 'Hold (Empty)': return 'scale-90 bg-white';
      default: return 'scale-100 bg-sage';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Context Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Wellness Resources
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Explore research-backed wellness playbooks, circadian sleep guides, and real-time vagal breathwork pacers.
          </p>
        </div>
        <Pill tone="butter">
          Evidence-Based
        </Pill>
      </div>

      {/* Featured Interactive 5-Minute Box Breathing Widget */}
      <StickerCard tone="butter" shadow="sticker" className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex items-center gap-2">
              <Pill tone="white" className="border-2 border-ink text-[10px]">
                Interactive Practice
              </Pill>
              <span className="font-display text-xs font-bold text-ink">5-Minute Vagal Reset</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-ink">
              Box Breathing Pacer (4-4-4-4)
            </h3>
            <p className="text-xs sm:text-sm text-ink/85 leading-relaxed">
              Used by high-performance teams under pressure. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Clinically proven to reduce heart rate variability stress spikes in under 3 minutes.
            </p>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <StickerButton
                variant="primary"
                onClick={() => setBreathingActive(!breathingActive)}
                className="text-xs"
              >
                {breathingActive ? <Pause className="w-4 h-4 stroke-[2.5]" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{breathingActive ? 'Pause Exercise' : 'Begin 5-Min Reset'}</span>
              </StickerButton>

              <button
                onClick={resetBreathing}
                className="p-2.5 border-[3px] border-ink bg-white text-ink shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={handleToggleSound}
                role="switch"
                aria-checked={soundEnabled}
                aria-label="Toggle Zen Chime audio feedback"
                title={soundEnabled ? "Mute Zen Chime audio feedback" : "Enable Zen Chime Tibetan bell sound"}
                className={`flex items-center gap-1.5 px-3 py-2 border-[3px] border-ink font-display text-xs font-bold transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-ink text-butter shadow-sticker-sm'
                    : 'bg-white text-ink shadow-sticker-sm hover:bg-paper'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 stroke-[2]" /> : <VolumeX className="w-4 h-4 stroke-[2]" />}
                <span>Zen Chime {soundEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Breathing Visualizer */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 border-[3px] border-ink bg-white shadow-sticker text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-[4px] border-ink flex flex-col items-center justify-center shadow-[4px_4px_0_#111] transition-transform duration-1000 ease-in-out ${getPhaseScale()}`}
              >
                <Wind className="w-6 h-6 text-ink mb-1 stroke-[2]" />
                <span className="font-display text-xs font-bold text-ink tracking-wider uppercase">
                  {breathPhase}
                </span>
                <span className="font-display text-3xl font-bold tabular-nums text-ink">
                  {phaseSeconds}s
                </span>
              </div>
            </div>

            <p className="font-display text-xs font-bold text-ink mt-3">
              {breathingActive
                ? `Follow the rhythm: Slowly ${breathPhase.toLowerCase()} through your nose...`
                : 'Click "Begin 5-Min Reset" to sync your breath'}
            </p>
          </div>
        </div>
      </StickerCard>

      {/* Resource Articles Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-display font-bold text-ink">
          Curated Health Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessResources.map((res) => (
            <StickerCard
              key={res.id}
              tone="white"
              shadow="sticker"
              className="p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-sticker-lg transition-transform"
              onClick={() => setActiveArticle(res)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Pill tone="sage" className="border-2 border-ink text-[10px]">
                    {res.category}
                  </Pill>
                  <span className="font-display text-xs font-bold text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ink" />
                    {res.readTime}
                  </span>
                </div>

                <h4 className="text-base font-display font-bold text-ink leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-ink/80 leading-relaxed line-clamp-2">
                  {res.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 border border-ink bg-paper text-[10px] font-display font-bold text-ink"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t-[2px] border-dashed border-ink/30 flex items-center justify-between text-xs">
                <span className="font-display text-muted font-bold">{res.type}</span>
                <span className="font-display font-bold text-ink underline flex items-center gap-1">
                  Read Article <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </StickerCard>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      <Modal
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title}
        subtitle={`${activeArticle?.category} • ${activeArticle?.readTime}`}
        maxWidth="max-w-xl"
      >
        {activeArticle && (
          <div className="space-y-4 text-left">
            <div className="p-3 border-[2px] border-ink bg-butter text-xs font-bold text-ink">
              💡 {activeArticle.description}
            </div>

            <div className="text-xs text-ink/90 leading-relaxed space-y-3 font-normal">
              <p>
                {activeArticle.content || "Corporate vitality begins by acknowledging physiological fatigue before cognitive depletion occurs. Implementing consistent recovery intervals and asynchronous focus periods shields mental bandwidth..."}
              </p>
              <p className="font-semibold text-ink">
                <strong>Key Action Item:</strong> Block a non-negotiable 15-minute sanctuary window between meetings to reset cognitive load and prevent dopamine exhaustion.
              </p>
            </div>

            <div className="pt-3 border-t-[2px] border-dashed border-ink/30 flex justify-end">
              <StickerButton
                variant="secondary"
                onClick={() => setActiveArticle(null)}
                className="text-xs"
              >
                Close Reader
              </StickerButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResourcesPage;
