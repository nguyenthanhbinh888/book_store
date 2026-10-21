import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Zap, Star } from 'lucide-react';
import { Book } from '../types';
import { booksApi } from '../api';
import { formatCurrency } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [buyingNow, setBuyingNow] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    booksApi.getBookById(Number(id))
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thông tin cuốn sách này.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Đang tải thông tin chi tiết sách...</span>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="content-wrapper">
        <div className="empty-state">
          <h3>Không tìm thấy cuốn sách</h3>
          <p>{error || 'Sách không tồn tại hoặc đã ngừng kinh doanh.'}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Quay lại danh sách sách</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity > book.stockQuantity) {
      showToast('Không thể đặt vượt quá số lượng tồn kho!', 'warning');
      return;
    }

    const success = addToCart(book, quantity);
    if (success) {
      setAdded(true);
      showToast(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng! 🛒`, 'success');
      setTimeout(() => setAdded(false), 2000);
    } else {
      showToast('Không đủ tồn kho để thêm số lượng này!', 'warning');
    }
  };

  const handleBuyNow = async () => {
    if (quantity > book.stockQuantity) {
      showToast('Không thể đặt vượt quá số lượng tồn kho!', 'warning');
      return;
    }

    setBuyingNow(true);
    const success = addToCart(book, quantity);
    if (success) {
      showToast(`Đang chuyển đến trang thanh toán... ⚡`, 'info');
      setTimeout(() => {
        navigate('/checkout');
        setBuyingNow(false);
      }, 400);
    } else {
      showToast('Không đủ tồn kho để thêm số lượng này!', 'warning');
      setBuyingNow(false);
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const stockColor =
    book.stockQuantity > 10 ? '#059669' :
    book.stockQuantity > 0 ? '#d97706' :
    '#e11d48';

  return (
    <div className="content-wrapper detail-page-wrapper">
      <Link to="/" className="btn btn-secondary detail-back-btn">
        <ArrowLeft size={16} />
        <span>Quay lại trang chủ</span>
      </Link>

      <div className="detail-card">
        {/* Book Cover */}
        <div className="detail-cover-col">
          <div className="detail-cover-frame">
            <img
              src={book.coverImageUrl || defaultCover}
              alt={book.title}
              className="detail-cover-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultCover;
              }}
            />
          </div>
          {/* Perks below image */}
          <div className="detail-perks">
            <div className="perk-item">
              <Truck size={18} className="perk-icon" />
              <span>Giao hàng COD toàn quốc</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={18} className="perk-icon" />
              <span>Sách 100% chính hãng</span>
            </div>
            <div className="perk-item">
              <RefreshCw size={18} className="perk-icon" />
              <span>Đổi trả dễ dàng</span>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="detail-info-col">
          {book.category && (
            <span className="detail-category-badge">{book.category.name}</span>
          )}

          <h1 className="detail-title">{book.title}</h1>

          {/* Meta info */}
          <div className="detail-meta-list">
            <div className="detail-meta-row">
              <span className="detail-meta-label">Tác giả</span>
              <span className="detail-meta-value">
                {book.authors?.map((a) => a.name).join(', ') || 'Chưa cập nhật'}
              </span>
            </div>
            {book.publisher && (
              <div className="detail-meta-row">
                <span className="detail-meta-label">Nhà xuất bản</span>
                <span className="detail-meta-value">{book.publisher.name}</span>
              </div>
            )}
            {book.isbn && (
              <div className="detail-meta-row">
                <span className="detail-meta-label">ISBN</span>
                <span className="detail-meta-value detail-isbn">{book.isbn}</span>
              </div>
            )}
          </div>

          {/* Price box */}
          <div className="detail-price-box">
            <span className="detail-price-label">Giá bán</span>
            <div className="detail-price-value">{formatCurrency(book.sellingPrice)}</div>
            {/* Stock */}
            <div className="detail-stock-row" style={{ color: stockColor }}>
              <span className="stock-dot" style={{ background: stockColor }} />
              <span>
                {book.stockQuantity > 0
                  ? `Còn hàng trong kho (${book.stockQuantity} cuốn)`
                  : 'Tạm hết hàng'}
              </span>
            </div>
          </div>

          {/* Action Area */}
          {book.stockQuantity > 0 ? (
            <div className="detail-action-area">
              {/* Quantity selector */}
              <div className="qty-selector">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="qty-btn"
                  id="btn-qty-minus"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(book.stockQuantity, prev + 1))}
                  className="qty-btn"
                  id="btn-qty-plus"
                  disabled={quantity >= book.stockQuantity}
                >
                  +
                </button>
              </div>

              {/* Buttons */}
              <div className="detail-btns">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-detail-cart"
                  id="btn-detail-add-to-cart"
                >
                  {added ? (
                    <>
                      <Check size={20} />
                      <span>Đã thêm vào giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      <span>Thêm vào giỏ hàng</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn btn-detail-buy-now"
                  id="btn-detail-buy-now"
                  disabled={buyingNow}
                >
                  <Zap size={20} />
                  <span>{buyingNow ? 'Đang chuyển trang...' : 'Mua ngay'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-out-of-stock">
              <span>⚠️ Sách hiện đang hết hàng. Vui lòng quay lại sau!</span>
            </div>
          )}

          {/* Description */}
          <div className="detail-description">
            <h3 className="detail-desc-title">
              <Star size={16} style={{ color: '#f59e0b', display: 'inline', marginRight: '6px' }} />
              Giới thiệu nội dung
            </h3>
            <p className="detail-desc-text">
              {book.description || 'Chưa có thông tin mô tả chi tiết cho cuốn sách này.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
