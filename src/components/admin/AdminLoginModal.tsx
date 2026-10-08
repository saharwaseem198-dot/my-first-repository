import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { adminLogin, setActiveView } = useStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passcode);
    if (!success) {
      setError(true);
    }
  };

  const handleDemoLogin = () => {
    adminLogin('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-neutral-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-100 tracking-wide uppercase">
            Admin Access Portal
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Authorized management area for Zeenat Couture Pakistani store & inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Admin Passcode / Password
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="Enter passcode (e.g. admin123)"
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">
                Invalid passcode. Use <span className="font-mono font-semibold">admin123</span> or click 1-Click Demo Login below.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow"
          >
            <span>Unlock Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-4 text-xs text-neutral-500 uppercase tracking-widest font-mono">or</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 text-neutral-200 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant Demo Admin Access (admin123)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('shop')}
            className="w-full py-2 text-neutral-400 hover:text-neutral-200 text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
