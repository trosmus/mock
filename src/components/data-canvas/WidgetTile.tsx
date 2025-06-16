import React from 'react';
import { BarChart3, PieChart, Activity, Table, Type, Heading1 } from 'lucide-react';
import type { Widget } from '../../types/index';
import ChartPreview from '../ChartPreview';
import { getDemoDataForChart } from './mockData/chartDemoData';

interface WidgetTileProps {
  widget: Widget;
  getDemoData?: (widgetId: string) => { columns: string[]; data: any[][]; totalRows: number; };
  onClick?: () => void;
  index?: number;
}

// Compact widget tile for grid display
const WidgetTile: React.FC<WidgetTileProps> = ({ widget, getDemoData, onClick, index }) => {
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

  return (
    <div 
      className="relative h-full w-full bg-white border border-gray-200 flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Header - No action buttons */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-100 flex-shrink-0">
        <div className="p-1 bg-gray-50 rounded-sm flex-shrink-0">
          <Icon size={12} className="text-gray-700" />
        </div>
        <h3 className="font-semibold text-gray-800 text-xs truncate">{widget.title}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 min-h-0 relative">
        {widget.type === 'chart' && widget.chartConfig ? (
          <div className="h-full">
            <ChartPreview 
              config={widget.chartConfig} 
              dataframeId={widget.dataframeId}
              height="100%"
              demoData={getDemoData?.(widget.id) || getDemoDataForChart(widget.id)}
            />
          </div>
        ) : widget.type === 'metric' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              {widget.content}
            </div>
            <div className="text-xs text-gray-600 font-semibold text-center">{widget.title}</div>
          </div>
        ) : widget.type === 'text' ? (
          <div className="h-full">
            {widget.id === 'key-metrics' ? (
              <div className="grid grid-cols-2 gap-2 h-full p-1">
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    12,847
                  </div>
                  <div className="text-xs text-gray-600 font-semibold text-center leading-tight">
                    Total Patients
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    44
                  </div>
                  <div className="text-xs text-gray-600 font-semibold text-center leading-tight">
                    Median Age
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    8.5%
                  </div>
                  <div className="text-xs text-gray-600 font-semibold text-center leading-tight">
                    Readmission Rate
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    94%
                  </div>
                  <div className="text-xs text-gray-600 font-semibold text-center leading-tight">
                    Immunization Rate
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-800 leading-relaxed overflow-hidden whitespace-pre-line font-medium">
                {widget.content}
              </div>
            )}
          </div>
        ) : widget.type === 'heading' ? (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-sm font-bold text-gray-800 text-center">
              {widget.content}
            </h2>
          </div>
        ) : widget.type === 'table' ? (
          <div className="h-full overflow-hidden">
            <div className="text-xs">
              <div className="grid grid-cols-3 gap-1 font-semibold text-gray-800 mb-1 pb-1 border-b border-gray-200">
                <div>Provider</div>
                <div>Patients</div>
                <div>Specialty</div>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-1 text-gray-600">
                  <div>Dr. Smith</div>
                  <div>324</div>
                  <div>Cardiology</div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-gray-600">
                  <div>Dr. Johnson</div>
                  <div>298</div>
                  <div>Internal Med</div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-gray-600">
                  <div>Dr. Williams</div>
                  <div>267</div>
                  <div>Pediatrics</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WidgetTile; 