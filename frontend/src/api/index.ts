import { axiosClient } from './axiosClient';
import {
  ApiResponse,
  User,
  Category,
  Author,
  Publisher,
  Book,
  AdminBook,
  Order,
  OrderStatus,
  PurchaseReceipt,
  PurchaseReceiptStatus,
  Supplier,
  InventoryTransaction,
  DashboardSummary,
  PageResponse,
} from '../types';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post<any, ApiResponse<{ token: string; user: User }>>('/auth/login', data),

  register: (data: { fullName: string; email: string; password: string; phone?: string }) =>
    axiosClient.post<any, ApiResponse<{ token: string; user: User }>>('/auth/register', data),

  getMe: () =>
    axiosClient.get<any, ApiResponse<User>>('/auth/me'),

  updateProfile: (data: { fullName: string; phone?: string }) =>
    axiosClient.put<any, ApiResponse<User>>('/auth/me', data),
};

export const booksApi = {
  getBooks: (params?: {
    keyword?: string;
    categoryId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => axiosClient.get<any, ApiResponse<PageResponse<Book>>>('/books', { params }),

  getBookById: (id: number) =>
    axiosClient.get<any, ApiResponse<Book>>(`/books/${id}`),
};

export const categoriesApi = {
  getCategories: () =>
    axiosClient.get<any, ApiResponse<Category[]>>('/categories'),

  getCategoryById: (id: number) =>
    axiosClient.get<any, ApiResponse<Category>>(`/categories/${id}`),
};

export const ordersApi = {
  createOrder: (data: {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    note?: string;
    items: { bookId: number; quantity: number }[];
  }) => axiosClient.post<any, ApiResponse<Order>>('/orders', data),

  getMyOrders: (page = 0, size = 10) =>
    axiosClient.get<any, ApiResponse<PageResponse<Order>>>('/orders/my', {
      params: { page, size },
    }),

  getMyOrderById: (id: number) =>
    axiosClient.get<any, ApiResponse<Order>>(`/orders/my/${id}`),

  cancelOrder: (id: number) =>
    axiosClient.post<any, ApiResponse<Order>>(`/orders/my/${id}/cancel`),
};

export const adminApi = {
  // Sách
  getBooks: (params?: {
    keyword?: string;
    categoryId?: number;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => axiosClient.get<any, ApiResponse<PageResponse<AdminBook>>>('/admin/books', { params }),

  getBookById: (id: number) =>
    axiosClient.get<any, ApiResponse<AdminBook>>(`/admin/books/${id}`),

  createBook: (data: any) =>
    axiosClient.post<any, ApiResponse<AdminBook>>('/admin/books', data),

  updateBook: (id: number, data: any) =>
    axiosClient.put<any, ApiResponse<AdminBook>>(`/admin/books/${id}`, data),

  updateBookStatus: (id: number, active: boolean) =>
    axiosClient.patch<any, ApiResponse<AdminBook>>(`/admin/books/${id}/status`, { active }),

  // Danh mục
  getCategories: (params?: { keyword?: string; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<Category>>>('/admin/categories', { params }),

  createCategory: (data: { name: string; description?: string; active?: boolean }) =>
    axiosClient.post<any, ApiResponse<Category>>('/admin/categories', data),

  updateCategory: (id: number, data: { name: string; description?: string; active?: boolean }) =>
    axiosClient.put<any, ApiResponse<Category>>(`/admin/categories/${id}`, data),

  updateCategoryStatus: (id: number, active: boolean) =>
    axiosClient.patch<any, ApiResponse<Category>>(`/admin/categories/${id}/status`, { active }),

  // Tác giả
  getAuthors: (params?: { keyword?: string; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<Author>>>('/admin/authors', { params }),

  getAllAuthors: () =>
    axiosClient.get<any, ApiResponse<Author[]>>('/admin/authors/all'),

  createAuthor: (data: { name: string; biography?: string }) =>
    axiosClient.post<any, ApiResponse<Author>>('/admin/authors', data),

  updateAuthor: (id: number, data: { name: string; biography?: string }) =>
    axiosClient.put<any, ApiResponse<Author>>(`/admin/authors/${id}`, data),

  // Nhà xuất bản
  getPublishers: (params?: { keyword?: string; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<Publisher>>>('/admin/publishers', { params }),

  getAllPublishers: () =>
    axiosClient.get<any, ApiResponse<Publisher[]>>('/admin/publishers/all'),

  createPublisher: (data: { name: string; address?: string; phone?: string }) =>
    axiosClient.post<any, ApiResponse<Publisher>>('/admin/publishers', data),

  updatePublisher: (id: number, data: { name: string; address?: string; phone?: string }) =>
    axiosClient.put<any, ApiResponse<Publisher>>(`/admin/publishers/${id}`, data),

  // Đơn hàng
  getOrders: (params?: { keyword?: string; status?: OrderStatus; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<Order>>>('/admin/orders', { params }),

  getOrderById: (id: number) =>
    axiosClient.get<any, ApiResponse<Order>>(`/admin/orders/${id}`),

  updateOrderStatus: (id: number, status: OrderStatus) =>
    axiosClient.patch<any, ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),

  // Phiếu nhập kho
  getPurchaseReceipts: (params?: { keyword?: string; status?: PurchaseReceiptStatus; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<PurchaseReceipt>>>('/admin/purchase-receipts', { params }),

  getPurchaseReceiptById: (id: number) =>
    axiosClient.get<any, ApiResponse<PurchaseReceipt>>(`/admin/purchase-receipts/${id}`),

  createPurchaseReceipt: (data: { supplierId: number; note?: string; items: { bookId: number; quantity: number; unitCost: number }[] }) =>
    axiosClient.post<any, ApiResponse<PurchaseReceipt>>('/admin/purchase-receipts', data),

  confirmPurchaseReceipt: (id: number) =>
    axiosClient.post<any, ApiResponse<PurchaseReceipt>>(`/admin/purchase-receipts/${id}/confirm`),

  confirmReceipt: (id: number) =>
    axiosClient.post<any, ApiResponse<PurchaseReceipt>>(`/admin/purchase-receipts/${id}/confirm`),

  // Lịch sử kho
  getInventoryTransactions: (params?: { bookId?: number; type?: string; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<InventoryTransaction>>>('/admin/inventory/transactions', { params }),

  // Thống kê Dashboard
  getDashboardSummary: () =>
    axiosClient.get<any, ApiResponse<DashboardSummary>>('/admin/dashboard/summary'),

  // Khách hàng
  getCustomers: (params?: { keyword?: string; page?: number; size?: number }) =>
    axiosClient.get<any, ApiResponse<PageResponse<User>>>('/admin/customers', { params }),

  // Nhà cung cấp
  getSuppliers: () =>
    axiosClient.get<any, ApiResponse<Supplier[]>>('/admin/suppliers'),
};
