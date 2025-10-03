import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }
    navigate('/create-order');
  };

  const handleKeyDown = (e, productId, currentQty) => {
    if (e.key === 'Enter') {
      const parsed = Number(e.currentTarget.value);
      if (!Number.isNaN(parsed) && parsed > 0) {
        updateQuantity(productId, parsed);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>🛒 Sepetiniz Boş</h2>
            <p>Sepetinizde henüz ürün bulunmamaktadır.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Alışverişe Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>🛒 Sepetim</h1>
          <button onClick={clearCart} className="btn btn-secondary">
            Sepeti Temizle
          </button>
        </div>

        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.Id} className="cart-item">
              <div className="item-image">
                {item.ImageUrl ? (
                  <img src={item.ImageUrl} alt={item.Title} />
                ) : (
                  <div className="image-placeholder">🌸</div>
                )}
              </div>
              
              <div className="item-info">
                <h3>{item.Title}</h3>
                <p className="item-description">{item.Description}</p>
                <p className="item-price">₺{item.Price}</p>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.Id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    className="quantity-input"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.Id, Number(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, item.Id, item.quantity)}
                  />
                  <button 
                    onClick={() => handleQuantityChange(item.Id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.Id)}
                  className="btn btn-danger"
                >
                  🗑️ Kaldır
                </button>
              </div>

              <div className="item-total">
                ₺{(item.Price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="total-section">
            <h3>Toplam Tutar: ₺{getTotalPrice().toFixed(2)}</h3>
            <button onClick={handleCheckout} className="btn btn-primary btn-large">
              💳 Ödemeye Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;