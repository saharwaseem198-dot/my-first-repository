import React, { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Dress, ProductStatus } from '../../types';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

export const ProductManagement: React.FC = () => {
  const {
    products,
    categories,
    deleteProduct,
    setEditingProduct,
    setViewingProduct,
    setIsAddProductModalOpen,
    updateProduct,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'InStock' | 'LowStock' | 'OutOfStock'>('All');
  const [dressToDelete, setDressToDelete] = useState<Dress | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.fabric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.collection.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || prod.status === selectedStatus;

    let matchesStock = true;
    if (stockFilter === 'InStock') matchesStock = prod.stock > 3;
    if (stockFilter === 'LowStock') matchesStock = prod.stock > 0 && prod.stock <= 3;
    if (stockFilter === 'OutOfStock') matchesStock = prod.stock === 0;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const handleStatusChange = (dressId: string, newStatus: ProductStatus) => {
    updateProduct(dressId, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Dress & Product Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage Pakistani women's suits, pret wear, luxury fabrics & live storefront status
          </p>
        </div>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dress</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dress name, SKU, fabric..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active (Live in Shop)</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Draft">Draft (Admin Only)</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>

          {/* Stock Level Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Stock Levels</option>
              <option value="InStock">In Stock (&gt; 3)</option>
              <option value="LowStock">Low Stock (≤ 3)</option>
              <option value="OutOfStock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Status Count Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center gap-4 text-neutral-400">
            <span>
              Showing <strong className="text-white font-mono">{filteredProducts.length}</strong> of{' '}
              <strong className="text-white font-mono">{products.length}</strong> dresses
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Visual Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
          <Layers className="w-10 h-10 mx-auto text-neutral-600" />
          <h3 className="text-base font-medium text-neutral-200">No dresses matched your criteria</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting search terms or clear filters to view catalog items.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setStockFilter('All');
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Professional Table View */
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-3.5 px-4 font-medium">Dress / SKU</th>
                  <th className="py-3.5 px-3 font-medium">Category</th>
                  <th className="py-3.5 px-3 font-medium">Price (PKR)</th>
                  <th className="py-3.5 px-3 font-medium">Stock</th>
                  <th className="py-3.5 px-3 font-medium">Status</th>
                  <th className="py-3.5 px-3 font-medium">Date Added</th>
                  <th className="py-3.5 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredProducts.map((dress) => {
                  let statusBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  if (dress.status === 'Out of Stock') {
                    statusBadge = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  } else if (dress.status === 'Draft') {
                    statusBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  } else if (dress.status === 'Hidden') {
                    statusBadge = 'text-neutral-400 bg-neutral-800 border-neutral-700';
                  }

                  return (
                    <tr
                      key={dress.id}
                      className="hover:bg-neutral-800/30 transition-colors group"
                    >
                      {/* Product Image & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dress.images[0]}
                            alt={dress.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-16 object-cover rounded-lg border border-neutral-800 shrink-0 bg-neutral-950"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors truncate">
                              {dress.name}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              {dress.sku} · {dress.collection}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {dress.isFeatured && (
                                <span className="text-[10px] text-amber-300 font-medium">★ Featured</span>
                              )}
                              {dress.isNewArrival && (
                                <span className="text-[10px] text-sky-300 font-medium">New Arrival</span>
                              )}
                              {dress.isBestSeller && (
                                <span className="text-[10px] text-purple-300 font-medium">Best Seller</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-neutral-300">{dress.category}</span>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[140px]">{dress.fabric}</p>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-mono tabular-nums">
                        {dress.salePrice ? (
                          <div>
                            <span className="font-semibold text-amber-300">
                              Rs. {dress.salePrice.toLocaleString()}
                            </span>
                            <span className="block text-[11px] text-neutral-500 line-through">
                              Rs. {dress.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-neutral-200">
                            Rs. {dress.price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3 font-mono tabular-nums">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              dress.stock === 0
                                ? 'text-rose-400'
                                : dress.stock <= 3
                                ? 'text-amber-400'
                                : 'text-neutral-200'
                            }`}
                          >
                            {dress.stock}
                          </span>
                          {dress.stock <= 3 && dress.stock > 0 && (
                            <span className="text-[10px] text-amber-400">Low</span>
                          )}
                          {dress.stock === 0 && (
                            <span className="text-[10px] text-rose-400">Empty</span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-3">
                        <select
                          value={dress.status}
                          onChange={(e) => handleStatusChange(dress.id, e.target.value as ProductStatus)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-neutral-950 focus:outline-none ${statusBadge}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Out of Stock">Out of Stock</option>
                          <option value="Draft">Draft</option>
                          <option value="Hidden">Hidden</option>
                        </select>
                      </td>

                      {/* Date Added */}
                      <td className="py-3.5 px-3 font-mono text-neutral-400">
                        {dress.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => setViewingProduct(dress)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                            title="View Dress Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingProduct(dress)}
                            className="p-1.5 text-neutral-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Edit Dress"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete (with modal confirmation) */}
                          <button
                            onClick={() => setDressToDelete(dress)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Delete Dress"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((dress) => (
            <div
              key={dress.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-neutral-700 transition-colors flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-neutral-950 overflow-hidden">
                <img
                  src={dress.images[0]}
                  alt={dress.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    dress.status === 'Active'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  }`}>
                    {dress.status}
                  </span>
                  {dress.isFeatured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white font-mono text-xs tabular-nums">
                  Stock: {dress.stock}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{dress.category}</span>
                    <span className="font-mono">{dress.sku}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-neutral-100 mt-1 line-clamp-1">
                    {dress.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{dress.fabric}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                  <div className="font-mono tabular-nums">
                    {dress.salePrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-amber-300 text-sm">
                          Rs. {dress.salePrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-neutral-500 line-through">
                          Rs. {dress.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-neutral-200 text-sm">
                        Rs. {dress.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingProduct(dress)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingProduct(dress)}
                      className="p-1.5 text-neutral-400 hover:text-amber-300 rounded hover:bg-neutral-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDressToDelete(dress)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={dressToDelete}
        isOpen={!!dressToDelete}
        onClose={() => setDressToDelete(null)}
        onConfirm={() => {
          if (dressToDelete) {
            deleteProduct(dressToDelete.id);
            setDressToDelete(null);
          }
        }}
      />
    </div>
  );
};
