import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  ScatterChart,
  Table,
  Plus,
  Download,
  Save,
  Play
} from 'lucide-react';
import ChatAssistantPanel from '../components/ChatAssistantPanel';
import VariablesPanel from '../components/VariablesPanel';
import SavedDocumentsPanel from '../components/SavedDocumentsPanel';
import ChartPreview from '../components/ChartPreview';
import { useChartConfigStore } from '../stores/useChartConfigStore';
import { useAppStore } from '../stores/useAppStore';
import { useChatContextStore } from '../stores/useChatContextStore';
import { mockQueryResults } from '../mocks/mockData';
import type { Variable } from '../stores/useVariablesStore';
import type { SavedDocument } from '../stores/useSavedDocumentsStore';

const VisualizationBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [chatExpanded, setChatExpanded] = useState(false);
  const { addWidget } = useAppStore();
  const { addContext } = useChatContextStore();
  const {
    currentConfig,
    updateConfig,
    setXAxis,
    setYAxis,
    setGroupBy,
    saveConfig,
    resetConfig
  } = useChartConfigStore();

  const handleDocumentSelect = (document: SavedDocument) => {
    if (document.type === 'chart' && document.content?.chartConfig) {
      // Load chart configuration
      const config = document.content.chartConfig;
      updateConfig(config);
      console.log('Loading chart configuration:', document);
    }
  };

  const visualizationTypes = [
    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { type: 'line', icon: LineChart, label: 'Line Chart' },
    { type: 'pie', icon: PieChart, label: 'Pie Chart' },
    { type: 'scatter', icon: ScatterChart, label: 'Scatter Plot' },
    { type: 'table', icon: Table, label: 'Data Table' },
  ];

  const handleDrop = (e: React.DragEvent, field: 'x' | 'y' | 'groupBy') => {
    e.preventDefault();
    try {
      const variable: Variable = JSON.parse(e.dataTransfer.getData('application/json'));
      
      switch (field) {
        case 'x':
          setXAxis(variable);
          break;
        case 'y':
          setYAxis(variable);
          break;
        case 'groupBy':
          setGroupBy(variable);
          break;
      }
    } catch (error) {
      console.error('Failed to parse dropped variable:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddToDashboard = () => {
    if (!currentConfig.xAxis || (!currentConfig.yAxis && currentConfig.type !== 'table')) return;
    
    const widget = {
      id: `chart-${Date.now()}`,
      type: currentConfig.type === 'table' ? 'table' as const : 'chart' as const,
      title: currentConfig.title,
      chartConfig: {
        type: currentConfig.type,
        x: currentConfig.xAxis.name,
        y: currentConfig.yAxis?.name || '',
        groupBy: currentConfig.groupBy?.name,
        title: currentConfig.title
      },
      dataframeId: getDataframeId(), // Dynamic dataframe selection
      x: 0,
      y: 0,
      w: currentConfig.type === 'table' ? 8 : 6,
      h: currentConfig.type === 'table' ? 6 : 4
    };
    
    addWidget(widget);
    navigate('/dashboards');
  };

  // Function to intelligently select appropriate mock data
  const getDataframeId = () => {
    if (!currentConfig.xAxis) return 'top-diagnoses';
    
    const xName = currentConfig.xAxis.name.toLowerCase();
    const yName = currentConfig.yAxis?.name.toLowerCase() || '';
    
    // Match based on variable names to appropriate datasets
    if (xName.includes('age') && (yName.includes('count') || yName.includes('diagnosis'))) {
      return 'top-diagnoses';
    }
    if (xName.includes('severity') || yName.includes('severity')) {
      return 'severity-distribution';
    }
    if (xName.includes('month') || xName.includes('date')) {
      return 'monthly-admissions';
    }
    if (xName.includes('gender') || yName.includes('stay')) {
      return 'patient-demographics';
    }
    if (currentConfig.type === 'table') {
      return 'diagnosis-table';
    }
    
    return 'top-diagnoses'; // Default fallback
  };

  // Static demo data for visualization previews
  const getDemoData = () => {
    const chartType = currentConfig.type;
    
    switch (chartType) {
      case 'bar':
        return {
          columns: ['category', 'value', 'group'],
          data: [
            ['Q1', 245, 'Sales'],
            ['Q2', 312, 'Sales'],
            ['Q3', 278, 'Sales'],
            ['Q4', 389, 'Sales'],
            ['Q1', 189, 'Marketing'],
            ['Q2', 234, 'Marketing'],
            ['Q3', 198, 'Marketing'],
            ['Q4', 267, 'Marketing']
          ],
          totalRows: 8
        };
      
      case 'line':
        return {
          columns: ['month', 'revenue', 'profit'],
          data: [
            ['Jan', 45600],
            ['Feb', 52300],
            ['Mar', 48900],
            ['Apr', 58200],
            ['May', 61800],
            ['Jun', 55400],
            ['Jul', 59700],
            ['Aug', 62100],
            ['Sep', 57800],
            ['Oct', 64500],
            ['Nov', 68200],
            ['Dec', 71300]
          ],
          totalRows: 12
        };
        
      case 'pie':
        return {
          columns: ['segment', 'percentage', 'count'],
          data: [
            ['Premium', 42.5, 1250],
            ['Standard', 35.2, 1035],
            ['Basic', 22.3, 658]
          ],
          totalRows: 3
        };
        
      case 'scatter':
        return {
          columns: ['x_value', 'y_value', 'size'],
          data: [
            [23, 45, 120],
            [34, 67, 145],
            [45, 23, 98],
            [56, 78, 167],
            [67, 34, 132],
            [78, 89, 189],
            [89, 56, 156],
            [90, 91, 178]
          ],
          totalRows: 8
        };
        
      case 'table':
      default:
        return {
          columns: ['ID', 'Name', 'Category', 'Value', 'Status', 'Date'],
          data: [
            [1001, 'Premium Package', 'Software', 2450.00, 'Active', '2024-01-15'],
            [1002, 'Analytics Pro', 'Analytics', 1890.50, 'Active', '2024-01-16'],
            [1003, 'Enterprise Suite', 'Enterprise', 4200.00, 'Pending', '2024-01-17'],
            [1004, 'Starter Plan', 'Basic', 299.99, 'Active', '2024-01-18'],
            [1005, 'Data Warehouse', 'Storage', 3200.00, 'Active', '2024-01-19'],
            [1006, 'ML Platform', 'AI/ML', 5600.00, 'Trial', '2024-01-20'],
            [1007, 'Business Intelligence', 'Analytics', 1750.00, 'Active', '2024-01-21'],
            [1008, 'Cloud Services', 'Infrastructure', 890.00, 'Active', '2024-01-22'],
            [1009, 'Security Suite', 'Security', 1250.00, 'Pending', '2024-01-23'],
            [1010, 'Mobile App', 'Mobile', 450.00, 'Active', '2024-01-24']
          ],
          totalRows: 10
        };
    }
  };

  // Enhanced table preview component with static demo data
  const renderTablePreview = () => {
    const demoData = getDemoData();

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 font-medium text-gray-700 border-b flex justify-between items-center">
          <span>{currentConfig.title || 'Data Table Preview'}</span>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {demoData.totalRows} rows
          </span>
        </div>
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {demoData.columns.map((col, index) => (
                  <th key={index} className="px-4 py-3 text-left font-semibold text-gray-600 border-b border-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoData.data.slice(0, 8).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-50 transition-colors duration-150">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 border-b border-gray-100">
                      <span className={`
                        ${typeof cell === 'number' && cell > 1000 ? 'font-semibold text-green-600' : ''}
                        ${typeof cell === 'string' && cell.includes('Active') ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs' : ''}
                        ${typeof cell === 'string' && cell.includes('Pending') ? 'text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs' : ''}
                        ${typeof cell === 'string' && cell.includes('Trial') ? 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs' : ''}
                      `}>
                        {typeof cell === 'number' && cell > 100 && cell % 1 !== 0 
                          ? `$${cell.toFixed(2)}` 
                          : cell
                        }
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {demoData.data.length > 8 && (
            <div className="px-4 py-3 text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-blue-50 text-center border-t">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                ... and {demoData.data.length - 8} more rows
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Static chart preview component
  const renderChartPreview = () => {
    const demoData = getDemoData();
    
    return (
      <ChartPreview
        config={{
          type: currentConfig.type,
          x: demoData.columns[0],
          y: demoData.columns[1],
          groupBy: demoData.columns[2] || undefined,
          title: currentConfig.title || `${currentConfig.type.charAt(0).toUpperCase() + currentConfig.type.slice(1)} Chart Preview`
        }}
        dataframeId="demo-data"
        height="400px"
        demoData={demoData}
      />
    );
  };

  const handleUseForQuickAnalysis = () => {
    addContext({
      source: 'chart',
      chartConfig: currentConfig,
      description: `Chart: ${currentConfig.title} (${currentConfig.type})`
    });
    navigate('/chat');
  };

  return (
    <div className="h-full flex">
      {/* Saved Documents Panel */}
      <SavedDocumentsPanel 
        currentPageType="chart"
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visualization Builder</h1>
            <p className="text-gray-600">Drag variables to create charts and tables</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleUseForQuickAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              💬 Use for Quick Analysis
            </button>
            <button
              onClick={resetConfig}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleAddToDashboard}
              disabled={!currentConfig.xAxis || (!currentConfig.yAxis && currentConfig.type !== 'table')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add to Dashboard
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Visualization Configuration */}
          <div className="col-span-4 space-y-6">
            {/* Visualization Type Selection */}
            <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Visualization Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {visualizationTypes.map((viz) => {
                  const Icon = viz.icon;
                  return (
                    <button
                      key={viz.type}
                      onClick={() => updateConfig({ type: viz.type as any })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        currentConfig.type === viz.type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-sm font-medium">{viz.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag & Drop Fields */}
            <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Visualization Configuration</h3>
              
              <div className="space-y-4">
                {/* Visualization Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentConfig.type === 'table' ? 'Table Title' : 'Chart Title'}
                  </label>
                  <input
                    type="text"
                    value={currentConfig.title}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${currentConfig.type === 'table' ? 'table' : 'chart'} title...`}
                  />
                </div>

                {/* X Axis / Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentConfig.type === 'table' ? 'Columns' : 'X Axis'}
                  </label>
                  <div
                    onDrop={(e) => handleDrop(e, 'x')}
                    onDragOver={handleDragOver}
                    className={`min-h-[60px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                      currentConfig.xAxis
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {currentConfig.xAxis ? (
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-200 rounded">
                          <span className="text-xs text-green-800 font-medium">
                            {currentConfig.xAxis.type}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {currentConfig.xAxis.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({currentConfig.xAxis.tableName})
                        </span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Drop a variable here</p>
                        <p className="text-xs">
                          {currentConfig.type === 'table' ? 'First column to display' : 'Categories or dimensions'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Y Axis / Values (Hidden for table) */}
                {currentConfig.type !== 'table' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Y Axis
                    </label>
                    <div
                      onDrop={(e) => handleDrop(e, 'y')}
                      onDragOver={handleDragOver}
                      className={`min-h-[60px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                        currentConfig.yAxis
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {currentConfig.yAxis ? (
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-blue-200 rounded">
                            <span className="text-xs text-blue-800 font-medium">
                              {currentConfig.yAxis.type}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {currentConfig.yAxis.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({currentConfig.yAxis.tableName})
                          </span>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p className="text-sm">Drop a variable here</p>
                          <p className="text-xs">Metrics or measures</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Group By / Additional Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentConfig.type === 'table' ? 'Additional Columns' : 'Group By (Optional)'}
                  </label>
                  <div
                    onDrop={(e) => handleDrop(e, 'groupBy')}
                    onDragOver={handleDragOver}
                    className={`min-h-[60px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                      currentConfig.groupBy
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {currentConfig.groupBy ? (
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-purple-200 rounded">
                          <span className="text-xs text-purple-800 font-medium">
                            {currentConfig.groupBy.type}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {currentConfig.groupBy.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({currentConfig.groupBy.tableName})
                        </span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Drop a variable here</p>
                        <p className="text-xs">
                          {currentConfig.type === 'table' ? 'More columns to include' : 'For series grouping'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Table Configuration */}
            {currentConfig.type === 'table' && (
              <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Table Settings</h3>
                
                <div className="space-y-4">
                  {/* Pagination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rows per Page
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="10">10 rows</option>
                      <option value="25">25 rows</option>
                      <option value="50">50 rows</option>
                      <option value="100">100 rows</option>
                    </select>
                  </div>

                  {/* Sorting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">No sorting</option>
                      {currentConfig.xAxis && (
                        <>
                          <option value={`${currentConfig.xAxis.name}-asc`}>
                            {currentConfig.xAxis.name} (A-Z)
                          </option>
                          <option value={`${currentConfig.xAxis.name}-desc`}>
                            {currentConfig.xAxis.name} (Z-A)
                          </option>
                        </>
                      )}
                      {currentConfig.groupBy && (
                        <>
                          <option value={`${currentConfig.groupBy.name}-asc`}>
                            {currentConfig.groupBy.name} (A-Z)
                          </option>
                          <option value={`${currentConfig.groupBy.name}-desc`}>
                            {currentConfig.groupBy.name} (Z-A)
                          </option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Table Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Table Features
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Enable search/filtering</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Show row numbers</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Enable column resizing</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Enable row selection</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visualization Preview */}
          <div className="col-span-8">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-200 h-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Visualization Preview</h3>
                <p className="text-sm text-gray-500">
                  {currentConfig.xAxis && (currentConfig.yAxis || currentConfig.type === 'table')
                    ? `${currentConfig.type === 'table' ? 'Table' : currentConfig.type + ' chart'}: ${currentConfig.xAxis.name}${currentConfig.yAxis ? ' vs ' + currentConfig.yAxis.name : ''}`
                    : `Configure ${currentConfig.type === 'table' ? 'columns' : 'chart axes'} to see preview`
                  }
                </p>
              </div>
              
              <div className="p-6">
                {currentConfig.xAxis && (currentConfig.yAxis || currentConfig.type === 'table') ? (
                  currentConfig.type === 'table' ? (
                    renderTablePreview()
                  ) : (
                    renderChartPreview()
                  )
                ) : (
                  <div className="h-96 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      {currentConfig.type === 'table' ? (
                        <Table size={64} className="mx-auto mb-4 opacity-50" />
                      ) : (
                        <BarChart3 size={64} className="mx-auto mb-4 opacity-50" />
                      )}
                      <h3 className="text-lg font-medium mb-2">Visualization Preview</h3>
                      <p className="text-sm">
                        Drag variables from the right panel to configure your {currentConfig.type === 'table' ? 'table' : 'chart'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variables Panel */}
      <VariablesPanel />
    </div>
  );
};

export default VisualizationBuilderPage; 