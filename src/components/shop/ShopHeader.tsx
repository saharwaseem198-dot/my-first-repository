import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopHeader: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    setActiveView,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900 text-neutral-100">
      {/* Top Announcement Bar */}
      <div className="bg-neutral-900 border-b border-neutral-850 px-4 py-1.5 text-center text-[11px] text-neutral-300 flex items-center justify-center gap-2">
        <span className="text-amber-300 font-medium font-serif tracking-wider uppercase">
          Festive & Eid Haute Couture
        </span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>Complimentary Nationwide Express Delivery over Rs. 15,000</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="text-neutral-400">Cash on Delivery Available</span>
      </div>

      {/* Main Navigation (3-Zone Top Bar Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCategoryFilter('All');
              setSearchQuery('');
            }}
            className="text-left group"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-amber-200 uppercase block group-hover:text-amber-100 transition-colors">
              ZEENAT COUTURE
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-neutral-300">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === 'All' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            All Outfits
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('3-Piece')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === '3-Piece' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            3-Piece
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('Chiffon')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === 'Chiffon' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Chiffon
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('Velvet')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === 'Velvet' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Velvet Formal
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('Lawn')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === 'Lawn' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Luxury Lawn
          </button>
          <button
            onClick={() => setSelectedCategoryFilter('Wedding Wear')}
            className={`transition-colors hover:text-white ${
              selectedCategoryFilter === 'Wedding Wear' ? 'text-amber-300 border-b border-amber-300 pb-0.5' : 'text-neutral-400'
            }`}
          >
            Bridal / Shaadi
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search, Admin Portal Toggle, Shopping Bag) */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dresses, fabric..."
                  className="bg-transparent text-white focus:outline-none w-32 sm:w-48 text-xs"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-neutral-400 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title="Search collection"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Admin Portal Switcher */}
          <button
            onClick={() => setActiveView('admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs rounded-full transition-colors font-medium shadow-sm"
            title="Switch to Store Admin Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          {/* Shopping Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-300 hover:text-white transition-colors"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center font-mono">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
