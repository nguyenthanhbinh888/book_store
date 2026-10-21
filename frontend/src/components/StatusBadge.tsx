import React from 'react';
import { OrderStatus, PurchaseReceiptStatus } from '../types';
import { getOrderStatusInfo, getReceiptStatusInfo } from '../utils/format';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const info = getOrderStatusInfo(status);
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: info.bg, color: info.text }}
      id={`order-status-${status.toLowerCase()}`}
    >
      {info.label}
    </span>
  );
};

interface ReceiptStatusBadgeProps {
  status: PurchaseReceiptStatus;
}

export const ReceiptStatusBadge: React.FC<ReceiptStatusBadgeProps> = ({ status }) => {
  const info = getReceiptStatusInfo(status);
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: info.bg, color: info.text }}
      id={`receipt-status-${status.toLowerCase()}`}
    >
      {info.label}
    </span>
  );
};
