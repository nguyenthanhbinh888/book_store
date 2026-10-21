import React, { useEffect, useState } from 'react';
import { Plus, Check, Eye, Trash2 } from 'lucide-react';
import { PurchaseReceipt, Supplier, AdminBook, PurchaseReceiptStatus } from '../../types';
import { adminApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/format';
import { ReceiptStatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminPurchaseReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<PurchaseReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [books, setBooks] = useState<AdminBook[]>([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [note, setNote] = useState('');
  const [receiptItems, setReceiptItems] = useState<{ bookId: number; quantity: number; unitCost: number }[]>([]);
  const [creating, setCreating] = useState(false);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<PurchaseReceipt | null>(null);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getPurchaseReceipts({ page, size: 10 })
      .then((res) => {
        setReceipts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải phiếu nhập.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminApi.getSuppliers().then((res) => {
      setSuppliers(res.data);
      if (res.data.length > 0) setSupplierId(res.data[0].id);
    });
    adminApi.getBooks({ page: 0, size: 50 }).then((res) => {
      setBooks(res.data.content);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [page]);

  const handleOpenCreate = () => {
    if (books.length === 0) {
      showToast('Cần có ít nhất một cuốn sách trong hệ thống để tạo phiếu nhập!', 'warning');
      return;
    }
    setNote('');
    setReceiptItems([{ bookId: books[0].id, quantity: 10, unitCost: books[0].costPrice || 50000 }]);
    setCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    if (books.length === 0) return;
    setReceiptItems([...receiptItems, { bookId: books[0].id, quantity: 10, unitCost: books[0].costPrice || 50000 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setReceiptItems(receiptItems.filter((_, i) => i !== index));
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || receiptItems.length === 0) {
      showToast('Vui lòng chọn nhà cung cấp và ít nhất một dòng sách!', 'warning');
      return;
    }

    setCreating(true);
    try {
      await adminApi.createPurchaseReceipt({
        supplierId,
        note: note.trim() || undefined,
        items: receiptItems,
      });
      showToast('Tạo phiếu nhập hàng thành công (Bản nháp)!', 'success');
      setCreateModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Không thể tạo phiếu nhập.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmReceipt = async (receipt: PurchaseReceipt) => {
    try {
      await adminApi.confirmReceipt(receipt.id);
      showToast(`Đã xác nhận nhập kho thành công cho phiếu #${receipt.receiptCode}! Tồn kho sách đã được tăng lên.`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xác nhận nhập kho.', 'error');
    }
  };

  const handleOpenDetail = (receipt: PurchaseReceipt) => {
    adminApi.getPurchaseReceiptById(receipt.id)
      .then((res) => {
        setViewingReceipt(res.data);
        setDetailModalOpen(true);
      })
      .catch((err) => showToast(err.message, 'error'));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Phiếu Nhập Kho</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Nhập sách từ nhà cung cấp, tăng số lượng tồn kho tự động và ghi lịch sử truy vết
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" id="btn-create-receipt">
          <Plus size={18} />
          <span>Tạo phiếu nhập mới</span>
        </button>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table className="custom-table" id="admin-receipts-table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Nhà cung cấp</th>
                <th>Người tạo</th>
                <th>Tổng chi phí nhập</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>Đang tải...</td>
                </tr>
              ) : receipts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Chưa có phiếu nhập kho nào.
                  </td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{r.receiptCode}</td>
                    <td>{r.supplier?.name}</td>
                    <td>{r.createdBy?.fullName}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(r.totalCost)}</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>
                      <ReceiptStatusBadge status={r.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenDetail(r)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Xem chi tiết"
                        >
                          <Eye size={15} />
                        </button>
                        {r.status === 'DRAFT' && (
                          <button
                            onClick={() => handleConfirmReceipt(r)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                            id={`btn-confirm-receipt-${r.id}`}
                          >
                            <Check size={14} />
                            <span>Xác nhận nhập kho</span>
                          </button>
                        )}
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

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tạo Phiếu Nhập Sách Mới"
        maxWidth="740px"
      >
        <form onSubmit={handleCreateReceipt} id="create-receipt-form">
          <div className="form-group">
            <label className="form-label">Chọn nhà cung cấp *</label>
            <select
              className="form-control"
              value={supplierId}
              onChange={(e) => setSupplierId(Number(e.target.value))}
              required
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú phiếu nhập</label>
            <input
              type="text"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Số hóa đơn đối tác, đợt nhập tháng..."
            />
          </div>

          <div style={{ margin: '1.5rem 0 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 700 }}>Danh sách sách nhập ({receiptItems.length})</h4>
            <button
              type="button"
              onClick={handleAddItemRow}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} />
              <span>Thêm dòng sách</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {receiptItems.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  className="form-control"
                  value={item.bookId}
                  onChange={(e) => {
                    const selectedBook = books.find((b) => b.id === Number(e.target.value));
                    const newItems = [...receiptItems];
                    newItems[idx].bookId = Number(e.target.value);
                    if (selectedBook) {
                      newItems[idx].unitCost = selectedBook.costPrice || 50000;
                    }
                    setReceiptItems(newItems);
                  }}
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Số lượng"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...receiptItems];
                    newItems[idx].quantity = Number(e.target.value);
                    setReceiptItems(newItems);
                  }}
                  required
                />

                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="form-control"
                  placeholder="Đơn giá nhập"
                  value={item.unitCost}
                  onChange={(e) => {
                    const newItems = [...receiptItems];
                    newItems[idx].unitCost = Number(e.target.value);
                    setReceiptItems(newItems);
                  }}
                  required
                />

                {receiptItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(idx)}
                    style={{ color: 'var(--danger-text)', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating} id="btn-submit-create-receipt">
              {creating ? 'Đang tạo...' : 'Lưu Phiếu Nhập (Bản nháp)'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={viewingReceipt ? `Phiếu Nhập #${viewingReceipt.receiptCode}` : 'Chi Tiết'}
        maxWidth="680px"
      >
        {viewingReceipt && (
          <div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <div><strong>Nhà cung cấp:</strong> {viewingReceipt.supplier?.name}</div>
              <div><strong>Người lập:</strong> {viewingReceipt.createdBy?.fullName}</div>
              <div><strong>Ngày tạo:</strong> {formatDate(viewingReceipt.createdAt)}</div>
              {viewingReceipt.confirmedAt && (
                <div><strong>Ngày nhập kho:</strong> {formatDate(viewingReceipt.confirmedAt)}</div>
              )}
              {viewingReceipt.note && <div><strong>Ghi chú:</strong> {viewingReceipt.note}</div>}
            </div>

            <div className="table-wrapper" style={{ marginBottom: '1rem' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Sách</th>
                    <th>Số lượng nhập</th>
                    <th>Đơn giá nhập</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingReceipt.details.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>{d.bookTitle}</td>
                      <td>{d.quantity}</td>
                      <td>{formatCurrency(d.unitCost)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(d.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'right', fontSize: '1.15rem', fontWeight: 800 }}>
              Tổng tiền phiếu nhập: <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(viewingReceipt.totalCost)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
