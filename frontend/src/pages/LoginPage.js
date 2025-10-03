// LoginPage.jsx - Güncellenmiş versiyon
import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './AuthPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Login attempt with:", { email, password });
      
      const response = await api.post("/Auth/login", { 
        email: email.trim(), 
        password: password 
      });
      
      console.log("Login response:", response.data);
      
      // Backend'den gelen response yapısına göre token'ı al
      if (response.data && response.data.token) {
        login(response.data.token);
        
        // User bilgisini localStorage'a kaydet (opsiyonel)
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        navigate("/products");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Daha detaylı hata mesajları
      if (err.response) {
        // Backend'den gelen hata
        console.error("Error response:", err.response.data);
        console.error("Error status:", err.response.status);
        
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else if (err.response.status === 400) {
          setError(err.response.data || "Bad request");
        } else {
          setError(err.response.data || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // İstek gönderildi ama cevap alınamadı
        console.error("No response received:", err.request);
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        // İstek oluşturulurken hata
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🔑</div>
            <h1 className="auth-title">Giriş Yap</h1>
            <p className="auth-subtitle">Hesabınıza giriş yaparak çiçek dünyasına adım atın</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                E-posta Adresi
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="form-control"
                placeholder="ornek@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔒</span>
                Şifre
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="form-control"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`btn btn-primary btn-lg auth-submit ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Giriş Yap
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Hesabınız yok mu? 
              <a href="/register" className="auth-link">
                <span>🌟</span>
                Hemen Kayıt Ol
              </a>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-flowers">
            <div className="flower flower-1">🌸</div>
            <div className="flower flower-2">🌺</div>
            <div className="flower flower-3">🌻</div>
            <div className="flower flower-4">🌷</div>
            <div className="flower flower-5">🌹</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;