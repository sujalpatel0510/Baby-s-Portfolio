import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Heart } from 'lucide-react';

export default function Guestbook({ soundFX }) {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('☁️');

  const stickers = ['☁️', '🌙', '⭐', '🌈', '🍼', '💖', '🧸'];

  useEffect(() => {
    const saved = localStorage.getItem('nimbus_guestbook');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // Fallback default
      }
    } else {
      // Default cozy initial notes
      const initial = [
        {
          name: 'Pip the Skull Baby',
          text: 'Sleep tight little cloud! Thank you for the soft rain lullabies over Midnight Nursery! 🦴💖',
          sticker: '⭐',
          time: 'Just now',
        },
        {
          name: 'Hardik from haX',
          text: 'Good things start small. Welcome to your first website, Nimbus!',
          sticker: '🌈',
          time: '17 Oct 17:17',
        },
      ];
      setMessages(initial);
      localStorage.setItem('nimbus_guestbook', JSON.stringify(initial));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMsg = {
      name: name.trim(),
      text: text.trim(),
      sticker: selectedSticker,
      time: 'Just now',
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('nimbus_guestbook', JSON.stringify(updated));

    setName('');
    setText('');
    soundFX.playSparkle();
  };

  return (
    <section id="guestbook" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-midnight-card/95 border-2 border-berry/20 dark:border-midnight-border rounded-3xl p-6 md:p-10 shadow-xl backdrop-blur-md" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs rounded-full uppercase tracking-wider font-semibold flex items-center gap-1.5 w-fit">
              <MessageSquare size={14} aria-hidden="true" /> Side Quest (+2 pts)
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-earth dark:text-cream-50 mt-2">
              The Slumber Crib Guestbook
            </h3>
            <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300">
              Sign Nimbus’s bedside cloud wall and leave a bedtime blessing!
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-cream-50 dark:bg-midnight/60 rounded-2xl border border-berry/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Your name or creature species..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2.5 rounded-xl border border-berry/20 bg-white dark:bg-midnight text-earth dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-berry font-bubbly"
              required
            />
            {/* Sticker Picker */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white dark:bg-midnight rounded-xl border border-berry/20">
              <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">Badge:</span>
              {stickers.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setSelectedSticker(s);
                    soundFX.playClick();
                  }}
                  className={`text-base p-2 rounded-lg transition-transform tactile min-w-[36px] min-h-[36px] flex items-center justify-center ${
                    selectedSticker === s ? 'scale-125 bg-berry/20 ring-1 ring-berry' : 'opacity-70'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Leave a sweet whisper or dream wish..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-xl border border-berry/20 bg-white dark:bg-midnight text-earth dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-berry font-bubbly mb-3"
            required
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-berry hover:bg-berry-dark text-white rounded-xl text-xs font-bubbly font-bold flex items-center justify-center gap-2 shadow-sm transition-all tactile"
          >
            <Send size={14} /> Pin Bedtime Note
          </button>
        </form>

        {/* Message Wall (Sticky notes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#fffef0] dark:bg-midnight/80 border border-amber-200 dark:border-stone-800 shadow-sm relative rotate-[-0.5deg] hover:rotate-0 transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-sm text-earth dark:text-cream-100 flex items-center gap-1.5">
                  <span>{m.sticker}</span> {m.name}
                </span>
                <span className="text-[10px] font-mono text-stone-400">{m.time}</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-bubbly leading-relaxed">
                "{m.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
