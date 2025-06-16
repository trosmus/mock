import React, { useState } from 'react';
import GraphCanvas from '../components/data-canvas/GraphCanvas';
import BlocksDrawer from '../components/data-canvas/BlocksDrawer';
import PreviewModal from '../components/data-canvas/PreviewModal';
import { useCanvasStore } from '../state/canvasStore';

interface DataSeries {
  id: string;
  name: string;
  data: any[];
  chartType: string;
  sourceWidget: string;
}

const CanvasPage: React.FC = () => {
  const { previewModalNodeId, closePreviewModal } = useCanvasStore();
  const [dataSeries, setDataSeries] = useState<DataSeries[]>([
    {
      id: 'mock-hypertension-series',
      name: 'Hypertension',
      data: [{ name: 'Hypertension', value: 2840 }],
      chartType: 'bar',
      sourceWidget: 'Most Common Conditions'
    },
    {
      id: 'mock-diabetes-series',
      name: 'Diabetes',
      data: [{ name: 'Diabetes', value: 1950 }],
      chartType: 'bar',
      sourceWidget: 'Most Common Conditions'
    },
    {
      id: 'mock-asthma-series',
      name: 'Asthma',
      data: [{ name: 'Asthma', value: 1240 }],
      chartType: 'bar',
      sourceWidget: 'Most Common Conditions'
    }
  ]);
  
  console.log('🏠 CanvasPage render - nodeId:', previewModalNodeId);

  const addDataSeries = (seriesData: {
    name: string;
    data: any[];
    chartType: string;
    sourceWidget: string;
  }) => {
    const newSeries: DataSeries = {
      id: `data-series-${Date.now()}`,
      ...seriesData
    };
    
    setDataSeries(prev => [...prev, newSeries]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Desktop</h1>
        <div className="ml-auto text-sm text-gray-500">
          Explore data relationships and patterns
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Blocks Drawer - Left Sidebar */}
        <BlocksDrawer dataSeries={dataSeries} />
        
        {/* Graph Canvas - Main Area */}
        <main className="flex-1 relative bg-white">
          <GraphCanvas />
        </main>

        {/*/!* AI Context Panel - Right Sidebar *!/*/}
        {/*<aside className="w-80 border-l border-gray-200 bg-white shadow-sm">*/}
        {/*  <AIContextPanel />*/}
        {/*</aside>*/}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={!!previewModalNodeId}
        nodeId={previewModalNodeId}
        onClose={closePreviewModal}
        onAddDataSeries={addDataSeries}
      />
    </div>
  );
};

export default CanvasPage;
