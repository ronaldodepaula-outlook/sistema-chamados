import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { chamadosService } from '../../services/chamados';
import { clientesService } from '../../services/chamados';
import { useAuth } from '../../hooks/useAuth';
import ChamadoCard from './ChamadoCard';
import ChamadoForm from './ChamadoForm';
//import Modal from '../UI/Modal';
//import Loading from '../UI/Loading';

// CORRIGIR estas linhas:
import Modal from '../UI/Modal';
import Loading from '../UI/Loading';

const ChamadosList = () => {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const { user } = useAuth();

  const loadChamados = useCallback(async () => {
    try {
      const data = await chamadosService.getAll();

      // if logged user is a cliente, only show the chamados for the client's own record
      if (user?.tipo === 'cliente') {
        // find the cliente record for this user
        try {
          const clientes = await clientesService.getAll();
          const myCliente = clientes.find(c => c.usuario?.id === user.id || c.usuario_id === user.id);
          if (myCliente) {
            setChamados((Array.isArray(data) ? data : []).filter(ch => ch.cliente_id === myCliente.id));
          } else {
            // no cliente record found -> no chamados
            setChamados([]);
          }
        } catch (err) {
          console.error('Erro ao localizar cliente do usuário:', err);
          setChamados([]);
        }
      } else {
        // admin/tecnico: show all chamados
        setChamados(data);
      }
    } catch (error) {
      console.error('Erro ao carregar chamados:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadChamados();
  }, [loadChamados]);

  

  const handleCreateChamado = async (chamadoData) => {
    try {
      await chamadosService.create(chamadoData);
      await loadChamados();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await chamadosService.updateStatus(id, status);
      await loadChamados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || chamado.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    aberto: chamados.filter(c => c.status === 'aberto').length,
    andamento: chamados.filter(c => c.status === 'andamento').length,
    fechado: chamados.filter(c => c.status === 'fechado').length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chamados</h1>
          <p className="text-gray-600">Gerencie todos os chamados do sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Novo Chamado</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{chamados.length}</div>
          <div className="text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.aberto}</div>
          <div className="text-gray-600">Abertos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.andamento}</div>
          <div className="text-gray-600">Em Andamento</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-200">
          <div className="text-2xl font-bold text-green-600">{statusCounts.fechado}</div>
          <div className="text-gray-600">Fechados</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="aberto">Aberto</option>
              <option value="andamento">Em Andamento</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Chamados */}
      <div className="space-y-4">
        {filteredChamados.map(chamado => (
          <ChamadoCard
            key={chamado.id}
            chamado={chamado}
            onStatusUpdate={handleUpdateStatus}
            onUpdate={loadChamados}
          />
        ))}
        
        {filteredChamados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Nenhum chamado encontrado</div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Criar primeiro chamado
            </button>
          </div>
        )}
      </div>

      {/* Modal de Criar Chamado */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Chamado"
      >
        <ChamadoForm
          onSubmit={handleCreateChamado}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ChamadosList;