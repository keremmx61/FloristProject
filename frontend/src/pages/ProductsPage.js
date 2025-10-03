import React, { useMemo, useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { addToCart } = useCart(); // CartContext'ten addToCart fonksiyonunu al

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔍 Ürünler yükleniyor...');
      const response = await api.get('/Product');
      
      const productsData = response.data;
      console.log('✅ Processed products:', productsData);
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError('');
      
    } catch (err) {
      console.error('❌ Ürünler yüklenirken hata:', err);
      setError('Ürünler yüklenirken bir hata oluştu.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product); // CartContext'teki fonksiyonu kullan
    console.log('🛒 Sepete eklenen ürün:', product);
    alert(`✅ ${product.Title} sepete eklendi!`);
  };

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        (p.Title || '').toLowerCase().includes(q) ||
        (p.Description || '').toLowerCase().includes(q)
      );
    }
    if (minPrice !== '') {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) result = result.filter(p => Number(p.Price) >= min);
    }
    if (maxPrice !== '') {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) result = result.filter(p => Number(p.Price) <= max);
    }
    if (sort === 'price_asc') result.sort((a,b) => Number(a.Price) - Number(b.Price));
    if (sort === 'price_desc') result.sort((a,b) => Number(b.Price) - Number(a.Price));
    if (sort === 'title_asc') result.sort((a,b) => (a.Title||'').localeCompare(b.Title||''));
    if (sort === 'title_desc') result.sort((a,b) => (b.Title||'').localeCompare(a.Title||''));
    return result;
  }, [products, query, sort, minPrice, maxPrice]);

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading">
            <span className="spinner"></span>
            ⏳ Ürünler yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Çiçeklerimiz</h1>
          <p>En taze ve güzel çiçekleri keşfet</p>
        </div>

        <div className="products-toolbar">
          <div className="search-group">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="filters">
            <input
              type="number"
              min="0"
              placeholder="Min ₺"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Max ₺"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Popüler</option>
              <option value="price_asc">Fiyat: Artan</option>
              <option value="price_desc">Fiyat: Azalan</option>
              <option value="title_asc">A → Z</option>
              <option value="title_desc">Z → A</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <h3>❌ Hata Oluştu</h3>
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              🔄 Tekrar Dene
            </button>
          </div>
        )}

        {/* DEBUG PANEL - İstersen kaldırabilirsin */}
        {/* Debug panel kaldırıldı */}

        <div className="products-info">Toplam {filteredProducts.length} ürün</div>

        {filteredProducts.length === 0 && !error ? (
          <div className="no-products">
            <p>📭 Henüz ürün bulunmamaktadır.</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              🔄 Tekrar Yükle
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.Id} className="product-card">
                <a className="product-image" href={`/products/${product.Id}`}>
                  {product.ImageUrl ? (
                    <img src={product.ImageUrl} alt={product.Title} />
                  ) : (
                    <div className="image-placeholder" aria-hidden>🌸</div>
                  )}
                </a>
                
                <div className="product-info">
                  <h3 className="product-title">{product.Title}</h3>
                  <p className="product-price">₺{product.Price}</p>
                  {product.Description && (
                    <p className="product-description">{product.Description}</p>
                  )}
                  
                  <button onClick={() => handleAddToCart(product)} className="btn-add">
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;