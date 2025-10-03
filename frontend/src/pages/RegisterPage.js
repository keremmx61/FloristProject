import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import './AuthPage.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0); // 0 = Customer
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Backend ile birebir uyumlu JSON
    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: parseInt(role) // role'ün integer olduğundan emin ol
    };

    console.log("Register attempt with:", payload);

    try {
      const response = await api.post("/Auth/register", payload);
      console.log("Register response:", response.data);
      
      setSuccess("Registration successful! Redirecting to login...");
      
      // 2 saniye bekleyip login sayfasına yönlendir
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        console.error("Error status:", err.response.status);
        
        if (err.response.status === 400) {
          // Backend'den gelen mesaj genellikle string olarak gelir
          const errorMessage = typeof err.response.data === 'string' 
            ? err.response.data 
            : err.response.data.message || "Registration failed";
          setError(errorMessage);
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
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
            <div className="auth-icon">🌟</div>
            <h1 className="auth-title">Kayıt Ol</h1>
            <p className="auth-subtitle">Çiçek dünyasına katılın ve özel fırsatlardan yararlanın</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                Ad Soyad
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="form-control"
                placeholder="Adınız ve soyadınız"
                disabled={loading}
              />
            </div>

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
                minLength={6}
                className="form-control"
                placeholder="En az 6 karakter"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎭</span>
                Rol Seçin
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="form-control"
                disabled={loading}
              >
                <option value={0}>👥 Müşteri</option>
                <option value={1}>🚚 Kurye</option>
                <option value={2}>⚙️ Admin</option>
              </select>
            </div>
            
            {error && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                {success}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className={`btn btn-success btn-lg auth-submit ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Kayıt oluşturuluyor...
                </>
              ) : (
                <>
                  <span>🎉</span>
                  Kayıt Ol
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Zaten hesabınız var mı? 
              <a href="/login" className="auth-link">
                <span>🔑</span>
                Giriş Yap
              </a>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-flowers">
            <div className="flower flower-1">🌺</div>
            <div className="flower flower-2">🌻</div>
            <div className="flower flower-3">🌸</div>
            <div className="flower flower-4">🌷</div>
            <div className="flower flower-5">🌹</div>
            <div className="flower flower-6">💐</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;