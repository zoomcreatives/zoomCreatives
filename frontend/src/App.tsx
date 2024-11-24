import { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ClientLogin from './pages/ClientLogin';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ClientPortal from './pages/client-portal';
import { addAuditLog } from './store/auditLogStore';

interface AuthContextType {
  userType: 'admin' | 'client' | null;
  userEmail: string | null;
  login: (type: 'admin' | 'client', email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [userType, setUserType] = useState<'admin' | 'client' | null>(() => {
    const savedType = localStorage.getItem('userType');
    return (savedType === 'admin' || savedType === 'client') ? savedType : null;
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });

  useEffect(() => {
    if (userType && userEmail) {
      localStorage.setItem('userType', userType);
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
    }
  }, [userType, userEmail]);

  const login = (type: 'admin' | 'client', email: string) => {
    setUserType(type);
    setUserEmail(email);
  };

  const logout = () => {
    if (userType && userEmail) {
      addAuditLog({
        userId: userEmail,
        userName: userEmail,
        userType: userType === 'admin' ? 'admin' : 'client',
        action: 'logout',
        resource: 'auth',
        details: 'User logged out',
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent
      });
    }
    setUserType(null);
    setUserEmail(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ userType, userEmail, login, logout }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          userType ? (
            <Navigate to={userType === 'admin' ? "/dashboard" : "/client-portal"} replace />
          ) : (
            <Login />
          )
        } />
        <Route path="/client-login" element={
          userType ? (
            <Navigate to={userType === 'client' ? "/client-portal" : "/dashboard"} replace />
          ) : (
            <ClientLogin />
          )
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/dashboard/*" element={
          userType === 'admin' ? <Dashboard /> : <Navigate to="/login" replace />
        } />

        {/* Protected Client Routes */}
        <Route path="/client-portal/*" element={
          userType === 'client' ? <ClientPortal /> : <Navigate to="/client-login" replace />
        } />

        {/* Root Route */}
        <Route path="/" element={
          userType === 'admin' ? <Navigate to="/dashboard" replace /> :
          userType === 'client' ? <Navigate to="/client-portal" replace /> :
          <Navigate to="/login" replace />
        } />
      </Routes>
    </AuthContext.Provider>
  );
}