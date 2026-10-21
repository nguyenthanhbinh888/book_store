import React, { useEffect, useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import { User } from '../../types';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/format';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getCustomers({ keyword: keyword || undefined, page, size: 10 })
      .then((res) => {
        setCustomers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải danh sách khách hàng.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Danh Sách Khách Hàng</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Thông tin các tài khoản người dùng đăng ký trên hệ thống BookStore
          </p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '380px', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              id="admin-search-customers"
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="admin-customers-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Địa chỉ Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò (Role)</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>Đang tải...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không có khách hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserCheck size={16} />
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td>{c.phone || 'Chưa cập nhật'}</td>
                    <td>
                      <span className="status-badge" style={{ background: c.role === 'ADMIN' ? '#dbeafe' : '#ecfdf5', color: c.role === 'ADMIN' ? '#1d4ed8' : '#059669' }}>
                        {c.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: c.active ? '#dcfce7' : '#fee2e2', color: c.active ? '#15803d' : '#dc2626' }}>
                        {c.active ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1rem' }}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </div>
      </div>
    </div>
  );
};
