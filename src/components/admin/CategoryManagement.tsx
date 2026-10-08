import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Eye, X, Check, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { ASSET_CHIFFON, ASSET_LAWN, ASSET_VELVET } from '../../data/initialData';

export const CategoryManagement: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    setAdminTab,
    setSelectedCategoryFilter,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(ASSET_CHIFFON);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage(ASSET_CHIFFON);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image || ASSET_CHIFFON);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        image,
      });
    } else {
      addCategory({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        image,
      });
    }
    setIsModalOpen(false);
  };

  const handleViewCategoryDresses = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setAdminTab('products');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-neutral-100 uppercase">
            Category Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Organize Pakistani couture collections, fabric lines & silhouette categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const associatedDresses = products.filter((p) => p.category === category.name);
          const dressCount = associatedDresses.length;

          return (
            <div
              key={category.id}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-bold text-base text-neutral-100">
                        {category.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 font-mono">slug: /{category.slug}</p>
                    </div>
                  </div>

                  <span className="px-2 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono tabular-nums text-amber-300">
                    {dressCount} dress{dressCount !== 1 ? 'es' : ''}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                  {category.description || 'Curated luxury fashion category for seasonal collections.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                <button
                  onClick={() => handleViewCategoryDresses(category.name)}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Dresses ({dressCount})</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCatToDelete(category)}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-serif font-bold text-neutral-100 uppercase tracking-wide">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding Wear, Velvet, Lawn"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for customer browsing and filter tags"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300">Thumbnail Image Preset</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Chiffon', url: ASSET_CHIFFON },
                    { label: 'Velvet', url: ASSET_VELVET },
                    { label: 'Lawn', url: ASSET_LAWN },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative flex-1 aspect-video rounded-lg overflow-hidden border transition-all ${
                        image === preset.url
                          ? 'border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[9px] text-white rounded">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100 space-y-4">
            <h3 className="text-base font-serif font-bold text-neutral-100">
              Delete Category "{catToDelete.name}"?
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to remove this category? Existing dresses categorized under "{catToDelete.name}" will remain in the catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCatToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCategory(catToDelete.id);
                  setCatToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
