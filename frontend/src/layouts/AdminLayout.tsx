import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Book,
  FolderTree,
  Users2,
  Building,
  ShoppingBag,
  FileSpreadsheet,
  ArrowLeftRight,
  UserCheck,
  Home,
  LogOut,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Tổng quan Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/books', label: 'Quản lý Sách', icon: Book },
    { to: '/admin/categories', label: 'Quản lý Danh mục', icon: FolderTree },
    { to: '/admin/authors', label: 'Quản lý Tác giả', icon: Users2 },
    { to: '/admin/publishers', label: 'Nhà xuất bản', icon: Building },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingBag },
    { to: '/admin/purchase-receipts', label: 'Phiếu nhập kho', icon: FileSpreadsheet },
    { to: '/admin/inventory', label: 'Lịch sử biến động kho', icon: ArrowLeftRight },
    { to: '/admin/customers', label: 'Danh sách Khách hàng', icon: UserCheck },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <BookOpen size={26} color="#818cf8" />
          <span>Admin Portal</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link to="/" className="admin-nav-item">
              <Home size={18} />
              <span>Về trang bán hàng</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Admin Section */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cổng quản trị hệ thống</span>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Quản Trị Bán Sách BookStore</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{user?.fullName}</div>
              <span className="status-badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.72rem' }}>
                ADMIN
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              id="admin-logout-btn"
              title="Đăng xuất"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
