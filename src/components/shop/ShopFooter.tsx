import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopFooter: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      {/* Trust Badges */}
      <div className="border-b border-neutral-900 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-neutral-200">100% Pure Fabric & Craft</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Authentic hand-embroidered crinkle chiffon, organza, and luxury combed lawn.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mx-auto sm:mx-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-neutral-200">Nationwide Express Delivery</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Dispatched directly from our Lahore atelier across all cities in Pakistan.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mx-auto sm:mx-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-neutral-200">WhatsApp Concierge Service</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Dedicated styling consultants available for custom stitching inquiries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <span className="text-base font-serif font-bold text-amber-200 tracking-wider uppercase block">
            ZEENAT COUTURE
          </span>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Preserving centuries of Subcontinental needlework heritage, tilla embroidery, and modern silhouette tailoring for Pakistani women worldwide.
          </p>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-neutral-200">
            Collections
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => setSelectedCategoryFilter('3-Piece')} className="hover:text-amber-300 transition-colors">
                Luxury 3-Piece Festive
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategoryFilter('Velvet')} className="hover:text-amber-300 transition-colors">
                Royal Velvet Formal
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategoryFilter('Chiffon')} className="hover:text-amber-300 transition-colors">
                Handcrafted Chiffon
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategoryFilter('Lawn')} className="hover:text-amber-300 transition-colors">
                Summer Designer Lawn
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-neutral-200">
            Atelier & Service
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>Flagship: M.M. Alam Road, Gulberg III, Lahore</li>
            <li>Karachi Studio: Bukhari Commercial, Phase 6, DHA</li>
            <li>Helpline: +92 42 3578 9000</li>
            <li>WhatsApp: +92 321 000 0000</li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-neutral-200">
            Administration
          </h4>
          <p className="text-[11px] text-neutral-500">
            Authorized personnel can access the backend inventory and order management system.
          </p>
          <button
            onClick={() => setActiveView('admin')}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-800 rounded-lg text-xs transition-colors font-medium mt-1 inline-flex items-center gap-1.5"
          >
            <span>Launch Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-900/80 py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-600">
        <p>© 2026 Zeenat Couture (Pvt) Ltd. All Rights Reserved.</p>
        <p>Pakistani Fashion & Textile Craftsmanship</p>
      </div>
    </footer>
  );
};
