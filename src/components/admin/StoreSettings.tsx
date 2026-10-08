import React, { useState } from 'react';
import { Settings, RefreshCw, Save, CheckCircle, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const StoreSettings: React.FC = () => {
  const { resetStoreToDefault, showToast } = useStore();

  const [brandName, setBrandName] = useState('ZEENAT COUTURE');
  const [tagline, setTagline] = useState('Pakistani Haute Couture & Luxury Pret');
  const [currency, setCurrency] = useState('PKR (Rs.)');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(15000);
  const [standardShippingFee, setStandardShippingFee] = useState(450);
  const [helpline, setHelpline] = useState('+92 42 3578 9000');
  const [whatsapp, setWhatsapp] = useState('+92 321 000 0000');
  const [address, setAddress] = useState('M.M. Alam Road, Gulberg III, Lahore, Pakistan');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings saved successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Store Settings & Configuration
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Branding, currency, shipping rules, contact details & database controls
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
            Brand Identity & Atelier Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Tagline / Subheading</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Official Helpline</label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">WhatsApp Concierge</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-neutral-300">Flagship Studio Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h2 className="text-base font-serif font-bold text-neutral-100 tracking-wide">
            Delivery & Currency Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Store Base Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Complimentary Shipping Threshold (PKR)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Standard Courier Charge (PKR)</label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Database Reset Card */}
      <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-red-300">
              Reset Demo Store Data
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
              Resets all dresses, orders, categories, and customer records back to the original luxury Pakistani couture catalog seed. Useful if you want a clean slate after test orders.
            </p>
          </div>

          <button
            type="button"
            onClick={resetStoreToDefault}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
