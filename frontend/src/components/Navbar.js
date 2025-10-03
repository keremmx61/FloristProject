import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">ÇiçekSepeti</span>
          </Link>
          
          <div className={`nav-center${isMenuOpen ? ' active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>Ana Sayfa</Link>
            <Link to="/products" className="nav-link" onClick={closeMenu}>Ürünler</Link>
            <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
              <span className="cart-text">Sepet</span>
              <span className="cart-badge">{getTotalItems()}</span>
            </Link>
            {user && user.role === 1 && (
              <Link to="/courier" className="nav-link courier-link" onClick={closeMenu}>Kurye</Link>
            )}
            {user && user.role === 2 && (
              <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>Admin</Link>
            )}
          </div>

          <div className={`nav-actions${isMenuOpen ? ' active' : ''}`}>
            {user ? (
              <div className="user-menu">
                <span className="user-welcome">Hoş geldin, {user.fullName}</span>
                <Link to="/orders" className="nav-link" onClick={closeMenu}>Siparişlerim</Link>
                <button onClick={handleLogout} className="btn-logout">Çıkış</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link login-link" onClick={closeMenu}>Giriş</Link>
                <Link to="/register" className="btn btn-register" onClick={closeMenu}>Kayıt Ol</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            aria-label="Menüyü Aç/Kapat"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;