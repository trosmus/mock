import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PanelRight, Bot, Brain, Search, Calculator, FileText, BarChart3, Database, Zap } from 'lucide-react';

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
}

const agentCategories: AgentCategory[] = [
  {
    id: 'analysis',
    name: 'Analysis Agents',
    icon: <Brain className="w-4 h-4" />,
    agents: [
      { 
        id: 'data-analyst', 
        name: 'Data Analyst Agent', 
        description: 'Analyzes datasets and generates insights', 
        prompt: 'I am a data analyst agent that can examine datasets, identify patterns, and generate comprehensive analytical insights.',
        type: 'analysis',
        category: 'dataset'
      },
      { 
        id: 'statistical-analyst', 
        name: 'Statistical Analyst Agent', 
        description: 'Performs statistical analysis and hypothesis testing', 
        prompt: 'I specialize in statistical analysis, hypothesis testing, and advanced statistical modeling to uncover data relationships.',
        type: 'analysis',
        category: 'sql'
      },
      { 
        id: 'pattern-finder', 
        name: 'Pattern Finder Agent', 
        description: 'Identifies trends and patterns in data', 
        prompt: 'I excel at finding hidden patterns, trends, and anomalies in complex datasets using advanced pattern recognition techniques.',
        type: 'analysis',
        category: 'workflow'
      },
    ]
  },
  {
    id: 'visualization',
    name: 'Visualization Agents',
    icon: <BarChart3 className="w-4 h-4" />,
    agents: [
      { 
        id: 'chart-creator', 
        name: 'Chart Creator Agent', 
        description: 'Creates various types of charts and graphs', 
        prompt: 'I create compelling visualizations including bar charts, line graphs, scatter plots, and other chart types to represent data effectively.',
        type: 'visualization',
        category: 'visualization'
      },
      { 
        id: 'dashboard-builder', 
        name: 'Dashboard Builder Agent', 
        description: 'Builds comprehensive dashboards', 
        prompt: 'I build interactive dashboards that combine multiple visualizations to provide comprehensive views of your data.',
        type: 'visualization',
        category: 'visualization'
      },
      { 
        id: 'infographic-designer', 
        name: 'Infographic Designer Agent', 
        description: 'Creates infographics and visual summaries', 
        prompt: 'I design informative infographics and visual summaries that make complex data easy to understand at a glance.',
        type: 'visualization',
        category: 'narrative'
      },
    ]
  },
  {
    id: 'processing',
    name: 'Data Processing Agents',
    icon: <Zap className="w-4 h-4" />,
    agents: [
      { 
        id: 'data-cleaner', 
        name: 'Data Cleaner Agent', 
        description: 'Cleans and preprocesses data', 
        prompt: 'I clean and preprocess data by handling missing values, removing duplicates, and standardizing formats for analysis.',
        type: 'processing',
        category: 'filter'
      },
      { 
        id: 'data-transformer', 
        name: 'Data Transformer Agent', 
        description: 'Transforms and reshapes data', 
        prompt: 'I transform data structures, aggregate values, and reshape datasets to prepare them for specific analytical needs.',
        type: 'processing',
        category: 'sql'
      },
      { 
        id: 'feature-engineer', 
        name: 'Feature Engineer Agent', 
        description: 'Creates new features from existing data', 
        prompt: 'I create new features and derived variables from existing data to enhance analytical capabilities and model performance.',
        type: 'processing',
        category: 'field'
      },
    ]
  },
  {
    id: 'reporting',
    name: 'Reporting Agents',
    icon: <FileText className="w-4 h-4" />,
    agents: [
      { 
        id: 'report-writer', 
        name: 'Report Writer Agent', 
        description: 'Generates comprehensive reports', 
        prompt: 'I write detailed reports that summarize findings, provide insights, and make recommendations based on data analysis.',
        type: 'reporting',
        category: 'narrative'
      },
      { 
        id: 'executive-summarizer', 
        name: 'Executive Summarizer Agent', 
        description: 'Creates executive summaries', 
        prompt: 'I create concise executive summaries that highlight key findings and strategic insights for decision makers.',
        type: 'reporting',
        category: 'narrative'
      },
      { 
        id: 'insight-generator', 
        name: 'Insight Generator Agent', 
        description: 'Generates actionable insights', 
        prompt: 'I generate actionable insights and recommendations by analyzing data patterns and business implications.',
        type: 'reporting',
        category: 'narrative'
      },
    ]
  },
  {
    id: 'query',
    name: 'Query Agents',
    icon: <Search className="w-4 h-4" />,
    agents: [
      { 
        id: 'sql-expert', 
        name: 'SQL Expert Agent', 
        description: 'Writes complex SQL queries', 
        prompt: 'I write optimized SQL queries for data extraction, aggregation, and complex analytical operations across multiple tables.',
        type: 'query',
        category: 'sql'
      },
      { 
        id: 'data-explorer', 
        name: 'Data Explorer Agent', 
        description: 'Explores and discovers data relationships', 
        prompt: 'I explore datasets to discover relationships, correlations, and interesting patterns that might not be immediately obvious.',
        type: 'query',
        category: 'dataset'
      },
      { 
        id: 'metric-calculator', 
        name: 'Metric Calculator Agent', 
        description: 'Calculates KPIs and metrics', 
        prompt: 'I calculate key performance indicators, business metrics, and statistical measures to track performance and trends.',
        type: 'query',
        category: 'field'
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
        extension: 'AGENT'
      };
    case 'filter':
      return {
        icon: Zap,
        color: '#10b981',
        fileColor: '#50c878',
        extension: 'AGENT'
      };
    case 'field':
      return {
        icon: Calculator,
        color: '#f59e0b',
        fileColor: '#ffa500',
        extension: 'AGENT'
      };
    case 'sql':
      return {
        icon: Search,
        color: '#6366f1',
        fileColor: '#7c3aed',
        extension: 'AGENT'
      };
    case 'visualization':
      return {
        icon: BarChart3,
        color: '#ec4899',
        fileColor: '#e91e63',
        extension: 'AGENT'
      };
    case 'narrative':
      return {
        icon: FileText,
        color: '#22c55e',
        fileColor: '#4caf50',
        extension: 'AGENT'
      };
    case 'workflow':
      return {
        icon: Bot,
        color: '#ef4444',
        fileColor: '#f44336',
        extension: 'AGENT'
      };
    default:
      return {
        icon: Bot,
        color: '#64748b',
        fileColor: '#9e9e9e',
        extension: 'AGENT'
      };
  }
};

const AgentsBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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
      className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
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
          <div className="flex-1 overflow-y-auto">
            {agentCategories.map((category) => (
              <div key={category.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full p-3 flex items-center justify-between transition-colors border-none outline-none focus:outline-none ${
                    expandedCategories.has(category.id) 
                      ? 'bg-purple-50 hover:bg-purple-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {category.icon}
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCategories.has(category.id) ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="pb-3 px-3">
                    {/* Grid container for agents */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                        gap: '12px',
                        justifyItems: 'center',
                      }}
                    >
                      {category.agents.map((agent) => (
                        <div
                          key={agent.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, agent)}
                          className="cursor-grab hover:scale-[1.05] transition-all duration-200"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                            width: '80px',
                            textAlign: 'center',
                          }}
                          title={agent.description}
                        >
                          {/* Agent Icon */}
                          <div
                            style={{
                              position: 'relative',
                              width: '48px',
                              height: '48px',
                              margin: '12px auto 12px auto',
                            }}
                          >
                            {/* Circular background */}
                            <div
                              style={{
                                position: 'absolute',
                                width: '48px',
                                height: '48px',
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
                                size: 20,
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
                                width: '18px',
                                height: '18px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                borderRadius: '50%',
                                border: '2px solid white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
                              }}
                            >
                              <svg
                                width="8"
                                height="8"
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
                              fontSize: '10px',
                              fontWeight: '500',
                              color: '#1d1d1f',
                              lineHeight: '1.2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginBottom: '2px',
                            }}
                          >
                            {agent.name.replace(' Agent', '')}
                          </div>
                          <div
                            style={{
                              fontSize: '8px',
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