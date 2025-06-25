import React, { useState } from 'react';
import { ChevronRight, Bot, Brain, Search, Calculator, FileText, BarChart3, Database, Zap } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  type: string;
  category: string;
}

interface AgentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  agents: Agent[];
  tier: 'basic' | 'advanced';
}

const agentCategories: AgentCategory[] = [
  {
    id: 'basic-agents',
    name: 'Basic AI Agents',
    icon: <Bot className="w-4 h-4" />,
    tier: 'basic',
    agents: [
      {
        id: 'data-explorer',
        name: 'Data Explorer',
        description: 'Automatically finds interesting patterns in your data',
        prompt: 'I explore your data to discover patterns, trends, and insights. I show you what\'s working, what\'s not, and create easy-to-read summaries perfect for getting started with any dataset.',
        type: 'analysis',
        category: 'dataset'
      },
      {
        id: 'ask-your-data',
        name: 'Ask Your Data',
        description: 'Just type questions in plain English',
        prompt: 'I answer your business questions in plain English. Ask me "How are we doing this quarter?" or "What are our top products?" and I\'ll give you instant answers without any complicated formulas.',
        type: 'query',
        category: 'narrative'
      },
      {
        id: 'chart-maker',
        name: 'Chart Maker',
        description: 'Picks the perfect chart for your information',
        prompt: 'I create beautiful visualizations for your data. I automatically pick the best chart type, make professional-looking graphs, and help you build dashboards that make your data look great.',
        type: 'visualization',
        category: 'visualization'
      },
      {
        id: 'report-writer',
        name: 'Report Writer',
        description: 'Creates polished business reports for you',
        prompt: 'I write professional business reports in clear language. I create summaries, schedule automatic reports, and make you look like a data expert without any technical knowledge required.',
        type: 'reporting',
        category: 'narrative'
      },
    ]
  },
  {
    id: 'advanced-agents',
    name: 'Advanced AI Agents',
    icon: <Brain className="w-4 h-4" />,
    tier: 'advanced',
    agents: [
      {
        id: 'predictive-analytics',
        name: 'Predictive Analytics Agent',
        description: 'Machine learning model building and forecasting',
        prompt: 'I build sophisticated predictive models using machine learning. I can forecast trends, predict customer behavior, identify risks, and run complex what-if scenarios for strategic planning.',
        type: 'prediction',
        category: 'workflow'
      },
      {
        id: 'data-integration',
        name: 'Data Integration Agent',
        description: 'Multi-source data connections and ETL pipelines',
        prompt: 'I connect and harmonize data from multiple sources. I handle complex ETL processes, API integrations, real-time data streaming, and ensure your data is clean and ready for analysis.',
        type: 'integration',
        category: 'dataset'
      },
      {
        id: 'performance-monitor',
        name: 'Performance Monitor Agent',
        description: 'Advanced KPI tracking and anomaly detection',
        prompt: 'I continuously monitor your business performance with advanced analytics. I track complex KPIs, detect anomalies using statistical algorithms, and provide real-time alerts for critical metrics.',
        type: 'monitoring',
        category: 'workflow'
      },
      {
        id: 'collaboration-agent',
        name: 'Collaboration Agent',
        description: 'Team-based analytics and workflow management',
        prompt: 'I facilitate advanced team collaboration on data projects. I manage workflows, version control, team permissions, and enterprise governance for complex analytics initiatives.',
        type: 'collaboration',
        category: 'workflow'
      },
      {
        id: 'ml-studio',
        name: 'Machine Learning Studio',
        description: 'Advanced ML model development and deployment',
        prompt: 'I provide a complete machine learning development environment. I help you build, train, validate, and deploy custom ML models with advanced algorithms and automated model optimization.',
        type: 'ml-development',
        category: 'workflow'
      },
      {
        id: 'custom-analytics',
        name: 'Custom Analytics Builder',
        description: 'Build custom analytical workflows and algorithms',
        prompt: 'I help you create custom analytical solutions tailored to your specific business needs. I build custom algorithms, specialized metrics, and unique analytical workflows that standard tools can\'t provide.',
        type: 'custom-development',
        category: 'workflow'
      },
    ]
  },
];

// Helper function to get agent-specific file colors and icons
const getAgentFileConfig = (category: string) => {
  switch (category) {
    case 'dataset':
      return {
        icon: Database,
        color: '#3b82f6',
        fileColor: '#4a90e2',
        folderColor: '#3b82f6',
        extension: 'AGENT'
      };
    case 'filter':
      return {
        icon: Zap,
        color: '#10b981',
        fileColor: '#50c878',
        folderColor: '#10b981',
        extension: 'AGENT'
      };
    case 'field':
      return {
        icon: Calculator,
        color: '#f59e0b',
        fileColor: '#ffa500',
        folderColor: '#f59e0b',
        extension: 'AGENT'
      };
    case 'sql':
      return {
        icon: Search,
        color: '#6366f1',
        fileColor: '#7c3aed',
        folderColor: '#6366f1',
        extension: 'AGENT'
      };
    case 'visualization':
      return {
        icon: BarChart3,
        color: '#ec4899',
        fileColor: '#e91e63',
        folderColor: '#ec4899',
        extension: 'AGENT'
      };
    case 'narrative':
      return {
        icon: FileText,
        color: '#22c55e',
        fileColor: '#4caf50',
        folderColor: '#22c55e',
        extension: 'AGENT'
      };
    case 'workflow':
      return {
        icon: Bot,
        color: '#ef4444',
        fileColor: '#f44336',
        folderColor: '#ef4444',
        extension: 'AGENT'
      };
    default:
      return {
        icon: Bot,
        color: '#64748b',
        fileColor: '#9e9e9e',
        folderColor: '#64748b',
        extension: 'AGENT'
      };
  }
};

const AgentsBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (event: React.DragEvent, agent: Agent) => {
    console.log('🤖 Agent drag start:', agent.name);
    event.dataTransfer.setData('application/json', JSON.stringify({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      prompt: agent.prompt,
      type: agent.category, // Use category as the node type
      isAgent: true
    }));
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out h-full ${
        isExpanded ? 'w-80' : 'w-12'
      }`}
    >
      {/* Toggle Button */}
      {!isExpanded ? (
        <div className="w-12 bg-white border-l border-gray-200 flex flex-col">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-3 hover:bg-gray-50 transition-colors border-none outline-none focus:outline-none"
            title="Expand Agents"
          >
            <Bot size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
              Agents
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-gray-700" />
                <h3 className="font-semibold text-gray-900 text-sm">AI Agents</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 transition-colors border-none outline-none focus:outline-none"
                title="Collapse Panel"
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1 pb-24 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {agentCategories.map((category) => (
              <div key={category.id} className="border-none border-gray-100">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full rounded-none p-3 flex items-center justify-between transition-colors border-none outline-none focus:outline-none ${
                    expandedCategories.has(category.id) 
                      ? category.tier === 'basic' 
                        ? 'bg-green-50 hover:bg-green-100' 
                        : 'bg-red-50 hover:bg-red-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-full ${
                      category.tier === 'basic' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {category.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCategories.has(category.id) ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="pt-3 pb-3 px-3">
                    {/* Grid container for agents */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        justifyItems: 'center',
                      }}
                    >
                      {category.agents.map((agent) => (
                        <div
                          key={agent.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, agent)}
                          className="cursor-grab hover:scale-[1.05] transition-all duration-200 p-3 rounded-lg border-2"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                            width: '120px',
                            textAlign: 'center',
                            borderColor: getAgentFileConfig(agent.category).folderColor,
                            backgroundColor: `${getAgentFileConfig(agent.category).folderColor}08`,
                          }}
                          title={agent.description}
                        >
                          {/* Agent Icon */}
                          <div
                            style={{
                              position: 'relative',
                              width: '56px',
                              height: '56px',
                              margin: '12px auto 16px auto',
                            }}
                          >
                            {/* Circular background */}
                            <div
                              style={{
                                position: 'absolute',
                                width: '56px',
                                height: '56px',
                                background: `linear-gradient(135deg, ${getAgentFileConfig(agent.category).fileColor} 0%, ${getAgentFileConfig(agent.category).fileColor}dd 100%)`,
                                borderRadius: '50%',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
                                border: '2px solid rgba(255, 255, 255, 0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {/* Main agent icon */}
                              {React.createElement(getAgentFileConfig(agent.category).icon, {
                                size: 24,
                                color: 'white',
                                strokeWidth: 2
                              })}
                            </div>

                            {/* AI indicator badge */}
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '-2px',
                                right: '-2px',
                                width: '20px',
                                height: '20px',
                                background: category.tier === 'basic'
                                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                borderRadius: '50%',
                                border: '2px solid white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: category.tier === 'basic'
                                  ? '0 2px 6px rgba(16, 185, 129, 0.3)'
                                  : '0 2px 6px rgba(239, 68, 68, 0.3)',
                              }}
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 8V4H8"/>
                                <rect width="16" height="12" x="4" y="8" rx="2"/>
                                <path d="M2 14h2"/>
                                <path d="M20 14h2"/>
                                <path d="M15 13v2"/>
                                <path d="M9 13v2"/>
                              </svg>
                            </div>
                          </div>

                          {/* Agent Information */}
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#1d1d1f',
                              lineHeight: '1.2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginBottom: '4px',
                            }}
                          >
                            {agent.name.replace(' Agent', '')}
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              color: '#a1a1a6',
                              fontWeight: '400',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {agent.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentsBar;
