import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  MoreVertical, 
  Edit3,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { chamadosService } from '../../services/chamados';
import ChamadoForm from './ChamadoForm';
import ChamadoDetails from './ChamadoDetails';
import Modal from '../UI/Modal';

const ChamadoCard = ({ chamado, onStatusUpdate, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fechado':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'andamento':
        return 'Em Andamento';
      case 'fechado':
        return 'Fechado';
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusUpdate(chamado.id, newStatus);
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await chamadosService.delete(chamado.id);
        onUpdate();
      } catch (error) {
        console.error('Erro ao excluir chamado:', error);
      }
    }
    setShowMenu(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {chamado.titulo}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {chamado.descricao}
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border py-2 z-10 min-w-[200px]">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit3 size={16} />
                    <span>Editar Chamado</span>
                  </button>
                  
                  {chamado.status !== 'fechado' && (
                    <button
                      onClick={() => handleStatusChange('fechado')}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
                    >
                      <MessageSquare size={16} />
                      <span>Fechar Chamado</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowDetailsModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <MessageSquare size={16} />
                    <span>Detalhes / Comentários</span>
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Trash2 size={16} />
                    <span>Excluir</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>Cliente #{chamado.cliente_id}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(chamado.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={chamado.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(chamado.status)} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="aberto">Aberto</option>
                <option value="andamento">Em Andamento</option>
                <option value="fechado">Fechado</option>
              </select>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(chamado.status)}`}>
                {getStatusText(chamado.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Chamado"
      >
        <ChamadoForm
          chamado={chamado}
          onSubmit={async (data) => {
            await chamadosService.update(chamado.id, data);
            onUpdate();
            setShowEditModal(false);
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Modal de Detalhes / Comentários */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes do Chamado"
      >
        <ChamadoDetails chamadoId={chamado.id} onClose={() => setShowDetailsModal(false)} onUpdate={onUpdate} />
      </Modal>
    </>
  );
};

export default ChamadoCard;