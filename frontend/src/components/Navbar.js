import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { IoMenu, IoClose, IoSearch, IoPersonCircle, IoSunny, IoMoon } from 'react-icons/io5';
import SmartSearch from './SmartSearch';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--bg-navbar)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, sans-serif'
      }}>
        {/* Logo (Redirects to dashboard /journey if logged in) */}
        <Link to={user ? "/journey" : "/"} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '8px' }}>
          <span style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-white)',
            letterSpacing: '1px',
          }}>
            ZEN<span style={{ color: '#F97316' }}>FIT</span>
          </span>
        </Link>

        {/* Desktop Links (Removed Home page link) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '24px',
            margin: 0,
            padding: 0,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {user && (
              <>
                <li>
                  <Link to="/journey" style={{
                    textDecoration: 'none',
                    color: isActive('/journey') ? '#F97316' : 'var(--text-slate)',
                    transition: 'color 0.2s'
                  }}>My Journey</Link>
                </li>
                <li>
                  <Link to="/workout" style={{
                    textDecoration: 'none',
                    color: isActive('/workout') ? '#F97316' : 'var(--text-slate)',
                    transition: 'color 0.2s'
                  }}>Workout</Link>
                </li>
                <li>
                  <Link to="/mealplan" style={{
                    textDecoration: 'none',
                    color: isActive('/mealplan') ? '#F97316' : 'var(--text-slate)',
                    transition: 'color 0.2s'
                  }}>Meal Plan</Link>
                </li>
                <li>
                  <Link to="/membership" style={{
                    textDecoration: 'none',
                    color: isActive('/membership') ? '#F97316' : 'var(--text-slate)',
                    transition: 'color 0.2s'
                  }}>Membership</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-slate)',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-slate)'}
          >
            {theme === 'dark' ? <IoSunny /> : <IoMoon />}
          </button>

          {user && (
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-slate)',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-slate)'}
            >
              <IoSearch />
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: 'var(--text-white)',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <IoPersonCircle style={{ fontSize: '26px', color: '#10B981' }} />
                <span className="nav-username">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={{
                textDecoration: 'none',
                color: 'var(--text-slate)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'color 0.2s'
              }}>
                Login
              </Link>
              <Link to="/signup" style={{
                textDecoration: 'none',
                backgroundColor: '#F97316',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 0 12px rgba(249, 115, 22, 0.3)',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#EA580C';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#F97316';
                e.target.style.transform = 'translateY(0)';
              }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-white)',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center'
            }}
          >
            {mobileOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer menu (Removed Home page link) */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: '73px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 24px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {user && (
            <>
              <Link to="/journey" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-slate)', fontSize: '16px', fontWeight: '600' }}>My Journey</Link>
              <Link to="/workout" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-slate)', fontSize: '16px', fontWeight: '600' }}>Workout</Link>
              <Link to="/mealplan" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-slate)', fontSize: '16px', fontWeight: '600' }}>Meal Plan</Link>
              <Link to="/membership" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-slate)', fontSize: '16px', fontWeight: '600' }}>Membership</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-slate)', fontSize: '16px', fontWeight: '600' }}>Profile</Link>
            </>
          )}
        </div>
      )}

      {/* Smart Search Portal */}
      <SmartSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
