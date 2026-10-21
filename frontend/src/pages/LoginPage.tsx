import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, ShieldAlert, KeyRound, UserCheck, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    typeof (location.state as any)?.from === 'string'
      ? (location.state as any).from
      : (location.state as any)?.from?.pathname || '/';

  // Tự động chuyển trang ngay khi phát hiện người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const destination =
        from && from !== '/login'
          ? from
          : (isAdmin ? '/admin' : '/');
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isAdmin, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const loggedUser = await login(email.trim(), password);
      showToast(`Chào mừng trở lại, ${loggedUser.fullName}! 👋`, 'success');

      const destination =
        from && from !== '/login'
          ? from
          : (loggedUser.role === 'ADMIN' ? '/admin' : '/');

      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
      showToast(err.message || 'Đăng nhập không thành công!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="auth-layout">
      {/* Left: Illustration */}
      <div className="auth-illustration">
        <div className="auth-illustration-content">
          <div className="auth-brand-icon">
            <BookOpen size={36} color="white" />
          </div>
          <h2 className="auth-brand-title">BookStore Pro</h2>
          <p className="auth-brand-quote">
            "Tri thức là sức mạnh. Mỗi cuốn sách là một hành trình mới đang chờ bạn khám phá."
          </p>

          {/* Decorative stats */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            justifyContent: 'center',
          }}>
            {[
              { value: '1,200+', label: 'Đầu sách' },
              { value: '5,000+', label: 'Khách hàng' },
              { value: '99%', label: 'Hài lòng' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem', fontWeight: 800, color: 'white',
                  letterSpacing: '-0.02em'
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(199,210,254,0.75)', marginTop: '0.2rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="auth-form-col">
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
              <LogIn size={26} />
            </div>
            <h1 className="auth-form-title">Đăng Nhập</h1>
            <p className="auth-form-subtitle">Truy cập tài khoản BookStore của bạn</p>
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
              animation: 'fadeInUp 0.2s ease',
            }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Địa chỉ Email</label>
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
              <label className="form-label" htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="btn-login-submit"
              disabled={submitting}
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {submitting ? (
                <>
                  <span className="spinner-sm" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Đăng Nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-default)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '0.85rem',
            }}>
              <Sparkles size={12} />
              Tài khoản demo local
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@bookstore.local', 'Admin@123456')}
                className="btn btn-secondary"
                style={{ fontSize: '0.83rem', padding: '0.5rem 0.85rem', justifyContent: 'flex-start' }}
                id="btn-demo-admin"
              >
                <KeyRound size={14} color="var(--primary-600)" />
                <span>Admin: <strong>admin@bookstore.local</strong></span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer@bookstore.local', 'Customer@123456')}
                className="btn btn-secondary"
                style={{ fontSize: '0.83rem', padding: '0.5rem 0.85rem', justifyContent: 'flex-start' }}
                id="btn-demo-customer"
              >
                <UserCheck size={14} color="var(--success-600)" />
                <span>Khách hàng: <strong>customer@bookstore.local</strong></span>
              </button>
            </div>
          </div>

          <div style={{
            textAlign: 'center', marginTop: '1.75rem',
            fontSize: '0.9rem', color: 'var(--text-secondary)',
          }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Đăng ký ngay →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
