import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, XCircle } from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api';
import { formatCurrency, formatDate } from '../utils/format';
import { OrderStatusBadge } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const { showToast } = useToast();

  const loadOrders = () => {
    setLoading(true);
    setError(null);
    ordersApi.getMyOrders(page, 8)
      .then((res) => {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách đơn hàng.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleOpenCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    setCancelling(true);
    try {
      await ordersApi.cancelOrder(selectedOrder.id);
      showToast(`Đã hủy đơn hàng ${selectedOrder.orderCode}. Tồn kho đã được hoàn lại!`, 'success');
      setCancelModalOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      showToast(err.message || 'Không thể hủy đơn hàng.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Đơn Hàng Của Tôi</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Theo dõi trạng thái và lịch sử các đơn sách bạn đã đặt mua
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Đang tải lịch sử đơn hàng...</span>
        </div>
      ) : error ? (
        <div className="empty-state">
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <button onClick={loadOrders} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Thử lại
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', border: '1px solid var(--border-color)' }}>
          <Package size={56} color="var(--primary-400)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Hãy chọn những cuốn sách yêu thích và trải nghiệm dịch vụ của chúng tôi.
          </p>
          <Link to="/" className="btn btn-primary">
            Duyệt sách ngay
          </Link>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="custom-table" id="my-orders-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Thời gian đặt</th>
                  <th>Người nhận</th>
                  <th>Tổng thanh toán</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.id}`} style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                        {order.orderCode}
                      </Link>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.recipientName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link
                          to={`/orders/${order.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                        >
                          <ExternalLink size={14} />
                          <span>Chi tiết</span>
                        </Link>

                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleOpenCancel(order)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                          >
                            <XCircle size={14} />
                            <span>Hủy đơn</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '1rem' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal for Order Cancellation */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Xác nhận hủy đơn hàng"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Bạn có chắc chắn muốn hủy đơn hàng <strong>{selectedOrder?.orderCode}</strong> không? Số lượng sách trong đơn sẽ được tự động hoàn lại vào kho hàng.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => setCancelModalOpen(false)}
              className="btn btn-secondary"
              disabled={cancelling}
            >
              Giữ lại đơn hàng
            </button>
            <button
              onClick={handleConfirmCancel}
              className="btn btn-danger"
              disabled={cancelling}
              id="btn-confirm-cancel-order"
            >
              {cancelling ? 'Đang hủy đơn...' : 'Đồng ý hủy đơn'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
