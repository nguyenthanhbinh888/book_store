import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api';
import { formatDate } from '../utils/format';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Họ và tên không được để trống!', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await authApi.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      updateUser(res.data);
      showToast('Cập nhật hồ sơ cá nhân thành công!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật hồ sơ.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-wrapper" style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Hồ Sơ Cá Nhân</h1>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.fullName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span className="status-badge" style={{ background: user?.role === 'ADMIN' ? '#dbeafe' : '#ecfdf5', color: user?.role === 'ADMIN' ? '#1d4ed8' : '#059669', fontSize: '0.75rem' }}>
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng thân thiết'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tham gia: {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} id="profile-form">
          <div className="form-group">
            <label className="form-label" htmlFor="profileEmail">Địa chỉ Email (Cố định)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="profileEmail"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ background: '#f8fafc', color: 'var(--text-secondary)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileFullName">Họ và tên *</label>
            <input
              type="text"
              id="profileFullName"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profilePhone">Số điện thoại liên lạc</label>
            <input
              type="tel"
              id="profilePhone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0987654321"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            id="btn-update-profile"
            style={{ marginTop: '0.5rem' }}
          >
            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>
    </div>
  );
};
