// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(email, senha);
      navigate('/');
    } catch (error) {
      // show user a friendly message and log the underlying error for debugging
      console.error('Erro no login:', error);
      // Prefer server provided message, then axios error message, then fallback
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      setErrorMessage(serverMessage || error?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <span className="text-white text-2xl font-bold">B</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          BizLocal Chamados
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de gestão de chamados
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sua senha"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">Admin</div>
                <div className="text-sm">admin@empresa.com</div>
                <div className="text-sm font-mono">admin123</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Usuário</div>
                <div className="text-sm">user@example.com</div>
                <div className="text-sm font-mono">senha123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;