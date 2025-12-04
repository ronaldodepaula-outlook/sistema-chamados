// src/contexts/AuthContext.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { usuariosService } from '../services/usuarios';
import { AuthContext } from './auth-context';

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função checkAuth usando useCallback
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        let userData = await authService.getCurrentUser();
        // backend may return { usuario: {...} } or user directly
        const finalUser = userData?.usuario || userData;
        // normalize role to canonical set
        if (finalUser && typeof finalUser === 'object') {
          const role = String(finalUser.tipo || finalUser.role || '').toLowerCase();
          if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) finalUser.tipo = 'admin';
          else if (['tecnico', 'technician', 'tech'].includes(role)) finalUser.tipo = 'tecnico';
          else if (['cliente', 'client', 'customer'].includes(role)) finalUser.tipo = 'cliente';
          else finalUser.tipo = role || '';
        }
        setUser(finalUser);
      } catch (err) {
        console.error('Erro na autenticação:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);

      // If API returns a token, store it and set user
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        // either use user returned or fetch current user
        // The backend sometimes returns 'user' or 'usuario' (PT-BR) — handle both
        const serverUser = response.user || response.usuario;
        let userData = serverUser || await authService.getCurrentUser();
        // If getCurrentUser returns a wrapper { usuario: {...} } handle that too
        const finalUser = userData?.usuario || userData;
        // Normalize role the same as checkAuth
        if (finalUser && typeof finalUser === 'object') {
          const role = String(finalUser.tipo || finalUser.role || '').toLowerCase();
          if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) finalUser.tipo = 'admin';
          else if (['tecnico', 'technician', 'tech'].includes(role)) finalUser.tipo = 'tecnico';
          else if (['cliente', 'client', 'customer'].includes(role)) finalUser.tipo = 'cliente';
          else finalUser.tipo = role || '';
        }
        setUser(finalUser);
        return { token: response.token, user: finalUser };
      }

      // If API returned an object containing user directly
      if (response && typeof response === 'object') {
        // Support both response.user and response.usuario
        if (response.user || response.usuario) {
          const finalUser = response.user || response.usuario;
          setUser(finalUser);
          return { user: finalUser };
        }

        // If the API returned a primary key / id (pk) or id alone,
        // the backend may have started a server session (cookie),
        // so attempt to fetch the current user and set session
        if (response.pk || response.id) {
          const userData = await authService.getCurrentUser();
          const finalUser = userData?.usuario || userData;
          if (finalUser && typeof finalUser === 'object') {
            const role = String(finalUser.tipo || finalUser.role || '').toLowerCase();
            if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) finalUser.tipo = 'admin';
            else if (['tecnico', 'technician', 'tech'].includes(role)) finalUser.tipo = 'tecnico';
            else if (['cliente', 'client', 'customer'].includes(role)) finalUser.tipo = 'cliente';
            else finalUser.tipo = role || '';
          }
          setUser(finalUser);
          return { user: finalUser };
        }
      }

      // If response is empty (e.g. 204 No Content) the server may still have started a session
      // try to fetch the current user and set session accordingly
      const fallbackUser = await authService.getCurrentUser();
      if (fallbackUser) {
        const finalUser = fallbackUser?.usuario || fallbackUser;
        setUser(finalUser);
        return { user: finalUser };
      }

      // Otherwise treat as login failure
      throw new Error('Login falhou: resposta inesperada do servidor.');
    } catch (err) {
      console.error('Erro no login:', err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response?.token) localStorage.setItem('token', response.token);
      let serverUser = response.user || response.usuario;
      let finalUser = serverUser || (await authService.getCurrentUser())?.usuario;
      if (finalUser && typeof finalUser === 'object') {
        const role = String(finalUser.tipo || finalUser.role || '').toLowerCase();
        if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) finalUser.tipo = 'admin';
        else if (['tecnico', 'technician', 'tech'].includes(role)) finalUser.tipo = 'tecnico';
        else if (['cliente', 'client', 'customer'].includes(role)) finalUser.tipo = 'cliente';
        else finalUser.tipo = role || '';
      }
      if (finalUser) setUser(finalUser);
      return response;
    } catch (err) {
      console.error('Erro no registro:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Update profile for the currently logged-in user and update context
  const updateProfile = useCallback(async (data) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    try {
      // backend requires PUT /api/usuarios/:id for updating the current user
      const resp = await usuariosService.update(user.id, data);
      const updated = resp?.usuario || resp;
      if (updated && typeof updated === 'object') {
        // normalize role same as other places
        const role = String(updated.tipo || updated.role || '').toLowerCase();
        if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) updated.tipo = 'admin';
        else if (['tecnico', 'technician', 'tech'].includes(role)) updated.tipo = 'tecnico';
        else if (['cliente', 'client', 'customer'].includes(role)) updated.tipo = 'cliente';
        else updated.tipo = role || '';
      }
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    }
  }, [user]);

  // Allow consumers to trigger a refresh of current user state (useful for role checks)
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      const finalUser = userData?.usuario || userData;
      if (finalUser && typeof finalUser === 'object') {
        const role = String(finalUser.tipo || finalUser.role || '').toLowerCase();
        if (['admin', 'administrator', 'administrador', 'superadmin'].includes(role)) finalUser.tipo = 'admin';
        else if (['tecnico', 'technician', 'tech'].includes(role)) finalUser.tipo = 'tecnico';
        else if (['cliente', 'client', 'customer'].includes(role)) finalUser.tipo = 'cliente';
        else finalUser.tipo = role || '';
      }
      setUser(finalUser);
      return finalUser;
    } catch (err) {
      console.error('refreshUser failed', err);
      // In case of error, clear token and user so callers can handle redirect
      localStorage.removeItem('token');
      setUser(null);
      return null;
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    loading
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Note: AuthProvider is already exported above as a named export.