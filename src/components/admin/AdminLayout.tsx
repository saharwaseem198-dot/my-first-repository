import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { ProductManagement } from './ProductManagement';
import { CategoryManagement } from './CategoryManagement';
import { OrderManagement } from './OrderManagement';
import { CustomerManagement } from './CustomerManagement';
import { InvoicesView } from './InvoicesView';
import { SalesAnalytics } from './SalesAnalytics';
import { StoreSettings } from './StoreSettings';
import { ProductFormModal } from './ProductFormModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { AdminLoginModal } from './AdminLoginModal';

export const AdminLayout: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setActiveView,
    isAdminAuthenticated,
    adminLogout,
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    editingProduct,
    setEditingProduct,
    activeInvoiceOrder,
    setActiveInvoiceOrder,
    toastMessage,
    orders,
    products,
  } = useStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAdminAuthenticated) {
    return <AdminLoginModal />;
  }

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  const navigationItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products / Dresses', icon: <Layers className="w-4 h-4" />, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined },
    { id: 'categories', label: 'Categories', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales & Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-neutral-900 border border-amber-500/40 rounded-xl shadow-2xl text-xs text-neutral-200 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-neutral-400 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-amber-300 text-lg uppercase tracking-wider">
            Zeenat Couture
          </span>
        </div>

        <button
          onClick={() => setActiveView('shop')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 font-medium border border-neutral-700"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between z-40 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-amber-200 tracking-wider uppercase block">
                  Zeenat Couture
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                  Admin Atelier Panel
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navigationItems.map((item) => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-neutral-950' : 'text-neutral-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                        isActive
                          ? 'bg-neutral-950 text-amber-400'
                          : 'bg-neutral-800 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Switch to Customer View & User Info */}
          <div className="p-4 border-t border-neutral-800 space-y-3 bg-neutral-950/40">
            {/* Customer storefront switch button */}
            <button
              onClick={() => setActiveView('shop')}
              className="w-full py-2.5 px-3 bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700/80 text-neutral-200 hover:text-white rounded-xl text-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">Customer Shopfront</span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
            </button>

            {/* Logout */}
            <button
              onClick={adminLogout}
              className="w-full py-2 px-3 text-neutral-400 hover:text-rose-400 text-xs transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Dynamic Admin Sub-View */}
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'products' && <ProductManagement />}
        {adminTab === 'categories' && <CategoryManagement />}
        {adminTab === 'orders' && <OrderManagement />}
        {adminTab === 'customers' && <CustomerManagement />}
        {adminTab === 'invoices' && <InvoicesView />}
        {adminTab === 'sales' && <SalesAnalytics />}
        {adminTab === 'settings' && <StoreSettings />}
      </main>

      {/* Global Modals for Admin Actions */}
      <ProductFormModal
        isOpen={isAddProductModalOpen || !!editingProduct}
        productToEdit={editingProduct}
        onClose={() => {
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
        }}
      />

      <InvoiceModal
        order={activeInvoiceOrder}
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />
    </div>
  );
};
