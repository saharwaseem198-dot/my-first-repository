import React, { useState } from 'react';
import {
  Search,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, setActiveInvoiceOrder } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.deliveryAddress.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Confirmed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Processing':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Shipped':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Delivered':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Cancelled':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Order Fulfillment & Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Track customer bookings, courier statuses, payment verification & invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Total Bookings:</span>
          <span className="font-mono text-sm text-amber-300 font-semibold">{orders.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Client Name, Phone, City..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="py-3.5 px-4 font-medium">Order ID / Date</th>
                <th className="py-3.5 px-3 font-medium">Client / Contact</th>
                <th className="py-3.5 px-3 font-medium">Items / Description</th>
                <th className="py-3.5 px-3 font-medium">Total Amount</th>
                <th className="py-3.5 px-3 font-medium">Payment Method</th>
                <th className="py-3.5 px-3 font-medium">Delivery City</th>
                <th className="py-3.5 px-3 font-medium">Order Status</th>
                <th className="py-3.5 px-4 text-right font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-white block">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {order.orderDate}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-neutral-200">{order.customerName}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{order.customerPhone}</p>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 max-w-xs">
                        <div className="flex -space-x-2 shrink-0">
                          {order.items.slice(0, 3).map((it, i) => (
                            <img
                              key={i}
                              src={it.image}
                              alt={it.productName}
                              referrerPolicy="no-referrer"
                              className="w-7 h-9 object-cover rounded border border-neutral-900"
                            />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-300 truncate">
                            {order.items[0]?.productName}
                            {order.items.length > 1 && ` +${order.items.length - 1} more`}
                          </p>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Qty: {order.quantity} item(s)
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-3 font-mono tabular-nums">
                      <span className="font-semibold text-amber-300">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                      {order.shippingFee === 0 && (
                        <span className="block text-[10px] text-emerald-400">Free Ship</span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-3">
                      <span className="text-neutral-300 block font-medium">
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Delivery City */}
                    <td className="py-3.5 px-3">
                      <span className="text-neutral-300 font-medium">
                        {order.deliveryAddress.city}
                      </span>
                      <p className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                        {order.deliveryAddress.street}
                      </p>
                    </td>

                    {/* Order Status Dropdown */}
                    <td className="py-3.5 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-neutral-950 focus:outline-none ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action: View Invoice */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                          title="Quick View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveInvoiceOrder(order)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium"
                          title="Generate Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
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

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-serif font-bold text-neutral-100 uppercase tracking-wide">
                  Order Details — {selectedOrderDetails.id}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">Invoice: {selectedOrderDetails.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Client & Address Info */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-200">{selectedOrderDetails.customerName}</span>
                  <span className="font-mono text-neutral-400">{selectedOrderDetails.customerPhone}</span>
                </div>
                <div className="text-neutral-400 text-[11px] space-y-0.5">
                  <p>{selectedOrderDetails.deliveryAddress.street}</p>
                  <p>{selectedOrderDetails.deliveryAddress.city}, {selectedOrderDetails.deliveryAddress.province}</p>
                  <p>Email: {selectedOrderDetails.customerEmail}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  Ordered Dresses:
                </p>
                <div className="divide-y divide-neutral-800">
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-13 object-cover rounded border border-neutral-800 shrink-0"
                        />
                        <div>
                          <p className="font-medium text-neutral-200">{it.productName}</p>
                          <p className="text-[11px] text-neutral-500">
                            Size: {it.size} · Color: {it.color} · Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums text-amber-300 font-medium">
                        Rs. {it.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400">Payment: </span>
                  <span className="text-neutral-200 font-medium">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 text-[11px]">Total: </span>
                  <span className="text-sm font-mono font-bold text-amber-300">
                    Rs. {selectedOrderDetails.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                onClick={() => {
                  const orderToOpen = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  setActiveInvoiceOrder(orderToOpen);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Tax Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
