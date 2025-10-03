import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  // Sipariş detayları
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const openOrderDetails = async (order) => {
    // Modalı mevcut satır verisiyle hemen aç (optimistic UX)
    const base = order || {};
    const baseUser = base.user || base.User || base.customer || base.Customer || {};
    const baseCustomerName = (baseUser.fullName || baseUser.FullName) 
      || base.customerName || base.CustomerName 
      || base.userFullName || base.UserFullName 
      || base.user_name || base.User_Name 
      || '';
    const optimistic = {
      id: base.id || base.Id,
      user: baseUser,
      customerName: baseCustomerName,
      items: base.items || base.Items,
      totalAmount: base.totalAmount || base.TotalAmount,
      insertDate: base.insertDate || base.InsertDate
    };
    setOrderDetails(optimistic);
    setShowOrderModal(true);

    const id = optimistic.id;
    if (!id) return;

    // Birkaç olası endpoint sırayla denenir
    const candidates = [
      `/Admin/orders/${id}`,
      `/Orders/${id}`,
      `/Order/${id}`
    ];
    for (const url of candidates) {
      try {
        const res = await api.get(url);
        if (res?.data) {
          // Yeni veriyi mevcutla birleştir, isim bilgisi kaybolmasın
          setOrderDetails(prev => ({ ...prev, ...res.data }));
          break;
        }
      } catch (e) {
        // Diğer endpoint'i dene
        continue;
      }
    }
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Düzenleme / Silme state
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTargetProduct, setDeleteTargetProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Yeni ürün modal state'leri
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (user && user.role === 2) {
      loadDashboardData();
    }
  }, [user, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'dashboard') {
        const statsResponse = await api.get('/Admin/dashboard');
        setStats(statsResponse.data);
      }
      else if (activeTab === 'users') {
        const usersResponse = await api.get('/Admin/users');
        setUsers(usersResponse.data);
      }
      else if (activeTab === 'orders') {
        const ordersResponse = await api.get('/Admin/orders');
        setOrders(ordersResponse.data);
      }
      else if (activeTab === 'products') {
        const productsResponse = await api.get('/Product');
        setProducts(productsResponse.data);
      }

    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      alert('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ürün güncelle
  const handleEditClick = (product) => {
    const normalized = {
      id: product.id || product.Id,
      title: product.title || product.Title || '',
      description: product.description || product.Description || '',
      price: String(product.price || product.Price || ''),
      imageUrl: product.imageUrl || product.ImageUrl || ''
    };
    setEditingProduct(normalized);
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      // Basit doğrulama
      const priceNumber = parseFloat((editingProduct.price || '').toString().replace(',', '.'));
      if (!editingProduct.title || isNaN(priceNumber) || priceNumber < 0) {
        alert('Lütfen geçerli bir ürün adı ve fiyat girin.');
        return;
      }

      const payload = {
        Id: editingProduct.id,
        Title: editingProduct.title,
        Description: editingProduct.description || '',
        Price: priceNumber,
        ImageUrl: editingProduct.imageUrl || '',
        IsActive: true
      };
      await api.put(`/Admin/products/${editingProduct.id}`, payload);
      alert('Ürün güncellendi');
      setShowEditModal(false);
      setEditingProduct(null);
      if (activeTab === 'products') loadDashboardData();
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      const msg = error?.response?.data ? JSON.stringify(error.response.data) : error?.message || 'Bilinmeyen hata';
      alert('Ürün güncellenirken hata oluştu: ' + msg);
    }
  };

  // Ürün sil
  const handleDeleteClick = (product) => {
    const id = product.id || product.Id;
    const title = product.title || product.Title || 'İsimsiz Ürün';
    setDeleteTargetProduct({ id, title });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetProduct) return;
    try {
      await api.delete(`/Admin/products/${deleteTargetProduct.id}`);
      alert('Ürün silindi');
      setShowDeleteConfirm(false);
      setDeleteTargetProduct(null);
      if (activeTab === 'products') loadDashboardData();
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      alert('Ürün silinirken hata oluştu');
    }
  };

  // Yeni ürün ekleme fonksiyonu
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        Title: newProduct.title,
        Description: newProduct.description,
        Price: parseFloat(newProduct.price),
        ImageUrl: newProduct.imageUrl || '',
        IsActive: true
      };

      console.log('Yeni ürün verisi:', productData);

      const response = await api.post('/Admin/products', productData);
      console.log('Ürün eklendi:', response.data);

      alert('Ürün başarıyla eklendi!');
      setShowAddProductModal(false);
      setNewProduct({ title: '', description: '', price: '', imageUrl: '' });
      
      // Ürün listesini yenile
      loadDashboardData();

    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      alert('Ürün eklenirken hata oluştu: ' + (error.response?.data || error.message));
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/Admin/users/${userId}/role`, { role: newRole });
      alert('Kullanıcı rolü güncellendi!');
      loadDashboardData();
    } catch (error) {
      console.error('Rol güncelleme hatası:', error);
      alert('Rol güncellenirken hata oluştu');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/Admin/orders/${orderId}/status`, { status: newStatus });
      alert('Sipariş durumu güncellendi!');
      loadDashboardData();
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  if (!user || user.role !== 2) {
    return (
      <div className="container">
        <div className="access-denied">
          <h2>⛔ Erişim Engellendi</h2>
          <p>Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>👨‍💼 Admin Paneli</h1>
          <p>Hoş geldin, {user.fullName}</p>
          <button onClick={loadDashboardData} className="btn btn-secondary">
            🔄 Yenile
          </button>
        </div>

        <div className="admin-tabs">
          <button className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Kullanıcılar ({users.length})
          </button>
          <button className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📦 Siparişler ({orders.length})
          </button>
          <button className={`tab-button ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            🌸 Ürünler ({products.length})
          </button>
        </div>

        {loading && <div className="loading">⏳ Yükleniyor...</div>}

        {activeTab === 'dashboard' && stats && <DashboardTab stats={stats} />}
        {activeTab === 'users' && <UsersTab users={users} onRoleUpdate={updateUserRole} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} onStatusUpdate={updateOrderStatus} onView={openOrderDetails} />}
        {activeTab === 'products' && (
          <ProductsTab 
            products={products} 
            onAddProduct={() => setShowAddProductModal(true)} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Yeni Ürün Ekle Modal */}
        {showAddProductModal && (
          <AddProductModal 
            product={newProduct}
            onChange={setNewProduct}
            onSubmit={handleAddProduct}
            onClose={() => setShowAddProductModal(false)}
          />
        )}

      {/* Sipariş Detay Modal */}
      {showOrderModal && orderDetails && (
        <OrderDetailsModal 
          order={orderDetails}
          onClose={() => { setShowOrderModal(false); setOrderDetails(null); }}
        />
      )}

      {/* Ürün Düzenle Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal 
          product={editingProduct}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          onClose={() => { setShowEditModal(false); setEditingProduct(null); }}
        />
      )}

      {/* Silme Onayı */}
      {showDeleteConfirm && deleteTargetProduct && (
        <ConfirmDialog 
          title="Ürünü Sil"
          message={`'${deleteTargetProduct.title}' ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Evet, Sil"
          cancelText="Vazgeç"
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteConfirm(false); setDeleteTargetProduct(null); }}
        />
      )}
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardTab = ({ stats }) => (
  <div className="dashboard-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <h3>{stats.TotalUsers}</h3>
          <p>Toplam Kullanıcı</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🌸</div>
        <div className="stat-info">
          <h3>{stats.TotalProducts}</h3>
          <p>Toplam Ürün</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <h3>{stats.TotalOrders}</h3>
          <p>Toplam Sipariş</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <h3>₺{stats.TotalRevenue?.toFixed(2)}</h3>
          <p>Toplam Ciro</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⏳</div>
        <div className="stat-info">
          <h3>{stats.PendingOrders}</h3>
          <p>Bekleyen Sipariş</p>
        </div>
      </div>
    </div>
  </div>
);

// Kullanıcılar Component
const UsersTab = ({ users, onRoleUpdate }) => (
  <div className="users-tab">
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Kayıt Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id || user.Id}>
              <td>{user.id || user.Id}</td>
              <td>{user.fullName || user.FullName || 'İsimsiz'}</td>
              <td>{user.email || user.Email}</td>
              <td>
                <select 
                  value={user.role || user.Role} 
                  onChange={(e) => onRoleUpdate(user.id || user.Id, parseInt(e.target.value))}
                  className="role-select"
                >
                  <option value={0}>Müşteri</option>
                  <option value={1}>Kurye</option>
                  <option value={2}>Admin</option>
                </select>
              </td>
              <td>{new Date(user.insertDate || user.InsertDate).toLocaleDateString('tr-TR')}</td>
              <td>
                <button className="btn btn-sm btn-danger">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Siparişler Component
const OrdersTab = ({ orders, onStatusUpdate, onView }) => (
  <div className="orders-tab">
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Müşteri</th>
            <th>Tutar</th>
            <th>Durum</th>
            <th>Tarih</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id || order.Id}>
              <td>#{order.id || order.Id}</td>
              <td>{(order.user || order.User)?.fullName || (order.user || order.User)?.FullName || 'Bilinmiyor'}</td>
              <td>₺{(order.totalAmount || order.TotalAmount)?.toFixed(2)}</td>
              <td>
                <select 
                  value={order.status || order.Status} 
                  onChange={(e) => onStatusUpdate(order.id || order.Id, parseInt(e.target.value))}
                  className="status-select"
                >
                  <option value={0}>Bekliyor</option>
                  <option value={2}>Hazırlanıyor</option>
                  <option value={3}>Yolda</option>
                  <option value={4}>Teslim Edildi</option>
                  <option value={5}>İptal Edildi</option>
                </select>
              </td>
              <td>{new Date(order.insertDate || order.InsertDate).toLocaleDateString('tr-TR')}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => onView(order)}>Detay</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Ürünler Component - Buton fonksiyonel hale getirildi
const ProductsTab = ({ products, onAddProduct, onEdit, onDelete }) => (
  <div className="products-tab">
    <button className="btn btn-primary" onClick={onAddProduct}>
      + Yeni Ürün Ekle
    </button>
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id || product.Id} className="product-card">
          <div className="product-image">
            {product.imageUrl || product.ImageUrl ? (
              <img src={product.imageUrl || product.ImageUrl} alt={product.title || product.Title} />
            ) : (
              <div className="image-placeholder">🌸</div>
            )}
          </div>
          <div className="product-info">
            <h4>{product.title || product.Title || 'İsimsiz Ürün'}</h4>
            <p className="product-description">
              {product.description || product.Description || 'Açıklama yok'}
            </p>
            <p className="product-price">₺{product.price || product.Price || 0}</p>
            <div className="product-actions">
              <button className="btn btn-sm btn-primary" onClick={() => onEdit(product)}>Düzenle</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(product)}>Sil</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Yeni Ürün Ekle Modal Component
const AddProductModal = ({ product, onChange, onSubmit, onClose }) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...product,
      [field]: value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>➕ Yeni Ürün Ekle</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="Örn: Kırmızı Gül Buketi"
            />
          </div>

          <div className="form-group">
            <label>Açıklama *</label>
            <textarea
              value={product.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder="Ürün açıklaması..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Fiyat (₺) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
              placeholder="Örn: 149.99"
            />
          </div>

          <div className="form-group">
            <label>Resim URL (Opsiyonel)</label>
            <input
              type="url"
              value={product.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/resim.jpg"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              ➕ Ürün Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;

// Ürün Düzenleme Modal Component
const EditProductModal = ({ product, onChange, onSubmit, onClose }) => {
  const handleInputChange = (field, value) => {
    onChange(field, value);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>✏️ Ürün Düzenle</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input type="text" value={product.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Açıklama *</label>
            <textarea value={product.description} onChange={(e) => handleInputChange('description', e.target.value)} rows="3" required />
          </div>
          <div className="form-group">
            <label>Fiyat (₺) *</label>
            <input type="number" step="0.01" min="0" value={product.price} onChange={(e) => handleInputChange('price', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Resim URL (Opsiyonel)</label>
            <input type="url" value={product.imageUrl} onChange={(e) => handleInputChange('imageUrl', e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">İptal</button>
            <button type="submit" className="btn btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Onay Diyaloğu Component
const ConfirmDialog = ({ title, message, confirmText, cancelText, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h3>⚠️ {title}</h3>
        <button onClick={onCancel} className="modal-close">×</button>
      </div>
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">{cancelText || 'Vazgeç'}</button>
        <button type="button" onClick={onConfirm} className="btn btn-danger">{confirmText || 'Onayla'}</button>
      </div>
    </div>
  </div>
);

// Sipariş Detayları Modal
const OrderDetailsModal = ({ order, onClose }) => {
  const id = order.id || order.Id;
  const user = order.user || order.User || {};
  const fallbackName = order.customerName || order.CustomerName || order.userFullName || order.UserFullName;
  const items = order.items || order.Items || [];
  const total = order.totalAmount || order.TotalAmount || 0;
  const created = new Date(order.insertDate || order.InsertDate);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>📦 Sipariş #{id}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div>
          <p><strong>Veren:</strong> {user.fullName || user.FullName || fallbackName || 'Bilinmiyor'}</p>
          <p><strong>Tarih/Saat:</strong> {created.toLocaleString('tr-TR')}</p>
          <p><strong>Tutar:</strong> ₺{Number(total).toFixed(2)}</p>
          {items.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <strong>İçerik:</strong>
              <ul>
                {items.map((it, idx) => (
                  <li key={idx}>
                    {(it.title || it.Title) || 'Ürün'} x{it.quantity || it.Quantity || 1} — ₺{Number(it.price || it.Price || 0).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn btn-secondary">Kapat</button>
        </div>
      </div>
    </div>
  );
};