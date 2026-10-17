import React, { useState } from 'react';
import { Compass, Wind, Home, CheckCircle2, Sparkles } from 'lucide-react';

export default function DeliveryRoutes({ soundFX }) {
  const [activeStop, setActiveStop] = useState(0);

  const stops = [
    {
      id: 0,
      name: 'Starlight Nursery Roofs',
      time: '20:15 IST',
      cargo: '30 Soft Pink Lullabies',
      note: 'Sprinkled gentle dream mist over the sleepy rabbit burrows.',
      coords: { x: '18%', y: '30%' },
    },
    {
      id: 1,
      name: 'Old Whispering Oak Tree',
      time: '22:00 IST',
      cargo: '15 Firefly Amber Lanterns',
      note: 'Delivered cozy nightlights to baby squirrels afraid of owls.',
      coords: { x: '48%', y: '65%' },
    },
    {
      id: 2,
      name: 'Moonlit Lake Cottages',
      time: '23:45 IST',
      cargo: '45 Cloud Puff Blankets',
      note: 'Swaddled the ducklings in warm marshmallow vapor.',
      coords: { x: '78%', y: '25%' },
    },
  ];

  const handleStopClick = (idx) => {
    setActiveStop(idx);
    soundFX.playClick();
    soundFX.playRainDrop();
  };

  return (
    <div className="bg-white/90 dark:bg-midnight-card/90 border-2 border-berry/20 dark:border-midnight-border rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:border-berry/40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-mono text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Compass size={14} /> Project 03 · Dispatch
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Interactive Flight Path</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-earth dark:text-cream-50 mb-2">
          Midnight Dream Flight Map
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
          Click the flight checkpoints to trace Nimbus’s nightly rooftop drift across the neighborhood to deliver bedtime dreams!
        </p>

        {/* Interactive Flight Canvas / Graphic */}
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-sky-950 via-indigo-950 to-midnight-deep p-4 overflow-hidden border border-berry/30 shadow-inner mb-4">
          {/* Subtle star dots */}
          <div className="absolute top-3 left-10 text-[9px] text-amber-200">★</div>
          <div className="absolute top-12 left-1/3 text-[8px] text-sky-200">✦</div>
          <div className="absolute top-6 right-16 text-[9px] text-pink-200">★</div>

          {/* SVG Flight Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 60 50 Q 150 140 250 40"
              fill="none"
              stroke="#a34063"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Interactive Waypoints */}
          {stops.map((stop, i) => (
            <button
              key={stop.name}
              onClick={() => handleStopClick(i)}
              style={{ left: stop.coords.x, top: stop.coords.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-transform transform active:scale-90 ${
                activeStop === i
                  ? 'bg-berry text-white ring-4 ring-amber-300 scale-125 z-20 shadow-lg'
                  : 'bg-white/80 text-berry hover:scale-110 z-10'
              }`}
              title={stop.name}
            >
              <Home size={14} />
            </button>
          ))}

          {/* Flying Nimbus Indicator */}
          <div
            className="absolute transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: stops[activeStop].coords.x,
              top: stops[activeStop].coords.y,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="flex items-center gap-1 bg-white/90 text-berry text-[10px] font-mono px-2 py-0.5 rounded-full shadow-md font-bold border border-berry/30">
              <span>☁️ Nimbus</span>
            </div>
          </div>
        </div>

        {/* Selected Checkpoint Card */}
        <div className="p-3.5 bg-cream-50 dark:bg-midnight/70 rounded-2xl border border-berry/20 text-xs">
          <div className="flex items-center justify-between font-mono text-stone-500 dark:text-stone-400 mb-1">
            <span>Stop #{activeStop + 1} · {stops[activeStop].time}</span>
            <span className="text-berry font-bold">{stops[activeStop].cargo}</span>
          </div>
          <div className="font-bubbly font-bold text-earth dark:text-cream-50 text-sm">
            {stops[activeStop].name}
          </div>
          <p className="text-stone-600 dark:text-stone-300 mt-1">
            {stops[activeStop].note}
          </p>
        </div>
      </div>
    </div>
  );
}
