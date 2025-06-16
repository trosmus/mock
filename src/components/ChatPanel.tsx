import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Play, BarChart3 } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { mockAgentResponse } from '../mocks/mockData';
import { useNavigate } from 'react-router-dom';

interface ChatPanelProps {
  className?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ className = '' }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    chatMessages, 
    addChatMessage, 
    isLoading, 
    setLoading,
    setCurrentSQL,
    addWidget
  } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    };

    addChatMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await mockAgentResponse(input);
      addChatMessage(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };

  const handleRunSQL = (sql: string) => {
    setCurrentSQL(sql);
    navigate('/sql');
  };

  const handleCreateChart = (message: any) => {
    if (message.chartConfig && message.queryResult) {
      const widget = {
        id: `widget-${Date.now()}`,
        type: 'chart' as const,
        title: message.chartConfig.title || 'New Chart',
        chartConfig: message.chartConfig,
        dataframeId: 'top-diagnoses', // This would be dynamic in real app
        x: 0,
        y: 0,
        w: 6,
        h: 4
      };
      
      addWidget(widget);
      navigate('/dashboards');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-soft border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pastel-blue to-pastel-purple rounded-xl">
            <Bot size={20} className="text-blue-800" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Data Assistant</h2>
            <p className="text-sm text-gray-500">Ask questions about your data</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`p-2 rounded-xl ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-r from-pastel-purple to-pastel-pink'
              }`}>
                {message.type === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-purple-800" />
                )}
              </div>

              {/* Message Content */}
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-900'
              }`}>
                <p className="mb-2">{message.content}</p>
                
                {/* SQL Block */}
                {message.sql && (
                  <div className="mt-3 p-3 bg-gray-900 rounded-xl text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-xs font-medium">SQL</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopySQL(message.sql!)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={() => handleRunSQL(message.sql!)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                        >
                          <Play size={12} />
                        </button>
                      </div>
                    </div>
                    <code className="text-green-400 font-mono">{message.sql}</code>
                  </div>
                )}

                {/* Chart Preview */}
                {message.chartConfig && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-xs font-medium">Chart Preview</span>
                      <button
                        onClick={() => handleCreateChart(message)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <BarChart3 size={12} />
                        Add to Dashboard
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {message.chartConfig.type} chart: {message.chartConfig.x} vs {message.chartConfig.y}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="p-2 bg-gradient-to-r from-pastel-purple to-pastel-pink rounded-xl">
              <Bot size={16} className="text-purple-800" />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gray-500" />
                <span className="text-gray-500">Analyzing your data...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your data..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel; 