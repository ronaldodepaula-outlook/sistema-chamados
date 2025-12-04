import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardAdmin from './DashboardAdmin';
import DashboardTecnico from './DashboardTecnico';
import DashboardCliente from './DashboardCliente';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Carregando...</div></div>
  );

  const role = String(user?.tipo || '').toLowerCase();

  switch (role) {
    case 'tecnico':
      return <DashboardTecnico />;
    case 'cliente':
      return <DashboardCliente />;
    case 'admin':
    default:
      return <DashboardAdmin />;
  }
};

export default Dashboard;