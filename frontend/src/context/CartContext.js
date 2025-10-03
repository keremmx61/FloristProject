import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // LocalStorage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cicekci-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sepeti LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cicekci-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sepete ürün ekle
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.Id === product.Id);
      
      if (existingItem) {
        // Ürün zaten sepette, miktarı arttır
        return prevItems.map(item =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yeni ürün ekle
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten ürün çıkar
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.Id !== productId));
  };

  // Ürün miktarını güncelle
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.Id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setCartItems([]);
  };

  // Toplam ürün sayısı
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Toplam tutar
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.Price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};