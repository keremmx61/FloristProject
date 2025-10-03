import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* 🌸 HERO SECTION - Tam ekran modern tasarım */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-gradient">Sevdiklerinize</span>
                <br />
                <span className="title-main">Özel Çiçekler</span>
              </h1>
              <p className="hero-subtitle">
                En taze çiçeklerle özel anlarınızı taçlandırın. 
                Aynı gün teslimat ile sevdiklerinize sürpriz yapın.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn-hero-primary">
                  🛍️ Hemen Alışverişe Başla
                </Link>
                <Link to="/products" className="btn-hero-secondary">
                  🌸 Çiçekleri Keşfet
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="floating-flowers">
                <div className="flower-1">🌹</div>
                <div className="flower-2">🌷</div>
                <div className="flower-3">💐</div>
                <div className="flower-4">🌸</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>Keşfet</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* 📊 FEATURES SECTION - Modern kartlar */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Neden Bizi Seçmelisiniz?</h2>
            <p>Kalite, hız ve güvenin buluştuğu nokta</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Aynı Gün Teslimat</h3>
              <p>İstanbul içi aynı gün, diğer şehirlere 1-2 iş günü içinde teslimat</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌸</div>
              <h3>Taze Çiçek Garantisi</h3>
              <p>Günlük kesilmiş taze çiçekler ile en kaliteli buketler</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Özel Tasarım Buketler</h3>
              <p>Usta çiçekçilerimiz tarafından özenle hazırlanmış buketler</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>%100 Müşteri Memnuniyeti</h3>
              <p>Memnun kalmadıysanız ücret iadesi garantisi</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 CATEGORIES CHIPS */}
      <section className="categories-section">
        <div className="container">
          <div className="chips">
            <Link to="/products?cat=rose" className="chip">🌹 Güller</Link>
            <Link to="/products?cat=orchid" className="chip">💮 Orkideler</Link>
            <Link to="/products?cat=lily" className="chip">🌺 Zambaklar</Link>
            <Link to="/products?cat=mixed" className="chip">💐 Karışık Buket</Link>
            <Link to="/products?cat=birthday" className="chip">🎂 Doğum Günü</Link>
            <Link to="/products?cat=love" className="chip">❤️ Aşk</Link>
          </div>
        </div>
      </section>

      {/* 🌺 POPULAR PRODUCTS SECTION */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Popüler Çiçekler</h2>
            <p>En çok tercih edilen çiçeklerimiz</p>
          </div>
          
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image red-rose">🌹</div>
              <div className="product-info">
                <h3>Kırmızı Gül Buketi</h3>
                <p>12 adet taze kırmızı gül</p>
                <div className="product-price">₺199</div>
                <Link to="/products" className="btn-product">İncele</Link>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image orchid">💮</div>
              <div className="product-info">
                <h3>Beyaz Orkide</h3>
                <p>Şık ve zarif beyaz orkide</p>
                <div className="product-price">₺249</div>
                <Link to="/products" className="btn-product">İncele</Link>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image mixed">💐</div>
              <div className="product-info">
                <h3>Karışık Buket</h3>
                <p>Renkli çiçeklerden oluşan buket</p>
                <div className="product-price">₺179</div>
                <Link to="/products" className="btn-product">İncele</Link>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image lily">🌺</div>
              <div className="product-info">
                <h3>Zambak Buketi</h3>
                <p>Mis kokulu beyaz zambaklar</p>
                <div className="product-price">₺219</div>
                <Link to="/products" className="btn-product">İncele</Link>
              </div>
            </div>
          </div>
          
          <div className="section-cta">
            <Link to="/products" className="btn-cta">
              Tüm Çiçekleri Gör ➔
            </Link>
          </div>
        </div>
      </section>

      {/* ⭐ TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Müşterilerimiz Ne Diyor?</h2>
            <p>Gerçek kullanıcı yorumları</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="avatar">😊</div>
              <p>"Zamanında teslim edildi, çiçekler mükemmeldi!"</p>
              <span className="name">Aylin K.</span>
            </div>
            <div className="testimonial-card">
              <div className="avatar">🥰</div>
              <p>"Sevgilime sürpriz yaptım, çok beğendi. Teşekkürler!"</p>
              <span className="name">Emre Y.</span>
            </div>
            <div className="testimonial-card">
              <div className="avatar">🌟</div>
              <p>"Müşteri hizmetleri harika, sorunumu hemen çözdüler."</p>
              <span className="name">Selin D.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 HOW IT WORKS SECTION */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>3 Adımda Kolay Alışveriş</h2>
            <p>Çiçek siparişi vermek hiç bu kadar kolay olmamıştı</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Çiçeğini Seç</h3>
              <p>Binlerce çiçek arasından favorini seç</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Siparişini Ver</h3>
              <p>Güvenli ödeme ile siparişini tamamla</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Kapına Gelsin</h3>
              <p>Çiçeğin tazeliğini koruyarak kapında</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Özel Gününüz İçin Mükemmel Buket</h2>
            <p>Doğum günü, yıldönümü veya sadece bir tebrik... Her an için özel çiçekler</p>
            <div className="cta-actions">
              <Link to="/products" className="btn-cta-primary">
                Hemen Sipariş Ver
              </Link>
              <Link to="/contact" className="btn-cta-secondary">
                Danışmanlık Al
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;