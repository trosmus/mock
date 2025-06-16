import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface UseForQuickAnalysisButtonProps {
  context?: string;
  sql?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const UseForQuickAnalysisButton: React.FC<UseForQuickAnalysisButtonProps> = ({
  context,
  sql,
  className = '',
  size = 'sm'
}) => {
  const navigate = useNavigate();
  const { addChatMessage } = useAppStore();

  const handleClick = () => {
    // Add context to chat if provided
    if (context || sql) {
      const contextMessage = `Context: ${context || 'SQL Query'}\n${sql ? `SQL: ${sql}` : ''}`;
      addChatMessage({
        id: `context-${Date.now()}`,
        type: 'user',
        content: contextMessage,
        timestamp: new Date()
      });
    }
    
    navigate('/chat');
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 
        bg-gradient-to-r from-pastel-blue to-pastel-purple 
        text-blue-800 font-medium rounded-xl
        hover:shadow-soft transition-all duration-200
        hover:scale-105
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <MessageSquare size={16} />
      💬 Use for Quick Analysis
    </button>
  );
};

export default UseForQuickAnalysisButton; 