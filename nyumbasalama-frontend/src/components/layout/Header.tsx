'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Menu,
  X,
  LogIn,
  UserPlus,
  Shield,
  LogOut,
  Image as ImageIcon, // ✅ Fixed: Removed extra 's'
  Upload,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);

    try {
      const userData = userStr ? JSON.parse(userStr) : null;
      setUser(userData);
      const role = userData?.role || '';
      setIsAdmin(role === 'ADMIN' || role === 'admin' || userData?.email === 'sankhathecoder7@gmail.com');
    } catch {
      setIsAdmin(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    // ✅ Futa data zote za session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // ✅ Badilisha state
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    setMobileMenuOpen(false);
    
    // ✅ Nenda kwenye login page
    router.push('/login'); // ✅ FIXED: Goes to login page
  };

  // ✅ Home link (always goes to '/')
  const baseLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/images', label: 'Gallery', icon: ImageIcon },
  ];

  const adminLinks = [
    { href: '/upload/image', label: 'Upload', icon: Upload },
  ];

  const navLinks = isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Inabonyezwa kwenda Home */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NyumbaSalama</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isClient && isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-600 hidden lg:block">
                  👋 {user?.name || user?.email}
                </span>
                {/* ✅ Logout button - inarudi Login page */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {baseLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              {isAdmin && adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-200" />
              {isClient && isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-purple-600 bg-purple-50 rounded-xl text-sm font-medium"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  <div className="px-3 py-2 text-sm text-gray-500">👋 {user?.name || user?.email}</div>
                  {/* ✅ Logout in mobile menu */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium"
                  >
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}