import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, Table, Type, Heading1, X, Edit3 } from 'lucide-react';
import type { Widget } from '../types/index';
import ChartPreview from './ChartPreview';
import UseForQuickAnalysisButton from './UseForQuickAnalysisButton';
import { useAppStore } from '../stores/useAppStore';

interface WidgetCardProps {
  widget: Widget;
  isDragging?: boolean;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, isDragging = false }) => {
  const { removeWidget, updateWidget } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(widget.content || '');

  const getWidgetIcon = () => {
    switch (widget.type) {
      case 'chart':
        return widget.chartConfig?.type === 'pie' ? PieChart : BarChart3;
      case 'metric':
        return Activity;
      case 'table':
        return Table;
      case 'text':
        return Type;
      case 'heading':
        return Heading1;
      default:
        return BarChart3;
    }
  };

  const handleSaveEdit = () => {
    updateWidget(widget.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(widget.content || '');
    setIsEditing(false);
  };

  const Icon = getWidgetIcon();

  return (
    <div className={`
      relative group h-full w-full
      bg-white
      rounded-2xl shadow-lg border border-gray-200
      ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      transition-all duration-200 hover:shadow-xl hover:-translate-y-1
      flex flex-col
      overflow-hidden
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
            <Icon size={14} className="text-gray-700" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm truncate">{widget.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {(widget.type === 'text' || widget.type === 'heading') && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit3 size={12} className="text-gray-600" />
            </button>
          )}
          <button
            onClick={() => removeWidget(widget.id)}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X size={12} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 min-h-0 relative">
        {widget.type === 'chart' && widget.chartConfig ? (
          <div className="h-full">
            <ChartPreview 
              config={widget.chartConfig} 
              dataframeId={widget.dataframeId}
              height="100%"
            />
          </div>
        ) : widget.type === 'metric' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              12,543
            </div>
            <div className="text-xs text-gray-600 font-medium text-center">Total Records</div>
          </div>
        ) : widget.type === 'text' ? (
          <div className="h-full">
            {isEditing ? (
              <div className="h-full flex flex-col">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter your text content..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="text-gray-700 text-sm leading-relaxed cursor-pointer hover:bg-gray-50 p-2 rounded-lg h-full overflow-auto"
                onClick={() => setIsEditing(true)}
              >
                {widget.content || 'Click to edit this text block...'}
              </div>
            )}
          </div>
        ) : widget.type === 'heading' ? (
          <div className="h-full flex items-center justify-center">
            {isEditing ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-center text-lg font-bold"
                  placeholder="Section Heading"
                />
                <div className="flex gap-2 mt-2 justify-center">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h2 
                className="text-lg lg:text-xl font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg w-full"
                onClick={() => setIsEditing(true)}
              >
                {widget.content || 'Section Heading'}
              </h2>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Table size={32} />
          </div>
        )}

        {/* Footer Actions */}
        {(widget.type === 'chart' || widget.type === 'metric') && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <UseForQuickAnalysisButton 
              context={`Widget: ${widget.title}`}
              sql={widget.chartConfig ? `-- Generated from ${widget.title}` : undefined}
              size="sm"
              className="w-full justify-center bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard; 