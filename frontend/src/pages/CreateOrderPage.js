import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './CreateOrderPage.css';

const CreateOrderPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditcard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sipariş verilerini hazırla
      const orderData = {
        UserId: user.id,
        ShippingAddress: shippingAddress,
        TotalAmount: getTotalPrice(),
        Items: cartItems.map(item => ({
          ProductId: item.Id,
          Quantity: item.quantity,
          UnitPrice: item.Price
        }))
      };

      console.log('Sipariş verisi:', orderData);

      // Backend'e sipariş gönder
      const response = await api.post('/Order/create', orderData);
      console.log('Sipariş başarılı:', response.data);

      // Sepeti temizle
      clearCart();
      
      // Sipariş onay sayfasına yönlendir
      navigate('/order-confirmation', { 
      state: { 
        orderId: response.data.orderId, 
        totalAmount: getTotalPrice() 
      } 
    });

    } catch (err) {
      console.error('Sipariş hatası:', err);
      setError('Sipariş oluşturulurken bir hata oluştu: ' + 
        (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>🛒 Sepetiniz Boş</h2>
          <p>Sipariş oluşturmak için sepete ürün ekleyin.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Alışverişe Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-order-page">
      <div className="container">
        <div className="page-header">
          <h1>💳 Siparişi Tamamla</h1>
          <p>Lütfen teslimat ve ödeme bilgilerinizi girin</p>
        </div>

        <div className="order-layout">
          {/* Sipariş Özeti */}
          <div className="order-summary">
            <h3>Sipariş Özeti</h3>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.Id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.Title}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-total">₺{(item.Price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Toplam: ₺{getTotalPrice().toFixed(2)}</strong>
            </div>
          </div>

          {/* Teslimat ve Ödeme Formu */}
          <form onSubmit={handleSubmitOrder} className="order-form">
            <h3>Teslimat Bilgileri</h3>
            
            <div className="form-group">
              <label>Tam Adres *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                placeholder="Cadde, sokak, apartman, daire no, ilçe, şehir..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Ödeme Yöntemi *</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="creditcard">Kredi Kartı</option>
                <option value="cash">Kapıda Nakit Ödeme</option>
                <option value="card">Kapıda Kart ile Ödeme</option>
              </select>
            </div>

            {paymentMethod === 'creditcard' && (
              <div className="credit-card-info">
                <h4>Kredi Kartı Bilgileri</h4>
                <div className="form-group">
                  <label>Kart Numarası</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Son Kullanma Tarihi</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? '⏳ Sipariş Oluşturuluyor...' : '✅ Siparişi Onayla'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;