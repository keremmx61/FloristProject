import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import './CourierPage.css';

const CourierPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-orders');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 1) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Kurye siparişleri yükleniyor...');
      
      // ✅ ÖNCE API RESPONSE'LARINI DEBUG EDELİM
      const myOrdersResponse = await api.get(`/Order/courier/${user.id}`);
      console.log('📦 My orders response:', myOrdersResponse.data);
      
      const availableResponse = await api.get('/Order/available');
      console.log('📋 Available orders response:', availableResponse.data);
      
      // ✅ ARRAY KONTROLÜ YAP - EĞER ARRAY DEĞİLSE, BOŞ ARRAY YAP
      const myOrdersData = Array.isArray(myOrdersResponse.data) ? myOrdersResponse.data : [];
      const availableData = Array.isArray(availableResponse.data) ? availableResponse.data : [];
      
      setOrders(myOrdersData);
      setAvailableOrders(availableData);
      
    } catch (err) {
      console.error('❌ Siparişler yüklenirken hata:', err);
      setError('Siparişler yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
      
      // ✅ HATA DURUMUNDA BOŞ ARRAY SET ET
      setOrders([]);
      setAvailableOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Backend henüz hazır olmadığı için mock fonksiyonlar
  const assignOrder = async (orderId) => {
    try {
      // Backend hazır değilse mock işlem yap
      alert(`✅ Sipariş #${orderId} size atandı! (Mock işlem)`);
      
      // Mock olarak orders listesine ekle
      const orderToAssign = availableOrders.find(order => order.id === orderId);
      if (orderToAssign) {
        setOrders(prev => [...prev, { ...orderToAssign, status: 2 }]); // 2 = Hazırlanıyor
        setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
      }
      
    } catch (error) {
      console.error('Sipariş atama hatası:', error);
      alert('Sipariş atanırken hata oluştu');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Backend hazır değilse mock işlem yap
      alert(`✅ Sipariş #${orderId} durumu güncellendi! (Mock işlem)`);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      // Backend hazır değilse mock işlem yap
      alert(`✅ Sipariş #${orderId} teslim edildi! (Mock işlem)`);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 4 } : order // 4 = Teslim Edildi
      ));
      
    } catch (error) {
      console.error('Teslimat hatası:', error);
      alert('Teslimat kaydedilirken hata oluştu');
    }
  };

  if (!user || user.role !== 1) {
    return (
      <div className="container">
        <div className="access-denied">
          <h2>⛔ Erişim Engellendi</h2>
          <p>Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>📦 Siparişler yükleniyor...</div>
          <small>Backend endpoint'leri hazırlanıyor...</small>
        </div>
      </div>
    );
  }

  return (
    <div className="courier-page">
      <div className="container">
        <div className="page-header">
          <h1>🚚 Kurye Paneli</h1>
          <p>Hoş geldin, {user.fullName}</p>
          <button onClick={fetchOrders} className="btn btn-secondary">
            🔄 Yenile
          </button>
        </div>

        {error && (
          <div className="error-message">
            <h3>⚠️ Backend Bildirimi</h3>
            <p>{error}</p>
            <p><strong>Not:</strong> Backend endpoint'leri henüz tamamlanmadı. Mock verilerle çalışıyor.</p>
          </div>
        )}

        <div className="courier-tabs">
          <button 
            className={`tab-button ${activeTab === 'my-orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-orders')}
          >
            📋 Siparişlerim ({orders.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            📦 Müsait Siparişler ({availableOrders.length})
          </button>
        </div>

        {/* BENİM SİPARİŞLERİM */}
        {activeTab === 'my-orders' && (
          <div className="orders-section">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>📭 Henüz size atanmış sipariş bulunmamaktadır.</p>
                <button onClick={() => setActiveTab('available')} className="btn btn-primary">
                  Müsait Siparişlere Göz At
                </button>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                    onDeliver={markAsDelivered}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MÜSAİT SİPARİŞLER */}
        {activeTab === 'available' && (
          <div className="orders-section">
            {availableOrders.length === 0 ? (
              <div className="no-orders">
                <p>✅ Şu anda müsait sipariş bulunmamaktadır. Tüm siparişler atandı!</p>
              </div>
            ) : (
              <div className="orders-grid">
                {availableOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onAssign={assignOrder}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* DEBUG INFO */}
        <div className="debug-panel">
          <h4>🔧 Debug Bilgisi</h4>
          <p><strong>Kurye ID:</strong> {user.id}</p>
          <p><strong>My Orders Count:</strong> {orders.length} (Array: {Array.isArray(orders) ? 'Evet' : 'Hayır'})</p>
          <p><strong>Available Orders Count:</strong> {availableOrders.length} (Array: {Array.isArray(availableOrders) ? 'Evet' : 'Hayır'})</p>
        </div>
      </div>
    </div>
  );
};

// OrderCard Component'i - Property isimlerini düzelttim
const OrderCard = ({ order, onStatusUpdate, onDeliver, onAssign, showActions }) => {
  // ✅ PROPERTY FALLBACK MEKANİZMASI
  const orderId = order.id || order.Id;
  const orderStatus = order.status || order.Status;
  const customerName = (order.user || order.User)?.fullName || (order.user || order.User)?.FullName || 'Bilinmiyor';
  const shippingAddress = order.shippingAddress || order.ShippingAddress || 'Adres bilgisi yok';
  const totalAmount = order.totalAmount || order.TotalAmount || 0;
  const insertDate = order.insertDate || order.InsertDate;

  const getStatusInfo = (status) => {
    const statusMap = {
      [0]: { text: '🕒 Bekliyor', color: '#ffc107', nextStatus: 2 },
      [2]: { text: '👨‍🍳 Hazırlanıyor', color: '#17a2b8', nextStatus: 3 },
      [3]: { text: '🚗 Yolda', color: '#007bff', nextStatus: 4 },
      [4]: { text: '✅ Teslim Edildi', color: '#28a745' },
      [5]: { text: '❌ İptal Edildi', color: '#dc3545' }
    };
    
    return statusMap[status] || { text: 'Bilinmiyor', color: '#6c757d' };
  };

  const statusInfo = getStatusInfo(orderStatus);
  const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h3>Sipariş #{orderId}</h3>
          <span className="order-date">{new Date(insertDate).toLocaleDateString('tr-TR')}</span>
        </div>
        <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
          {statusInfo.text}
        </span>
      </div>

      <div className="order-details">
        <p><strong>Müşteri:</strong> {customerName}</p>
        <p><strong>Adres:</strong> {shippingAddress}</p>
        <p><strong>Ürün Sayısı:</strong> {totalItems} adet</p>
        <p><strong>Tutar:</strong> ₺{totalAmount?.toFixed(2)}</p>
        
        {/* Ürün Listesi */}
        <div className="order-items">
          <strong>Ürünler:</strong>
          {order.orderItems?.map(item => {
            const productName = item.product?.title || item.product?.Title || 'Bilinmeyen Ürün';
            const quantity = item.quantity || item.Quantity || 0;
            const unitPrice = item.unitPrice || item.UnitPrice || 0;
            
            return (
              <div key={item.id} className="order-item">
                <span>{productName} x{quantity}</span>
                <span>₺{unitPrice?.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aksiyon Butonları */}
      {showActions && (
        <div className="order-actions">
          {orderStatus === 0 && (
            <button 
              onClick={() => onStatusUpdate(orderId, 2)}
              className="btn btn-primary"
            >
              🚚 Teslimata Başla
            </button>
          )}
          
          {orderStatus === 2 && (
            <button 
              onClick={() => onStatusUpdate(orderId, 3)}
              className="btn btn-primary"
            >
              🚗 Yola Çık
            </button>
          )}
          
          {orderStatus === 3 && (
            <button 
              onClick={() => onDeliver(orderId)}
              className="btn btn-success"
            >
              ✅ Teslim Et
            </button>
          )}
          
          {orderStatus === 4 && (
            <span className="completed">✅ Teslim edildi</span>
          )}
        </div>
      )}

      {!showActions && onAssign && (
        <div className="order-actions">
          <button 
            onClick={() => onAssign(orderId)}
            className="btn btn-primary"
          >
            📋 Siparişi Al
          </button>
        </div>
      )}
    </div>
  );
};

export default CourierPage;