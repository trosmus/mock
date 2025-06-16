import React, { useState, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, BarChart3, PieChart, Activity, Table, Type, Heading1, Plus } from 'lucide-react';
import type { Widget } from '../../types/index';
import ChartPreview from '../ChartPreview';
import { getThinkingProcess } from './mockData/thinkingProcesses';

interface ExpandedWidgetViewProps {
  widget: Widget;
  getDemoData: (widgetId: string) => { columns: string[]; data: any[][]; totalRows: number; };
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
  onAddDataSeries?: (seriesData: {
    name: string;
    data: any[];
    chartType: string;
    sourceWidget: string;
  }) => void;
}

// Expanded widget view component for carousel
const ExpandedWidgetView: React.FC<ExpandedWidgetViewProps> = ({ 
  widget, 
  getDemoData, 
  onClose, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount,
  onAddDataSeries
}) => {
  const [actionMenu, setActionMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    seriesData: any;
  } | null>(null);

  const handleSeriesClick = useCallback((seriesData: any, event?: { clientX: number; clientY: number }) => {
    console.log('ExpandedWidgetView handleSeriesClick called!', { seriesData, event });
    
    if (event) {
      console.log('Setting action menu with coordinates:', event);
      setActionMenu({
        show: true,
        x: event.clientX,
        y: event.clientY,
        seriesData
      });
    } else {
      console.log('No event coordinates provided');
    }
  }, []);

  const handleAddToDrawer = useCallback(() => {
    if (actionMenu?.seriesData && onAddDataSeries) {
      onAddDataSeries(actionMenu.seriesData);
      setActionMenu(null);
    }
  }, [actionMenu?.seriesData, onAddDataSeries]);

  const closeActionMenu = useCallback(() => {
    setActionMenu(null);
  }, []);

  // Memoize the demo data to prevent unnecessary re-renders
  const memoizedDemoData = useMemo(() => {
    return getDemoData(widget.id);
  }, [getDemoData, widget.id]);

  // Memoized ChartPreview to prevent re-renders when action menu changes
  const MemoizedChartPreview = useMemo(() => {
    if (widget.type !== 'chart' || !widget.chartConfig) return null;
    
    return (
      <ChartPreview 
        config={widget.chartConfig} 
        dataframeId={widget.dataframeId}
        height="100%"
        demoData={memoizedDemoData}
        onSeriesClick={handleSeriesClick}
      />
    );
  }, [widget.chartConfig, widget.dataframeId, memoizedDemoData, handleSeriesClick]);

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

  const Icon = getWidgetIcon();
  const thinkingProcess = getThinkingProcess(widget.id);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Navigation arrows - hidden on mobile */}
      <button
        onClick={onPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200 hidden md:block"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200 hidden md:block"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Main Content - Unified Card Layout */}
      <div 
        className="w-full h-full max-w-7xl mx-6 flex bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Visualization */}
        <div className="flex-1 flex flex-col">
          {/* Visualization Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white h-20">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">{widget.title}</h3>
              <p className="text-sm text-blue-100">
                Analysis {currentIndex + 1} of {totalCount}
              </p>
            </div>
          </div>

          {/* Visualization Content */}
          <div className="flex-1 p-8 overflow-auto">
            {widget.type === 'chart' && widget.chartConfig ? (
              <div className="h-full min-h-[500px]">
                {MemoizedChartPreview}
              </div>
            ) : widget.type === 'metric' ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {widget.content}
                </div>
                <div className="text-2xl text-gray-600 font-semibold text-center">{widget.title}</div>
              </div>
            ) : widget.type === 'text' ? (
              <div className="h-full">
                {widget.id === 'key-metrics' ? (
                  <div className="grid grid-cols-2 gap-8 h-full max-w-3xl mx-auto">
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                      <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        12,847
                      </div>
                      <div className="text-xl text-gray-700 font-semibold text-center">
                        Total Patients
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                      <div className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        44
                      </div>
                      <div className="text-xl text-gray-700 font-semibold text-center">
                        Median Age
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                      <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                        8.5%
                      </div>
                      <div className="text-xl text-gray-700 font-semibold text-center">
                        Readmission Rate
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                      <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        94%
                      </div>
                      <div className="text-xl text-gray-700 font-semibold text-center">
                        Immunization Rate
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xl text-gray-800 leading-relaxed whitespace-pre-line font-medium max-w-4xl mx-auto">
                    {widget.content}
                  </div>
                )}
              </div>
            ) : widget.type === 'table' ? (
              <div className="h-full">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-3 gap-6 font-bold text-gray-800 p-6 bg-gray-50 border-b border-gray-200">
                    <div>Provider</div>
                    <div>Patients</div>
                    <div>Specialty</div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-6 p-6 text-gray-700 text-lg">
                      <div>Dr. Smith</div>
                      <div>324</div>
                      <div>Cardiology</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6 text-gray-700 text-lg">
                      <div>Dr. Johnson</div>
                      <div>298</div>
                      <div>Internal Medicine</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6 text-gray-700 text-lg">
                      <div>Dr. Williams</div>
                      <div>267</div>
                      <div>Pediatrics</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6 text-gray-700 text-lg">
                      <div>Dr. Brown</div>
                      <div>245</div>
                      <div>Orthopedics</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6 text-gray-700 text-lg">
                      <div>Dr. Davis</div>
                      <div>223</div>
                      <div>Neurology</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300"></div>

        {/* Right Side - Thinking Process */}
        <div className="w-96 flex flex-col">
          {/* Process Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white h-20">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">AI Analysis Process</h3>
            </div>
          </div>

          {/* Process Steps */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {thinkingProcess.steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Connection Line */}
                    {index < thinkingProcess.steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                    )}
                    
                    {/* Step Content */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <StepIcon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-700 text-sm mb-2">{step.description}</p>
                        <p className="text-gray-600 text-xs leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendation */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className="text-blue-600" />
                <h4 className="font-semibold text-blue-700">Recommendation</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{thinkingProcess.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile swipe indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:hidden">
        {Array.from({ length: totalCount }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Action Menu Overlay */}
      {actionMenu?.show && (
        <>
          <div 
            className="fixed inset-0 z-50" 
            onClick={closeActionMenu}
          />
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-48"
            style={{
              left: Math.min(actionMenu.x, window.innerWidth - 200),
              top: Math.max(actionMenu.y - 100, 10),
            }}
          >
            <button
              onClick={handleAddToDrawer}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-sm border-none"
            >
              <Plus size={16} className="text-blue-600" />
              <span>Add serie to Drawer</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpandedWidgetView; 