import React from 'react';
import { TrendingUp, CreditCard, ShoppingBag, DollarSign, Calendar, PieChart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SalesAnalytics: React.FC = () => {
  const { orders, products, categories } = useStore();

  const confirmedOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = confirmedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalItemsSold = confirmedOrders.reduce((acc, o) => acc + o.quantity, 0);
  const averageOrderValue = confirmedOrders.length > 0 ? Math.round(totalRevenue / confirmedOrders.length) : 0;

  // Payment method breakdown
  const paymentBreakdown = confirmedOrders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  // City breakdown
  const cityBreakdown = confirmedOrders.reduce((acc, o) => {
    const city = o.deliveryAddress.city;
    acc[city] = (acc[city] || 0) + o.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Sales & Financial Analytics
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Revenue velocity, average order sizes, regional distribution in Pakistan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Currency:</span>
          <span className="font-mono text-xs text-amber-300 font-semibold px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg">
            PKR (Pakistani Rupee)
          </span>
        </div>
      </div>

      {/* KPI Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <p className="text-xs text-neutral-400">Total Net Revenue</p>
          <p className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500">Excludes cancelled returns</p>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <p className="text-xs text-neutral-400">Average Order Value (AOV)</p>
          <p className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            Rs. {averageOrderValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500">Across {confirmedOrders.length} confirmed orders</p>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <p className="text-xs text-neutral-400">Total Outfits Dispatched</p>
          <p className="text-2xl font-serif font-bold text-emerald-400 font-mono tabular-nums">
            {totalItemsSold} Units
          </p>
          <p className="text-[11px] text-neutral-500">Stitched pret & unstitched luxury lawn</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channels */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
            Payment Method Split
          </h2>
          <div className="space-y-3">
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const share = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-200 font-medium">{method}</span>
                    <span className="font-mono tabular-nums text-amber-300">
                      Rs. {amount.toLocaleString()} ({share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${Math.max(share, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pakistani Cities */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
            Regional Pakistani Sales
          </h2>
          <div className="space-y-3">
            {Object.entries(cityBreakdown).map(([city, amount]) => {
              const share = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              return (
                <div key={city} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-200 font-medium">{city}</span>
                    <span className="font-mono tabular-nums text-emerald-400">
                      Rs. {amount.toLocaleString()} ({share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.max(share, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
