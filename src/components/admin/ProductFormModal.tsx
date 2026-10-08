import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { Dress, ProductColor, ProductStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ASSET_CHIFFON, ASSET_HERO, ASSET_LAWN, ASSET_VELVET } from '../../data/initialData';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Dress | null;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitched'];

const PRESET_COLORS: ProductColor[] = [
  { name: 'Dusty Rose', hex: '#C48B9F' },
  { name: 'Emerald Green', hex: '#064E3B' },
  { name: 'Royal Maroon', hex: '#4A0404' },
  { name: 'Midnight Navy', hex: '#0F172A' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Ivory Pearl', hex: '#FDFBF7' },
  { name: 'Lilac Mist', hex: '#DDD6FE' },
  { name: 'Sapphire Blue', hex: '#1E3A8A' },
  { name: 'Jet Black', hex: '#171717' },
  { name: 'Soft Peach', hex: '#FED7AA' },
];

const PRESET_IMAGE_LIBRARY = [
  { label: 'Embroidered Chiffon 3-Piece', url: ASSET_CHIFFON },
  { label: 'Royal Velvet Formal', url: ASSET_VELVET },
  { label: 'Luxury Lawn 3-Piece', url: ASSET_LAWN },
  { label: 'Festive Editorial Couture', url: ASSET_HERO },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, categories } = useStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '3-Piece');
  const [collection, setCollection] = useState('Festive Couture');
  const [price, setPrice] = useState<number>(35000);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [hasSalePrice, setHasSalePrice] = useState(false);
  const [stock, setStock] = useState<number>(10);
  const [status, setStatus] = useState<ProductStatus>('Active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([
    PRESET_COLORS[0],
    PRESET_COLORS[1],
  ]);
  const [images, setImages] = useState<string[]>([ASSET_CHIFFON]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setDescription(productToEdit.description);
      setFabric(productToEdit.fabric);
      setCategory(productToEdit.category);
      setCollection(productToEdit.collection);
      setPrice(productToEdit.price);
      if (productToEdit.salePrice) {
        setSalePrice(productToEdit.salePrice);
        setHasSalePrice(true);
      } else {
        setSalePrice(undefined);
        setHasSalePrice(false);
      }
      setStock(productToEdit.stock);
      setStatus(productToEdit.status);
      setIsFeatured(productToEdit.isFeatured);
      setIsNewArrival(productToEdit.isNewArrival);
      setIsBestSeller(productToEdit.isBestSeller);
      setSelectedSizes(productToEdit.sizes);
      setSelectedColors(productToEdit.colors);
      setImages(productToEdit.images.length ? productToEdit.images : [ASSET_CHIFFON]);
    } else {
      // Reset defaults for Add Dress
      setName('');
      setSku(`ZN-${Date.now().toString().slice(-4)}`);
      setDescription('');
      setFabric('Pure Crinkle Chiffon with Hand-Embroidered Organza Dupatta');
      setCategory(categories[0]?.name || '3-Piece');
      setCollection('Noor-e-Khaas Festive Edit');
      setPrice(38500);
      setSalePrice(undefined);
      setHasSalePrice(false);
      setStock(10);
      setStatus('Active');
      setIsFeatured(false);
      setIsNewArrival(true);
      setIsBestSeller(false);
      setSelectedSizes(['S', 'M', 'L']);
      setSelectedColors([PRESET_COLORS[0], PRESET_COLORS[1]]);
      setImages([ASSET_CHIFFON]);
    }
    setErrorMsg('');
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: ProductColor) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.name === color.name);
      if (exists) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter((c) => c.name !== color.name);
      }
      return [...prev, color];
    });
  };

  const handleAddImage = (urlToAdd?: string) => {
    const targetUrl = urlToAdd || newImageUrl.trim();
    if (!targetUrl) return;
    if (!images.includes(targetUrl)) {
      setImages((prev) => [...prev, targetUrl]);
    }
    if (!urlToAdd) setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const others = prev.filter((_, i) => i !== index);
      return [selected, ...others];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Dress name is required.');
      return;
    }
    if (price <= 0) {
      setErrorMsg('Valid price in PKR is required.');
      return;
    }
    if (selectedSizes.length === 0) {
      setErrorMsg('Please select at least one available size.');
      return;
    }
    if (selectedColors.length === 0) {
      setErrorMsg('Please select at least one available color.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please add at least one product image.');
      return;
    }

    const payload = {
      name: name.trim(),
      sku: sku.trim() || `ZN-${Date.now().toString().slice(-4)}`,
      description: description.trim() || `${name} handcrafted with bespoke embroidery details.`,
      fabric: fabric.trim() || 'Pure Luxury Fabric',
      category,
      collection: collection.trim() || 'Festive Edit',
      price: Number(price),
      salePrice: hasSalePrice && salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      status: Number(stock) === 0 && status === 'Active' ? 'Out of Stock' : status,
      isFeatured,
      isNewArrival,
      isBestSeller,
      sizes: selectedSizes,
      colors: selectedColors,
      images,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl my-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-100 tracking-wide uppercase">
              {productToEdit ? 'Edit Pakistani Dress' : 'Add New Dress to Collection'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {productToEdit 
                ? 'Updates will immediately sync with the live customer shopfront'
                : 'Added dresses immediately become available for customer orders'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              1. Dress Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs text-neutral-300">Dress / Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shehnai Embroidered Chiffon 3-Piece"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">SKU / Product Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. ZN-CHF-009"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Collection</label>
                <input
                  type="text"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  placeholder="e.g. Noor-e-Khaas Festive"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Fabric Composition *</label>
                <input
                  type="text"
                  required
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure Chiffon & Silk Dupatta"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Detailed Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe needlework, tilla, hand zardozi, embroidery panels, dupatta details, etc."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Pricing, Stock & Status */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              2. Pricing, Inventory & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Regular Price (PKR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">Rs.</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm font-mono tabular-nums text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-300">Sale Price (PKR)</label>
                  <label className="text-[11px] text-amber-400 cursor-pointer flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={hasSalePrice}
                      onChange={(e) => {
                        setHasSalePrice(e.target.checked);
                        if (!salePrice) setSalePrice(Math.round(price * 0.9));
                      }}
                      className="rounded accent-amber-400"
                    />
                    <span>On Sale</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">Rs.</span>
                  <input
                    type="number"
                    disabled={!hasSalePrice}
                    min="1"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    placeholder="Discounted price"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm font-mono tabular-nums text-neutral-100 disabled:opacity-40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => {
                    const nextVal = Number(e.target.value);
                    setStock(nextVal);
                    if (nextVal === 0) setStatus('Out of Stock');
                    else if (status === 'Out of Stock') setStatus('Active');
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm font-mono tabular-nums text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Product Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Active">Active (Visible in Store)</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Draft">Draft (Admin Only)</option>
                  <option value="Hidden">Hidden (Not visible)</option>
                </select>
              </div>
            </div>

            {/* Badges / Highlighting */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <span>New Arrival</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <span>Best Seller</span>
              </label>
            </div>
          </div>

          {/* Section 3: Sizes & Colors */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              3. Available Sizes & Color Palette
            </h3>

            <div className="space-y-2">
              <span className="text-xs text-neutral-300">Select Available Sizes:</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-neutral-300">Select Color Palette:</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_COLORS.map((col) => {
                  const isSelected = selectedColors.some((c) => c.name === col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Image Management */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                4. Image Gallery Management
              </h3>
              <span className="text-xs text-neutral-400">
                First image is the primary cover photo
              </span>
            </div>

            {/* Current Images Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[3/4]"
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${index}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-neutral-950 font-bold text-[10px] rounded uppercase tracking-wider shadow">
                      Main Cover
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(index)}
                        className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
                      >
                        Set as Main
                      </button>
                    )}
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Presets Picker */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
              <p className="text-xs text-neutral-400 font-medium">
                Add from Luxury Pakistani Studio Assets:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGE_LIBRARY.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAddImage(item.url)}
                    className="px-2.5 py-1 text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL (e.g. /src/assets/images/...)"
                className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Dress to Shop'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
