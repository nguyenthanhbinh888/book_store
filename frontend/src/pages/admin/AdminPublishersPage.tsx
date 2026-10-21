import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Search } from 'lucide-react';
import { Publisher } from '../../types';
import { adminApi } from '../../api';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

export const AdminPublishersPage: React.FC = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getPublishers({ keyword: keyword || undefined, page, size: 10 })
      .then((res) => {
        setPublishers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải nhà xuất bản', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleOpenCreate = () => {
    setEditingPublisher(null);
    setName('');
    setAddress('');
    setPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Publisher) => {
    setEditingPublisher(p);
    setName(p.name);
    setAddress(p.address || '');
    setPhone(p.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tên nhà xuất bản không được để trống!', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim(), address: address.trim() || undefined, phone: phone.trim() || undefined };
      if (editingPublisher) {
        await adminApi.updatePublisher(editingPublisher.id, payload);
        showToast('Cập nhật nhà xuất bản thành công!', 'success');
      } else {
        await adminApi.createPublisher(payload);
        showToast('Thêm nhà xuất bản thành công!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu nhà xuất bản.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Nhà Xuất Bản</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Thông tin các đối tác nhà xuất bản sách
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" id="btn-add-publisher">
          <Plus size={18} />
          <span>Thêm nhà xuất bản</span>
        </button>
      </div>

      <div className="table-card">
        <div className="table-header">
          <form onSubmit={(e) => { e.preventDefault(); setPage(0); loadData(); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên nhà xuất bản..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="admin-publishers-table">
            <thead>
              <tr>
                <th>Tên nhà xuất bản</th>
                <th>Địa chỉ trụ sở</th>
                <th>Điện thoại liên hệ</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem' }}>Đang tải...</td>
                </tr>
              ) : publishers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Chưa có nhà xuất bản nào.
                  </td>
                </tr>
              ) : (
                publishers.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.address || '—'}</td>
                    <td>{p.phone || '—'}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(p)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
                        <Edit3 size={15} />
                      </button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPublisher ? 'Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản Mới'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tên nhà xuất bản *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: NXB Tri Thức"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ trụ sở</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện, tỉnh/TP"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Điện thoại liên hệ</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0281234567"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Nhà Xuất Bản'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
