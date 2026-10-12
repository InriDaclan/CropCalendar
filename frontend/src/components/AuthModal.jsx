import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin(username, password);
      } else {
        await onRegister(username, password, email, isStaff);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '1rem', borderBottom: 'none' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: mode === 'login' ? '800' : '600',
                color: mode === 'login' ? '#16a34a' : '#64748b',
                cursor: 'pointer',
                borderBottom: mode === 'login' ? '2px solid #16a34a' : '2px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: mode === 'register' ? '800' : '600',
                color: mode === 'register' ? '#16a34a' : '#64748b',
                cursor: 'pointer',
                borderBottom: mode === 'register' ? '2px solid #16a34a' : '2px solid transparent',
                paddingBottom: '0.4rem'
              }}
            >
              Create Account
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            )}

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '1rem'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="staff-check"
                  checked={isStaff}
                  onChange={(e) => setIsStaff(e.target.checked)}
                />
                <label htmlFor="staff-check" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                  Register with Admin Privileges (manage crops)
                </label>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register & Enter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
