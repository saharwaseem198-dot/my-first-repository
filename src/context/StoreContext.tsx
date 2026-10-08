import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminTab,
  CartItem,
  Category,
  Customer,
  DeliveryAddress,
  Dress,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ProductColor,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from '../data/initialData';

interface StoreContextType {
  // Navigation & Authentication
  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  isAdminAuthenticated: boolean;
  adminLogin: (passcode: string) => boolean;
  adminLogout: () => void;

  // Products
  products: Dress[];
  addProduct: (data: Omit<Dress, 'id' | 'createdAt' | 'soldCount'>) => Dress;
  updateProduct: (id: string, updates: Partial<Dress>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (data: Omit<Category, 'id' | 'dressCount'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order;

  // Customers
  customers: Customer[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Dress, size: string, color: ProductColor, qty?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Modals & Active state
  viewingProduct: Dress | null;
  setViewingProduct: (dress: Dress | null) => void;
  editingProduct: Dress | null;
  setEditingProduct: (dress: Dress | null) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;

  // Search & Filter state for customer shop
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Reset demo
  resetStoreToDefault: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'zeenat_couture_products_v2',
  CATEGORIES: 'zeenat_couture_categories_v2',
  ORDERS: 'zeenat_couture_orders_v2',
  CUSTOMERS: 'zeenat_couture_customers_v2',
  CART: 'zeenat_couture_cart_v2',
  ADMIN_AUTH: 'zeenat_couture_admin_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // State with LocalStorage fallbacks
  const [products, setProducts] = useState<Dress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Modals & Navigation state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Dress | null>(null);
  const [editingProduct, setEditingProduct] = useState<Dress | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminAuthenticated));
    } catch (e) {
      console.error(e);
    }
  }, [isAdminAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Auth
  const adminLogin = (passcode: string) => {
    // Allows default "admin123", "zeenat", or empty/quick unlock
    if (passcode.trim() === 'admin123' || passcode.trim() === 'zeenat' || passcode.trim() === 'admin') {
      setIsAdminAuthenticated(true);
      showToast('Admin access granted — Welcome to Zeenat Couture Studio');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin Portal');
  };

  // Products CRUD
  const addProduct = (data: Omit<Dress, 'id' | 'createdAt' | 'soldCount'>): Dress => {
    const newDress: Dress = {
      ...data,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      soldCount: 0,
    };

    setProducts((prev) => [newDress, ...prev]);
    showToast(`"${newDress.name}" added and live on Customer Storefront!`);
    return newDress;
  };

  const updateProduct = (id: string, updates: Partial<Dress>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // If stock becomes 0 and was Active, or stock set > 0
          if (updated.stock === 0 && updated.status === 'Active') {
            updated.status = 'Out of Stock';
          }
          return updated;
        }
        return item;
      })
    );
    showToast('Product successfully updated & synced with customer store.');
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    showToast(`"${item?.name || 'Product'}" permanently deleted from catalog.`);
  };

  // Categories CRUD
  const addCategory = (data: Omit<Category, 'id' | 'dressCount'>): Category => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now().toString().slice(-4)}`,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created.`);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
  };

  // Orders CRUD
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order ${orderId} marked as ${status}.`);
  };

  const createOrder = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order => {
    const orderItems: OrderItem[] = cart.map((item) => {
      const price = item.product.salePrice ?? item.product.price;
      return {
        productId: item.product.id,
        productName: item.product.name,
        image: item.product.images[0] || '',
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        unitPrice: price,
        subtotal: price * item.quantity,
      };
    });

    const totalQty = orderItems.reduce((acc, it) => acc + it.quantity, 0);
    const subtotal = orderItems.reduce((acc, it) => acc + it.subtotal, 0);
    const shippingFee = subtotal >= 15000 ? 0 : 450;
    const discount = 0;
    const totalAmount = subtotal - discount + shippingFee;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${randomSuffix}`;
    const newInvoiceNumber = `INV-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: newOrderId,
      invoiceNumber: newInvoiceNumber,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      deliveryAddress: payload.deliveryAddress,
      items: orderItems,
      quantity: totalQty,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
      notes: payload.notes,
    };

    // 1. Decrement product stock & increment sold count
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingCartItem = cart.find((c) => c.product.id === prod.id);
        if (matchingCartItem) {
          const nextStock = Math.max(0, prod.stock - matchingCartItem.quantity);
          return {
            ...prod,
            stock: nextStock,
            soldCount: prod.soldCount + matchingCartItem.quantity,
            status: nextStock === 0 ? 'Out of Stock' : prod.status,
          };
        }
        return prod;
      })
    );

    // 2. Add to orders
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Update or create customer
    setCustomers((prev) => {
      const existing = prev.find(
        (c) =>
          c.email.toLowerCase() === payload.customerEmail.toLowerCase() ||
          c.phone === payload.customerPhone
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                ordersCount: c.ordersCount + 1,
                totalSpending: c.totalSpending + totalAmount,
                accountStatus: c.totalSpending + totalAmount > 100000 ? 'VIP' : c.accountStatus,
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now().toString().slice(-4)}`,
          name: payload.customerName,
          phone: payload.customerPhone,
          email: payload.customerEmail,
          city: payload.deliveryAddress.city,
          registrationDate: new Date().toISOString().split('T')[0],
          ordersCount: 1,
          totalSpending: totalAmount,
          accountStatus: totalAmount > 100000 ? 'VIP' : 'Active',
        };
        return [newCust, ...prev];
      }
    });

    // 4. Clear cart
    clearCart();
    showToast(`Order #${newOrderId} received! Connected directly to Admin Panel.`);
    return newOrder;
  };

  // Cart methods
  const addToCart = (
    product: Dress,
    size: string,
    color: ProductColor,
    qty = 1
  ) => {
    if (product.stock <= 0 || product.status === 'Out of Stock') {
      showToast('Item is currently Out of Stock.');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + qty);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize: size,
            selectedColor: color,
            quantity: Math.min(product.stock, qty),
          },
        ];
      }
    });

    setIsCartOpen(true);
    showToast(`Added "${product.name}" to shopping bag`);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      const maxStock = updated[index]?.product.stock || 1;
      updated[index] = {
        ...updated[index],
        quantity: Math.min(maxStock, qty),
      };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetStoreToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Reset to original sample Pakistani couture dataset.');
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        orders,
        updateOrderStatus,
        createOrder,
        customers,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        viewingProduct,
        setViewingProduct,
        editingProduct,
        setEditingProduct,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        resetStoreToDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
