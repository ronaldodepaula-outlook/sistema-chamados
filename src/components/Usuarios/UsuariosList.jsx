import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';
import { usuariosService } from '../../services/usuarios';
import UsuarioForm from './UsuarioForm';
import Modal from '../UI/Modal';
import Loading from '../UI/Loading';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadUsuarios(); }, []);

  const loadUsuarios = async () => {
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUsuario = async (usuarioData) => {
    try {
      await usuariosService.create(usuarioData);
      await loadUsuarios();
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const handleUpdateUsuario = async (id, usuarioData) => {
    try {
      await usuariosService.update(id, usuarioData);
      await loadUsuarios();
      setSelectedUsuario(null);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await usuariosService.delete(id);
      await loadUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const safeUsuarios = Array.isArray(usuarios) ? usuarios : [];

  const filtered = safeUsuarios.filter(u =>
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie usuários do sistema</p>
        </div>
        <button onClick={() => { setSelectedUsuario(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus size={20} />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar usuários..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"><User size={16} className="text-blue-600" /></div>
                    <div>
                      <div className="font-medium text-gray-900">{u.nome}</div>
                      <div className="text-sm text-gray-500">ID: {u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => { setSelectedUsuario(u); setShowModal(true); }} className="text-blue-600 hover:text-blue-900 mr-3"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteUsuario(u.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12"><div className="text-gray-400 text-lg">Nenhum usuário encontrado</div></div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedUsuario(null); }} title={selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}>
        <UsuarioForm usuario={selectedUsuario} onSubmit={async (data) => {
          if (selectedUsuario) await handleUpdateUsuario(selectedUsuario.id, data);
          else await handleCreateUsuario(data);
        }} onCancel={() => { setShowModal(false); setSelectedUsuario(null); }} />
      </Modal>
    </div>
  );
};

export default UsuariosList;
