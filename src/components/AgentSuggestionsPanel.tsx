import React from 'react';
import { Lightbulb, TrendingUp, BarChart3, Database, ArrowRight } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useNavigate } from 'react-router-dom';

const AgentSuggestionsPanel: React.FC = () => {
  const { agentSuggestions, setCurrentSQL, addChatMessage } = useAppStore();
  const navigate = useNavigate();

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.sql) {
      // Add to chat as context
      addChatMessage({
        id: `suggestion-${Date.now()}`,
        type: 'user',
        content: suggestion.title,
        timestamp: new Date()
      });
      
      // Set SQL and navigate
      setCurrentSQL(suggestion.sql);
      navigate('/sql');
    } else {
      // Just add to chat
      addChatMessage({
        id: `suggestion-${Date.now()}`,
        type: 'user',
        content: suggestion.title,
        timestamp: new Date()
      });
      navigate('/chat');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'query':
        return Database;
      case 'chart':
        return BarChart3;
      case 'dashboard':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'query':
        return 'from-pastel-blue to-blue-100';
      case 'chart':
        return 'from-pastel-purple to-purple-100';
      case 'dashboard':
        return 'from-pastel-green to-green-100';
      default:
        return 'from-pastel-yellow to-yellow-100';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'query':
        return 'text-blue-800';
      case 'chart':
        return 'text-purple-800';
      case 'dashboard':
        return 'text-green-800';
      default:
        return 'text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pastel-orange to-orange-100 rounded-xl">
          <Lightbulb size={20} className="text-orange-800" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
          <p className="text-sm text-gray-500">Pre-computed analysis ideas based on your data</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {agentSuggestions.map((suggestion) => {
          const Icon = getIcon(suggestion.type);
          const colorClass = getColor(suggestion.type);
          const textColorClass = getTextColor(suggestion.type);

          return (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                group cursor-pointer p-4 rounded-2xl border border-gray-200
                bg-gradient-to-r ${colorClass}
                hover:shadow-soft transition-all duration-200 hover:scale-[1.02]
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-white/50 rounded-xl ${textColorClass}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${textColorClass} text-sm`}>
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${textColorClass} opacity-70`}>
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <ArrowRight size={14} className={`${textColorClass} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </div>
                  <p className={`text-sm ${textColorClass} opacity-80 mt-1`}>
                    {suggestion.description}
                  </p>
                  
                  {/* Chart info */}
                  {suggestion.chartConfig && (
                    <div className={`text-xs ${textColorClass} opacity-60 mt-2`}>
                      {suggestion.chartConfig.type} chart: {suggestion.chartConfig.x} vs {suggestion.chartConfig.y}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Click any suggestion to start your analysis
        </p>
      </div>
    </div>
  );
};

export default AgentSuggestionsPanel; 