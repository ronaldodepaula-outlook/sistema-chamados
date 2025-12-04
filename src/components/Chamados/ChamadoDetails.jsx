import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, User, MessageSquare, Clock, X } from 'lucide-react';
import { chamadosService, comentariosService } from '../../services/chamados';

const ChamadoDetails = ({ chamadoId, onClose, onUpdate }) => {
  const [chamado, setChamado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState('');
  const { user } = useAuth();

  const loadChamado = useCallback(async () => {
    try {
      const [chamadoData, comentariosData] = await Promise.all([
        chamadosService.getById(chamadoId),
        comentariosService.getByChamadoId(chamadoId)
      ]);
      setChamado(chamadoData);
      // Normalize comentarios response to an array
      let normalized = [];
      if (!comentariosData) normalized = [];
      else if (Array.isArray(comentariosData)) normalized = comentariosData;
      else if (Array.isArray(comentariosData.data)) normalized = comentariosData.data;
      else if (Array.isArray(comentariosData.comentarios)) normalized = comentariosData.comentarios;
      else if (typeof comentariosData === 'object') normalized = [comentariosData];
      // ensure uniqueness by id
      const seen = new Set();
      const unique = [];
      for (const c of normalized) {
        if (c && c.id && !seen.has(c.id)) { seen.add(c.id); unique.push(c); }
      }
      setComentarios(unique);
    } catch (error) {
      console.error('Erro ao carregar chamado:', error);
    } finally {
      setLoading(false);
    }
  }, [chamadoId]);

  useEffect(() => {
    loadChamado();
  }, [loadChamado]);

  const handleAddComentario = async () => {
    if (!novoComentario.trim()) return;

    try {
      await comentariosService.create({
        chamado_id: chamadoId,
        conteudo: novoComentario
      });
      if (typeof onUpdate === 'function') await onUpdate();
      setNovoComentario('');
      await loadChamado();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleAddSolucao = async () => {
    if (!novoComentario.trim()) return;
    try {
      // create a comment labeled as SOLUÇÃO and close the chamado
      const solText = `SOLUÇÃO: ${novoComentario}`;
      await comentariosService.create({
        chamado_id: chamadoId,
        conteudo: solText
      });
      await chamadosService.updateStatus(chamadoId, 'fechado');
      setNovoComentario('');
      await loadChamado();
      if (typeof onUpdate === 'function') await onUpdate();
    } catch (error) {
      console.error('Erro ao adicionar solução:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chamado) {
    return (
      <div className="p-8 text-center text-gray-500">
        Chamado não encontrado
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString || '-';
    return d.toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto':
        return 'bg-yellow-100 text-yellow-800';
      case 'andamento':
        return 'bg-blue-100 text-blue-800';
      case 'fechado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{chamado.titulo}</h2>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(chamado.status)}`}>
              {chamado.status}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Fechar detalhes"
                className="ml-3 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <User size={16} className="mr-2" />
            <span>Cliente ID: {chamado.cliente_id}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Criado em: {formatDate(chamado.created_at)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {chamado.descricao}
          </p>
        </div>

        {/* Comentários */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <MessageSquare size={20} className="mr-2" />
            Comentários ({(Array.isArray(comentarios) ? comentarios.length : 0)})
          </h3>

          <div className="space-y-4 mb-6">
            {/* timeline */}
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
              <ul className="space-y-6 pl-6">
                {(Array.isArray(comentarios) ? comentarios : []).map((comentario) => {
                  // normalize content & timestamps in-place
                  const content = comentario.conteudo || comentario.mensagem || comentario.raw?.mensagem || comentario.raw?.conteudo || '';
                  const created = comentario.created_at || comentario.criado_em || comentario.raw?.created_at || comentario.raw?.criado_em || null;
                  const isSolucao = content?.toUpperCase?.().startsWith('SOLUÇÃO');
                  return (
                    <li key={comentario.id} className="relative">
                      <div className={`absolute left-0 w-3 h-3 rounded-full ${isSolucao ? 'bg-green-600' : 'bg-blue-600'}`} />
                      <div className={`bg-white border rounded-lg p-4 ${isSolucao ? 'border-green-200' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {comentario.usuario?.nome || `Usuário #${comentario.usuario_id}`}
                              {isSolucao && <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">Solução</span>}
                            </div>
                            <div className="text-xs text-gray-400">{formatDate(created)}</div>
                          </div>
                          {/* Option: technician/admin can mark a new solution using the form below, so we don't modify old comments here. */}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {comentarios.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nenhum comentário ainda
              </div>
            )}
          </div>

          {/* Adicionar comentário */}
          <div className="border-t pt-4">
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Digite um comentário..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-400">Escreva sua resposta / comentário</div>
              <div className="flex items-center space-x-2">
                {user && (['admin','administrator','superadmin','tecnico','technician','tech'].includes((user.tipo || '').toLowerCase())) && (
                  <button
                    onClick={handleAddSolucao}
                    disabled={!novoComentario.trim()}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Marcar como Solução
                  </button>
                )}

                <button
                  onClick={handleAddComentario}
                  disabled={!novoComentario.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Comentário
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChamadoDetails;