import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">🌸</div>
            <div>
              <h3>ÇiçekSepeti</h3>
              <p>Sevdiklerinize özel anlar yaşatın.</p>
            </div>
          </div>

        <div className="footer-links">
            <h4>Keşfet</h4>
            <ul>
              <li><a href="/">Ana Sayfa</a></li>
              <li><a href="/products">Ürünler</a></li>
              <li><a href="/orders">Siparişlerim</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>İletişim</h4>
            <p>📞 0(212) 000 00 00</p>
            <p>✉️ destek@cicekci.app</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} ÇiçekSepeti. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


