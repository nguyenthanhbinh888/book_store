import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingBag, User as UserIcon, LogOut, Shield, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo" id="nav-brand-logo">
          <BookOpen size={28} />
          <span>BookStore</span>
        </Link>

        <form onSubmit={handleSearch} className="search-bar" id="nav-search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sách theo tên, tác giả, ISBN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            id="nav-search-input"
          />
        </form>

        <div className="nav-actions">
          {isAdmin && (
            <Link to="/admin" className="btn btn-secondary" id="nav-admin-dashboard-btn" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <Shield size={16} />
              <span>Quản trị</span>
            </Link>
          )}

          <Link to="/cart" className="cart-btn" id="nav-cart-btn">
            <ShoppingBag size={20} />
            <span>Giỏ hàng</span>
            {totalItems > 0 && <span className="cart-badge" id="nav-cart-badge">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" className="btn btn-secondary" id="nav-profile-btn" style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}>
                <UserIcon size={16} />
                <span>{user?.fullName ? user.fullName.trim().split(' ').slice(-1)[0] : 'Tài khoản'}</span>
              </Link>
              <Link to="/my-orders" className="btn btn-secondary" id="nav-my-orders-btn" style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}>
                Đơn mua
              </Link>
              <button onClick={logout} className="btn btn-secondary" id="nav-logout-btn" title="Đăng xuất" style={{ padding: '0.5rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" id="nav-login-btn" style={{ padding: '0.5rem 1rem' }}>
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary" id="nav-register-btn" style={{ padding: '0.5rem 1rem' }}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
