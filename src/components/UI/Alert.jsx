import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', children, onClose }) => {
  const config = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: <Info size={20} className="text-blue-400" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: <CheckCircle size={20} className="text-green-400" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: <AlertCircle size={20} className="text-yellow-400" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: <XCircle size={20} className="text-red-400" />
    }
  };

  const { bg, border, text, icon } = config[type];

  return (
    <div className={`${bg} border ${border} rounded-lg p-4 ${text}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;