import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Location state'inden order bilgilerini al
  const orderData = location.state || {};

  // Eğer order bilgisi yoksa ana sayfaya yönlendir
  if (!orderData.orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="confirmation-icon">✅</div>
            <h1>Siparişiniz Başarıyla Oluşturuldu!</h1>
          </div>
          
          <div className="confirmation-details">
            <div className="order-info">
              <h3>Sipariş Bilgileri</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Sipariş Numarası:</span>
                  <span className="value">#{orderData.orderId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Toplam Tutar:</span>
                  <span className="value">₺{orderData.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tahmini Teslimat:</span>
                  <span className="value">2-3 iş günü içinde</span>
                </div>
                <div className="info-item">
                  <span className="label">Sipariş Durumu:</span>
                  <span className="value status-pending">Hazırlanıyor</span>
                </div>
              </div>
            </div>

            <div className="delivery-info">
              <h3>📦 Teslimat Bilgileri</h3>
              <p>Siparişiniz en kısa sürede hazırlanacak ve kargoya verilecektir.</p>
              <ul className="timeline">
                <li className="completed">
                  <span className="timeline-icon">✅</span>
                  <span className="timeline-text">Sipariş alındı</span>
                </li>
                <li className="active">
                  <span className="timeline-icon">⏳</span>
                  <span className="timeline-text">Hazırlanıyor</span>
                </li>
                <li>
                  <span className="timeline-icon">🚚</span>
                  <span className="timeline-text">Kargoya verilecek</span>
                </li>
                <li>
                  <span className="timeline-icon">🏠</span>
                  <span className="timeline-text">Teslim edilecek</span>
                </li>
              </ul>
            </div>

            <div className="next-steps">
              <h3>🔔 Sonraki Adımlar</h3>
              <div className="steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <p>Siparişiniz onaylandı ve işleme alındı</p>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <p>En geç 24 saat içinde hazırlanacak</p>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <p>Kargo bilgileri SMS ile iletilecek</p>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary">
              📋 Siparişlerimi Görüntüle
            </Link>
            <Link to="/products" className="btn btn-secondary">
              🛒 Alışverişe Devam Et
            </Link>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-outline"
            >
              🏠 Ana Sayfaya Dön
            </button>
          </div>

          <div className="support-info">
            <p>❓ Sorularınız mı var? <Link to="/contact">Müşteri Hizmetleri</Link> ile iletişime geçin.</p>
            <p>📞 <strong>Destek Hattı:</strong> 0850 123 45 67</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;