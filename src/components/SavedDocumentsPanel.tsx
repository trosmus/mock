import React from 'react';
import { ChevronLeft, FileText, BarChart3, Database, MessageSquare, Calendar, Tag, Trash2, Eye } from 'lucide-react';
import { useSavedDocumentsStore } from '../stores/useSavedDocumentsStore';
import type { SavedDocument } from '../stores/useSavedDocumentsStore';

interface SavedDocumentsPanelProps {
  className?: string;
  currentPageType?: 'dashboard' | 'query' | 'chart' | 'analysis';
  onDocumentSelect?: (document: SavedDocument) => void;
}

const SavedDocumentsPanel: React.FC<SavedDocumentsPanelProps> = ({ 
  className = '', 
  currentPageType,
  onDocumentSelect 
}) => {
  const { documents, isExpanded, toggleExpanded, removeDocument } = useSavedDocumentsStore();

  const getDocumentIcon = (type: SavedDocument['type']) => {
    switch (type) {
      case 'dashboard': return BarChart3;
      case 'query': return Database;
      case 'chart': return BarChart3;
      case 'analysis': return MessageSquare;
      default: return FileText;
    }
  };

  const getTypeColor = (type: SavedDocument['type']) => {
    switch (type) {
      case 'dashboard': return 'text-blue-600 bg-blue-50';
      case 'query': return 'text-green-600 bg-green-50';
      case 'chart': return 'text-purple-600 bg-purple-50';
      case 'analysis': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPageTitle = (type?: string) => {
    switch (type) {
      case 'dashboard': return 'Saved Dashboards';
      case 'query': return 'Saved Queries';
      case 'chart': return 'Saved Visualizations';
      case 'analysis': return 'Saved Analysis';
      default: return 'Saved Documents';
    }
  };

  // Filter documents by current page type
  const filteredDocuments = currentPageType 
    ? documents.filter(doc => doc.type === currentPageType)
    : documents;

  const handleDocumentClick = (document: SavedDocument) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  if (!isExpanded) {
    return (
      <div className={`w-12 bg-white border-r border-gray-200 flex flex-col ${className}`}>
        <button
          onClick={toggleExpanded}
          className="p-3 hover:bg-gray-50 transition-colors"
          style={{ border: 'none' }}
          title="Expand Saved Documents"
        >
          <FileText size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
            Saved
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900 text-sm">{getPageTitle(currentPageType)}</h3>
          </div>
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-gray-100 transition-colors"
            title="Collapse Panel"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No {currentPageType ? currentPageType + 's' : 'documents'} found</p>
            <p className="text-xs text-gray-400 mt-1">Create your first {currentPageType || 'document'} to see it here</p>
          </div>
        ) : (
          filteredDocuments.map((document) => {
            const Icon = getDocumentIcon(document.type);
            const typeColor = getTypeColor(document.type);
            
            return (
              <div
                key={document.id}
                className="group p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer hover:border-blue-200"
                onClick={() => handleDocumentClick(document)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${typeColor} flex-shrink-0`}>
                    <Icon size={14} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {document.title}
                      </h4>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDocumentClick(document);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View Document"
                        >
                          <Eye size={12} className="text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDocument(document.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete Document"
                        >
                          <Trash2 size={12} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {document.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {document.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={10} />
                        {document.updatedAt.toLocaleDateString()}
                      </div>
                      
                      {document.tags && document.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {document.tags.slice(0, 2).join(', ')}
                            {document.tags.length > 2 && '...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {filteredDocuments.length} {currentPageType ? currentPageType + (filteredDocuments.length === 1 ? '' : 's') : 'documents'}
        </p>
      </div>
    </div>
  );
};

export default SavedDocumentsPanel; 