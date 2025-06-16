import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Database, 
  Hash, 
  Type, 
  Calendar, 
  CheckSquare,
  Key,
  Link,
  Search,
  ChevronLeft
} from 'lucide-react';
import { useVariablesStore, type Variable } from '../stores/useVariablesStore';

interface VariablesPanelProps {
  onVariableDrag?: (variable: Variable) => void;
  className?: string;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({ 
  onVariableDrag, 
  className = '' 
}) => {
  const { 
    variables, 
    isExpanded,
    toggleExpanded,
    addSelectedVariable, 
    selectedVariables 
  } = useVariablesStore();
  
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(['patients', 'diagnoses']));
  const [searchTerm, setSearchTerm] = useState('');

  // Group variables by table
  const tableGroups = variables.reduce((acc, variable) => {
    if (!acc[variable.tableName]) {
      acc[variable.tableName] = [];
    }
    acc[variable.tableName].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  // Filter variables by search term
  const filteredTableGroups = Object.entries(tableGroups).reduce((acc, [tableName, vars]) => {
    const filteredVars = vars.filter(variable => 
      variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tableName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredVars.length > 0) {
      acc[tableName] = filteredVars;
    }
    return acc;
  }, {} as Record<string, Variable[]>);

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getTypeIcon = (type: Variable['type']) => {
    switch (type) {
      case 'string': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'boolean': return CheckSquare;
      default: return Type;
    }
  };

  const getTypeColor = (type: Variable['type']) => {
    switch (type) {
      case 'string': return 'text-green-600 bg-green-50';
      case 'number': return 'text-blue-600 bg-blue-50';
      case 'date': return 'text-purple-600 bg-purple-50';
      case 'boolean': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDragStart = (e: React.DragEvent, variable: Variable) => {
    e.dataTransfer.setData('application/json', JSON.stringify(variable));
    if (onVariableDrag) {
      onVariableDrag(variable);
    }
  };

  const handleVariableClick = (variable: Variable) => {
    addSelectedVariable(variable);
  };

  // Collapsed state
  if (!isExpanded) {
    return (
      <div className={`w-12 bg-white border-l border-gray-200 flex flex-col ${className}`}>
        <button
          onClick={toggleExpanded}
          className="p-3 hover:bg-gray-50 transition-colors"
          style={{ border: 'none' }}
          title="Expand Variables"
        >
          <Database size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="text-xs text-gray-500 whitespace-nowrap" 
            style={{ 
              writingMode: 'vertical-rl', 
              textOrientation: 'mixed' 
            }}
          >
            Variables
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-white border-l border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Variables</h3>
          </div>
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-gray-100 transition-colors"
            title="Hide Variables Panel"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredTableGroups).map(([tableName, tableVariables]) => (
          <div key={tableName} className="border-b border-gray-100">
            {/* Table Header */}
            <button
              onClick={() => toggleTable(tableName)}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
            >
              {expandedTables.has(tableName) ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
              <Database size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900 capitalize">{tableName}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {tableVariables.length} fields
              </span>
            </button>

            {/* Variables */}
            {expandedTables.has(tableName) && (
              <div className="bg-gray-50">
                {tableVariables.map((variable) => {
                  const TypeIcon = getTypeIcon(variable.type);
                  const isSelected = selectedVariables.some(v => v.id === variable.id);
                  
                  return (
                    <div
                      key={variable.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, variable)}
                      onClick={() => handleVariableClick(variable)}
                      className={`
                        flex items-center gap-3 p-3 pl-8 hover:bg-white cursor-pointer transition-colors border-l-2
                        ${isSelected ? 'border-l-blue-500 bg-blue-50' : 'border-l-transparent'}
                      `}
                    >
                      {/* Type Icon */}
                      <div className={`p-1 rounded ${getTypeColor(variable.type)}`}>
                        <TypeIcon size={12} />
                      </div>
                      
                      {/* Variable Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900 truncate">
                            {variable.name}
                          </span>
                          {variable.isKey && (
                            <Key size={12} className="text-yellow-600" />
                          )}
                          {variable.isForeignKey && (
                            <Link size={12} className="text-purple-600" />
                          )}
                        </div>
                        {variable.description && (
                          <p className="text-xs text-gray-500 truncate" title={variable.description}>
                            {variable.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Variables */}
      {selectedVariables.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Selected ({selectedVariables.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {selectedVariables.slice(0, 3).map((variable) => (
              <span
                key={variable.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {variable.name}
              </span>
            ))}
            {selectedVariables.length > 3 && (
              <span className="text-xs text-gray-500">
                +{selectedVariables.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariablesPanel; 