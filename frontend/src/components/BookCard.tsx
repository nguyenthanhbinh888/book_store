import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, Zap } from 'lucide-react';
import { Book } from '../types';
import { formatCurrency } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [added, setAdded] = React.useState(false);

  const authorNames = book.authors?.length
    ? book.authors.map((a) => a.name).join(', ')
    : 'Tác giả chưa cập nhật';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (book.stockQuantity <= 0) {
      showToast('Sách này hiện đã tạm hết hàng!', 'warning');
      return;
    }

    const success = addToCart(book, 1);
    if (success) {
      setAdded(true);
      showToast(`Đã thêm "${book.title}" vào giỏ hàng!`, 'success');
      setTimeout(() => setAdded(false), 1500);
    } else {
      showToast('Không thể thêm quá số lượng tồn kho còn lại!', 'warning');
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (book.stockQuantity <= 0) {
      showToast('Sách này hiện đã tạm hết hàng!', 'warning');
      return;
    }

    const success = addToCart(book, 1);
    if (success) {
      showToast(`Đã thêm "${book.title}" vào giỏ — đang chuyển đến thanh toán...`, 'info');
      navigate('/checkout');
    } else {
      showToast('Không thể thêm quá số lượng tồn kho còn lại!', 'warning');
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const stockColor =
    book.stockQuantity > 5 ? '#059669' :
    book.stockQuantity > 0 ? '#d97706' :
    '#e11d48';

  const stockLabel =
    book.stockQuantity > 5 ? `Còn ${book.stockQuantity} cuốn` :
    book.stockQuantity > 0 ? `Chỉ còn ${book.stockQuantity} cuốn` :
    'Tạm hết hàng';

  return (
    <div className="book-card" id={`book-card-${book.id}`}>
      <Link to={`/books/${book.id}`} className="book-cover-link">
        <div className="book-cover-wrapper">
          <img
            src={book.coverImageUrl || defaultCover}
            alt={book.title}
            className="book-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultCover;
            }}
          />
          {book.category && (
            <span className="book-badge-category">{book.category.name}</span>
          )}
          {/* Quick view overlay */}
          <div className="book-cover-overlay">
            <span className="book-overlay-label">Xem chi tiết →</span>
          </div>
        </div>
      </Link>

      <div className="book-info">
        <div className="book-author" title={authorNames}>{authorNames}</div>
        <Link to={`/books/${book.id}`}>
          <h3 className="book-title" title={book.title}>{book.title}</h3>
        </Link>

        {/* Stock indicator */}
        <div className="stock-indicator" style={{ color: stockColor }}>
          <span className="stock-dot" style={{ background: stockColor }} />
          <span>{stockLabel}</span>
        </div>

        <div className="book-meta">
          <div className="book-price">{formatCurrency(book.sellingPrice)}</div>
        </div>

        {/* Action buttons */}
        {book.stockQuantity > 0 ? (
          <div className="card-actions">
            <button
              onClick={handleAddToCart}
              className="btn-cart-icon"
              id={`btn-add-cart-${book.id}`}
              title="Thêm vào giỏ hàng"
            >
              {added ? <Check size={16} /> : <ShoppingBag size={16} />}
              <span>{added ? 'Đã thêm' : 'Vào giỏ'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-buy-now-sm"
              id={`btn-buy-now-${book.id}`}
              title="Mua ngay"
            >
              <Zap size={16} />
              <span>Mua ngay</span>
            </button>
          </div>
        ) : (
          <div className="card-actions">
            <button className="btn-out-of-stock" disabled>
              Tạm hết hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
