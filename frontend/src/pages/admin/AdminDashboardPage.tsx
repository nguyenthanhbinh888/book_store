import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  ShoppingBag,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { DashboardSummary } from '../../types';
import { adminApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/format';
import { OrderStatusBadge } from '../../components/StatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboardSummary()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Không thể tải dữ liệu thống kê.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span>Đang tổng hợp số liệu kinh doanh từ MySQL...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="empty-state">
        <h3>Lỗi tải dữ liệu Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tổng Quan Hoạt Động Kinh Doanh</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Số liệu thống kê thời gian thực được truy vấn trực tiếp từ cơ sở dữ liệu
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" id="kpi-active-books">
          <div className="kpi-icon-wrap" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <Book size={26} />
          </div>
          <div>
            <div className="kpi-title">Sách đang kinh doanh</div>
            <div className="kpi-value">{data.activeBookCount}</div>
          </div>
        </div>

        <div className="kpi-card" id="kpi-total-orders">
          <div className="kpi-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="kpi-title">Tổng số đơn hàng</div>
            <div className="kpi-value">{data.totalOrderCount}</div>
          </div>
        </div>

        <div className="kpi-card" id="kpi-pending-orders">
          <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={26} />
          </div>
          <div>
            <div className="kpi-title">Đơn hàng chờ xử lý</div>
            <div className="kpi-value">{data.pendingOrderCount}</div>
          </div>
        </div>

        <div className="kpi-card" id="kpi-total-revenue">
          <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="kpi-title">Doanh thu hoàn tất (COMPLETED)</div>
            <div className="kpi-value" style={{ color: '#059669' }}>{formatCurrency(data.totalRevenue)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Orders */}
        <div className="table-card">
          <div className="table-header">
            <h3 className="table-title">Đơn hàng mới nhất</h3>
            <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="custom-table" id="recent-orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Người nhận</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <Link to={`/admin/orders`} style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                          {ord.orderCode}
                        </Link>
                      </td>
                      <td>{ord.recipientName}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(ord.totalAmount)}</td>
                      <td>
                        <OrderStatusBadge status={ord.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Books Alert */}
        <div className="table-card">
          <div className="table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#d97706" />
              <h3 className="table-title">Cảnh báo sách sắp hết hàng (Tồn kho ≤ 10)</h3>
            </div>
            <Link to="/admin/purchase-receipts" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              <span>Tạo phiếu nhập</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="custom-table" id="low-stock-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Danh mục</th>
                  <th style={{ textAlign: 'right' }}>Tồn kho còn</th>
                </tr>
              </thead>
              <tbody>
                {data.lowStockBooks.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: '#059669', padding: '1.5rem' }}>
                      Toàn bộ sách hiện tại đều có mức tồn kho dồi dào!
                    </td>
                  </tr>
                ) : (
                  data.lowStockBooks.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600 }}>{b.title}</td>
                      <td>{b.category?.name}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: 800 }}>
                          {b.stockQuantity} cuốn
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
