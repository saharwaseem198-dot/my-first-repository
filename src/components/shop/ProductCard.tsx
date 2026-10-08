import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { Dress } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  dress: Dress;
}

export const ProductCard: React.FC<ProductCardProps> = ({ dress }) => {
  const { setViewingProduct } = useStore();

  const isOutOfStock = dress.status === 'Out of Stock' || dress.stock <= 0;
  const isLowStock = !isOutOfStock && dress.stock <= 3;

  return (
    <div
      onClick={() => setViewingProduct(dress)}
      className="group bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden cursor-pointer hover:border-neutral-750 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] bg-neutral-950 overflow-hidden">
        <img
          src={dress.images[0]}
          alt={dress.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {dress.isNewArrival && (
            <span className="px-2 py-0.5 bg-neutral-950/80 backdrop-blur-sm text-sky-300 text-[10px] font-semibold uppercase tracking-wider rounded border border-sky-500/20">
              New Arrival
            </span>
          )}
          {dress.salePrice && (
            <span className="px-2 py-0.5 bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider rounded shadow">
              Sale
            </span>
          )}
          {dress.isBestSeller && (
            <span className="px-2 py-0.5 bg-neutral-950/80 backdrop-blur-sm text-purple-300 text-[10px] font-semibold uppercase tracking-wider rounded border border-purple-500/20">
              Best Seller
            </span>
          )}
        </div>

        {/* Out of Stock or Low Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3 py-1.5 bg-neutral-900/95 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-xl">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wide rounded">
            Only {dress.stock} Left
          </div>
        ) : null}

        {/* Hover Quick Action */}
        {!isOutOfStock && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewingProduct(dress);
              }}
              className="w-full py-2 bg-neutral-950/90 hover:bg-amber-400 hover:text-neutral-950 text-neutral-100 text-xs font-medium rounded-xl border border-neutral-700 transition-colors backdrop-blur-sm flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Outfit</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="uppercase tracking-wider">{dress.category}</span>
            <span className="font-mono text-neutral-500">{dress.fabric.split(' ')[0]}</span>
          </div>

          <h3 className="font-serif font-bold text-sm text-neutral-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {dress.name}
          </h3>

          <p className="text-[11px] text-neutral-400 line-clamp-1">
            {dress.fabric}
          </p>
        </div>

        {/* Price & Sizes */}
        <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
          <div className="font-mono tabular-nums">
            {dress.salePrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-amber-300 text-sm">
                  Rs. {dress.salePrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500 line-through">
                  Rs. {dress.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-neutral-200 text-sm">
                Rs. {dress.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
            {dress.sizes.slice(0, 3).join(' · ')}
            {dress.sizes.length > 3 && ' +'}
          </div>
        </div>
      </div>
    </div>
  );
};
