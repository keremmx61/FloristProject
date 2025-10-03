import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('🔐 Token bulundu, decode ediliyor...');
        const decoded = jwtDecode(token);
        console.log('📋 Tüm decoded token:', decoded);
        
        // Role bilgisini bul
        const userRole = findRoleInToken(decoded);
        console.log('👤 Bulunan kullanıcı rolü:', userRole);
        
        if (decoded.exp * 1000 > Date.now()) {
          const userData = {
            id: getClaimValue(decoded, ['nameidentifier', 'sub', 'Id']),
            fullName: getClaimValue(decoded, ['name', 'unique_name', 'FullName']),
            email: getClaimValue(decoded, ['emailaddress', 'email', 'Email']),
            role: userRole
          };
          
          console.log('📊 Oluşturulan user data:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.log('⏰ Token süresi dolmuş');
          logout();
        }
      } catch (error) {
        console.error('❌ Token decode error:', error);
        logout();
      }
    } else {
      console.log('❌ Token bulunamadı');
    }
    setLoading(false);
  };

  // Claim değerini bulan yardımcı fonksiyon
  const getClaimValue = (decoded, possibleKeys) => {
    for (let key of possibleKeys) {
      // Önce uzun claim formatını dene
      const longKey = `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/${key}`;
      if (decoded[longKey] !== undefined) {
        return decoded[longKey];
      }
      // Sonra kısa key'i dene
      if (decoded[key] !== undefined) {
        return decoded[key];
      }
    }
    return '';
  };

  // Token içinde role'ü arayan ve string'i sayısala çeviren fonksiyon
  const findRoleInToken = (decoded) => {
    const roleValue = getClaimValue(decoded, ['role', 'Role']);
    console.log('🔍 Raw role value:', roleValue, 'type:', typeof roleValue);
    
    if (roleValue) {
      // ✅ STRING ROLE'Ü SAYISALA ÇEVİR
      let roleNumber;
      
      if (typeof roleValue === 'number') {
        roleNumber = roleValue;
      } else if (typeof roleValue === 'string') {
        // String role'ü sayısala çevir
        const roleMap = {
          'Customer': 0,
          'Courier': 1, 
          'Admin': 2,
          '0': 0,
          '1': 1,
          '2': 2
        };
        
        roleNumber = roleMap[roleValue];
        if (roleNumber === undefined) {
          // Sayısal string ise direkt çevir
          roleNumber = parseInt(roleValue);
        }
      }
      
      console.log('🔢 Converted role number:', roleNumber);
      return isNaN(roleNumber) ? 0 : roleNumber;
    }
    
    console.warn('⚠️ Role bilgisi bulunamadı');
    return 0; // Default role
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <div>🔐 Kimlik doğrulama kontrol ediliyor...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};