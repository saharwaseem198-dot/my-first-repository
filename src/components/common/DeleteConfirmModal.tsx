import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Dress } from '../../types';

interface DeleteConfirmModalProps {
  product: Dress | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl text-neutral-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 id="delete-title" className="text-lg font-serif tracking-wide text-neutral-100 font-semibold">
              Delete Product
            </h3>
            <p className="text-sm text-neutral-400">
              Are you sure you want to delete this product?
            </p>
          </div>
        </div>

        {/* Product snapshot */}
        <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-12 h-16 object-cover rounded border border-neutral-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-200 truncate">{product.name}</p>
            <p className="text-xs text-neutral-500">{product.category} · {product.sku}</p>
            <p className="text-xs font-mono tabular-nums text-amber-300 mt-0.5">
              Rs. {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-red-400/90 leading-relaxed">
          This product will be permanently removed from the catalog and will immediately disappear from the customer-facing storefront.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            Yes, Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};
