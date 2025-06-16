import React, { useState, useCallback, useEffect } from 'react';
import { getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useCanvasStore } from '../../state/canvasStore';
import { Plus, Database, Filter, Hash, Code, BarChart3, FileText, Workflow, TrendingUp } from 'lucide-react';

// Helper function to get icon for block type
const getBlockIcon = (blockType: string) => {
  switch (blockType) {
    case 'dataset': return Database;
    case 'filter': return Filter;
    case 'field': return Hash;
    case 'sql': return Code;
    case 'visualization': return BarChart3;
    case 'narrative': return FileText;
    case 'workflow': return Workflow;
    case 'data-series': return TrendingUp;
    default: return Database;
  }
};

// Helper function to get color for block type
const getBlockColor = (blockType: string) => {
  switch (blockType) {
    case 'dataset': return '#3b82f6';
    case 'filter': return '#10b981';
    case 'field': return '#f59e0b';
    case 'sql': return '#6366f1';
    case 'visualization': return '#ec4899';
    case 'narrative': return '#22c55e';
    case 'workflow': return '#ef4444';
    case 'data-series': return '#0ea5e9';
    default: return '#64748b';
  }
};

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}) => {
  const { selectedEdgeId } = useCanvasStore();
  const isSelected = selected || selectedEdgeId === id;
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedBlocks, setDroppedBlocks] = useState<any[]>(
    Array.isArray(data?.transformationBlocks) ? data.transformationBlocks : []
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Listen for edge configuration events for this specific edge
  useEffect(() => {
    const handleEdgeConfigureEvent = (event: CustomEvent) => {
      const { edgeId, blockData } = event.detail;
      if (edgeId === id) {
        setDroppedBlocks(prev => [...prev, blockData]);
      }
    };

    window.addEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);

    return () => {
      window.removeEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);
    };
  }, [id]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    try {
      const blockData = JSON.parse(event.dataTransfer.getData('application/json'));

      // Trigger edge configuration through a custom event
      const configureEvent = new CustomEvent('configureEdge', {
        detail: {
          edgeId: id,
          blockData: blockData,
          position: { x: labelX, y: labelY }
        }
      });
      window.dispatchEvent(configureEvent);

      console.log('Block dropped on edge:', { edgeId: id, blockData });
    } catch (error) {
      console.error('Failed to parse dropped block on edge:', error);
    }
  }, [id, labelX, labelY]);

  const edgeStyle = {
    stroke: isDragOver ? '#10b981' : (style.stroke || '#3b82f6'),
    strokeWidth: isDragOver ? 8 : (isSelected ? 6 : (style.strokeWidth || 5)),
    strokeDasharray: isDragOver ? '12,6' : 'none',
    filter: isDragOver ?
      `drop-shadow(0 4px 12px rgba(16, 185, 129, 0.6))` :
      isSelected ?
        `drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))` :
        `drop-shadow(0 1px 4px rgba(59, 130, 246, 0.2))`,
    opacity: isDragOver ? 1 : (isSelected ? 1 : 0.8),
    transition: 'all 0.3s ease',
  };

  // Calculate grid dimensions for dropped blocks
  const totalBlocks = droppedBlocks.length;
  const getGridDimensions = (count: number) => {
    if (count <= 1) return { cols: 1, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    return { cols: 4, rows: 4 };
  };

  const gridDims = getGridDimensions(totalBlocks);

  // Dynamic sizing based on grid content
  const cellWidth = 48;
  const cellHeight = 40;
  const gridGap = 3;
  const boxPadding = 8;

  const boxWidth = (cellWidth * gridDims.cols) + (gridGap * (gridDims.cols - 1)) + (boxPadding * 2);
  const boxHeight = (cellHeight * gridDims.rows) + (gridGap * (gridDims.rows - 1)) + (boxPadding * 2);

  const cellSize = {
    width: cellWidth,
    height: cellHeight
  };

  return (
    <>
      {/* Invisible wider path for easier drag targeting */}
      <path
        style={{
          stroke: `${edgeStyle.stroke}`,
          strokeWidth: 10,
          fill: 'none',
          pointerEvents: 'all',
        }}
        d={edgePath}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />

      {/* Visible edge path */}
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
      />

      {/* Drop zone indicator */}
      {isDragOver && (
        <g>
          {/* Drop zone circle */}
          <circle
            cx={labelX}
            cy={labelY}
            r="20"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4,2"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Plus icon */}
          <foreignObject
            x={labelX - 8}
            y={labelY - 8}
            width="16"
            height="16"
            style={{ pointerEvents: 'none' }}
          >
            <Plus
              size={16}
              color="#10b981"
              strokeWidth={2.5}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
              }}
            />
          </foreignObject>
        </g>
      )}

      {/* Edge transformation box for dropped blocks */}
      {droppedBlocks.length > 0 && (
        <g
          style={{ pointerEvents: 'all' }}
          onMouseEnter={() => setIsDragOver(true)}
          onMouseLeave={() => setIsDragOver(false)}
        >
          {/* Background box */}
          <rect
            x={labelX - boxWidth / 2}
            y={labelY - boxHeight / 2}
            width={boxWidth}
            height={boxHeight}
            rx="8"
            ry="8"
            fill="white"
            stroke={edgeStyle.stroke}
            strokeWidth="2"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
              pointerEvents: 'all',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          {/* Grid of dropped blocks */}
          <foreignObject
            x={labelX - boxWidth / 2 + boxPadding / 2}
            y={labelY - boxHeight / 2 + boxPadding / 2}
            width={boxWidth - boxPadding}
            height={boxHeight - boxPadding}
            style={{ pointerEvents: 'all' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridDims.cols}, 1fr)`,
                gridTemplateRows: `repeat(${gridDims.rows}, 1fr)`,
                gap: `${gridGap}px`,
                width: '100%',
                height: '100%',
                padding: `${boxPadding / 2}px`,
              }}
            >
              {Array.from({ length: gridDims.cols * gridDims.rows }).map((_, index) => {
                const block = droppedBlocks[index];

                if (block) {
                  // Render filled block
                  const BlockIcon = getBlockIcon(block.type);
                  const blockColor = getBlockColor(block.type);
                  const blockName = String(block.name || 'Unknown').replace(' Block', '');

                  return (
                    <div
                      key={index}
                      style={{
                        width: `${cellSize.width}px`,
                        height: `${cellSize.height}px`,
                        background: `linear-gradient(135deg, ${blockColor}20 0%, ${blockColor}40 100%)`,
                        border: `1px solid ${blockColor}`,
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        boxSizing: 'border-box',
                      }}
                      title={block.name}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 auto'
                      }}>
                        <BlockIcon
                          size={14}
                          color={blockColor}
                          strokeWidth={2}
                        />
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 auto',
                        width: '100%',
                        padding: '0 4px'
                      }}>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            color: blockColor,
                            lineHeight: '1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {blockName}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  // Render empty slot
                  return (
                    <div
                      key={index}
                      style={{
                        width: `${cellSize.width}px`,
                        height: `${cellSize.height}px`,
                        border: '1px dashed #cbd5e1',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(248, 250, 252, 0.5)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Plus
                        size={12}
                        color="#cbd5e1"
                        strokeWidth={1.5}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </foreignObject>
        </g>
      )}

      {/* Edge label - only show if no dropped blocks */}
      {data?.label && !isDragOver && droppedBlocks.length === 0 && (
        <text
          x={labelX}
          y={labelY}
          style={{
            fill: '#1e293b',
            fontSize: '11px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
            pointerEvents: 'none',
            textAnchor: 'middle',
            dominantBaseline: 'middle',
          }}
        >
          <tspan
            style={{
              fill: '#3b82f6',
              filter: 'none',
            }}
          >
            {String(data.label)}
          </tspan>
        </text>
      )}

      {/* Animated particles for selected edges */}
      {isSelected && !isDragOver && droppedBlocks.length === 0 && (
        <circle
          r="2"
          fill="#3b82f6"
          style={{
            filter: `drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))`,
          }}
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
};

export default CustomEdge;
