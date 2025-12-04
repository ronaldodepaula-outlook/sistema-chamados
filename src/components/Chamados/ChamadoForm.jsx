import React, { useState, useEffect, useCallback } from 'react';
import { clientesService } from '../../services/chamados';
import { useAuth } from '../../hooks/useAuth';

const ChamadoForm = ({ chamado, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cliente_id: ''
  });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const loadClientesCb = useCallback(async () => {
    try {
      const data = await clientesService.getAll();
      // If current user is a cliente, restrict clients list to only the user's own cliente
      if (user?.tipo === 'cliente') {
        const myCliente = data.find(c => c.usuario?.id === user.id || c.usuario_id === user.id);
        setClientes(myCliente ? [myCliente] : []);
        // ensure the cliente_id defaults to the user's cliente
        if (myCliente) setFormData(prev => ({ ...prev, cliente_id: myCliente.id }));
      } else {
        setClientes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }, [user]);

  useEffect(() => {
    loadClientesCb();

    if (chamado) {
      setFormData({
        titulo: chamado.titulo || '',
        descricao: chamado.descricao || '',
        cliente_id: chamado.cliente_id || ''
      });
    }
  }, [chamado, loadClientesCb]);

  // removed duplicate loadClientes function; loadClientesCb is the stable callback used by useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o título do chamado"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descreva detalhadamente o problema ou solicitação"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cliente *
        </label>
        <select
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.empresa} - {cliente.usuario?.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : (chamado ? 'Atualizar' : 'Criar')}
        </button>
      </div>
    </form>
  );
};

export default ChamadoForm;