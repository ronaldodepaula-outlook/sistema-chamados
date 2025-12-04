import React, { useState, useEffect } from 'react';

const ClienteForm = ({ cliente, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    senha_confirmation: '',
    empresa: '',
    telefone: '',
    cpf_cnpj: '',
    endereco: '',
    cidade: '',
    estado: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.usuario?.nome || '',
        email: cliente.usuario?.email || '',
        senha: '',
        senha_confirmation: '',
        empresa: cliente.empresa || '',
        telefone: cliente.telefone || '',
        cpf_cnpj: cliente.cpf_cnpj || '',
        endereco: cliente.endereco || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || ''
      });
    }
  }, [cliente]);

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

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {!cliente && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required={!cliente}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="senha_confirmation"
                value={formData.senha_confirmation}
                onChange={handleChange}
                required={!cliente}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa *
          </label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF/CNPJ
          </label>
          <input
            type="text"
            name="cpf_cnpj"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade *
          </label>
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado *
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione...</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <textarea
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
          {loading ? 'Salvando...' : (cliente ? 'Atualizar' : 'Criar')}
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;