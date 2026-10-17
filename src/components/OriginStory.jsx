import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Moon, Sparkles, Heart } from 'lucide-react';

export default function OriginStory({ soundFX }) {
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      chapter: 'Scene 01',
      title: 'Born from a Teapot’s Steam',
      subtitle: 'Where Nimbus Came From',
      body: 'On a drizzly autumn dusk, an old grandmother brewed a kettle of chamomile tea with two drops of star blossom honey. As the steam whistled gently up toward the open window, the cool night breeze wrapped it in a sleepy swirl. Instead of vanishing, the steam giggled, yawned, and blinked two glowing amber eyes. Nimbus was born!',
      accent: '☕ Chamomile Tea & Starhoney',
      icon: '✨',
    },
    {
      chapter: 'Scene 02',
      title: 'Apprentice to the Night Sky',
      subtitle: 'The Craft of Cloud Painting',
      body: 'Nimbus couldn’t make thunderclaps—they were far too noisy and hurt little ears. Instead, Nimbus learned that soft puffs of marshmallow mist could cushion restless thoughts. By gathering stray moonlight and humming gentle pentatonic tunes, Nimbus discovered how to weave warm rainbow dreams into soft bedtime showers.',
      accent: '🌈 Rainbow Dream Weaving',
      icon: '🎨',
    },
    {
      chapter: 'Scene 03',
      title: 'The Midnight Slumber Mission',
      subtitle: 'A Purpose Every Evening',
      body: 'Now, as the clock chimes 17:17 IST, Nimbus floats across roof tiles, chimney tops, and sleepy trees. With a pocket full of firefly jars and starlight lullabies, Nimbus ensures no little baby—whether a human, puppy, kitten, or friendly skull baby—ever has to face the dark alone. Every good thing starts small.',
      accent: '🌙 Sweet Dreams Forever',
      icon: '💖',
    },
  ];

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      soundFX.playClick();
      soundFX.playChime(659.25);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      soundFX.playClick();
      soundFX.playChime(523.25);
    }
  };

  const current = scenes[currentScene];

  return (
    <section id="origin-story" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="px-3.5 py-1.5 bg-berry/10 dark:bg-berry/20 text-berry font-mono text-xs uppercase tracking-widest rounded-full font-bold inline-flex items-center gap-2">
          <BookOpen size={14} /> The Bedtime Storybook · Origin Tale
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth dark:text-cream-50 mt-3">
          How Nimbus Got Their Nightcap
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-sm max-w-lg mx-auto mt-2">
          A three-chapter bedtime scroll. Less than 150 words per chapter, told with cozy early-web warmth.
        </p>
      </div>

      {/* Storybook Illustrated Page Container */}
      <div className="relative bg-[#fffdf9] dark:bg-midnight-card border-4 border-berry/20 dark:border-midnight-border rounded-3xl p-6 md:p-12 shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Decorative corner ribbons */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
          <div className="absolute transform rotate-45 bg-berry text-white text-[9px] font-mono py-1 right-[-35px] top-[18px] w-[120px] text-center font-bold shadow">
            CHAPTER {currentScene + 1}
          </div>
        </div>

        {/* Scene Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl p-2.5 bg-cream-100 dark:bg-midnight rounded-2xl border border-berry/20">
            {current.icon}
          </span>
          <div>
            <span className="text-xs font-mono font-semibold text-berry uppercase tracking-wider">
              {current.chapter} · {current.subtitle}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-earth dark:text-cream-50">
              {current.title}
            </h3>
          </div>
        </div>

        {/* Scene Narrative Body */}
        <p className="text-base md:text-lg leading-relaxed text-stone-700 dark:text-stone-200 font-bubbly my-6 min-h-[120px] transition-all">
          {current.body}
        </p>

        {/* Scene Footer & Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="text-xs font-mono text-berry font-bold bg-berry/10 dark:bg-berry/20 px-3 py-1.5 rounded-lg">
            {current.accent}
          </div>

          {/* Chapter Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevScene}
              disabled={currentScene === 0}
              className="p-2.5 rounded-xl border border-berry/30 text-berry hover:bg-berry/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Previous scene"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination dots */}
            <div className="flex gap-1.5 px-2">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentScene(i);
                    soundFX.playClick();
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    currentScene === i ? 'w-8 bg-berry' : 'w-2.5 bg-berry/30 hover:bg-berry/50'
                  }`}
                  aria-label={`Go to chapter ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextScene}
              disabled={currentScene === scenes.length - 1}
              className="p-2.5 rounded-xl border border-berry/30 text-berry hover:bg-berry/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Next scene"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
