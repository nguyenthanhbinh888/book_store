export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
  createdAt: string;
}

export interface Publisher {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface Book {
  id: number;
  isbn?: string;
  title: string;
  description?: string;
  category: Category;
  publisher?: Publisher;
  authors: Author[];
  sellingPrice: number;
  stockQuantity: number;
  coverImageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminBook extends Book {
  costPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderDetail {
  id: number;
  bookId: number;
  bookTitleSnapshot: string;
  coverImageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  customer: User;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  details: OrderDetail[];
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
}

export type PurchaseReceiptStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface Supplier {
  id: number;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface PurchaseReceiptDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  coverImageUrl?: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseReceipt {
  id: number;
  receiptCode: string;
  supplier: Supplier;
  createdBy: User;
  status: PurchaseReceiptStatus;
  note?: string;
  totalCost: number;
  details: PurchaseReceiptDetail[];
  createdAt: string;
  confirmedAt?: string;
}

export interface InventoryTransaction {
  id: number;
  bookId: number;
  bookTitle: string;
  transactionType: string;
  referenceType: string;
  referenceId?: number;
  quantityChange: number;
  note?: string;
  createdByName?: string;
  createdAt: string;
}

export interface DashboardSummary {
  activeBookCount: number;
  totalOrderCount: number;
  pendingOrderCount: number;
  totalRevenue: number;
  recentOrders: Order[];
  lowStockBooks: Book[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CartItem {
  book: Book;
  quantity: number;
}
