import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { chamadosService } from '../services/chamados';
import { useAuth } from '../hooks/useAuth';

const DashboardTecnico = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const all = await chamadosService.getAll();
      // Chamados assigned to this technician may appear under tecnico_id or assigned_to
      const mine = (all || []).filter(c => String(c.tecnico_id || c.assigned_to || '') === String(user?.id));

      // derive metrics
      setAssigned(mine);
    } catch (err) {
      console.error('Erro ao carregar chamados do técnico:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Carregando...</div></div>;

  const total = assigned.length;
  const abertos = assigned.filter(c => c.status === 'aberto').length;
  const andamento = assigned.filter(c => c.status === 'andamento').length;
  const fechados = assigned.filter(c => c.status === 'fechado').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel do Técnico</h1>
        <p className="text-gray-600">Chamados atribuídos a você e suas métricas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg"><Ticket className="text-blue-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-gray-900">{total}</div><div className="text-gray-600">Atribuídos</div></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg"><AlertCircle className="text-yellow-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-yellow-600">{abertos}</div><div className="text-gray-600">Abertos</div></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg"><Clock className="text-blue-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-gray-900">{andamento}</div><div className="text-gray-600">Em Andamento</div></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-gray-900">{fechados}</div><div className="text-gray-600">Resolvidos</div></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Chamados Atribuídos</h3>
        <div className="space-y-3">
          {assigned.slice(0, 6).map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium text-gray-900">{c.titulo}</div>
                <div className="text-sm text-gray-500">Cliente #{c.cliente_id}</div>
              </div>
              <div className="text-xs font-medium px-2 py-1 rounded-full">
                {c.status}
              </div>
            </div>
          ))}

          {assigned.length === 0 && <div className="text-center text-gray-500 py-6">Nenhum chamado atribuído ainda.</div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardTecnico;
