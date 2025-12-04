import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Users } from 'lucide-react';
import { chamadosService, clientesService } from '../services/chamados';
import { useAuth } from '../hooks/useAuth';

const DashboardCliente = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [meusChamados, setMeusChamados] = useState([]);
  const [meuCliente, setMeuCliente] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [allChamados, clientes] = await Promise.all([
        chamadosService.getAll(),
        clientesService.getAll()
      ]);

      // find associated cliente for this user
      const cliente = (clientes || []).find(c => c.usuario?.id === user?.id || c.usuario_id === user?.id);
      setMeuCliente(cliente || null);

      const meus = cliente ? (Array.isArray(allChamados) ? allChamados.filter(ch => ch.cliente_id === cliente.id) : []) : [];
      setMeusChamados(meus);
    } catch (err) {
      console.error('Erro ao carregar dashboard cliente:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg text-gray-600">Carregando...</div></div>;

  const total = meusChamados.length;
  const abertos = meusChamados.filter(c => c.status === 'aberto').length;
  const fechados = meusChamados.filter(c => c.status === 'fechado').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel do Cliente</h1>
        <p className="text-gray-600">Visão dos seus chamados e informações do cliente</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg"><Ticket className="text-blue-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-gray-900">{total}</div><div className="text-gray-600">Seus Chamados</div></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg"><Ticket className="text-yellow-600" size={24} /></div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-yellow-600">{abertos}</div>
                <div className="text-gray-600">Abertos</div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Resolvidos</div>
              <div className="font-semibold text-gray-800">{fechados}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg"><Users className="text-green-600" size={24} /></div>
            <div className="ml-4"><div className="text-2xl font-bold text-gray-900">{meuCliente ? meuCliente.nome || meuCliente.razao_social || 'Cliente' : '-'}</div><div className="text-gray-600">Seu cadastro</div></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus Chamados Recentes</h3>
        <div className="space-y-3">
          {meusChamados.slice(0, 6).map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium text-gray-900">{c.titulo}</div>
                <div className="text-sm text-gray-500">Status: {c.status}</div>
              </div>
              <div className="text-xs font-medium px-2 py-1 rounded-full">{c.status}</div>
            </div>
          ))}

          {meusChamados.length === 0 && <div className="text-center text-gray-500 py-6">Você ainda não possui chamados abertos.</div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;
