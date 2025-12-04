import React, { useState, useEffect } from 'react';

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', senha_confirmation: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({ nome: usuario.nome || '', email: usuario.email || '', senha: '', senha_confirmation: '' });
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome *</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail *</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
      </div>

      {!usuario && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha *</label>
            <input name="senha" type="password" value={formData.senha} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha *</label>
            <input name="senha_confirmation" type="password" value={formData.senha_confirmation} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancelar</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Salvando...' : (usuario ? 'Atualizar' : 'Criar')}</button>
      </div>
    </form>
  );
};

export default UsuarioForm;
