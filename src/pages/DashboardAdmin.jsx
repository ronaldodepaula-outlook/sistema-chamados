import React, { useState, useEffect, useCallback } from 'react';
import { 
  Ticket, 
  Users, 
  BarChart3, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { chamadosService, clientesService } from '../services/chamados';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalChamados: 0,
    chamadosAbertos: 0,
    totalClientes: 0,
    taxaResolucao: 0
  });
  const [recentChamados, setRecentChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const [allChamados, clientes] = await Promise.all([
        chamadosService.getAll(),
        clientesService.getAll()
      ]);

      const abertos = (allChamados || []).filter(c => c.status === 'aberto').length;
      const fechados = (allChamados || []).filter(c => c.status === 'fechado').length;
      const taxaResolucao = (allChamados?.length > 0) ? Math.round((fechados / allChamados.length) * 100) : 0;

      setStats({
        totalChamados: Array.isArray(allChamados) ? allChamados.length : 0,
        chamadosAbertos: abertos,
        totalClientes: Array.isArray(clientes) ? clientes.length : 0,
        taxaResolucao
      });

      setRecentChamados((allChamados || []).slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard (admin):', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
        <p className="text-gray-600">Visão geral e métricas do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Ticket className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalChamados}</div>
              <div className="text-gray-600">Total de Chamados</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.chamadosAbertos}</div>
              <div className="text-gray-600">Chamados Abertos</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalClientes}</div>
              <div className="text-gray-600">Clientes</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.taxaResolucao}%</div>
              <div className="text-gray-600">Taxa de Resolução</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Chamados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Chamados Recentes</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            {recentChamados.map(chamado => (
              <div key={chamado.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{chamado.titulo}</div>
                  <div className="text-sm text-gray-600">Cliente #{chamado.cliente_id}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  chamado.status === 'aberto' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : chamado.status === 'andamento'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {chamado.status}
                </span>
              </div>
            ))}

            {recentChamados.length === 0 && (
              <div className="text-center py-8 text-gray-500">Nenhum chamado recente</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Banco de Dados</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Conectado</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Performance</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Ótima</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
