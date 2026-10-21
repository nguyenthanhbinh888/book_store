import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Power, Search } from 'lucide-react';
import { Category } from '../../types';
import { adminApi } from '../../api';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getCategories({ keyword: keyword || undefined, page, size: 10 })
      .then((res) => {
        setCategories(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Lỗi khi tải danh mục', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tên danh mục không được để trống!', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, { name: name.trim(), description: description.trim() });
        showToast('Cập nhật danh mục thành công!', 'success');
      } else {
        await adminApi.createCategory({ name: name.trim(), description: description.trim() });
        showToast('Tạo danh mục mới thành công!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu danh mục.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      await adminApi.updateCategoryStatus(cat.id, !cat.active);
      showToast(`Đã đổi trạng thái danh mục "${cat.name}"`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật trạng thái.', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Danh Mục</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Phân loại sách giúp khách hàng duyệt và tìm kiếm dễ dàng
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" id="btn-add-category">
          <Plus size={18} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <div className="table-card">
        <div className="table-header">
          <form onSubmit={(e) => { e.preventDefault(); setPage(0); loadData(); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm danh mục..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="admin-categories-table">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem' }}>Đang tải...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cat.name}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '300px' }} className="truncate">
                      {cat.description || '—'}
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: cat.active ? '#dcfce7' : '#f3f4f6', color: cat.active ? '#15803d' : '#6b7280' }}>
                        {cat.active ? 'Đang dùng' : 'Ngừng dùng'}
                      </span>
                    </td>
                    <td>{formatDate(cat.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button onClick={() => handleOpenEdit(cat)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className={cat.active ? "btn btn-danger" : "btn btn-secondary"}
                          style={{ padding: '0.35rem 0.65rem' }}
                          title={cat.active ? "Ngừng dùng" : "Kích hoạt"}
                        >
                          <Power size={15} />
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tên danh mục *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Khoa học viễn tưởng"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả danh mục</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu thể loại sách..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Danh Mục'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
