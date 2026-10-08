import React, { useState } from 'react';
import { Search, Printer, Download, Eye, FileText, ArrowUpRight, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const InvoicesView: React.FC = () => {
  const { orders, setActiveInvoiceOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    return (
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    );
  });

  const totalInvoiced = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const handlePrint = (order: Order) => {
    setActiveInvoiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownload = (order: Order) => {
    setActiveInvoiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Billing & Invoices
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Official commercial receipts, customer invoices, tax records & printable slips
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-2">
            <span className="text-neutral-400">Total Invoiced:</span>
            <span className="font-mono text-sm text-amber-300 font-semibold tabular-nums">
              Rs. {totalInvoiced.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number (e.g. INV-2026-...), order ID, or customer name..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4 font-medium">Invoice Number</th>
                <th className="py-3.5 px-3 font-medium">Order ID</th>
                <th className="py-3.5 px-3 font-medium">Billed To</th>
                <th className="py-3.5 px-3 font-medium">Date</th>
                <th className="py-3.5 px-3 font-medium">Payment Method</th>
                <th className="py-3.5 px-3 font-medium text-right">Grand Total (PKR)</th>
                <th className="py-3.5 px-3 font-medium text-center">Status</th>
                <th className="py-3.5 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {order.invoiceNumber}
                    </td>

                    {/* Order ID */}
                    <td className="py-3.5 px-3 font-mono text-neutral-400">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-neutral-200">{order.customerName}</p>
                      <p className="text-[11px] text-neutral-500 font-mono">{order.customerPhone}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 font-mono text-neutral-400">
                      {order.orderDate}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-3 text-neutral-300">
                      {order.paymentMethod}
                    </td>

                    {/* Grand Total */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className="font-semibold text-amber-300">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Invoice */}
                        <button
                          onClick={() => setActiveInvoiceOrder(order)}
                          className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Print Invoice */}
                        <button
                          onClick={() => handlePrint(order)}
                          className="p-1.5 text-neutral-400 hover:text-amber-300 rounded hover:bg-neutral-800 transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Download Invoice */}
                        <button
                          onClick={() => handleDownload(order)}
                          className="p-1.5 text-neutral-400 hover:text-amber-300 rounded hover:bg-neutral-800 transition-colors"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
