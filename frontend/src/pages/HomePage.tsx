import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, BookX, ArrowUpDown } from 'lucide-react';
import { Book, Category } from '../types';
import { booksApi, categoriesApi } from '../api';
import { BookCard } from '../components/BookCard';
import { Pagination } from '../components/Pagination';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryIdParam = searchParams.get('category');
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<string>('desc');

  // Load categories
  useEffect(() => {
    categoriesApi.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Lỗi khi tải danh mục', err));
  }, []);

  // Load books
  const loadBooks = () => {
    setLoading(true);
    setError(null);

    booksApi.getBooks({
      keyword: keyword || undefined,
      categoryId: selectedCategoryId,
      page: currentPage,
      size: 12,
      sortBy,
      sortDir,
    })
      .then((res) => {
        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách sách.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBooks();
  }, [keyword, selectedCategoryId, currentPage, sortBy, sortDir]);

  const handleSelectCategory = (id?: number) => {
    setCurrentPage(0);
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('category', id.toString());
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="content-wrapper">
      {/* Hero Banner */}
      {!keyword && (
        <section className="hero-banner" id="hero-banner">
          <div className="hero-text">
            <span className="hero-tagline">
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Tri Thức Mở Ra Tương Lai
            </span>
            <h1 className="hero-title">Khám Phá Thế Giới Sách Đỉnh Cao</h1>
            <p className="hero-desc">
              Tuyển tập sách công nghệ thông tin, lập trình kiến trúc, kinh tế, quản trị và kỹ năng sống từ các tác giả và nhà xuất bản uy tín nhất.
            </p>
          </div>
        </section>
      )}

      {/* Category Chips */}
      <div className="category-chips" id="category-chips">
        <button
          className={`category-chip ${!selectedCategoryId ? 'active' : ''}`}
          onClick={() => handleSelectCategory(undefined)}
          id="cat-chip-all"
        >
          Tất cả sách
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${selectedCategoryId === cat.id ? 'active' : ''}`}
            onClick={() => handleSelectCategory(cat.id)}
            id={`cat-chip-${cat.id}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          {keyword && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Kết quả tìm kiếm cho từ khóa: <strong>"{keyword}"</strong>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <ArrowUpDown size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Sắp xếp:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.88rem' }}
            value={`${sortBy}_${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('_');
              setSortBy(sb);
              setSortDir(sd);
            }}
            id="book-sort-select"
          >
            <option value="createdAt_desc">Mới nhất</option>
            <option value="sellingPrice_asc">Giá tăng dần</option>
            <option value="sellingPrice_desc">Giá giảm dần</option>
            <option value="title_asc">Tên sách (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Đang tải danh sách sách...</span>
        </div>
      ) : error ? (
        <div className="empty-state">
          <BookX size={48} />
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <button onClick={loadBooks} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Thử lại
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <BookX size={48} />
          <h3>Không tìm thấy cuốn sách nào</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục khác.</p>
        </div>
      ) : (
        <>
          <div className="book-grid" id="book-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};
