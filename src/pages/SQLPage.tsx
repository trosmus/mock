import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { useSQLStore } from '../stores/useSQLStore';
import SQLEditor from '../components/SQLEditor';
import ResultsTable from '../components/ResultsTable';
import ChartPreview from '../components/ChartPreview';
import ChatAssistantPanel from '../components/ChatAssistantPanel';
import VariablesPanel from '../components/VariablesPanel';
import SavedDocumentsPanel from '../components/SavedDocumentsPanel';
import type { ChartConfig } from '../types/index';
import type { SavedDocument } from '../stores/useSavedDocumentsStore';
import { BarChart3, Plus } from 'lucide-react';

const SQLPage: React.FC = () => {
  const { addWidget } = useAppStore();
  const { queryResult, currentSQL, setCurrentSQL } = useSQLStore();
  const [showChart, setShowChart] = useState(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [chatExpanded, setChatExpanded] = useState(false);

  const handleDocumentSelect = (document: SavedDocument) => {
    if (document.type === 'query' && document.content?.sql) {
      // Load SQL query into editor
      setCurrentSQL(document.content.sql);
      console.log('Loading SQL query:', document);
    }
  };

  const handleCreateChart = () => {
    if (!queryResult) return;
    
    // Auto-generate chart config based on result columns
    const columns = queryResult.columns;
    const firstStringColumn = columns.find((col, index) => 
      typeof queryResult.data[0]?.[index] === 'string'
    );
    const firstNumberColumn = columns.find((col, index) => 
      typeof queryResult.data[0]?.[index] === 'number'
    );

    if (firstStringColumn && firstNumberColumn) {
      const config: ChartConfig = {
        type: 'bar',
        x: firstStringColumn,
        y: firstNumberColumn,
        title: 'Chart from SQL Results'
      };
      
      setChartConfig(config);
      setShowChart(true);
    }
  };

  const handleAddToWorkspace = () => {
    if (chartConfig && queryResult) {
      const widget = {
        id: `widget-${Date.now()}`,
        type: 'chart' as const,
        title: chartConfig.title || 'SQL Chart',
        chartConfig,
        dataframeId: 'top-diagnoses', // Would be dynamic in real app
        x: 0,
        y: 0,
        w: 6,
        h: 4
      };
      
      addWidget(widget);
    }
  };

  return (
    <div className="h-full flex">
      {/* Saved Documents Panel */}
      <SavedDocumentsPanel 
        currentPageType="query"
        onDocumentSelect={handleDocumentSelect}
      />

      {/* Chat Assistant Panel */}
      <ChatAssistantPanel 
        isExpanded={chatExpanded}
        onToggle={() => setChatExpanded(!chatExpanded)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SQL Sandbox</h1>
          <p className="text-gray-600">Write, execute, and visualize your queries with AI assistance</p>
        </div>

        {/* SQL Editor */}
        <SQLEditor />

        {/* Results and Chart */}
        {queryResult && (
          <div className="grid grid-cols-12 gap-6">
            {/* Results Table */}
            <div className={`${showChart ? 'col-span-6' : 'col-span-12'}`}>
              <ResultsTable 
                result={queryResult} 
                onCreateChart={handleCreateChart}
              />
            </div>

            {/* Chart Preview */}
            {showChart && chartConfig && (
              <div className="col-span-6">
                <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                        <BarChart3 size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Chart Preview</h3>
                        <p className="text-sm text-gray-500">
                          {chartConfig.type} • {chartConfig.x} vs {chartConfig.y}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddToWorkspace}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      <Plus size={16} />
                      Add to Workspace
                    </button>
                  </div>

                  {/* Chart */}
                  <div className="p-4">
                    <ChartPreview 
                      config={chartConfig} 
                      dataframeId="top-diagnoses"
                      height="300px"
                    />
                  </div>

                  {/* Chart Config */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chart Type
                        </label>
                        <select
                          value={chartConfig.type}
                          onChange={(e) => setChartConfig({
                            ...chartConfig,
                            type: e.target.value as any
                          })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="bar">Bar Chart</option>
                          <option value="line">Line Chart</option>
                          <option value="pie">Pie Chart</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={chartConfig.title || ''}
                          onChange={(e) => setChartConfig({
                            ...chartConfig,
                            title: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Chart title..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!queryResult && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-12">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium mb-2">Execute a query to see results</h3>
              <p className="text-sm">Write your SQL query above or use the AI assistant to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Variables Panel */}
      <VariablesPanel />
    </div>
  );
};

export default SQLPage; 