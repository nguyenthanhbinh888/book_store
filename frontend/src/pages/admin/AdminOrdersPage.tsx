import React, { useEffect, useState } from 'react';
import { Search, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { adminApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/format';
import { OrderStatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('CONFIRMED');
  const [updating, setUpdating] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getOrders({
      keyword: keyword || undefined,
      status: statusFilter,
      page,
      size: 10,
    })
      .then((res) => {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải đơn hàng.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  const handleOpenDetail = (order: Order) => {
    adminApi.getOrderById(order.id)
      .then((res) => {
        setViewingOrder(res.data);
        setDetailModalOpen(true);
      })
      .catch((err) => showToast(err.message, 'error'));
  };

  const handleOpenStatusModal = (order: Order) => {
    setTargetOrder(order);
    setSelectedStatus(order.status);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!targetOrder) return;
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(targetOrder.id, selectedStatus);
      showToast(`Đã cập nhật trạng thái đơn ${targetOrder.orderCode} sang ${selectedStatus}`, 'success');
      setStatusModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật trạng thái đơn hàng.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Đơn Hàng</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Theo dõi, xử lý và cập nhật tiến độ giao hàng cho khách
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); loadData(); }} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mã đơn hoặc người nhận..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
            <Search size={16} />
          </button>
        </form>

        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '180px' }}
          value={statusFilter || ''}
          onChange={(e) => {
            const val = e.target.value;
            setStatusFilter(val ? (val as OrderStatus) : undefined);
            setPage(0);
          }}
          id="admin-filter-order-status"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý (PENDING)</option>
          <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
          <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
          <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
          <option value="CANCELLED">Đã hủy (CANCELLED)</option>
        </select>

        <button onClick={() => { setKeyword(''); setStatusFilter(undefined); loadData(); }} className="btn btn-secondary" title="Làm mới">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Orders Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="custom-table" id="admin-orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th>Người nhận & SĐT</th>
                <th>Tổng thanh toán</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>Đang tải...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      {ord.orderCode}
                    </td>
                    <td>{formatDate(ord.createdAt)}</td>
                    <td>{ord.customer?.fullName}</td>
                    <td>
                      <div>{ord.recipientName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.recipientPhone}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: ord.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7', color: ord.paymentStatus === 'PAID' ? '#15803d' : '#b45309' }}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                          title="Xem chi tiết đơn"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                          disabled={ord.status === 'CANCELLED'}
                        >
                          Chuyển trạng thái
                        </button>
                      </div>
                    </td>
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

      {/* View Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={viewingOrder ? `Chi Tiết Đơn Hàng #${viewingOrder.orderCode}` : 'Chi Tiết Đơn'}
        maxWidth="720px"
      >
        {viewingOrder && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Người nhận:</strong> {viewingOrder.recipientName} <br />
                <strong>Điện thoại:</strong> {viewingOrder.recipientPhone} <br />
                <strong>Địa chỉ:</strong> {viewingOrder.shippingAddress}
              </div>
              <div>
                <strong>Khách hàng:</strong> {viewingOrder.customer?.fullName} ({viewingOrder.customer?.email}) <br />
                <strong>Phương thức:</strong> {viewingOrder.paymentMethod} <br />
                <strong>Ghi chú:</strong> {viewingOrder.note || 'Không có'}
              </div>
            </div>

            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Các sản phẩm trong đơn</h4>
            <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
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
                  {viewingOrder.details.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={d.coverImageUrl || defaultCover}
                            alt={d.bookTitleSnapshot}
                            style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = defaultCover; }}
                          />
                          <span style={{ fontWeight: 600 }}>{d.bookTitleSnapshot}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(d.unitPrice)}</td>
                      <td>{d.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(d.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'right', fontSize: '1.15rem', fontWeight: 800 }}>
              Tổng cộng thanh toán: <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(viewingOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Change Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Cập Nhật Trạng Thái Đơn Hàng"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Đơn hàng: <strong>{targetOrder?.orderCode}</strong> (Trạng thái hiện tại: <OrderStatusBadge status={targetOrder?.status || 'PENDING'} />)
          </p>

          <div className="form-group">
            <label className="form-label">Chọn trạng thái mới</label>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              id="select-new-order-status"
            >
              <option value="PENDING">Chờ xử lý (PENDING)</option>
              <option value="CONFIRMED">Xác nhận đơn (CONFIRMED)</option>
              <option value="SHIPPING">Giao hàng (SHIPPING)</option>
              <option value="COMPLETED">Hoàn thành & Đã thu tiền (COMPLETED)</option>
              <option value="CANCELLED">Hủy đơn & Hoàn kho (CANCELLED)</option>
            </select>
          </div>

          {selectedStatus === 'CANCELLED' && (
            <div style={{ display: 'flex', gap: '0.65rem', background: '#fee2e2', color: '#b91c1c', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginTop: '1rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>
                <strong>Cảnh báo:</strong> Khi chuyển sang trạng thái <strong>HỦY ĐƠN</strong>, hệ thống sẽ tự động hoàn lại số lượng sách vào kho và ghi lại lịch sử biến động kho. Hành động này không thể hoàn tác!
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={() => setStatusModalOpen(false)} className="btn btn-secondary" disabled={updating}>
              Hủy bỏ
            </button>
            <button onClick={handleConfirmStatusUpdate} className="btn btn-primary" disabled={updating} id="btn-save-order-status">
              {updating ? 'Đang cập nhật...' : 'Lưu Trạng Thái'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
