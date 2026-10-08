export type ProductStatus = 'Active' | 'Out of Stock' | 'Draft' | 'Hidden';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 
  | 'Cash on Delivery (COD)' 
  | 'Direct Bank Transfer' 
  | 'JazzCash / EasyPaisa' 
  | 'Credit / Debit Card';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Dress {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  collection: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  fabric: string;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
  soldCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  dressCount?: number;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  quantity: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderDate: string;
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  registrationDate: string;
  ordersCount: number;
  totalSpending: number;
  accountStatus: 'Active' | 'VIP' | 'Blocked';
}

export interface CartItem {
  product: Dress;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'customers' 
  | 'invoices' 
  | 'sales' 
  | 'settings';
