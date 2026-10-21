import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, XCircle, MapPin, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api';
import { formatCurrency, formatDate } from '../utils/format';
import { OrderStatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { showToast } = useToast();

  const loadOrder = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    ordersApi.getMyOrderById(Number(id))
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message || 'Không thể tải chi tiết đơn hàng.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await ordersApi.cancelOrder(order.id);
      setOrder(res.data);
      showToast('Đã hủy đơn hàng và hoàn lại tồn kho thành công!', 'success');
      setCancelModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Không thể hủy đơn hàng.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Đang tải thông tin đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="content-wrapper">
        <div className="empty-state">
          <AlertCircle size={48} color="var(--danger-text)" />
          <h3>Không tìm thấy đơn hàng</h3>
          <p>{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền xem.'}</p>
          <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Quay lại đơn mua
          </Link>
        </div>
      </div>
    );
  }

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="content-wrapper">
      <Link to="/my-orders" className="btn btn-secondary" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Quay lại danh sách đơn mua</span>
      </Link>

      {/* Header bar */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Đơn hàng #{order.orderCode}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <Calendar size={15} />
            <span>Thời gian đặt: {formatDate(order.createdAt)}</span>
            {order.cancelledAt && (
              <span style={{ color: '#dc2626', marginLeft: '0.5rem' }}>
                (Thời gian hủy: {formatDate(order.cancelledAt)})
              </span>
            )}
          </div>
        </div>

        {order.status === 'PENDING' && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="btn btn-danger"
            id="btn-detail-cancel-order"
          >
            <XCircle size={16} />
            <span>Hủy đơn hàng này</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Order Details Table */}
        <div className="table-card" style={{ marginBottom: 0 }}>
          <div className="table-header">
            <h3 className="table-title">Các sản phẩm trong đơn</h3>
          </div>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sách</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.details.map((detail) => (
                  <tr key={detail.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={detail.coverImageUrl || defaultCover}
                          alt={detail.bookTitleSnapshot}
                          style={{ width: '48px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = defaultCover; }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {detail.bookTitleSnapshot}
                        </span>
                      </div>
                    </td>
                    <td>{formatCurrency(detail.unitPrice)}</td>
                    <td>{detail.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatCurrency(detail.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Info Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Recipient Info */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Địa Chỉ Nhận Hàng</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <User size={18} color="var(--primary-600)" />
                <span>Người nhận: <strong style={{ color: 'var(--text-main)' }}>{order.recipientName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} color="var(--primary-600)" />
                <span>Số điện thoại: <strong style={{ color: 'var(--text-main)' }}>{order.recipientPhone}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--primary-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Địa chỉ: <strong style={{ color: 'var(--text-main)' }}>{order.shippingAddress}</strong></span>
              </div>
              {order.note && (
                <div style={{ paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.88rem' }}>
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Summary */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Thanh Toán</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Phương thức:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{order.paymentMethod} (Nhận hàng trả tiền)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Trạng thái thanh toán:</span>
                <span style={{ fontWeight: 600, color: order.paymentStatus === 'PAID' ? '#059669' : '#d97706' }}>
                  {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tạm tính sách:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Tổng cộng:</span>
                <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Xác nhận hủy đơn hàng"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Bạn có thực sự muốn hủy đơn hàng <strong>#{order.orderCode}</strong> không? Sau khi xác nhận, toàn bộ số lượng sách trong đơn sẽ được hoàn trả lại tồn kho ngay lập tức.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => setCancelModalOpen(false)}
              className="btn btn-secondary"
              disabled={cancelling}
            >
              Quay lại
            </button>
            <button
              onClick={handleCancelOrder}
              className="btn btn-danger"
              disabled={cancelling}
              id="btn-confirm-cancel-in-detail"
            >
              {cancelling ? 'Đang hủy...' : 'Xác nhận hủy đơn'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
