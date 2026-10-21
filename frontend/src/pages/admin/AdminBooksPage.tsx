import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit3, Power, RefreshCw } from 'lucide-react';
import { AdminBook, Category, Author, Publisher } from '../../types';
import { adminApi, categoriesApi } from '../../api';
import { formatCurrency } from '../../utils/format';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    description: '',
    categoryId: 0,
    publisherId: 0,
    sellingPrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    coverImageUrl: '',
    authorIds: [] as number[],
  });
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  const loadData = () => {
    setLoading(true);
    adminApi.getBooks({
      keyword: keyword || undefined,
      categoryId,
      active: activeFilter,
      page,
      size: 10,
    })
      .then((res) => {
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.message || 'Không thể tải danh sách sách.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoriesApi.getCategories().then((res) => setCategories(res.data));
    adminApi.getAllAuthors().then((res) => setAuthors(res.data));
    adminApi.getAllPublishers().then((res) => setPublishers(res.data));
  }, []);

  useEffect(() => {
    loadData();
  }, [page, categoryId, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  const handleOpenCreate = () => {
    setEditingBook(null);
    setFormData({
      isbn: '',
      title: '',
      description: '',
      categoryId: categories[0]?.id || 1,
      publisherId: publishers[0]?.id || 1,
      sellingPrice: 100000,
      costPrice: 65000,
      stockQuantity: 20,
      coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      authorIds: authors[0]?.id ? [authors[0].id] : [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: AdminBook) => {
    setEditingBook(book);
    setFormData({
      isbn: book.isbn || '',
      title: book.title,
      description: book.description || '',
      categoryId: book.category?.id || 1,
      publisherId: book.publisher?.id || 0,
      sellingPrice: book.sellingPrice,
      costPrice: book.costPrice,
      stockQuantity: book.stockQuantity,
      coverImageUrl: book.coverImageUrl || '',
      authorIds: book.authors?.map((a) => a.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.categoryId) {
      showToast('Vui lòng điền các trường bắt buộc!', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        isbn: formData.isbn.trim() || undefined,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        categoryId: Number(formData.categoryId),
        publisherId: Number(formData.publisherId) || undefined,
        sellingPrice: Number(formData.sellingPrice),
        costPrice: Number(formData.costPrice),
        stockQuantity: Number(formData.stockQuantity),
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
        authorIds: formData.authorIds,
      };

      if (editingBook) {
        await adminApi.updateBook(editingBook.id, payload);
        showToast('Cập nhật sách thành công!', 'success');
      } else {
        await adminApi.createBook(payload);
        showToast('Thêm sách mới thành công!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu sách.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (book: AdminBook) => {
    try {
      const newStatus = !book.active;
      await adminApi.updateBookStatus(book.id, newStatus);
      showToast(`Đã chuyển trạng thái sách sang: ${newStatus ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Không thể đổi trạng thái sách.', 'error');
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Kho Sách</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Thêm mới, sửa thông tin, theo dõi giá nhập và điều chỉnh trạng thái kinh doanh
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" id="btn-add-new-book">
          <Plus size={18} />
          <span>Thêm sách mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo tên sách hoặc ISBN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            id="admin-book-search-input"
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
            <Search size={16} />
          </button>
        </form>

        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '180px' }}
          value={categoryId || ''}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
          id="admin-filter-category"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '160px' }}
          value={activeFilter === undefined ? '' : activeFilter.toString()}
          onChange={(e) => {
            const val = e.target.value;
            setActiveFilter(val === '' ? undefined : val === 'true');
          }}
          id="admin-filter-status"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang kinh doanh</option>
          <option value="false">Ngừng kinh doanh</option>
        </select>

        <button onClick={() => { setKeyword(''); setCategoryId(undefined); setActiveFilter(undefined); loadData(); }} className="btn btn-secondary" title="Làm mới">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="custom-table" id="admin-books-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sách & ISBN</th>
                <th>Danh mục</th>
                <th>Tác giả</th>
                <th>Giá bán</th>
                <th>Giá nhập</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 0.5rem' }}></div>
                    <span>Đang tải danh sách sách...</span>
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không có cuốn sách nào phù hợp điều kiện lọc.
                  </td>
                </tr>
              ) : (
                books.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <img
                        src={b.coverImageUrl || defaultCover}
                        alt={b.title}
                        style={{ width: '42px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultCover; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: '240px' }} className="truncate">
                        {b.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ISBN: {b.isbn || '—'}
                      </div>
                    </td>
                    <td>{b.category?.name}</td>
                    <td>{b.authors?.map((a) => a.name).join(', ') || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      {formatCurrency(b.sellingPrice)}
                    </td>
                    <td style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {formatCurrency(b.costPrice)}
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: b.stockQuantity > 5 ? '#ecfdf5' : '#fee2e2', color: b.stockQuantity > 5 ? '#059669' : '#dc2626' }}>
                        {b.stockQuantity} cuốn
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: b.active ? '#dcfce7' : '#f3f4f6', color: b.active ? '#15803d' : '#6b7280' }}>
                        {b.active ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Sửa sách"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(b)}
                          className={b.active ? "btn btn-danger" : "btn btn-secondary"}
                          style={{ padding: '0.35rem 0.65rem' }}
                          title={b.active ? "Ngừng kinh doanh" : "Kích hoạt bán lại"}
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

      {/* Modal Create/Edit Book */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Cập Nhật Sách' : 'Thêm Sách Mới Vào Kho'}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveBook} id="book-modal-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tên sách *</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mã ISBN (Tùy chọn)</label>
              <input
                type="text"
                className="form-control"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Danh mục sách *</label>
              <select
                className="form-control"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nhà xuất bản</label>
              <select
                className="form-control"
                value={formData.publisherId}
                onChange={(e) => setFormData({ ...formData, publisherId: Number(e.target.value) })}
              >
                <option value="0">-- Chưa xác định --</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tác giả (Chọn nhiều)</label>
              <select
                multiple
                className="form-control"
                style={{ height: '80px' }}
                value={formData.authorIds.map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                  setFormData({ ...formData, authorIds: selected });
                }}
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Giá bán niêm yết (VND) *</label>
              <input
                type="number"
                min="0"
                step="1000"
                className="form-control"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giá nhập kho (VND) * (Nội bộ)</label>
              <input
                type="number"
                min="0"
                step="1000"
                className="form-control"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                required
              />
            </div>

            {!editingBook && (
              <div className="form-group">
                <label className="form-label">Số lượng tồn kho ban đầu *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ gridColumn: editingBook ? 'span 2' : 'span 1' }}>
              <label className="form-label">URL Ảnh bìa</label>
              <input
                type="url"
                className="form-control"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Mô tả tóm tắt nội dung</label>
              <textarea
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Sách'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
