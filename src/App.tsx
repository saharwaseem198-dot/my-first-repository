/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { ShopView } from './components/shop/ShopView';
import { ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeView, setActiveView, toastMessage } = useStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-neutral-900 border border-amber-500/40 rounded-xl shadow-2xl text-xs text-neutral-200 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating View Switcher Bar for Quick Evaluation & Testing */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-750 rounded-full shadow-2xl">
        <button
          onClick={() => setActiveView('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeView === 'admin'
              ? 'bg-amber-400 text-neutral-950 font-semibold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>

        <button
          onClick={() => setActiveView('shop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeView === 'shop'
              ? 'bg-amber-400 text-neutral-950 font-semibold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Live Customer Shop</span>
        </button>
      </div>

      {/* View routing */}
      {activeView === 'admin' ? <AdminLayout /> : <ShopView />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
