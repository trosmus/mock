import React, { useState, useMemo, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Database, Filter, Hash, Code, BarChart3, FileText, Workflow, TrendingUp } from 'lucide-react';
import { useCanvasStore } from '../../state/canvasStore';
import ActionBar from './ActionBar';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Move this outside the component to prevent recreation on every render
const getCategoryConfigByType = (type: string) => {
  switch (type) {
    case 'dataset':
      return {
        icon: Database,
        bgColor: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        borderColor: '#3b82f6',
        iconColor: '#1e40af'
      };
    case 'filter':
      return {
        icon: Filter,
        bgColor: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        borderColor: '#10b981',
        iconColor: '#047857'
      };
    case 'field':
      return {
        icon: Hash,
        bgColor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderColor: '#f59e0b',
        iconColor: '#d97706'
      };
    case 'sql':
      return {
        icon: Code,
        bgColor: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        borderColor: '#6366f1',
        iconColor: '#4338ca'
      };
    case 'visualization':
      return {
        icon: BarChart3,
        bgColor: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        borderColor: '#ec4899',
        iconColor: '#be185d'
      };
    case 'narrative':
      return {
        icon: FileText,
        bgColor: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        borderColor: '#22c55e',
        iconColor: '#15803d'
      };
    case 'workflow':
      return {
        icon: Workflow,
        bgColor: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
        borderColor: '#ef4444',
        iconColor: '#dc2626'
      };
    case 'data-series':
      return {
        icon: TrendingUp,
        bgColor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderColor: '#0ea5e9',
        iconColor: '#0284c7'
      };
    default:
      return {
        icon: Database,
        bgColor: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderColor: '#64748b',
        iconColor: '#475569'
      };
  }
};

// Helper function to blend hex colors - also move outside
const blendHexColors = (colors: string[]): string => {
  if (colors.length === 0) return '#64748b';
  if (colors.length === 1) return colors[0];
  
  // Convert hex to RGB
  const rgbColors = colors.map(hex => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  });
  
  // Average the RGB values
  const avgR = Math.round(rgbColors.reduce((sum, color) => sum + color.r, 0) / rgbColors.length);
  const avgG = Math.round(rgbColors.reduce((sum, color) => sum + color.g, 0) / rgbColors.length);
  const avgB = Math.round(rgbColors.reduce((sum, color) => sum + color.b, 0) / rgbColors.length);
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
};

// Shimmer animation keyframes
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes shimmerBorder {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .shimmer-border {
    position: relative;
  }
  
  .shimmer-border::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
    background-size: 200% 100%;
    border-radius: 19px;
    animation: shimmerBorder 2s ease-in-out infinite;
    z-index: -1;
  }
  
  .shimmer-outline {
    position: relative;
  }
  
  .shimmer-outline::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
    background-size: 200% 100%;
    border-radius: 26px;
    animation: shimmerBorder 2s ease-in-out infinite;
    z-index: -2;
  }
`;

const CustomNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  console.log(`🔄 [${data.id}] CustomNode render - selected: ${selected}, dataChanged: ${!!data}`);
  
  const currentNodeId = String(data.id || '');
  
  // Use a selector to only re-render when this specific node's selection state changes
  const isSelectedFromStore = useCanvasStore((state) => state.selectedNodeId === currentNodeId);
  const isSelected = selected || isSelectedFromStore;
  
  // Stabilize the data object to prevent unnecessary re-renders
  const stableData = useMemo(() => {
    return {
      id: data.id,
      label: data.label,
      description: data.description || "Healthcare data analysis component",
      prompt: data.prompt || data.description || "Analyze the healthcare data to identify key patterns and insights. Focus on patient demographics, condition prevalence, and care utilization trends.",
      blockType: data.blockType,
      category: data.category,
      combinedBlocks: data.combinedBlocks
    };
  }, [data.id, data.label, data.description, data.prompt, data.blockType, data.category, data.combinedBlocks]);
  
  // Node status state (you can move this to your store later)
  const [nodeStatus, setNodeStatus] = useState<'unsynced' | 'syncing' | 'synced' | 'error'>('unsynced');
  const [showConfigPopover, setShowConfigPopover] = useState(false);

  // Inject shimmer styles only once
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = shimmerKeyframes;
      styleElement.id = 'shimmer-styles';
      
      // Only add if not already present
      if (!document.getElementById('shimmer-styles')) {
        document.head.appendChild(styleElement);
      }
      
      return () => {
        const existingStyle = document.getElementById('shimmer-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  // Action button handlers
  const handleRun = () => {
    console.log('🏃 handleRun called for:', data.id);
    setNodeStatus('syncing');
    console.log('Running node:', data.id);
    // Simulate async operation
    setTimeout(() => {
      setNodeStatus('synced');
    }, 2000);
  };

  const handleConfigure = () => {
    console.log('⚙️ handleConfigure called for:', data.id);
    setShowConfigPopover(true);
  };

  const handlePreview = () => {
    console.log('👁️ handlePreview called for:', data.id);
    console.log('👁️ Current nodeStatus:', nodeStatus);
    
    console.log('👁️ Opening preview modal for node:', data.id);
    console.log('👁️ Store state before opening:', useCanvasStore.getState());
    const { openPreviewModal } = useCanvasStore.getState();
    console.log('👁️ openPreviewModal function:', openPreviewModal);
    openPreviewModal(String(data.id));
    console.log('👁️ Store state after opening:', useCanvasStore.getState());
    console.log('👁️ Modal nodeId after opening:', useCanvasStore.getState().previewModalNodeId);
  };

  // Memoize category config to prevent recalculation on every render
  const getCategoryConfig = useMemo(() => {
    console.log(`🏷️ [${currentNodeId}] getCategoryConfig memoization recalculated`);
    const category = String(stableData.blockType || stableData.category || 'default');
    return getCategoryConfigByType(category);
  }, [stableData.blockType, stableData.category, currentNodeId]);

  const IconComponent = getCategoryConfig.icon;

  // Simplified drop handler without hover effects
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const blockData = JSON.parse(event.dataTransfer.getData('application/json'));

      // Trigger node combination through a custom event
      const combineEvent = new CustomEvent('combineNode', {
        detail: {
          targetNodeId: stableData.id,
          newBlock: blockData
        }
      });
      window.dispatchEvent(combineEvent);

    } catch (error) {
      console.error(`❌ [${currentNodeId}] Failed to parse dropped block:`, error);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Check if this is a combined node
  const isCombined = Array.isArray(stableData.combinedBlocks) && (stableData.combinedBlocks as any[]).length > 0;
  
  // Memoize combinedBlocks to prevent array recreation
  const combinedBlocks = useMemo(() => {
    return (stableData.combinedBlocks as any[]) || [];
  }, [stableData.combinedBlocks]);

  // Memoize color blending function to prevent expensive recalculations
  const blendColors = useMemo(() => {
    console.log(`🎨 [${currentNodeId}] blendColors memoization recalculated - isCombined: ${isCombined}, combinedBlocksLength: ${combinedBlocks.length}`);
    if (!isCombined || combinedBlocks.length === 0) return getCategoryConfig;
    
    // Get all block types including the original
    const allBlockTypes = [
      String(stableData.blockType || stableData.category || 'default'),
      ...combinedBlocks.map((block: any) => String(block.type || 'default'))
    ];
    
    // Get all category configs
    const configs = allBlockTypes.map(type => {
      switch (type) {
        case 'dataset': return { borderColor: '#3b82f6' };
        case 'filter': return { borderColor: '#10b981' };
        case 'field': return { borderColor: '#f59e0b' };
        case 'sql': return { borderColor: '#6366f1' };
        case 'visualization': return { borderColor: '#ec4899' };
        case 'narrative': return { borderColor: '#22c55e' };
        case 'workflow': return { borderColor: '#ef4444' };
        default: return { borderColor: '#64748b' };
      }
    });
    
    // Extract hex colors from border colors
    const hexColors = configs.map(config => config.borderColor);
    
    // Blend the colors
    const blendedColor = blendHexColors(hexColors);
    
    return {
      icon: getCategoryConfig.icon, // Keep original icon
      bgColor: `linear-gradient(135deg, ${blendedColor}20 0%, ${blendedColor}40 100%)`,
      borderColor: blendedColor,
      iconColor: blendedColor
    };
  }, [isCombined, combinedBlocks, getCategoryConfig, stableData.blockType, stableData.category, currentNodeId]);

  // Get the appropriate config (blended for combined, original for single)
  const nodeConfig = useMemo(() => {
    console.log(`⚙️ [${currentNodeId}] nodeConfig memoization recalculated`);
    return isCombined ? blendColors : getCategoryConfig;
  }, [isCombined, blendColors, getCategoryConfig, currentNodeId]);

  // Memoize grid calculations
  const gridCalculations = useMemo(() => {
    const totalBlocks = isCombined ? 1 + combinedBlocks.length : 1;
    console.log(`📐 [${currentNodeId}] calculateGridDimensions called with: ${totalBlocks}`);
    
    let gridDims;
    if (totalBlocks <= 1) gridDims = { cols: 1, rows: 1, maxBlocks: 1 };
    else if (totalBlocks <= 4) gridDims = { cols: 2, rows: 2, maxBlocks: 4 };
    else if (totalBlocks <= 9) gridDims = { cols: 3, rows: 3, maxBlocks: 9 };
    else if (totalBlocks <= 16) gridDims = { cols: 4, rows: 4, maxBlocks: 16 };
    else gridDims = { cols: 4, rows: 4, maxBlocks: 16 }; // Cap at 4x4 for readability
    
    console.log(`📦 [${currentNodeId}] getCellSize called with: {cols: ${gridDims.cols}, rows: ${gridDims.rows}}`);
    const baseWidth = 120;
    const baseHeight = 80;
    const gap = 4;
    
    const cellWidth = Math.floor((baseWidth - (gridDims.cols - 1) * gap) / gridDims.cols);
    const cellHeight = Math.floor((baseHeight - (gridDims.rows - 1) * gap) / gridDims.rows);
    
    const cellSize = {
      width: cellWidth,
      height: cellHeight,
      containerWidth: baseWidth,
      containerHeight: baseHeight
    };
    
    return { totalBlocks, gridDims, cellSize };
  }, [isCombined, combinedBlocks.length, currentNodeId]);

  const { totalBlocks, gridDims, cellSize } = gridCalculations;

  // Memoize the complex blocks rendering logic
  const renderedBlocks = useMemo(() => {
    console.log(`🧱 [${currentNodeId}] renderedBlocks memoization recalculated`);
    if (!isCombined) return null;
    
    const allBlocks = [
      {
        name: String(stableData.label || '').replace(' Block', ''),
        type: stableData.blockType,
        description: stableData.description
      },
      ...combinedBlocks
    ];
    
    return allBlocks.slice(0, gridDims.maxBlocks).map((block: any, index: number) => {
      const blockConfig = getCategoryConfigByType(String(block.type || 'default'));
      const BlockIcon = blockConfig.icon;
      const blockName = String(block.name || 'Unknown Block').replace(' Block', '');
      return (
        <div 
          key={index} 
          style={{ 
            width: `${cellSize.width}px`,
            height: `${cellSize.height}px`,
            padding: '3px',
            borderRadius: '4px',
            background: blockConfig.bgColor,
            border: `1px solid ${blockConfig.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1px',
            position: 'relative',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
          title={String(block.name || 'Unknown Block')} // Tooltip with full name
        >
          <BlockIcon 
            size={Math.max(8, Math.min(12, cellSize.width / 6))} 
            color={blockConfig.iconColor}
            strokeWidth={2}
          />
          <span style={{
            fontSize: `${Math.max(4, Math.min(6, cellSize.width / 12))}px`,
            fontWeight: '700',
            color: blockConfig.iconColor,
            lineHeight: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center'
          }}>
            {blockName}
          </span>
        </div>
      );
    });
  }, [isCombined, stableData.label, stableData.blockType, stableData.description, combinedBlocks, gridDims.maxBlocks, cellSize.width, cellSize.height, currentNodeId]);

  // Render empty cells
  const renderedEmptyCells = useMemo(() => {
    console.log(`🕳️ [${currentNodeId}] renderedEmptyCells memoization recalculated`);
    if (!isCombined) return null;
    
    const visibleBlocks = Math.min(totalBlocks, gridDims.maxBlocks);
    const emptyCells = Math.max(0, gridDims.maxBlocks - visibleBlocks);
    return Array.from({ length: emptyCells }).map((_, index) => (
      <div 
        key={`empty-${index}`} 
        style={{ 
          width: `${cellSize.width}px`,
          height: `${cellSize.height}px`,
          border: '2px dashed #94a3b8',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: `${Math.max(8, Math.min(10, cellSize.width / 6))}px`,
          background: 'rgba(148, 163, 184, 0.05)',
          fontWeight: '600'
        }}
      >
        +
      </div>
    ));
  }, [isCombined, totalBlocks, gridDims.maxBlocks, cellSize.width, cellSize.height, currentNodeId]);

  // Block composition summary
  const blockCompositionSummary = useMemo(() => {
    console.log(`📝 [${currentNodeId}] blockCompositionSummary memoization recalculated`);
    if (!isCombined) return null;
    
    // Get all block types including the original
    const allBlockTypes = [
      String(stableData.blockType || stableData.category || 'default'),
      ...combinedBlocks.map((block: any) => String(block.type || 'default'))
    ];
    
    // Count occurrences of each type
    const typeCounts = allBlockTypes.reduce((acc: any, type: string) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Create summary string
    const summary = Object.entries(typeCounts)
      .map(([type, count]: [string, any]) => {
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        return count > 1 ? `${count} ${typeLabel}s` : `1 ${typeLabel}`;
      })
      .slice(0, 2) // Show max 2 types
      .join(', ');
    
    const remainingTypes = Object.keys(typeCounts).length - 2;
    return remainingTypes > 0 ? `${summary} +${remainingTypes} more` : summary;
  }, [isCombined, stableData.blockType, stableData.category, combinedBlocks, currentNodeId]);

  // Memoize main node styles
  const nodeStyles = useMemo(() => {
    console.log(`🎨 [${currentNodeId}] nodeStyles memoization recalculated - isSelected: ${isSelected}`);
    
    // Skeleton shimmer effect when syncing
    const isShimmering = nodeStatus === 'syncing';
    
    return {
      background: isShimmering ? 
        'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)' :
        isSelected ? 
          'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)' :
          nodeConfig.bgColor,
      border: isShimmering ?
        '3px solid #cbd5e1' :
        `3px solid ${nodeConfig.borderColor}`,
      outline: isShimmering ?
        '7px solid #e2e8f0' :
        isSelected ? `7px solid ${nodeConfig.borderColor}` : 'none',
      outlineOffset: (isShimmering || isSelected) ? '3px' : '3px',
      borderRadius: '16px',
      color: isShimmering ? '#94a3b8' : '#1e293b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '12px',
      fontWeight: '600',
      padding: '16px 48px',
      boxShadow: isSelected ? 
        `0 12px 30px rgba(59, 130, 246, 0.25),
         0 6px 20px rgba(0, 0, 0, 0.1),
         inset 0 1px 0 rgba(255, 255, 255, 0.9)` :
        `0 6px 20px rgba(0, 0, 0, 0.08),
         0 3px 12px rgba(0, 0, 0, 0.04),
         inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
      textShadow: 'none',
      minWidth: isCombined ? '160px' : '140px',
      minHeight: isCombined ? '120px' : '100px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      cursor: 'pointer',
      position: 'relative' as const,
      backgroundSize: isShimmering ? '200% 100%' : 'auto',
      animation: isShimmering ? 'shimmer 2s ease-in-out infinite' : 'none',
    };
  }, [isSelected, nodeConfig, isCombined, currentNodeId, nodeStatus]);

  // Memoize handle styles to prevent recreation on every render
  const handleStyles = useMemo(() => {
    console.log(`🔗 [${currentNodeId}] handleStyles memoization recalculated`);
    const baseStyle = {
      background: nodeConfig.borderColor,
      border: '2px solid #ffffff',
      width: '10px',
      height: '10px',
      boxShadow: `0 2px 8px ${nodeConfig.borderColor}40`,
    };
    
    return {
      target: baseStyle,
      source: baseStyle
    };
  }, [nodeConfig.borderColor, currentNodeId]);

  return (
    <div
      className={`custom-node ${nodeStatus === 'syncing' ? 'shimmer-border shimmer-outline' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={nodeStyles}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyles.target}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyles.source}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyles.target}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyles.source}
      />

      {/* Category icon(s) and combined blocks grid */}
      {isCombined ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '8px',
          width: '100%'
        }}>
          {/* Combined blocks grid - all blocks treated equally */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridDims.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridDims.rows}, 1fr)`,
            gap: '4px',
            width: `${cellSize.containerWidth}px`,
            height: `${cellSize.containerHeight}px`,
            margin: '0 auto',
            padding: '0'
          }}>
            {renderedBlocks}

            {renderedEmptyCells}
          </div>

          {/* Overflow indicator below grid */}
          {totalBlocks > gridDims.maxBlocks && (
            <div style={{
              marginTop: '4px',
              fontSize: '7px',
              fontWeight: '600',
              color: '#64748b',
              textAlign: 'center'
            }}>
              +{totalBlocks - gridDims.maxBlocks} more blocks
            </div>
          )}
        </div>
      ) : (
        <div style={{
          marginBottom: '8px',
          padding: '8px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <IconComponent
            size={20}
            color={nodeConfig.iconColor}
            strokeWidth={2.5}
          />
        </div>
      )}

      {/* Node content */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{
          fontSize: isCombined ? '12px' : '13px',
          marginBottom: '4px',
          color: '#1e293b',
          fontWeight: '700',
          lineHeight: '1.2'
        }}>
          {isCombined ? (
            // Generic name for combined nodes
            `Combined Workflow (${totalBlocks})`
          ) : (
            // Original block name for single nodes
            String(stableData.label || '').replace(' Block', '')
          )}
        </div>

        {/* Show description only for non-combined nodes */}
        {!isCombined && stableData.description && typeof stableData.description === 'string' ? (
          <div style={{
            fontSize: '10px',
            opacity: 0.75,
            maxWidth: '120px',
            lineHeight: '1.3',
            color: '#64748b',
            fontWeight: '400'
          }}>
            {stableData.description}
          </div>
        ) : null}

        {/* Show block composition summary for combined nodes */}
        {isCombined && (
          <div style={{
            fontSize: '9px',
            opacity: 0.75,
            maxWidth: '120px',
            lineHeight: '1.3',
            color: '#64748b',
            fontWeight: '400'
          }}>
            {blockCompositionSummary}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <ActionBar
        nodeId={String(stableData.id || '')}
        status={nodeStatus}
        onRun={handleRun}
        onConfigure={handleConfigure}
        onPreview={handlePreview}
      />

      {/* Configuration Popover */}
      {showConfigPopover && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => setShowConfigPopover(false)}
          />
          
          {/* Popover */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '100%',
              marginLeft: '10px',
              width: '300px',
              background: 'white',
              border: `2px solid ${nodeConfig.borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              zIndex: 1001,
              padding: '0',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${nodeConfig.borderColor}10 0%, ${nodeConfig.borderColor}20 100%)`,
                p: 1.5,
                borderBottom: `1px solid ${nodeConfig.borderColor}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  margin: 0,
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                Configure {String(stableData.label || '').replace(' Block', '')}
              </Typography>
              <IconButton
                onClick={() => setShowConfigPopover(false)}
                size="small"
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 2 }}>
              <TextField
                label="Name"
                defaultValue={String(stableData.label || '').replace(' Block', '')}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fafbfc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.borderColor,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.borderColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: nodeConfig.borderColor,
                  },
                }}
              />

              <TextField
                label="Prompt"
                defaultValue={String(stableData.prompt || '')}
                placeholder="Enter your prompt or instructions here..."
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fafbfc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.borderColor,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.borderColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: nodeConfig.borderColor,
                  },
                }}
              />

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'flex-end',
                  pt: 1.5,
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowConfigPopover(false)}
                  sx={{
                    color: '#6b7280',
                    borderColor: '#e5e7eb',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#d1d5db',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    console.log('Saving node configuration for:', stableData.id);
                    setShowConfigPopover(false);
                  }}
                  sx={{
                    backgroundColor: nodeConfig.borderColor,
                    '&:hover': {
                      backgroundColor: nodeConfig.borderColor,
                      opacity: 0.9,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 8px ${nodeConfig.borderColor}30`,
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </div>
        </>
      )}
    </div>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: NodeProps, nextProps: NodeProps) => {
  // Compare basic props
  if (prevProps.selected !== nextProps.selected) return false;
  if (prevProps.id !== nextProps.id) return false;
  
  // Compare data object properties that actually matter for rendering
  const prevData = prevProps.data;
  const nextData = nextProps.data;
  
  // Only compare the properties we actually use in rendering
  if (prevData.id !== nextData.id) return false;
  if (prevData.label !== nextData.label) return false;
  if (prevData.blockType !== nextData.blockType) return false;
  if (prevData.category !== nextData.category) return false;
  if (prevData.description !== nextData.description) return false;
  if (prevData.prompt !== nextData.prompt) return false;
  
  // Compare combinedBlocks array deeply
  const prevCombined = (prevData.combinedBlocks as any[]) || [];
  const nextCombined = (nextData.combinedBlocks as any[]) || [];
  
  if (prevCombined.length !== nextCombined.length) return false;
  
  for (let i = 0; i < prevCombined.length; i++) {
    if (prevCombined[i]?.type !== nextCombined[i]?.type) return false;
    if (prevCombined[i]?.name !== nextCombined[i]?.name) return false;
  }
  
  // If all relevant properties are the same, don't re-render
  return true;
};

export default React.memo(CustomNodeComponent, arePropsEqual);