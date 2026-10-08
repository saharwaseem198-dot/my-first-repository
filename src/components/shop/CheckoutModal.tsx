import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Truck, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, PaymentMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, createOrder, setIsCartOpen, setActiveView, setAdminTab, setActiveInvoiceOrder } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [notes, setNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const shippingFee = subtotal >= 15000 ? 0 : 450;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const order = createOrder({
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.pk`,
      deliveryAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city,
        province,
        postalCode: postalCode.trim(),
      },
      paymentMethod,
      notes: notes.trim(),
    });

    setPlacedOrder(order);
  };

  const handleCloseSuccess = () => {
    setPlacedOrder(null);
    onClose();
    setIsCartOpen(false);
  };

  const handleViewOrderInAdmin = () => {
    const orderToInspect = placedOrder;
    setPlacedOrder(null);
    onClose();
    setIsCartOpen(false);
    setActiveView('admin');
    setAdminTab('orders');
    if (orderToInspect) {
      setActiveInvoiceOrder(orderToInspect);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl my-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Placed Order Success Screen */}
        {placedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                Order Confirmed & Placed!
              </h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Thank you for your order, {placedOrder.customerName}. Your order has been automatically registered and is now live in the store Admin Panel.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl text-left max-w-md mx-auto space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-bold text-white">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Invoice Number:</span>
                <span className="font-mono text-amber-300 font-medium">{placedOrder.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Delivery Address:</span>
                <span className="text-neutral-200 text-right">{placedOrder.deliveryAddress.street}, {placedOrder.deliveryAddress.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800">
                <span className="text-neutral-400">Payment:</span>
                <span className="text-neutral-200">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-sm">
                <span className="text-amber-200">Total Billed:</span>
                <span className="font-mono text-amber-300 text-base">
                  Rs. {placedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleViewOrderInAdmin}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>View in Admin Panel & Print Invoice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCloseSuccess}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs rounded-xl transition-colors"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-serif font-bold text-neutral-100 uppercase tracking-wide">
                  Nationwide Express Checkout
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
              {/* Client Contact Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  1. Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Saira Khan"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-neutral-300">Email Address (Optional for Invoice)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. saira.khan@gmail.com"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  2. Shipping Address in Pakistan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-xs text-neutral-300">Complete Street Address / House / Sector *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. House 54-A, Street 7, Phase 6, DHA"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Destination City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Province</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Punjab / Sindh / KPK"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54792"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  3. Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    {
                      id: 'Cash on Delivery (COD)' as PaymentMethod,
                      label: 'Cash on Delivery (COD)',
                      desc: 'Pay courier cash at doorstep',
                    },
                    {
                      id: 'Direct Bank Transfer' as PaymentMethod,
                      label: 'Direct Bank Transfer',
                      desc: 'Meezan / HBL / Bank Alfalah IBAN',
                    },
                    {
                      id: 'JazzCash / EasyPaisa' as PaymentMethod,
                      label: 'JazzCash / EasyPaisa',
                      desc: 'Instant mobile wallet transfer',
                    },
                    {
                      id: 'Credit / Debit Card' as PaymentMethod,
                      label: 'Credit / Debit Card',
                      desc: 'Visa / Mastercard online portal',
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'bg-neutral-800/90 border-amber-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-0.5 accent-amber-400"
                      />
                      <div>
                        <p className="font-medium text-white">{method.label}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="space-y-1 pt-2">
                <label className="text-xs text-neutral-400">Special Instructions / Custom Stitching Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please call before delivery or stitch shirt length 39 inches"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Order Bill Summary */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Outfits Subtotal:</span>
                  <span className="font-mono tabular-nums text-white">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier:</span>
                  <span className="font-mono tabular-nums text-white">
                    {shippingFee === 0 ? 'Complimentary (Free)' : `Rs. ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-800 font-semibold text-sm">
                  <span className="text-amber-200">Payable Amount:</span>
                  <span className="font-mono tabular-nums text-amber-300 text-base">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order (Rs. {totalAmount.toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
