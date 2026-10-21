import { OrderStatus, PurchaseReceiptStatus } from '../types';

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('VND', '₫');
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getOrderStatusInfo(status: OrderStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ xử lý', bg: '#fef3c7', text: '#b45309' };
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', bg: '#dbeafe', text: '#1d4ed8' };
    case 'SHIPPING':
      return { label: 'Đang giao hàng', bg: '#e0e7ff', text: '#4338ca' };
    case 'COMPLETED':
      return { label: 'Hoàn thành', bg: '#dcfce7', text: '#15803d' };
    case 'CANCELLED':
      return { label: 'Đã hủy', bg: '#fee2e2', text: '#b91c1c' };
    default:
      return { label: status, bg: '#f3f4f6', text: '#4b5563' };
  }
}

export function getReceiptStatusInfo(status: PurchaseReceiptStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case 'DRAFT':
      return { label: 'Bản nháp', bg: '#f3f4f6', text: '#4b5563' };
    case 'CONFIRMED':
      return { label: 'Đã nhập kho', bg: '#dcfce7', text: '#15803d' };
    case 'CANCELLED':
      return { label: 'Đã hủy', bg: '#fee2e2', text: '#b91c1c' };
    default:
      return { label: status, bg: '#f3f4f6', text: '#4b5563' };
  }
}
