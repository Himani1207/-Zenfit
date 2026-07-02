import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { IoPerson, IoMail, IoLockClosed } from 'react-icons/io5';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await signup(name.trim(), email.trim(), password.trim());
      if (res.success) {
        navigate('/login');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Signup server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '90vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '40px 32px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '28px',
            color: 'var(--text-white)',
            margin: '0 0 8px 0',
            textAlign: 'center',
            fontWeight: '800'
          }}>
            Create Account
          </h2>
          <p style={{
            color: 'var(--text-slate)',
            fontSize: '14px',
            textAlign: 'center',
            margin: '0 0 32px 0'
          }}>
            Join ZenFit to start tracking your journey
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-slate)' }}>FULL NAME</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px 16px'
              }}>
                <IoPerson style={{ color: '#F97316', fontSize: '18px', marginRight: '12px' }} />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-white)',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-slate)' }}>EMAIL ADDRESS</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px 16px'
              }}>
                <IoMail style={{ color: '#F97316', fontSize: '18px', marginRight: '12px' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-white)',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-slate)' }}>PASSWORD</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px 16px'
              }}>
                <IoLockClosed style={{ color: '#F97316', fontSize: '18px', marginRight: '12px' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-white)',
                    flex: 1,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {error && (
              <p style={{
                color: '#EF4444',
                fontSize: '13px',
                margin: 0,
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
                marginTop: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10B981';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{
            color: 'var(--text-slate)',
            fontSize: '13px',
            textAlign: 'center',
            margin: '24px 0 0 0'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#F97316',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
