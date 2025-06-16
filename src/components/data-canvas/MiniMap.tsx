import React from 'react';
import { MiniMap as ReactFlowMiniMap } from '@xyflow/react';
import { useCanvasStore } from '../../state/canvasStore';

interface MiniMapProps {
  className?: string;
}

const MiniMap: React.FC<MiniMapProps> = ({ className = '' }) => {
  const { selectedNodeId } = useCanvasStore();

  return (
    <div className={`absolute bottom-4 right-4 ${className}`}>
      <ReactFlowMiniMap
        nodeColor={(node) => {
          if (selectedNodeId === node.id) return '#3B82F6';
          return '#E5E7EB';
        }}
        nodeStrokeColor={(node) => {
          if (selectedNodeId === node.id) return '#1E40AF';
          return '#9CA3AF';
        }}
        nodeStrokeWidth={2}
        maskColor="rgb(240, 242, 246, 0.7)"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        pannable
        zoomable
      />
    </div>
  );
};

export default MiniMap;
