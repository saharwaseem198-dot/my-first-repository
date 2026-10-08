import React, { useState } from 'react';
import { Filter, ArrowUpDown, Sparkles, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ShopHeader } from './ShopHeader';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CartDrawer } from './CartDrawer';
import { ShopFooter } from './ShopFooter';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    viewingProduct,
    setViewingProduct,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'bestseller' | 'price-asc' | 'price-desc'>('featured');

  // Customer only sees Active and Out of Stock products (never Draft or Hidden)
  const customerVisibleProducts = products.filter((p) => {
    const isVisibleStatus = p.status === 'Active' || p.status === 'Out of Stock';
    if (!isVisibleStatus) return false;

    const matchesCategory =
      selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort
  const sortedProducts = [...customerVisibleProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'bestseller') return b.soldCount - a.soldCount;
    // Featured default
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <ShopHeader />

      {/* Main Campaign Hero */}
      {selectedCategoryFilter === 'All' && !searchQuery && <HeroBanner />}

      {/* Collection Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Couture Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide uppercase mt-1">
              {selectedCategoryFilter === 'All' ? 'All Pakistani Outfits' : `${selectedCategoryFilter} Collection`}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {sortedProducts.length} handcrafted outfits available for nationwide delivery
            </p>
          </div>

          {/* Controls: Category buttons & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
              >
                <option value="featured">Featured First</option>
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategoryFilter === 'All'
                ? 'bg-amber-400 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Collections ({products.filter((p) => p.status === 'Active' || p.status === 'Out of Stock').length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => (p.status === 'Active' || p.status === 'Out of Stock') && p.category === cat.name
            ).length;
            const isSelected = selectedCategoryFilter === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="p-16 text-center bg-neutral-900/40 border border-neutral-850 rounded-2xl space-y-3">
            <Layers className="w-10 h-10 mx-auto text-neutral-600" />
            <h3 className="text-base font-medium text-neutral-200">No dresses found in this collection</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Any products added or made active in the Admin Panel will immediately show up here.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((dress) => (
              <ProductCard key={dress.id} dress={dress} />
            ))}
          </div>
        )}
      </main>

      <ShopFooter />

      {/* Global Product Details Modal */}
      <ProductDetailsModal
        dress={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

      {/* Slide-out Cart Bag */}
      <CartDrawer />
    </div>
  );
};
