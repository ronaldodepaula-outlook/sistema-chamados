import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Save, Edit, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleStartEdit = () => {
    setName(user?.nome || '');
    setEmail(user?.email || '');
    setMessage(null);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ nome: name, email });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
      setEditMode(false);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setMessage({ type: 'error', text: serverMsg || 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Informações da sua conta</p>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              {!editMode ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900">{user.nome}</h2>
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-500">Nome</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Email</label>
                    <input value={email} type="email" onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            {message && (
              <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {message.text}
              </div>
            )}
            <h3 className="font-medium text-gray-900 mb-4">Informações da Conta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">ID do Usuário</label>
                <div className="mt-1 font-medium">{user.id}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Status</label>
                <div className="mt-1">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                </div>
              </div>
            </div>

            {/* Edit controls */}
            <div className="mt-6 flex items-center space-x-3">
              {!editMode ? (
                <button onClick={handleStartEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2">
                  <Edit size={16} />
                  <span>Editar perfil</span>
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2">
                    <Save size={16} />
                    <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                  <button onClick={handleCancel} disabled={saving} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center space-x-2">
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;