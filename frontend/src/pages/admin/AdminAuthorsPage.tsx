import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Search } from 'lucide-react';
import { Author } from '../../types';
import { adminApi } from '../../api';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

export const AdminAuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getAuthors({ keyword: keyword || undefined, page, size: 10 })
      .then((res) => {
        setAuthors(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải tác giả', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setName('');
    setBiography('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Author) => {
    setEditingAuthor(a);
    setName(a.name);
    setBiography(a.biography || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tên tác giả không được để trống!', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingAuthor) {
        await adminApi.updateAuthor(editingAuthor.id, { name: name.trim(), biography: biography.trim() });
        showToast('Cập nhật tác giả thành công!', 'success');
      } else {
        await adminApi.createAuthor({ name: name.trim(), biography: biography.trim() });
        showToast('Thêm tác giả mới thành công!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu tác giả.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Tác Giả</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Danh sách các tác giả sáng tác sách trong hệ thống
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" id="btn-add-author">
          <Plus size={18} />
          <span>Thêm tác giả</span>
        </button>
      </div>

      <div className="table-card">
        <div className="table-header">
          <form onSubmit={(e) => { e.preventDefault(); setPage(0); loadData(); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên tác giả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="admin-authors-table">
            <thead>
              <tr>
                <th>Tên tác giả</th>
                <th>Tiểu sử / Giới thiệu</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem' }}>Đang tải...</td>
                </tr>
              ) : authors.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Chưa có tác giả nào.
                  </td>
                </tr>
              ) : (
                authors.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{a.name}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '400px' }} className="truncate">
                      {a.biography || '—'}
                    </td>
                    <td>{formatDate(a.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(a)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
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
        title={editingAuthor ? 'Sửa Tác Giả' : 'Thêm Tác Giả Mới'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tên tác giả *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Martin Fowler"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tiểu sử / Giới thiệu tóm tắt</label>
            <textarea
              className="form-control"
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Thông tin nghề nghiệp, giải thưởng, thành tựu..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Tác Giả'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
