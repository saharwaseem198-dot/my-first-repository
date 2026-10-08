import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const freeShippingThreshold = 15000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 450;
  const grandTotal = subtotal + shippingFee;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col justify-between shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-serif font-bold text-neutral-100 uppercase tracking-wide">
                  Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="p-3.5 bg-neutral-950 border-b border-neutral-800 text-xs">
              {isFreeShipping ? (
                <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Congratulations! You qualify for Free Nationwide Shipping.</span>
                </p>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-neutral-300">
                    Add <span className="font-mono text-amber-300 font-semibold">Rs. {amountToFreeShipping.toLocaleString()}</span> more for Complimentary Delivery
                  </p>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-800/80">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="text-sm font-medium text-neutral-300">Your shopping bag is empty</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Explore our Pakistani 3-Piece, chiffon, and lawn collections to add outfits.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs rounded-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`} className="py-4 flex gap-3 text-xs">
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-22 object-cover rounded-lg border border-neutral-800 shrink-0 bg-neutral-950"
                      />

                      {/* Info & Adjustments */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-neutral-100 line-clamp-1">
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-neutral-500 hover:text-rose-400 p-0.5 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                            <span>Size: <strong className="text-neutral-200">{item.selectedSize}</strong></span>
                            <span>·</span>
                            <span>Color: <strong className="text-neutral-200">{item.selectedColor.name}</strong></span>
                          </div>

                          <p className="font-mono tabular-nums text-amber-300 font-medium mt-1">
                            Rs. {unitPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-950">
                            <button
                              onClick={() => updateCartQuantity(index, item.quantity - 1)}
                              className="px-2 py-0.5 text-neutral-400 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 font-mono text-[11px] text-white">
                              {item.quantity}
                            </span>
                            <button
                              disabled={item.quantity >= item.product.stock}
                              onClick={() => updateCartQuantity(index, item.quantity + 1)}
                              className="px-2 py-0.5 text-neutral-400 hover:text-white disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono tabular-nums text-white font-semibold">
                            Rs. {(unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-4">
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal:</span>
                    <span className="font-mono tabular-nums text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Nationwide Shipping:</span>
                    <span className="font-mono tabular-nums text-white">
                      {shippingFee === 0 ? 'Complimentary' : `Rs. ${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm font-semibold">
                    <span className="text-amber-200">Total:</span>
                    <span className="font-mono tabular-nums text-amber-300 text-base">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};
