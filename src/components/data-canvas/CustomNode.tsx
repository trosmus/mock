import React, { useState, useMemo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Database, Filter, Hash, Code, BarChart3, FileText, Workflow, TrendingUp, Folder, FolderOpen, Play, Settings, Eye, X, Minus } from 'lucide-react';
import { useCanvasStore } from '../../state/canvasStore';
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
        folderColor: '#3b82f6',
        accentColor: '#1e40af'
      };
    case 'filter':
      return {
        icon: Filter,
        folderColor: '#10b981',
        accentColor: '#047857'
      };
    case 'field':
      return {
        icon: Hash,
        folderColor: '#f59e0b',
        accentColor: '#d97706'
      };
    case 'sql':
      return {
        icon: Code,
        folderColor: '#6366f1',
        accentColor: '#4338ca'
      };
    case 'visualization':
      return {
        icon: BarChart3,
        folderColor: '#ec4899',
        accentColor: '#be185d'
      };
    case 'narrative':
      return {
        icon: FileText,
        folderColor: '#22c55e',
        accentColor: '#15803d'
      };
    case 'workflow':
      return {
        icon: Workflow,
        folderColor: '#ef4444',
        accentColor: '#dc2626'
      };
    case 'data-series':
      return {
        icon: TrendingUp,
        folderColor: '#0ea5e9',
        accentColor: '#0284c7'
      };
    default:
      return {
        icon: Database,
        folderColor: '#64748b',
        accentColor: '#475569'
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

// Helper function to get file-specific config for content display
const getFileConfig = (type: string) => {
  switch (type) {
    case 'dataset':
      return {
        icon: Database,
        fileColor: '#4a90e2',
        extension: 'DATA'
      };
    case 'filter':
      return {
        icon: Filter,
        fileColor: '#50c878',
        extension: 'FLT'
      };
    case 'field':
      return {
        icon: Hash,
        fileColor: '#ffa500',
        extension: 'FLD'
      };
    case 'sql':
      return {
        icon: Code,
        fileColor: '#7c3aed',
        extension: 'SQL'
      };
    case 'visualization':
      return {
        icon: BarChart3,
        fileColor: '#e91e63',
        extension: 'VIZ'
      };
    case 'narrative':
      return {
        icon: FileText,
        fileColor: '#4caf50',
        extension: 'TXT'
      };
    case 'workflow':
      return {
        icon: Workflow,
        fileColor: '#f44336',
        extension: 'WFL'
      };
    case 'data-series':
      return {
        icon: TrendingUp,
        fileColor: '#2196f3',
        extension: 'DAT'
      };
    default:
      return {
        icon: Database,
        fileColor: '#9e9e9e',
        extension: 'FILE'
      };
  }
};

// Helper function to create file icon component
const createFileIcon = (type: string, name: string, size: 'small' | 'large' = 'small') => {
  const fileConfig = getFileConfig(type);
  const IconComponent = fileConfig.icon;
  const isSmall = size === 'small';

  return (
    <div
      style={{
        position: 'relative',
        width: isSmall ? '20px' : '32px',
        height: isSmall ? '25px' : '40px',
        margin: isSmall ? '0 auto 4px auto' : '0 auto 8px auto',
      }}
      title={name}
    >
      {/* Main document body */}
      <div
        style={{
          position: 'absolute',
          width: isSmall ? '20px' : '32px',
          height: isSmall ? '25px' : '40px',
          background: `linear-gradient(135deg, ${fileConfig.fileColor} 0%, ${fileConfig.fileColor}dd 100%)`,
          borderRadius: isSmall ? '2px' : '3px',
          boxShadow: isSmall
            ? '0 1px 4px rgba(0, 0, 0, 0.15), 0 0.5px 2px rgba(0, 0, 0, 0.2)'
            : '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Folded corner */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: isSmall ? '5px' : '8px',
          height: isSmall ? '5px' : '8px',
          background: `linear-gradient(225deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          borderBottomLeftRadius: isSmall ? '1px' : '2px',
        }}
      />

      {/* Small category icon overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: isSmall ? '2px' : '3px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isSmall ? '8px' : '14px',
          height: isSmall ? '8px' : '14px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: isSmall ? '1px' : '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        }}
      >
        <IconComponent
          size={isSmall ? 4 : 8}
          color={fileConfig.fileColor}
          strokeWidth={2.5}
        />
      </div>

      {/* File extension badge */}
      <div
        style={{
          position: 'absolute',
          bottom: isSmall ? '-4px' : '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: isSmall ? '5px' : '7px',
          fontWeight: '700',
          color: '#666',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: isSmall ? '0.5px 2px' : '1px 3px',
          borderRadius: '2px',
          border: '0.5px solid #ccc',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          letterSpacing: '0.3px',
        }}
      >
        {fileConfig.extension}
      </div>
    </div>
  );
};

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
      combinedBlocks: data.combinedBlocks,
      isAgent: data.isAgent || false
    };
  }, [data.id, data.label, data.description, data.prompt, data.blockType, data.category, data.combinedBlocks, data.isAgent]);

  // Node status state (you can move this to your store later)
  const [nodeStatus, setNodeStatus] = useState<'unsynced' | 'syncing' | 'synced' | 'error'>('unsynced');
  const [showConfigPopover, setShowConfigPopover] = useState(false);

  // Action button handlers
  const handleRun = () => {
    console.log('🏃 handleRun called for:', data.id);
    setNodeStatus('syncing');
    console.log('Running node:', data.id);
    
    // Add insight about starting the run
    const { addInsight } = useCanvasStore.getState();
    addInsight({
      content: `Started processing ${stableData.label}. The node will turn to its category color once syncing is complete.`,
      nodeId: String(data.id)
    });
    
    // Simulate async operation with proper status progression
    setTimeout(() => {
      setNodeStatus('synced');
      // Add insight about completion
      addInsight({
        content: `Successfully synced ${stableData.label}. The node is now ready and displays its category color.`,
        nodeId: String(data.id)
      });
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

  const handleMinimize = () => {
    console.log('📦 handleMinimize called for:', data.id);
    // Dispatch custom event to handle minimization in GraphCanvas
    const minimizeEvent = new CustomEvent('minimizeNode', {
      detail: { nodeId: String(data.id) }
    });
    window.dispatchEvent(minimizeEvent);
  };

  const handleClose = () => {
    console.log('❌ handleClose called for:', data.id);
    // Dispatch custom event to handle removal in GraphCanvas
    const removeEvent = new CustomEvent('removeNode', {
      detail: { nodeId: String(data.id) }
    });
    window.dispatchEvent(removeEvent);
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
        case 'dataset': return { folderColor: '#3b82f6' };
        case 'filter': return { folderColor: '#10b981' };
        case 'field': return { folderColor: '#f59e0b' };
        case 'sql': return { folderColor: '#6366f1' };
        case 'visualization': return { folderColor: '#ec4899' };
        case 'narrative': return { folderColor: '#22c55e' };
        case 'workflow': return { folderColor: '#ef4444' };
        default: return { folderColor: '#64748b' };
      }
    });

    // Extract hex colors from folder colors
    const hexColors = configs.map(config => config.folderColor);

    // Blend the colors
    const blendedColor = blendHexColors(hexColors);

    return {
      icon: getCategoryConfig.icon, // Keep original icon
      folderColor: blendedColor,
      accentColor: blendedColor
    };
  }, [isCombined, combinedBlocks, getCategoryConfig, stableData.blockType, stableData.category, currentNodeId]);

  // Get the appropriate config (blended for combined, original for single) with sync status
  const nodeConfig = useMemo(() => {
    console.log(`⚙️ [${currentNodeId}] nodeConfig memoization recalculated`);
    const baseConfig = isCombined ? blendColors : getCategoryConfig;
    
    // If node is not synced, use grey colors
    if (nodeStatus === 'unsynced') {
      return {
        icon: baseConfig.icon,
        folderColor: '#9ca3af', // Grey color for unsynced
        accentColor: '#6b7280'
      };
    }
    
    // If syncing, use a slightly darker grey
    if (nodeStatus === 'syncing') {
      return {
        icon: baseConfig.icon,
        folderColor: '#6b7280', // Darker grey for syncing
        accentColor: '#4b5563'
      };
    }
    
    // If synced or error, use the original colors
    return baseConfig;
  }, [isCombined, blendColors, getCategoryConfig, currentNodeId, nodeStatus]);

  // Calculate how many items are inside the folder
  const itemCount = isCombined ? 1 + combinedBlocks.length : 1;

  return (
    <div
      className="custom-node"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        minWidth: '300px',
        minHeight: '140px',
        width: '100%',
        height: '100%',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        cursor: 'pointer',
      }}
    >
      {/* NodeResizer for resize functionality */}
      <NodeResizer
        minWidth={160}
        minHeight={120}
        isVisible={isSelected}
        color="transparent"
        handleStyle={{
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0',
          width: '20px',
          height: '20px',
          opacity: 0,
        }}
        lineStyle={{
          borderColor: 'transparent',
          borderWidth: '0px',
          borderStyle: 'none',
        }}
      />

      {/* Connection handles - hidden for simplified experience but kept for functionality */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      {/* macOS Finder Directory Style Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: isSelected
            ? `linear-gradient(135deg, ${nodeConfig.folderColor}15 0%, ${nodeConfig.folderColor}25 100%)`
            : `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
          border: isSelected
            ? `3px solid ${nodeConfig.folderColor}`
            : nodeStatus === 'syncing' 
              ? '2px solid rgba(59, 130, 246, 0.6)'
              : '2px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: isSelected
            ? `0 12px 32px ${nodeConfig.folderColor}25, 0 4px 16px rgba(0, 0, 0, 0.1)`
            : nodeStatus === 'syncing'
              ? '0 8px 24px rgba(59, 130, 246, 0.15), 0 2px 8px rgba(59, 130, 246, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          // Add shimmer effect when syncing
          ...(nodeStatus === 'syncing' && {
            background: 'linear-gradient(90deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.55) 50%, transparent 55%, transparent 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6) 50%, transparent)',
              animation: 'shimmer 1.5s infinite',
              zIndex: 1,
            }
          })
        }}
      >
        {/* Shimmer overlay for syncing state */}
        {nodeStatus === 'syncing' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.55) 50%, transparent 55%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
              borderRadius: '16px',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Header with Folder Icon, Title, and Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderBottom: `1px solid ${isSelected ? `${nodeConfig.folderColor}30` : '#e2e8f0'}`,
            background: isSelected 
              ? `linear-gradient(135deg, ${nodeConfig.folderColor}08 0%, ${nodeConfig.folderColor}12 100%)`
              : 'linear-gradient(135deg, #ffffff80 0%, #f8fafc80 100%)',
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
            minHeight: '48px',
            position: 'relative',
            zIndex: 2, // Above shimmer overlay
          }}
        >
          {/* Folder Icon or Agent Icon */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {stableData.isAgent ? (
              // Agent Icon - Circular with category color
              <div
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  background: `linear-gradient(135deg, ${nodeConfig.folderColor} 0%, ${nodeConfig.folderColor}dd 100%)`,
                  borderRadius: '50%',
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px ${nodeConfig.folderColor}30`,
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Main agent icon */}
                <IconComponent
                  size={16}
                  color="white"
                  strokeWidth={2}
                />
                
                {/* AI indicator badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-3px',
                    right: '-3px',
                    width: '14px',
                    height: '14px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '50%',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <svg
                    width="6"
                    height="6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
              </div>
            ) : (
              // Directory Icon - Folder with category overlay
              <>
                {isSelected ? (
                  <FolderOpen 
                    size={24} 
                    color={nodeConfig.folderColor}
                    strokeWidth={1.5}
                    style={{
                      filter: `drop-shadow(0 1px 4px ${nodeConfig.folderColor}40)`,
                    }}
                  />
                ) : (
                  <Folder 
                    size={24} 
                    color={nodeConfig.folderColor}
                    strokeWidth={1.5}
                    style={{
                      filter: `drop-shadow(0 1px 4px ${nodeConfig.folderColor}40)`,
                    }}
                  />
                )}
                
                {/* Small category icon overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: 'white',
                    borderRadius: '50%',
                    padding: '2px',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
                    border: `1px solid ${nodeConfig.folderColor}`,
                  }}
                >
                  <IconComponent
                    size={8}
                    color={nodeConfig.folderColor}
                    strokeWidth={2}
                  />
                </div>
              </>
            )}
          </div>

          {/* Title and Item Count */}
          <div
            style={{
              flex: 1,
              minWidth: 0, // Allow text to shrink
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isCombined ? (
                String(stableData.label || '').replace(' Block', '')
              ) : (
                String(stableData.label || '').replace(' Block', '')
              )}
              
              {/* Agent indicator - only show for non-agent nodes that have agent functionality */}
              {stableData.isAgent && false && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    flexShrink: 0,
                  }}
                  title="AI Agent"
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div
              style={{
                fontSize: '10px',
                color: '#64748b',
                fontWeight: '500',
                marginTop: '1px',
              }}
            >
              {stableData.isAgent ? (
                `${itemCount} file${itemCount !== 1 ? 's' : ''} • AI Agent`
              ) : (
                `${itemCount} item${itemCount !== 1 ? 's' : ''}`
              )}
            </div>
          </div>

          {/* Directory Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            {/* Run Button */}
            <button
              onClick={handleRun}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #10b981',
                background: nodeStatus === 'syncing' ? '#10b981' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                padding: '0',
                margin: '0',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = nodeStatus === 'syncing' ? '#10b981' : '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', nodeStatus === 'syncing' ? 'white' : '#10b981');
              }}
              title="Run workflow"
            >
              <Play 
                size={10} 
                color={nodeStatus === 'syncing' ? 'white' : '#10b981'}
                strokeWidth={2}
                style={{ marginLeft: '1px' }}
              />
            </button>

            {/* Configure Button */}
            <button
              onClick={handleConfigure}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #6366f1',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                padding: '0',
                margin: '0',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6366f1';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', '#6366f1');
              }}
              title="Configure settings"
            >
              <Settings 
                size={10} 
                color="#6366f1"
                strokeWidth={2}
              />
            </button>

            {/* Preview Button */}
            <button
              onClick={handlePreview}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #f59e0b',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                padding: '0',
                margin: '0',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f59e0b';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', '#f59e0b');
              }}
              title="Preview data"
            >
              <Eye 
                size={10} 
                color="#f59e0b"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'linear-gradient(180deg, transparent 0%, #cbd5e1 20%, #cbd5e1 80%, transparent 100%)',
              marginLeft: '2px',
              marginRight: '2px',
              flexShrink: 0,
            }}
          />

          {/* Window Control Buttons (Far Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            {/* Minimize Button */}
            <button
              onClick={handleMinimize}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #f59e0b',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                padding: '0',
                margin: '0',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f59e0b';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', '#f59e0b');
              }}
              title="Minimize directory"
            >
              <Minus 
                size={10} 
                color="#f59e0b"
                strokeWidth={2}
              />
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid #ef4444',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                padding: '0',
                margin: '0',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) icon.setAttribute('stroke', '#ef4444');
              }}
              title="Close directory"
            >
              <X 
                size={10}
                color="#ef4444"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Content Area with Grid Layout */}
        <div
          style={{
            flex: 1,
            padding: '12px',
            display: 'flex',
            alignItems: isCombined ? 'flex-start' : 'center',
            justifyContent: isCombined ? 'flex-start' : 'center',
            minHeight: 0, // Allow content to shrink
            position: 'relative',
            zIndex: 2, // Above shimmer overlay
          }}
        >
          {/* For agent nodes: show single content if 1 block, grid if 2+ blocks */}
          {/* For non-agent nodes: show grid if any combinedBlocks */}
          {(isCombined && combinedBlocks.length > 0 && (!stableData.isAgent || combinedBlocks.length > 1)) ? (
            // Grid layout for combined blocks as files
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                gap: '8px',
                width: '100%',
                alignItems: 'start',
                justifyItems: 'center',
              }}
            >
              {/* For non-agent nodes, show original block as file */}
              {!stableData.isAgent && (
                <div
                  style={{
                    width: '50px',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {createFileIcon(
                    String(stableData.blockType || stableData.category || 'default'),
                    String(stableData.label || '').replace(' Block', ''),
                    'small'
                  )}
                  <div
                    style={{
                      fontSize: '8px',
                      fontWeight: '500',
                      color: '#1d1d1f',
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '1px',
                    }}
                  >
                    {String(stableData.label || '').replace(' Block', '').replace(/\s+/g, '_').substring(0, 8)}
                  </div>
                  <div
                    style={{
                      fontSize: '6px',
                      color: '#a1a1a6',
                      fontWeight: '400',
                    }}
                  >
                    {String(stableData.blockType || stableData.category || 'file').replace('-', ' ')}
                  </div>
                </div>
              )}

              {/* Show combined blocks as files */}
              {combinedBlocks.slice(0, stableData.isAgent ? 12 : 11).map((block: any, index: number) => (
                <div
                  key={index}
                  style={{
                    width: '50px',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {createFileIcon(
                    String(block.type || 'default'),
                    String(block.name || 'Unknown Block'),
                    'small'
                  )}
                  <div
                    style={{
                      fontSize: '8px',
                      fontWeight: '500',
                      color: '#1d1d1f',
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '1px',
                    }}
                  >
                    {String(block.name || 'Unknown').replace(' Block', '').replace(/\s+/g, '_').substring(0, 8)}
                  </div>
                  <div
                    style={{
                      fontSize: '6px',
                      color: '#a1a1a6',
                      fontWeight: '400',
                    }}
                  >
                    {String(block.type || 'file').replace('-', ' ')}
                  </div>
                </div>
              ))}

              {/* Show overflow indicator as a special file */}
              {combinedBlocks.length > (stableData.isAgent ? 12 : 11) && (
                <div
                  style={{
                    width: '50px',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '20px',
                      height: '25px',
                      margin: '0 auto 4px auto',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      fontWeight: '600',
                      color: '#64748b',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
                    }}
                    title={`+${combinedBlocks.length - (stableData.isAgent ? 12 : 11)} more files`}
                  >
                    +{combinedBlocks.length - (stableData.isAgent ? 12 : 11)}
                  </div>
                  <div
                    style={{
                      fontSize: '8px',
                      fontWeight: '500',
                      color: '#1d1d1f',
                      lineHeight: '1.2',
                    }}
                  >
                    more...
                  </div>
                  <div
                    style={{
                      fontSize: '6px',
                      color: '#a1a1a6',
                      fontWeight: '400',
                    }}
                  >
                    files
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Single block display
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
                maxWidth: '100%',
              }}
            >
              {stableData.isAgent && combinedBlocks.length === 0 ? (
                // Agent drop zone when no files
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px',
                    border: '2px dashed rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.05)',
                    width: '100%',
                    minHeight: '60px',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(139, 92, 246, 0.8)',
                      fontWeight: '500',
                    }}
                  >
                    Drop files here to process
                  </div>
                </div>
              ) : stableData.isAgent && combinedBlocks.length === 1 ? (
                // Agent with single file - show as large file icon
                <>
                  {createFileIcon(
                    String(combinedBlocks[0].type || 'default'),
                    String(combinedBlocks[0].name || 'Unknown Block'),
                    'large'
                  )}

                  <div
                    style={{
                      fontSize: '10px',
                      color: '#64748b',
                      lineHeight: '1.3',
                      maxWidth: '140px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {String(combinedBlocks[0].description || combinedBlocks[0].name || 'File ready for processing')}
                  </div>
                </>
              ) : (
                // Regular file icon for non-agents or when no description
                <>
                  {createFileIcon(
                    String(stableData.blockType || stableData.category || 'default'),
                    String(stableData.label || '').replace(' Block', ''),
                    'large'
                  )}

                  {stableData.description && (
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#64748b',
                        lineHeight: '1.3',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {String(stableData.description)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
              border: `2px solid ${nodeConfig.folderColor}`,
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
                background: `linear-gradient(135deg, ${nodeConfig.folderColor}10 0%, ${nodeConfig.folderColor}20 100%)`,
                p: 1.5,
                borderBottom: `1px solid ${nodeConfig.folderColor}30`,
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
                    borderColor: nodeConfig.folderColor,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.folderColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: nodeConfig.folderColor,
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
                    borderColor: nodeConfig.folderColor,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: nodeConfig.folderColor,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: nodeConfig.folderColor,
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
                    backgroundColor: nodeConfig.folderColor,
                    '&:hover': {
                      backgroundColor: nodeConfig.folderColor,
                      opacity: 0.9,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 8px ${nodeConfig.folderColor}30`,
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
