import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ordersApi } from '../api';
import { formatCurrency } from '../utils/format';

export const CheckoutPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="content-wrapper">
        <div className="empty-state">
          <h3>Giỏ hàng đang trống</h3>
          <p>Bạn không có sản phẩm nào để đặt hàng.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError('Vui lòng nhập họ và tên người nhận hàng.');
      return;
    }
    if (!recipientPhone.trim()) {
      setError('Vui lòng nhập số điện thoại người nhận hàng.');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim() || undefined,
        items: items.map((i) => ({
          bookId: i.book.id,
          quantity: i.quantity,
        })),
      };

      const res = await ordersApi.createOrder(orderPayload);
      clearCart();
      showToast(`Đặt hàng thành công! Mã đơn: ${res.data.orderCode}`, 'success');
      navigate(`/orders/${res.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại số lượng tồn kho.');
      showToast(err.message || 'Đặt hàng thất bại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      <Link to="/cart" className="btn btn-secondary" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Thanh Toán Đơn Hàng (COD)</h1>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Form Details */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Thông Tin Nhận Hàng</h3>

          <form onSubmit={handleSubmitOrder} id="checkout-form">
            <div className="form-group">
              <label className="form-label" htmlFor="recipientName">Họ và tên người nhận *</label>
              <input
                type="text"
                id="recipientName"
                className="form-control"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="recipientPhone">Số điện thoại liên hệ *</label>
              <input
                type="tel"
                id="recipientPhone"
                className="form-control"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Ví dụ: 0987654321"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="shippingAddress">Địa chỉ nhận hàng chi tiết *</label>
              <input
                type="text"
                id="shippingAddress"
                className="form-control"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, ngõ/ngách, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="orderNote">Ghi chú giao hàng (tùy chọn)</label>
              <textarea
                id="orderNote"
                className="form-control"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Chỉ dẫn giao hàng, thời gian nhận mong muốn..."
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Phương thức thanh toán: Nhận hàng trả tiền (COD)</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Bạn chỉ cần thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi nhận và kiểm tra sách.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="btn-confirm-order"
              disabled={submitting}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {submitting ? 'Đang gửi đơn hàng lên hệ thống...' : 'Xác Nhận Đặt Hàng Ngay'}
            </button>
          </form>
        </div>

        {/* Order review */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Chi tiết các cuốn sách ({items.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {items.map(({ book, quantity }) => (
              <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', gap: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', flex: 1 }} className="truncate">
                  {book.title} <strong style={{ color: 'var(--text-main)' }}>x{quantity}</strong>
                </span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(book.sellingPrice * quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tạm tính:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
