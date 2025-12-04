import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../UI/Loading';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Ticket, 
  Users, 
  BarChart3,
  Settings 
} from 'lucide-react';

const Sidebar = ({ isOpen = false }) => {
  const { user, loading } = useAuth();

  // While auth is loading show a compact loader so the layout doesn't look empty
  if (loading) {
    return (
      <div className="w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h2 className="text-xl font-bold text-white">BizLocal</h2>
        </div>
        <div className="p-6"><Loading /></div>
      </div>
    );
  }

  // Build navigation depending on user role (be forgiving: normalize role to lowercase)
  const navigation = [];
  if (!user) {
    // authenticated UI not available
  } else {
    const role = String(user.tipo || '').toLowerCase();
    // Accept common synonyms and be case-insensitive
    const isAdmin = ['admin', 'administrator', 'superadmin'].includes(role);
    const isTecnico = ['tecnico', 'technician', 'tech'].includes(role);
    const isCliente = ['cliente', 'client', 'customer'].includes(role);

    if (isAdmin) {
    navigation.push(
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Chamados', href: '/chamados', icon: Ticket },
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Usuários', href: '/usuarios', icon: Users },
      { name: 'Logs', href: '/logs', icon: BarChart3 },
      { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
      { name: 'Configurações', href: '/configuracoes', icon: Settings }
    );
    } else if (isTecnico) {
    navigation.push(
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Chamados', href: '/chamados', icon: Ticket },
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
      { name: 'Configurações', href: '/configuracoes', icon: Settings }
    );
    } else if (isCliente) {
    navigation.push(
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Chamados', href: '/chamados', icon: Ticket },
      { name: 'Configurações', href: '/configuracoes', icon: Settings }
    );
    }
  }

  // On small screens render as overlay when isOpen is true
  const mobileVisible = isOpen;

  return (
    <div className={`w-64 bg-white shadow-lg z-40 ${mobileVisible ? 'fixed inset-y-0 left-0 block md:relative md:block' : 'hidden md:block'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600">
          <h2 className="text-xl font-bold text-white">BizLocal</h2>
          {/* close button only on mobile overlay */}
          {mobileVisible && (
            <button className="text-white p-2 md:hidden" aria-label="Fechar menu" onClick={() => {
              // emit a close event by dispatching a custom event so Layout/Header can respond (keeps Sidebar simple)
              window.dispatchEvent(new CustomEvent('sidebar:close'));
            }}>
              ✕
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;