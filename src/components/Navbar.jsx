import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut, Shield, LayoutDashboard, Menu, X, Sparkles, Code2, Terminal } from 'lucide-react';
import { Button } from './UI';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav-dark py-3'
          : 'bg-[#020617]/90 border-b border-[#1E293B] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#F8FAFC]">
                Bac<span className="text-[#2563EB]">Dev</span>
                <span className="text-[#06B6D4] font-mono text-xs font-semibold ml-1.5 px-2 py-0.5 rounded-md bg-[#0F172A] border border-[#1E293B]">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono tracking-wider">
                Baccalaureate CS Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#3B82F6] font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors ${
                isActive('/courses') ? 'text-[#3B82F6] font-semibold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Course Catalog
            </Link>

            {user && !isAdmin && (
              <Link
                to="/student/dashboard"
                className={`text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                  isActive('/student/dashboard')
                    ? 'text-[#06B6D4]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#06B6D4]" />
                <span>My Workspace</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'text-[#2563EB]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Shield className="w-4 h-4 text-[#2563EB]" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Status & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#0F172A] border border-[#1E293B]">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full bg-[#111827]"
                  />
                  <span className="text-xs font-semibold text-[#F8FAFC]">{user.name}</span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="!p-2 text-[#94A3B8] hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#94A3B8] hover:bg-[#0F172A]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-[#1E293B] px-4 py-4 space-y-3 animate-fade-in text-left">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Course Catalog
          </Link>

          {user && !isAdmin && (
            <Link
              to="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#06B6D4]"
            >
              My Workspace
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#2563EB]"
            >
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-[#1E293B] flex flex-col space-y-2">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#94A3B8]">Signed in as {user.name}</span>
                </div>
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
