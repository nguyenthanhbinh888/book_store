import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="content-wrapper">
        <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', border: '1px solid var(--border-color)' }}>
          <ShoppingBag size={56} color="var(--primary-400)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Giỏ hàng của bạn đang trống</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Khám phá hàng ngàn tựa sách hay và thêm vào giỏ hàng ngay hôm nay.
          </p>
          <Link to="/" className="btn btn-primary" id="btn-continue-shopping">
            <ArrowLeft size={16} />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>
      </div>
    );
  }

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Giỏ Hàng Của Bạn</h1>
        <button
          onClick={clearCart}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', color: 'var(--danger-text)', padding: '0.45rem 0.85rem' }}
          id="btn-clear-cart"
        >
          <Trash2 size={16} />
          <span>Xóa toàn bộ giỏ</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Item List */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {items.map(({ book, quantity }) => (
              <div
                key={book.id}
                style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}
                id={`cart-item-${book.id}`}
              >
                <img
                  src={book.coverImageUrl || defaultCover}
                  alt={book.title}
                  style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultCover; }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/books/${book.id}`}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }} className="truncate">
                      {book.title}
                    </h4>
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                    {formatCurrency(book.sellingPrice)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        style={{ padding: '0.25rem 0.6rem', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.5rem', fontWeight: 600, fontSize: '0.88rem', minWidth: '28px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        style={{ padding: '0.25rem 0.6rem', fontWeight: 700 }}
                        disabled={quantity >= book.stockQuantity}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(book.id)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.05rem', minWidth: '95px' }}>
                  {formatCurrency(book.sellingPrice * quantity)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: '1.25rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} />
              <span>Tiếp tục tìm thêm sách</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Tóm Tắt Đơn Hàng</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Phí vận chuyển COD:</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn btn-primary"
            id="btn-proceed-checkout"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            <span>Tiến hành đặt hàng</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
