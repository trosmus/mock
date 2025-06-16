import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Settings,
  User,
  Plus,
  Play,
  Save,
  Download,
  RefreshCw,
  Search,
  Filter,
  Share2,
  Copy,
  Trash2,
  Brain
} from 'lucide-react';

const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'canvas', label: 'Desktop', path: '/canvas', icon: Brain },
    { id: 'workspaces', label: 'Workspaces', path: '/dashboards', icon: LayoutDashboard },
    { id: 'sql', label: 'SQL Sandbox', path: '/sql', icon: Database },
    { id: 'builder', label: 'Visualization Builder', path: '/chart-builder', icon: BarChart3 },
    { id: 'chat', label: 'Quick Analysis', path: '/chat', icon: MessageSquare },
  ];

  const rightTabs = [
    { id: 'admin', label: 'Admin Panel', path: '/admin', icon: Settings },
    { id: 'profile', label: 'Profile', path: '/profile', icon: User },
  ];

  const getActionsForTab = (path: string) => {
    switch (path) {
      case '/dashboards':
        return [
          { icon: Plus, label: 'New', description: 'Create new widget' },
          { icon: Save, label: 'Save', description: 'Save dashboard' },
          { icon: Share2, label: 'Share', description: 'Share dashboard' },
          { icon: Download, label: 'Export', description: 'Export dashboard' },
          { icon: RefreshCw, label: 'Refresh', description: 'Refresh data' },
        ];
      case '/sql':
        return [
          { icon: Play, label: 'Run', description: 'Execute query' },
          { icon: Save, label: 'Save', description: 'Save query' },
          { icon: Copy, label: 'Copy', description: 'Copy to clipboard' },
          { icon: Download, label: 'Export', description: 'Export results' },
          { icon: Search, label: 'Find', description: 'Find in query' },
        ];
      case '/chat':
        return [
          { icon: Plus, label: 'New Chat', description: 'Start new conversation' },
          { icon: Save, label: 'Save', description: 'Save conversation' },
          { icon: Download, label: 'Export', description: 'Export chat' },
          { icon: Trash2, label: 'Clear', description: 'Clear history' },
        ];
      case '/chart-builder':
        return [
          { icon: Plus, label: 'New Chart', description: 'Create new visualization' },
          { icon: Save, label: 'Save', description: 'Save visualization config' },
          { icon: Copy, label: 'Duplicate', description: 'Duplicate visualization' },
          { icon: Download, label: 'Export', description: 'Export visualization' },
          { icon: RefreshCw, label: 'Preview', description: 'Refresh preview' },
        ];
      case '/canvas':
        return [
          { icon: RefreshCw, label: 'Reset View', description: 'Reset graph view to fit all nodes' },
          { icon: Save, label: 'Save Layout', description: 'Save current graph layout' },
          { icon: Download, label: 'Export', description: 'Export graph as image' },
          { icon: Search, label: 'Find Node', description: 'Search for specific nodes' },
          { icon: Filter, label: 'Filter', description: 'Filter nodes and edges' },
        ];
      default:
        return [];
    }
  };

  const currentActions = getActionsForTab(location.pathname);

  return (
    <div className="bg-blue-50/30 border-b border-gray-200">
      {/* Tab Headers */}
      <div className="bg-blue-600 px-4 border-b border-blue-700">
        <nav className="flex justify-between items-center">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium min-w-fit bg-transparent border-none focus:outline-none hover:bg-transparent
                    ${isActive 
                      ? 'text-white border-b-2 border-white font-bold underline bg-blue-700 shadow-lg rounded-none font-weight-900' 
                      : 'text-blue-100'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Profile Button */}
          <div className="flex items-center space-x-1">
            {rightTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium min-w-fit bg-transparent border-none focus:outline-none hover:bg-transparent rounded-none
                    ${isActive 
                      ? 'text-white border-b-2 border-white font-bold underline bg-blue-700 shadow-lg rounded-none font-weight-900' 
                      : 'text-blue-100'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Action Ribbon */}
      <div className="bg-blue-50/20 px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {currentActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-100 border border-blue-200 focus:outline-none min-w-fit hover:bg-transparent"
                title={action.description}
              >
                <ActionIcon size={12} className="text-gray-600" />
                <span className="text-xs text-gray-700 font-medium">{action.label}</span>
              </button>
            );
          })}
          
          {currentActions.length === 0 && (
            <div className="text-sm text-gray-500 py-1">
              No actions available for this tab
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation; 