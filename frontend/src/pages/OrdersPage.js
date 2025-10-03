import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import './OrdersPage.css';

function OrdersPage() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://localhost:7011/api/Order", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const assignCourier = async (orderId, courierId) => {
    try {
      await axios.put(
        `https://localhost:7011/api/Order/${orderId}/assign-courier`,
        { courierId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // tekrar yükle
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.put(
        `https://localhost:7011/api/Order/${orderId}/mark-delivered`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // tekrar yükle
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Siparişler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-message">
            <h3>⚠️ Hata</h3>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              🔄 Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>📋 Siparişler</h1>
          <p>Tüm siparişleri görüntüleyin ve yönetin</p>
          <button onClick={fetchOrders} className="btn btn-secondary">
            🔄 Yenile
          </button>
        </div>

        <div className="orders-content">
          {orders.length === 0 ? (
            <div className="no-orders">
              <h3>📭 Henüz sipariş bulunmamaktadır</h3>
              <p>Müşteriler sipariş verdiğinde burada görünecek.</p>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Müşteri</th>
                    <th>Kurye</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td className="customer-name">{order.user?.fullName || "N/A"}</td>
                      <td className="courier-name">
                        {order.courier?.fullName || (
                          <span className="unassigned">Atanmamış</span>
                        )}
                      </td>
                      <td className="total-amount">₺{order.totalAmount?.toFixed(2)}</td>
                      <td className="status">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status === 0 && 'Bekliyor'}
                          {order.status === 1 && 'Hazırlanıyor'}
                          {order.status === 2 && 'Yolda'}
                          {order.status === 3 && 'Teslim Edildi'}
                          {order.status === 4 && 'İptal Edildi'}
                        </span>
                      </td>
                      <td className="actions">
                        {!order.courier && (
                          <button 
                            onClick={() => assignCourier(order.id, 2)}
                            className="btn btn-sm btn-primary"
                          >
                            🚚 Kurye Ata
                          </button>
                        )}
                        {order.status !== 3 && order.courier && (
                          <button 
                            onClick={() => markDelivered(order.id)}
                            className="btn btn-sm btn-success"
                          >
                            ✅ Teslim Et
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;