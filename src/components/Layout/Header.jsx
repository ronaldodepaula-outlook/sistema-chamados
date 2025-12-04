import React from 'react';
import { Bell, User, LogOut, MoreVertical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Sistema de Chamados
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* mobile toggle button for sidebar */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 md:hidden mr-2"
            title="Abrir menu"
          >
            <MoreVertical size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* make user area clickable to open profile */}
          <button
            onClick={() => navigate('/profile')}
            title="Ver meu perfil"
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hover:underline">
              {user?.nome}
            </span>
          </button>
          
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;