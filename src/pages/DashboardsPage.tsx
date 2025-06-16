import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Grid, Eye, Edit3 } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import WidgetCard from '../components/WidgetCard';
import VariablesPanel from '../components/VariablesPanel';
import ChatAssistantPanel from '../components/ChatAssistantPanel';
import SavedDocumentsPanel from '../components/SavedDocumentsPanel';
import type { SavedDocument } from '../stores/useSavedDocumentsStore';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardsPage: React.FC = () => {
  const { widgets, updateWidget } = useAppStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);

  const handleLayoutChange = (layout: any[]) => {
    layout.forEach((item) => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        updateWidget(widget.id, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        });
      }
    });
  };

  const handleDocumentSelect = (document: SavedDocument) => {
    if (document.type === 'dashboard') {
      // Load dashboard content
      console.log('Loading dashboard:', document);
      // TODO: Implement dashboard loading logic
    }
  };

  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      minW: 2,
      minH: 1,
      maxW: 12
    }))
  };

  return (
    <div className="h-full w-full flex bg-gray-50">
      {/* Saved Documents Panel */}
      <SavedDocumentsPanel 
        currentPageType="dashboard"
        onDocumentSelect={handleDocumentSelect}
      />

      {/* Chat Assistant Panel */}
      <ChatAssistantPanel 
        isExpanded={chatExpanded}
        onToggle={() => setChatExpanded(!chatExpanded)}
      />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
              <p className="text-gray-600">Drag and resize your analytics widgets</p>
            </div>
            
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isEditMode 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:shadow-lg'
              }`}
            >
              {isEditMode ? <Eye size={16} /> : <Edit3 size={16} />}
              {isEditMode ? 'View Mode' : 'Edit Mode'}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 w-full p-6 min-h-0 overflow-auto">
          {widgets.length > 0 ? (
            <div className="h-full w-full">
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                rowHeight={70}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                margin={[20, 20]}
                containerPadding={[0, 0]}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
                autoSize={true}
                verticalCompact={true}
                resizeHandles={['se']}
              >
                {widgets.map((widget) => (
                  <div 
                    key={widget.id} 
                    className="widget-container"
                  >
                    <WidgetCard widget={widget} />
                  </div>
                ))}
              </ResponsiveGridLayout>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <Grid size={80} className="mx-auto text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No widgets yet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use the ribbon toolbar above to add charts, text blocks, and headings to your dashboard.
                  Or create charts from SQL queries and quick analysis.
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Try clicking the "Chart" button in the ribbon to get started!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variables Panel */}
      <VariablesPanel />
    </div>
  );
};

export default DashboardsPage; 