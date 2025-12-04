import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Acesso negado</h2>
        <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
        <div className="flex justify-center">
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Voltar ao dashboard</a>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
