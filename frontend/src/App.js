import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CreateOrderPage from './pages/CreateOrderPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage'; // YENİ
import OrdersPage from './pages/OrdersPage';
import OrderListPage from './pages/OrderListPage';
import CourierPage from './pages/CourierPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/create-order" element={<CreateOrderPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> {/* YENİ */}
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order-list" element={<OrderListPage />} />
                <Route path="/courier" element={<CourierPage />} />
                <Route path="/admin" element={<AdminPage />} /> {/* YENİ */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;