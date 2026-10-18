import React, { useState } from 'react';
import { Music, CloudRain, Sparkles, Sliders, Volume2 } from 'lucide-react';

export default function LullabyLab({ soundFX }) {
  const [activeNote, setActiveNote] = useState(null);
  const [tempo, setTempo] = useState('gentle');
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);

  // Pentatonic scale notes (always consonant & sweet)
  const notes = [
    { label: 'C5 · Moonbeam', freq: 523.25, color: 'bg-rainbow-pink hover:bg-rainbow-pink/80 text-earth' },
    { label: 'D5 · Stardust', freq: 587.33, color: 'bg-rainbow-peach hover:bg-rainbow-peach/80 text-earth' },
    { label: 'E5 · Cloud Fluff', freq: 659.25, color: 'bg-rainbow-yellow hover:bg-rainbow-yellow/80 text-earth' },
    { label: 'G5 · Dewdrop', freq: 783.99, color: 'bg-rainbow-mint hover:bg-rainbow-mint/80 text-earth' },
    { label: 'A5 · Dream Sky', freq: 880.00, color: 'bg-rainbow-sky hover:bg-rainbow-sky/80 text-earth' },
    { label: 'C6 · Slumber', freq: 1046.50, color: 'bg-rainbow-lilac hover:bg-rainbow-lilac/80 text-earth' },
  ];

  const handlePlayNote = (note, index) => {
    setActiveNote(index);
    soundFX.playChime(note.freq);
    setTimeout(() => setActiveNote(null), 300);
  };

  const playAutoLullaby = () => {
    if (isPlayingAuto) return;
    setIsPlayingAuto(true);
    const melody = [0, 2, 4, 3, 2, 0, 4, 5];
    const delays = [0, 400, 800, 1200, 1600, 2000, 2400, 2800];

    melody.forEach((noteIdx, i) => {
      setTimeout(() => {
        setActiveNote(noteIdx);
        soundFX.playChime(notes[noteIdx].freq);
        setTimeout(() => setActiveNote(null), 250);
        if (i === melody.length - 1) {
          setIsPlayingAuto(false);
        }
      }, delays[i]);
    });
  };

  return (
    <div className="h-full bg-white/90 dark:bg-midnight-card/90 border-2 border-berry/20 dark:border-midnight-border rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:border-berry/40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-berry/10 dark:bg-berry/30 text-berry font-mono text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Music size={14} /> Project 01 · Craft
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Interactive Synthesizer</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-earth dark:text-cream-50 mb-2">
          The Raindrop Lullaby Lab
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
          Nimbus tunes evening rain showers so each drop harmonizes into a soothing pentatonic lullaby that lulls sleepy woodland creatures into slumber.
        </p>

        {/* Synthesizer Keyboard / Chimes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          {notes.map((n, idx) => (
            <button
              key={n.label}
              onClick={() => handlePlayNote(n, idx)}
              className={`p-3 rounded-2xl text-xs font-bubbly font-semibold transition-all transform active:scale-95 shadow-sm border border-black/5 ${
                n.color
              } ${activeNote === idx ? 'ring-4 ring-berry scale-105 shadow-md -translate-y-1' : ''}`}
            >
              <div className="text-[10px] font-mono opacity-60">♪ Note {idx + 1}</div>
              <div className="truncate">{n.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Auto Playback Bar */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
        <button
          onClick={playAutoLullaby}
          disabled={isPlayingAuto}
          className="flex-1 py-2 px-4 bg-berry hover:bg-berry-dark disabled:opacity-50 text-white rounded-xl text-xs font-bubbly flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Sparkles size={14} />
          {isPlayingAuto ? 'Composing Lullaby...' : 'Auto-Play Nimbus’s Lullaby'}
        </button>

        <button
          onClick={() => soundFX.playRainDrop()}
          title="Play single raindrop chime"
          className="p-2 bg-cloud-light hover:bg-cloud text-berry rounded-xl text-xs font-mono border border-berry/20 transition-all"
        >
          <CloudRain size={16} />
        </button>
      </div>
    </div>
  );
}
