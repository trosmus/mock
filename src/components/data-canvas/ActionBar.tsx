import React, { useEffect } from 'react';
import { Play, Settings, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ActionButton from './ActionButton';

// Add CSS keyframes for spinning and shimmer animations
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes statusShimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

interface ActionBarProps {
  nodeId: string;
  status: 'unsynced' | 'syncing' | 'synced' | 'error';
  nodeColor: string;
  onRun: () => void;
  onConfigure: () => void;
  onPreview: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  nodeId,
  status,
  nodeColor,
  onRun,
  onConfigure,
  onPreview
}) => {
  console.log(`🎛️ [${nodeId}] ActionBar render - status: ${status}`);
  
  // Inject styles only once
  useEffect(() => {
    console.log(`💉 [${nodeId}] ActionBar styles injection effect`);
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = spinKeyframes;
      styleElement.id = 'action-bar-styles';
      
      // Only add if not already present
      if (!document.getElementById('action-bar-styles')) {
        document.head.appendChild(styleElement);
      }
      
      return () => {
        const existingStyle = document.getElementById('action-bar-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [nodeId]);

  // Get status configuration
  const getStatusConfig = (status: string) => {
    console.log(`⚙️ [${nodeId}] getStatusConfig called for status: ${status}`);
    switch (status) {
      case 'unsynced':
        return { 
          icon: Clock, 
          color: '#f59e0b', 
          bgColor: '#fef3c7',
          label: 'Unsynced'
        };
      case 'syncing':
        return { 
          icon: Clock, 
          color: '#3b82f6', 
          bgColor: '#dbeafe',
          label: 'Syncing'
        };
      case 'synced':
        return { 
          icon: CheckCircle, 
          color: '#10b981', 
          bgColor: '#dcfce7',
          label: 'Synced'
        };
      case 'error':
        return { 
          icon: AlertCircle, 
          color: '#ef4444', 
          bgColor: '#fef2f2',
          label: 'Error'
        };
      default:
        return { 
          icon: Clock, 
          color: '#64748b', 
          bgColor: '#f1f5f9',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '3px',
      transition: 'all 0.3s ease',
      zIndex: 10
    }}>
      {/* Status indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '25px',
          height: '25px',
          marginBottom: '4px',
          borderRadius: '4px',
          background: status === 'syncing' ? 
            'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)' :
            statusConfig.color,
          border: status === 'syncing' ?
            '1.5px solid #cbd5e1' :
            `1.5px solid ${statusConfig.color}`,
          transition: status === 'syncing' ? 'none' : 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          backgroundSize: status === 'syncing' ? '200% 100%' : 'auto',
          animation: status === 'syncing' ? 'statusShimmer 2s ease-in-out infinite' : 'none',
        }}
        title={statusConfig.label}
      >
        <StatusIcon
          size={11}
          color={status === 'syncing' ? '#94a3b8' : 'white'}
          strokeWidth={2.5}
          style={{
            animation: status === 'syncing' ? 'spin 1s linear infinite' : 'none',
            zIndex: 1,
            position: 'relative',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>

      {/* Action buttons - with opacity 0.5 by default */}
      <div style={{ opacity: 0.5, transition: 'opacity 0.3s ease' }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
        <ActionButton
          icon={Play}
          color="#10b981"
          onClick={onRun}
          tooltip="Run workflow"
          size="small"
        />
      </div>

      <div style={{ opacity: 0.5, transition: 'opacity 0.3s ease' }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
        <ActionButton
          icon={Settings}
          color="#6366f1"
          onClick={onConfigure}
          tooltip="Configure settings"
          size="small"
        />
      </div>

      <div style={{ opacity: 0.5, transition: 'opacity 0.3s ease' }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
        <ActionButton
          icon={Eye}
          color="#f59e0b"
          onClick={onPreview}
          tooltip="Preview data"
          size="small"
        />
      </div>
    </div>
  );
};

export default ActionBar;
