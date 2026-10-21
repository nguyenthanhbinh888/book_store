import React from 'react';
import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '3.5rem 1.5rem 2rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: '1rem' }}>
            <BookOpen size={26} color="#818cf8" />
            <span>BookStore</span>
          </div>
          <p style={{ lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '1rem' }}>
            Hệ thống nhà sách trực tuyến hàng đầu cung cấp sách lập trình, kinh tế, văn học và kỹ năng sống chất lượng cao.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Liên kết nhanh</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem' }}>
            <li><Link to="/" style={{ color: '#94a3b8' }}>Trang chủ</Link></li>
            <li><Link to="/cart" style={{ color: '#94a3b8' }}>Giỏ hàng</Link></li>
            <li><Link to="/my-orders" style={{ color: '#94a3b8' }}>Lịch sử đơn hàng</Link></li>
            <li><Link to="/login" style={{ color: '#94a3b8' }}>Đăng nhập / Đăng ký</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Thông tin liên hệ</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={18} color="#818cf8" />
              <span>Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Phone size={18} color="#818cf8" />
              <span>0901 234 567</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Mail size={18} color="#818cf8" />
              <span>hotro@bookstore.local</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.85rem' }}>
        <p>© 2026 BookStore Management System. Bản quyền thuộc về hệ thống quản lý bán sách.</p>
      </div>
    </footer>
  );
};
