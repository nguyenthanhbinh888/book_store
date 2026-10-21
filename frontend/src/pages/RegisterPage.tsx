import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ShieldAlert, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tự động chuyển trang chủ nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Vui lòng điền các trường bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newUser = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });

      showToast(`Chào mừng ${newUser.fullName}! Tài khoản đã được tạo thành công 🎉`, 'success');
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Không thể tạo tài khoản. Vui lòng thử lại.');
      showToast(err.message || 'Đăng ký thất bại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left: Illustration */}
      <div className="auth-illustration">
        <div className="auth-illustration-content">
          <div className="auth-brand-icon">
            <BookOpen size={36} color="white" />
          </div>
          <h2 className="auth-brand-title">Tham Gia Cùng Chúng Tôi</h2>
          <p className="auth-brand-quote">
            "Đăng ký ngay để khám phá kho sách phong phú và nhận những ưu đãi hấp dẫn từ BookStore."
          </p>

          {/* Benefits */}
          <div style={{ marginTop: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              '📚 Truy cập hơn 1,200 đầu sách chất lượng cao',
              '⚡ Đặt hàng nhanh chóng, thanh toán COD',
              '📦 Theo dõi đơn hàng theo thời gian thực',
              '🎁 Nhận ưu đãi và thông báo sách mới',
            ].map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.9rem', color: 'rgba(199, 210, 254, 0.9)',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="auth-form-col" style={{ overflowY: 'auto' }}>
        <div className="auth-form-inner">
          <div className="auth-form-header">
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '50%',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
            }}>
              <UserPlus size={26} />
            </div>
            <h1 className="auth-form-title">Đăng Ký Tài Khoản</h1>
            <p className="auth-form-subtitle">Trở thành khách hàng của BookStore</p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--danger-50)',
              color: 'var(--danger-600)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: '1.5px solid #fecdd3',
            }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Lê Thị Mai"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Địa chỉ Email *</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật khẩu * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(tối thiểu 6 ký tự)</span></label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Số điện thoại <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(tuỳ chọn)</span></label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                autoComplete="tel"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="btn-register-submit"
              disabled={submitting}
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {submitting ? (
                <>
                  <span className="spinner-sm" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Đăng Ký Ngay</span>
                </>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '1.75rem',
            fontSize: '0.9rem', color: 'var(--text-secondary)',
          }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Đăng nhập ngay →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
