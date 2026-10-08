import React from 'react';
import { Download, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/html printable file trigger or prompt print dialog
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Tax Invoice & Receipt
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {order.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
              title="Print official invoice"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
              title="Download invoice as PDF"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 md:p-10 bg-neutral-900 text-neutral-200">
          {/* Header & Brand */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b border-neutral-800 gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-amber-200 uppercase">
                  ZEENAT COUTURE
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1 font-serif">
                Haute Couture & Luxury Pret
              </p>
              <div className="mt-3 text-xs text-neutral-400 space-y-0.5 leading-relaxed">
                <p>M.M. Alam Road, Gulberg III, Lahore, Pakistan</p>
                <p>Phone: +92 42 3578 9000 · WhatsApp: +92 321 0000000</p>
                <p>NTN / STRN: 7819240-3 · sales@zeenatcouture.pk</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-300 font-semibold uppercase tracking-wider text-[11px] mb-2">
                Official Commercial Invoice
              </div>
              <p className="text-neutral-400">
                Invoice No: <span className="font-mono text-white font-medium">{order.invoiceNumber}</span>
              </p>
              <p className="text-neutral-400">
                Order ID: <span className="font-mono text-white font-medium">{order.id}</span>
              </p>
              <p className="text-neutral-400">
                Issue Date: <span className="text-white font-mono">{order.orderDate}</span>
              </p>
              <p className="text-neutral-400">
                Status: <span className="text-emerald-400 font-medium capitalize">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-neutral-800 text-xs">
            <div>
              <p className="uppercase tracking-wider font-semibold text-neutral-400 mb-2 font-mono text-[11px]">
                Billed & Shipped To:
              </p>
              <p className="text-sm font-semibold text-white">{order.customerName}</p>
              <p className="text-neutral-300 mt-1">{order.deliveryAddress.street}</p>
              <p className="text-neutral-300">
                {order.deliveryAddress.city}, {order.deliveryAddress.province} {order.deliveryAddress.postalCode ? `- ${order.deliveryAddress.postalCode}` : ''}
              </p>
              <p className="text-neutral-400 mt-2">
                Phone: <span className="text-white font-mono">{order.customerPhone}</span>
              </p>
              <p className="text-neutral-400">
                Email: <span className="text-white">{order.customerEmail}</span>
              </p>
            </div>

            <div className="md:text-right">
              <p className="uppercase tracking-wider font-semibold text-neutral-400 mb-2 font-mono text-[11px]">
                Payment & Fulfillment:
              </p>
              <p className="text-neutral-300">
                Payment Method: <span className="font-semibold text-white">{order.paymentMethod}</span>
              </p>
              <p className="text-neutral-300 mt-1">
                Fulfillment: <span className="text-amber-300 font-medium">Nationwide Express Courier (TCS / Leopard)</span>
              </p>
              {order.trackingNumber && (
                <p className="text-neutral-400 mt-1">
                  Tracking #: <span className="font-mono text-white">{order.trackingNumber}</span>
                </p>
              )}
              {order.notes && (
                <p className="text-neutral-400 mt-2 italic">
                  Note: "{order.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Product Items Table */}
          <div className="py-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="pb-3 font-medium">Dress / Description</th>
                  <th className="pb-3 text-center font-medium">Size</th>
                  <th className="pb-3 text-center font-medium">Color</th>
                  <th className="pb-3 text-center font-medium">Qty</th>
                  <th className="pb-3 text-right font-medium">Unit Price</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/30">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-13 object-cover rounded border border-neutral-800 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{item.productName}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">Code: {item.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-neutral-300 font-mono">{item.size}</td>
                    <td className="py-3.5 text-center text-neutral-300">{item.color}</td>
                    <td className="py-3.5 text-center font-mono tabular-nums text-white">{item.quantity}</td>
                    <td className="py-3.5 text-right font-mono tabular-nums text-neutral-300">
                      Rs. {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right font-mono tabular-nums text-white font-medium">
                      Rs. {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row justify-between gap-6 text-xs">
            <div className="space-y-2 max-w-sm text-neutral-400 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authentic Pakistani Designer Craftsmanship</span>
              </div>
              <p>
                All pieces are hand-checked by master karigars prior to dispatch. Exchanges are accepted within 7 days in original condition with intact seals.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-neutral-300">
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''}):</span>
                <span className="font-mono tabular-nums text-white">Rs. {order.subtotal.toLocaleString()}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>Special Discount:</span>
                  <span className="font-mono tabular-nums">- Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Nationwide Shipping:</span>
                <span className="font-mono tabular-nums text-white">
                  {order.shippingFee === 0 ? 'Complimentary' : `Rs. ${order.shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-neutral-800 text-sm font-semibold">
                <span className="text-amber-200">Grand Total:</span>
                <span className="text-base text-amber-300 font-mono tabular-nums">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <p>Thank you for choosing Zeenat Couture.</p>
            <p className="font-mono">Computer Generated Invoice · Valid Without Signature</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="no-print flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
