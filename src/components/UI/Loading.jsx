import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;