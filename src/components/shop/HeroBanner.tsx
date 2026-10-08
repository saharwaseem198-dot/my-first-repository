import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ASSET_HERO } from '../../data/initialData';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategoryFilter } = useStore();

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] overflow-hidden bg-neutral-950">
      {/* Background Campaign Image */}
      <img
        src={ASSET_HERO}
        alt="Pakistani Luxury Couture Campaign"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-top scale-105 transform hover:scale-100 transition-transform duration-1000"
      />

      {/* Measured Scrim for Media Overlays (4.5:1 contrast compliance) */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
      <div className="absolute inset-0 bg-neutral-950/30" />

      {/* Hero Content */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 text-neutral-100">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-serif">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Royal Heritage Series · Spring Festive 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase leading-tight text-balance">
            Artisanal Pakistani Haute Couture & Luxury Pret
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
            Bespoke hand-embroidered chiffon, pure micro-velvet, and schiffli lawn crafted by master karigars in Lahore & Karachi.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setSelectedCategoryFilter('3-Piece')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <span>Explore 3-Piece Festive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('Velvet')}
              className="px-5 py-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-medium text-xs rounded-xl transition-colors backdrop-blur-sm"
            >
              Royal Velvet Formal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
