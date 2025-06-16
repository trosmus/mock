import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Type, 
  Heading1, 
  Save, 
  Eye, 
  Download, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useChatContextStore } from '../stores/useChatContextStore';

const RibbonBar: React.FC = () => {
  const navigate = useNavigate();
  const { addWidget } = useAppStore();
  const { addContext } = useChatContextStore();

  const handleAddChart = () => {
    navigate('/builder');
  };

  const handleAddText = () => {
    const widget = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      title: 'New Text Block',
      content: 'Click to edit this text block...',
      dataframeId: 'none',
      x: 0,
      y: 0,
      w: 6,
      h: 2
    };
    addWidget(widget);
    navigate('/dashboards');
  };

  const handleAddHeading = () => {
    const widget = {
      id: `heading-${Date.now()}`,
      type: 'heading' as const,
      title: 'New Section',
      content: 'Section Heading',
      dataframeId: 'none',
      x: 0,
      y: 0,
      w: 12,
      h: 1
    };
    addWidget(widget);
    navigate('/dashboards');
  };

  const handleQuickAnalysis = () => {
    addContext({
      source: 'manual',
      description: 'Quick analysis from ribbon'
    });
    navigate('/chat');
  };

  const ribbonButtons = [
    { 
      icon: BarChart3, 
      label: 'Chart', 
      onClick: handleAddChart,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    },
    { 
      icon: Type, 
      label: 'Text', 
      onClick: handleAddText,
      color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    },
    { 
      icon: Heading1, 
      label: 'Heading', 
      onClick: handleAddHeading,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    },
    { 
      icon: Sparkles, 
      label: 'Quick Analysis', 
      onClick: handleQuickAnalysis,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    },
  ];

  const utilityButtons = [
    { icon: Save, label: 'Save', onClick: () => console.log('Save') },
    { icon: Eye, label: 'Preview', onClick: () => console.log('Preview') },
    { icon: Download, label: 'Export', onClick: () => console.log('Export') },
    { icon: RotateCcw, label: 'Reset', onClick: () => console.log('Reset') },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - Add buttons */}
        <div className="flex items-center gap-1">
          {ribbonButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={button.onClick}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200
                  ${button.color}
                `}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{button.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center - App Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">DataAgent</h1>
        </div>

        {/* Right side - Utility buttons */}
        <div className="flex items-center gap-1">
          {utilityButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={button.onClick}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Icon size={16} />
                <span className="text-xs font-medium">{button.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RibbonBar; 