import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { clientesService } from '../../services/chamados';
import ClienteForm from './ClienteForm';
import Modal from '../UI/Modal';
import Loading from '../UI/Loading';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCliente = async (clienteData) => {
    try {
      await clientesService.create(clienteData);
      await loadClientes();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleUpdateCliente = async (id, clienteData) => {
    try {
      await clientesService.update(id, clienteData);
      await loadClientes();
      setSelectedCliente(null);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDeleteCliente = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientesService.delete(id);
        await loadClientes();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf_cnpj?.includes(searchTerm)
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie todos os clientes do sistema</p>
        </div>
        <button
          onClick={() => {
            setSelectedCliente(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {cliente.usuario?.nome || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cliente.cpf_cnpj || 'Sem CPF/CNPJ'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.empresa}</div>
                  <div className="text-sm text-gray-500">
                    {cliente.cidade}, {cliente.estado}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.telefone}</div>
                  <div className="text-sm text-gray-500">{cliente.usuario?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCliente(cliente.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Nenhum cliente encontrado</div>
            <button
              onClick={() => {
                setSelectedCliente(null);
                setShowModal(true);
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Adicionar primeiro cliente
            </button>
          </div>
        )}
      </div>

      {/* Modal de Cliente */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCliente(null);
        }}
        title={selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <ClienteForm
          cliente={selectedCliente}
          onSubmit={async (data) => {
            if (selectedCliente) {
              await handleUpdateCliente(selectedCliente.id, data);
            } else {
              await handleCreateCliente(data);
            }
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedCliente(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ClientesList;