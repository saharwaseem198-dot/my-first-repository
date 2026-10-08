import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Ruler,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Dress, ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductDetailsModalProps {
  dress: Dress | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  dress,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Initialize variant defaults when dress opens
  React.useEffect(() => {
    if (dress) {
      setActiveImageIndex(0);
      setSelectedSize(dress.sizes[0] || 'M');
      setSelectedColor(dress.colors[0] || { name: 'Original', hex: '#C48B9F' });
      setQuantity(1);
    }
  }, [dress]);

  if (!isOpen || !dress) return null;

  const isOutOfStock = dress.status === 'Out of Stock' || dress.stock <= 0;
  const isLowStock = !isOutOfStock && dress.stock <= 3;
  const price = dress.salePrice || dress.price;

  const handleAddToCart = () => {
    if (isOutOfStock || !selectedColor) return;
    addToCart(dress, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl my-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white bg-black/50 hover:bg-neutral-800 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-neutral-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-850">
            {/* Main Preview Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={dress.images[activeImageIndex] || dress.images[0]}
                alt={dress.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {dress.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? dress.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === dress.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {dress.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {dress.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-18 rounded-lg overflow-hidden border shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, SKU & Collection */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="uppercase tracking-wider font-semibold text-amber-400">
                    {dress.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{dress.sku}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                  {dress.name}
                </h2>
                <p className="text-xs text-neutral-400 font-serif">
                  Collection: {dress.collection}
                </p>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-neutral-800/80 flex items-baseline justify-between">
                <div>
                  {dress.salePrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
                        Rs. {dress.salePrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-mono text-neutral-500 line-through tabular-nums">
                        Rs. {dress.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-mono font-bold text-white tabular-nums">
                      Rs. {dress.price.toLocaleString()}
                    </span>
                  )}
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Taxes included · Nationwide COD eligible
                  </p>
                </div>

                {/* Stock Status Badge */}
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase rounded-lg">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-lg">
                    Only {dress.stock} left in stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-lg">
                    In Stock ({dress.stock} available)
                  </span>
                )}
              </div>

              {/* Fabric Detail */}
              <div className="space-y-1 text-xs">
                <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  Fabric & Craft:
                </span>
                <p className="text-neutral-200 leading-relaxed bg-neutral-950 p-2.5 rounded-lg border border-neutral-850">
                  {dress.fabric}
                </p>
              </div>

              {/* Description */}
              <div className="text-xs text-neutral-300 leading-relaxed space-y-1">
                <p>{dress.description}</p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-semibold">Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors text-[11px]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide (Inches)</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dress.sizes.map((size) => (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold shadow-sm'
                          : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Inline Size Guide Drawer */}
                {isSizeGuideOpen && (
                  <div className="mt-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-300 space-y-2">
                    <p className="font-semibold text-amber-300">Standard Ready-to-Wear Sizing (Inches):</p>
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      <div className="p-1 bg-neutral-900 rounded">XS: Chest 18"</div>
                      <div className="p-1 bg-neutral-900 rounded">S: Chest 19.5"</div>
                      <div className="p-1 bg-neutral-900 rounded">M: Chest 21"</div>
                      <div className="p-1 bg-neutral-900 rounded">L: Chest 23"</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <span className="text-xs text-neutral-300 font-semibold">
                  Color Shade: <span className="text-amber-300 font-normal">{selectedColor?.name}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {dress.colors.map((col) => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                          isSelected
                            ? 'bg-neutral-800 border-amber-400 text-white'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-neutral-300 font-semibold">Quantity:</span>
                  <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-950">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-neutral-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono text-xs text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(dress.stock, q + 1))}
                      className="px-3 py-1 text-neutral-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors ${
                  isOutOfStock
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out / Unavailable' : 'Add to Shopping Bag'}</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  100% Authentic Fabric
                </span>
                <span>·</span>
                <span>Nationwide Courier (3-5 Days)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
