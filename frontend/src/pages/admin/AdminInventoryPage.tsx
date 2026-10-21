import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { InventoryTransaction } from '../../types';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/format';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';

export const AdminInventoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getInventoryTransactions({ type: typeFilter || undefined, page, size: 15 })
      .then((res) => {
        setTransactions(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải lịch sử biến động kho.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, typeFilter]);

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return { label: 'Nhập kho', bg: '#dcfce7', text: '#15803d' };
      case 'ORDER':
        return { label: 'Xuất bán đơn hàng', bg: '#fee2e2', text: '#b91c1c' };
      case 'ORDER_CANCEL':
        return { label: 'Hoàn kho hủy đơn', bg: '#dbeafe', text: '#1d4ed8' };
      case 'ADJUSTMENT':
        return { label: 'Điều chỉnh kho', bg: '#fef3c7', text: '#b45309' };
      default:
        return { label: type, bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Lịch Sử Biến Động Kho</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Truy vết chi tiết mọi lượt tăng/giảm số lượng sách từ nhập hàng, đặt đơn và hoàn hủy
          </p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '220px' }}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(0);
              }}
              id="filter-inventory-type"
            >
              <option value="">Tất cả nghiệp vụ kho</option>
              <option value="PURCHASE">Nhập kho từ phiếu nhập (PURCHASE)</option>
              <option value="ORDER">Xuất kho bán hàng (ORDER)</option>
              <option value="ORDER_CANCEL">Hoàn kho khi hủy đơn (ORDER_CANCEL)</option>
              <option value="ADJUSTMENT">Khởi tạo & Điều chỉnh kho (ADJUSTMENT)</option>
            </select>

            <button onClick={() => { setTypeFilter(''); loadData(); }} className="btn btn-secondary" title="Làm mới">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="inventory-transactions-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Tên cuốn sách</th>
                <th>Loại giao dịch</th>
                <th>Số lượng biến động</th>
                <th>Ghi chú nghiệp vụ</th>
                <th>Người thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>Đang tải...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Chưa có bản ghi biến động kho nào.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const badge = getTransactionTypeBadge(t.transactionType);
                  const isPositive = t.quantityChange > 0;
                  return (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{formatDate(t.createdAt)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.bookTitle}</td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: badge.bg, color: badge.text }}>
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: isPositive ? '#ecfdf5' : '#fee2e2',
                            color: isPositive ? '#059669' : '#dc2626',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                          }}
                        >
                          {isPositive ? `+${t.quantityChange}` : t.quantityChange} cuốn
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.note || '—'}</td>
                      <td>{t.createdByName || 'Hệ thống'}</td>
                    </tr>
                  );
                })
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
