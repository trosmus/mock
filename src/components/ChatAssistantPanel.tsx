import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Play, BarChart3, X, MessageSquare, Database, Code, TrendingUp, FileText } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useChatContextStore } from '../stores/useChatContextStore';
import { mockAgentResponse } from '../mocks/mockData';
import { useNavigate } from 'react-router-dom';

interface ChatAssistantPanelProps {
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  mainMode?: boolean;
}

const ChatAssistantPanel: React.FC<ChatAssistantPanelProps> = ({ 
  className = '', 
  isExpanded = true,
  onToggle,
  mainMode = false
}) => {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { addWidget } = useAppStore();
  const { currentContext, addContext } = useChatContextStore();

  // Suggestion chips data
  const suggestions = [
    "Show me top diagnoses by age group",
    "Create a revenue breakdown chart", 
    "Analyze patient demographics",
    "What's the monthly trend?",
    "Show severity distribution",
    "Compare categories performance"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Add welcome message on mount
  useEffect(() => {
    if (localMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'assistant',
        content: '👋 Hi! I\'m your AI assistant. I can help you analyze data, write SQL queries, and create visualizations. What would you like to explore?',
        timestamp: new Date()
      };
      setLocalMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    };

    setLocalMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await mockAgentResponse(input);
      setLocalMessages(prev => [...prev, response]);
      
      // Add to global context if useful
      if (response.sql || response.chartConfig) {
        addContext({
          source: 'manual',
          sql: response.sql,
          chartConfig: response.chartConfig,
          description: input.trim()
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
  };

  const handleRunSQL = (sql: string) => {
    // This would integrate with SQL store
    navigate('/sql');
  };

  const handleCreateChart = (message: any) => {
    if (message.chartConfig && message.queryResult) {
      const widget = {
        id: `widget-${Date.now()}`,
        type: 'chart' as const,
        title: message.chartConfig.title || 'New Chart',
        chartConfig: message.chartConfig,
        dataframeId: 'top-diagnoses',
        x: 0,
        y: 0,
        w: 6,
        h: 4
      };
      
      addWidget(widget);
      navigate('/dashboards');
    }
  };

  if (!isExpanded) {
    return (
      <div className={`w-12 bg-white border-r border-gray-200 flex flex-col ${className}`}>
        <button
          onClick={onToggle}
          className="p-3 hover:bg-gray-50 transition-colors"
          style={{ border: 'none' }}
          title="Expand Chat Assistant"
        >
          <MessageSquare size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
            AI Assistant
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${mainMode ? 'flex-1' : 'w-80'} ${mainMode ? 'bg-gray-50' : 'bg-white'} ${mainMode ? '' : 'border-r'} border-gray-200 flex flex-col ${className}`}>
      {/* Header - Hidden in main mode */}
      {!mainMode && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
                <p className="text-xs text-gray-500">Ready to help analyze your data</p>
              </div>
            </div>
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-100 transition-colors"
                title="Collapse Chat Assistant"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Context Display */}
      {currentContext && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="text-xs text-blue-800 font-medium mb-2">Active Context</div>
          <div className="flex flex-wrap gap-2">
            {/* Source Tag */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              currentContext.source === 'sql' ? 'bg-green-100 text-green-700' :
              currentContext.source === 'chart' ? 'bg-purple-100 text-purple-700' :
              currentContext.source === 'widget' ? 'bg-orange-100 text-orange-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {currentContext.source === 'sql' && <Code size={10} />}
              {currentContext.source === 'chart' && <TrendingUp size={10} />}
              {currentContext.source === 'widget' && <BarChart3 size={10} />}
              {currentContext.source === 'manual' && <FileText size={10} />}
              {currentContext.source.toUpperCase()}
            </div>

            {/* Description Tag */}
            {currentContext.description && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                <span className="truncate max-w-[150px]" title={currentContext.description}>
                  {currentContext.description}
                </span>
              </div>
            )}

            {/* SQL Tag */}
            {currentContext.sql && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                <Database size={10} />
                SQL Query
              </div>
            )}

            {/* Chart Config Tag */}
            {currentContext.chartConfig && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                <TrendingUp size={10} />
                {currentContext.chartConfig.type?.toUpperCase()} Chart
              </div>
            )}

            {/* Variables Tag */}
            {currentContext.variables && currentContext.variables.length > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                <span>{currentContext.variables.length} Variables</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {localMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {message.type === 'user' ? (
                  <User size={12} className="text-white" />
                ) : (
                  <Bot size={12} className="text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`rounded-2xl p-3 text-sm ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-100'
              }`}>
                <p className="mb-2 last:mb-0">{message.content}</p>
                
                {/* SQL Block */}
                {message.sql && (
                  <div className="mt-2 p-2 bg-gray-900 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400 font-medium">SQL</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopySQL(message.sql!)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                        >
                          <Copy size={10} />
                        </button>
                        <button
                          onClick={() => handleRunSQL(message.sql!)}
                          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
                        >
                          <Play size={10} />
                        </button>
                      </div>
                    </div>
                    <code className="text-green-400 font-mono text-xs break-all">
                      {message.sql}
                    </code>
                  </div>
                )}

                {/* Chart Preview */}
                {message.chartConfig && (
                  <div className="mt-2 p-2 bg-white rounded-lg border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600 font-medium">Chart</span>
                      <button
                        onClick={() => handleCreateChart(message)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <BarChart3 size={10} />
                        Add
                      </button>
                    </div>
                    <div className="text-gray-600">
                      {message.chartConfig.type} • {message.chartConfig.x} vs {message.chartConfig.y}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2">
            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-gray-500" />
                <span className="text-gray-500 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        {/* Suggestion Chips */}
        {localMessages.length <= 1 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2 font-medium">Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your data..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistantPanel; 