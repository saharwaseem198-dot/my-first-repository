import React from 'react';
import {
  ShoppingBag,
  Layers,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  FileText,
  Plus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Dress, Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    customers,
    setAdminTab,
    setIsAddProductModalOpen,
    setEditingProduct,
    setViewingProduct,
    setActiveInvoiceOrder,
    updateProduct,
  } = useStore();

  // Metrics
  const totalDresses = products.length;
  const totalCategories = categories.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === 'Delivered'
  ).length;

  const totalSales = orders.reduce((acc, o) => {
    // Only count non-cancelled orders towards total sales
    return o.status !== 'Cancelled' ? acc + o.totalAmount : acc;
  }, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 3);

  // Recent Orders (top 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  // Recently Added Dresses (top 4)
  const recentlyAddedDresses = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Best Selling Dresses (sorted by soldCount)
  const bestSellingDresses = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 4);

  // Category sales share
  const categoryStats = categories.map((cat) => {
    const dressesInCat = products.filter((p) => p.category === cat.name);
    const catRevenue = dressesInCat.reduce((acc, p) => acc + p.soldCount * (p.salePrice || p.price), 0);
    return {
      name: cat.name,
      count: dressesInCat.length,
      revenue: catRevenue,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const maxCatRev = Math.max(...categoryStats.map((c) => c.revenue), 1);

  // Quick Restock handler
  const handleRestock = (dress: Dress) => {
    updateProduct(dress.id, {
      stock: dress.stock + 10,
      status: 'Active',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Store Overview & Analytics
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time management for Zeenat Couture atelier, inventory & customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminTab('orders')}
            className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-colors flex items-center gap-2"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dress</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white tracking-tight tabular-nums font-mono">
            Rs. {totalSales.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500">
            Across {orders.filter((o) => o.status !== 'Cancelled').length} confirmed orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white tracking-tight tabular-nums font-mono">
            {totalOrders}
          </div>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="text-amber-400 font-mono font-medium">{pendingOrders} pending</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono font-medium">{completedOrders} completed</span>
          </p>
        </div>

        {/* Total Dresses */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Dresses</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white tracking-tight tabular-nums font-mono">
            {totalDresses}
          </div>
          <p className="text-[11px] text-neutral-500">
            Across {totalCategories} curated collections
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white tracking-tight tabular-nums font-mono">
            {lowStockProducts.length}
          </div>
          <p className="text-[11px] text-rose-400/90">
            {lowStockProducts.length > 0 ? 'Requires attention / restocking' : 'All inventory healthy'}
          </p>
        </div>
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl text-xs">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-neutral-400">Pending Orders</p>
            <p className="font-mono tabular-nums text-white font-semibold text-sm">{pendingOrders}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-neutral-400">Completed Orders</p>
            <p className="font-mono tabular-nums text-white font-semibold text-sm">{completedOrders}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <p className="text-neutral-400">Registered Clients</p>
            <p className="font-mono tabular-nums text-white font-semibold text-sm">{totalCustomers}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-amber-300 shrink-0" />
          <div>
            <p className="text-neutral-400">Active Categories</p>
            <p className="font-mono tabular-nums text-white font-semibold text-sm">{totalCategories}</p>
          </div>
        </div>
      </div>

      {/* Sales Overview & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Category Overview */}
        <div className="lg:col-span-2 p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
                Sales & Revenue by Category
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Top performing silhouettes and fabric lines in PKR
              </p>
            </div>
            <button
              onClick={() => setAdminTab('categories')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Manage Categories →
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {categoryStats.map((cat) => {
              const percentage = Math.round((cat.revenue / maxCatRev) * 100);
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400">{cat.count} dresses</span>
                      <span className="font-mono tabular-nums text-amber-300 font-medium">
                        Rs. {cat.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
              Order Status Pipeline
            </h2>
            <span className="text-xs font-mono text-neutral-500">{orders.length} total</span>
          </div>

          <div className="space-y-3 pt-2">
            {(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
              (st) => {
                const count = orders.filter((o) => o.status === st).length;
                const ratio = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                
                let colorClass = 'text-amber-400';
                if (st === 'Delivered') colorClass = 'text-emerald-400';
                if (st === 'Shipped') colorClass = 'text-sky-400';
                if (st === 'Cancelled') colorClass = 'text-rose-400';

                return (
                  <div key={st} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-800/60 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st === 'Delivered' ? 'bg-emerald-400' : st === 'Cancelled' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                      <span className="text-neutral-300">{st}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`font-semibold tabular-nums ${colorClass}`}>{count}</span>
                      <span className="text-neutral-500 text-[11px]">({ratio}%)</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setAdminTab('orders')}
              className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Process Order Queue
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Low Stock Dresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
              Recent Orders
            </h2>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              View All ({orders.length}) →
            </button>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs hover:bg-neutral-950/40 px-2 rounded-lg transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-medium">{order.id}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-200 font-medium">{order.customerName}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {order.deliveryAddress.city} · {order.items.length} item(s) · {order.orderDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-mono tabular-nums text-amber-300 font-medium">
                      Rs. {order.totalAmount.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-neutral-400 capitalize">
                      {order.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveInvoiceOrder(order)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                    title="View Invoice"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Dresses (with quick restock action) */}
        <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
                Low Stock Inventory Alerts
              </h2>
              {lowStockProducts.length > 0 && (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-semibold rounded uppercase">
                  {lowStockProducts.length} Alert{lowStockProducts.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => setAdminTab('products')}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Catalog →
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              All dresses currently have healthy inventory levels (&gt; 3 units).
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/80">
              {lowStockProducts.map((dress) => (
                <div key={dress.id} className="py-3 flex items-center justify-between text-xs hover:bg-neutral-950/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={dress.images[0]}
                      alt={dress.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-13 object-cover rounded border border-neutral-800 shrink-0"
                    />
                    <div>
                      <p className="font-medium text-neutral-200 line-clamp-1">{dress.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {dress.sku} · {dress.category}
                      </p>
                      <span className={`text-[10px] font-bold ${dress.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {dress.stock === 0 ? 'OUT OF STOCK' : `ONLY ${dress.stock} LEFT`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestock(dress)}
                      className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 rounded-lg transition-colors border border-neutral-700"
                    >
                      +10 Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Recently Added & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Dresses */}
        <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
              Recently Added Dresses
            </h2>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              + Add New
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentlyAddedDresses.map((dress) => (
              <div
                key={dress.id}
                className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3 group"
              >
                <img
                  src={dress.images[0]}
                  alt={dress.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 object-cover rounded border border-neutral-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-200 truncate">{dress.name}</p>
                  <p className="text-[11px] text-neutral-400">{dress.category}</p>
                  <p className="text-xs font-mono tabular-nums text-amber-300 mt-1">
                    Rs. {dress.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">Stock: {dress.stock}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(dress)}
                  className="p-1 text-neutral-500 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                  title="Edit Dress"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Dresses */}
        <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
              Best Selling Creations
            </h2>
            <span className="text-xs text-neutral-400">By client purchases</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bestSellingDresses.map((dress) => (
              <div
                key={dress.id}
                className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3"
              >
                <img
                  src={dress.images[0]}
                  alt={dress.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 object-cover rounded border border-neutral-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-200 truncate">{dress.name}</p>
                  <p className="text-[11px] text-neutral-400">{dress.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono tabular-nums text-emerald-400 font-medium">
                      {dress.soldCount} sold
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Rs. {(dress.soldCount * (dress.salePrice || dress.price)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
