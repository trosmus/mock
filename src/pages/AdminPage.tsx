import React, { useState } from 'react';
import { Database, Clock, Activity, Users, FileText } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

const AdminPage: React.FC = () => {
  const { datasets, chatMessages } = useAppStore();
  const [activeTab, setActiveTab] = useState('datasets');

  const tabs = [
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'history', label: 'Chat History', icon: Clock },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  const mockLogs = [
    { id: 1, timestamp: '2024-01-20 10:30:25', level: 'INFO', message: 'Query executed successfully', user: 'admin@example.com' },
    { id: 2, timestamp: '2024-01-20 10:29:15', level: 'INFO', message: 'Widget added to dashboard', user: 'user@example.com' },
    { id: 3, timestamp: '2024-01-20 10:28:45', level: 'WARNING', message: 'Long-running query detected', user: 'analyst@example.com' },
    { id: 4, timestamp: '2024-01-20 10:25:12', level: 'INFO', message: 'User login successful', user: 'admin@example.com' },
  ];

  return (
    <div className="h-full w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage datasets, monitor usage, and view system logs</p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-blue-800" />
              <div>
                <div className="text-2xl font-bold text-blue-800">{datasets.length}</div>
                <div className="text-sm text-blue-600">Datasets</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-purple-800" />
              <div>
                <div className="text-2xl font-bold text-purple-800">{chatMessages.length}</div>
                <div className="text-sm text-purple-600">Messages</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 min-w-[120px]">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-green-800" />
              <div>
                <div className="text-2xl font-bold text-green-800">3</div>
                <div className="text-sm text-green-600">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'datasets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Dataset Management</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
                  Add Dataset
                </button>
              </div>
              
              <div className="grid gap-4">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-soft transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                          <Database size={20} className="text-blue-800" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{dataset.name}</h4>
                          <p className="text-sm text-gray-500">{dataset.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {dataset.tables.length} tables
                        </div>
                        <div className="text-xs text-gray-500">
                          Updated {dataset.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {dataset.tables.map((table) => (
                        <span key={table.name} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                          {table.name} ({table.rowCount.toLocaleString()} rows)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
              
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${
                        message.type === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-r from-purple-50 to-pink-50'
                      }`}>
                        {message.type === 'user' 
                          ? <Users size={16} className="text-white" />
                          : <Activity size={16} className="text-purple-800" />
                        }
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {message.type === 'user' ? 'User' : 'AI Assistant'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700">{message.content}</p>
                        
                        {message.sql && (
                          <div className="mt-2 p-2 bg-gray-900 rounded-lg">
                            <code className="text-xs text-green-400 font-mono">{message.sql}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{log.timestamp}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                            log.level === 'INFO' 
                              ? 'bg-blue-100 text-blue-800'
                              : log.level === 'WARNING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.message}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{log.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 