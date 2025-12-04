import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chamados from './pages/Chamados';
import Clientes from './pages/Clientes';
import Profile from './pages/Profile';
import Usuarios from './pages/Usuarios';
import Logs from './pages/Logs';
import NotAuthorized from './pages/NotAuthorized';
import './index.css';

const ProtectedRoute = ({ children, roles = null }) => {
  const { user, loading, refreshUser } = useAuth();
  const [roleCheckLoading, setRoleCheckLoading] = React.useState(false);

  // If a roles-protected route renders but the user's role is missing or empty,
  // try a single refresh of /api/user before deciding the authorization result.
  React.useEffect(() => {
    let mounted = true;
    if (roles && Array.isArray(roles) && user && !user.tipo && !roleCheckLoading) {
      setRoleCheckLoading(true);
      refreshUser().finally(() => {
        if (mounted) setRoleCheckLoading(false);
      });
    }
    return () => { mounted = false; };
  }, [roles, user, roleCheckLoading, refreshUser]);

  if (loading || roleCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }
  // if user not logged in
  if (!user) return <Navigate to="/login" />;

  // if roles provided, check authorization by `user.tipo`.
  // Be forgiving: normalize user.tipo and roles for case and common synonyms.
  if (roles && Array.isArray(roles)) {
    const normalize = (t) => {
      const role = String(t || '').toLowerCase();
      if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) return 'admin';
      if (['tecnico', 'technician', 'tech'].includes(role)) return 'tecnico';
      if (['cliente', 'client', 'customer'].includes(role)) return 'cliente';
      return role;
    };

    const userRole = normalize(user?.tipo);
    const normalizedRoles = roles.map(normalize);
    if (!normalizedRoles.includes(userRole)) {
      return <Navigate to="/not-authorized" />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="chamados" element={<Chamados />} />
              <Route path="clientes" element={<ProtectedRoute roles={["admin","tecnico"]}><Clientes /></ProtectedRoute>} />
              <Route path="profile" element={<Profile />} />
              <Route path="usuarios" element={<ProtectedRoute roles={["admin"]}><Usuarios /></ProtectedRoute>} />
              <Route path="logs" element={<ProtectedRoute roles={["admin"]}><Logs /></ProtectedRoute>} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;