import React from 'react';
import { Play, Download, Save, Copy } from 'lucide-react';
import { useSQLStore } from '../stores/useSQLStore';

interface SQLEditorProps {
  className?: string;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ className = '' }) => {
  const { 
    currentSQL, 
    setCurrentSQL, 
    queryResult, 
    isExecuting, 
    executeSQL 
  } = useSQLStore();

  // SQL keyword tags
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 
    'COUNT(*)', 'AND', 'OR', 'LIMIT'
  ];

  const handleExecuteSQL = async () => {
    if (!currentSQL.trim()) return;
    await executeSQL();
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(currentSQL);
  };

  const handleSaveSQL = () => {
    // In a real app, this would save to backend
    console.log('Saving SQL:', currentSQL);
  };

  // Handle drag over for variables
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const variable = JSON.parse(e.dataTransfer.getData('application/json'));
      const variableText = `${variable.tableName}.${variable.name}`;
      
      // Insert at cursor position or append
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;
      const newSQL = 
        currentSQL.slice(0, cursorPosition) + 
        variableText + 
        currentSQL.slice(cursorPosition);
      
      setCurrentSQL(newSQL);
    } catch (error) {
      console.error('Failed to parse dropped variable:', error);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    // Get the textarea element
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart || currentSQL.length;
    const beforeCursor = currentSQL.slice(0, cursorPosition);
    const afterCursor = currentSQL.slice(cursorPosition);
    
    // Add space before keyword if needed
    const needsSpaceBefore = beforeCursor.length > 0 && !beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n');
    const spaceBefore = needsSpaceBefore ? ' ' : '';
    
    // Add space after keyword
    const spaceAfter = ' ';
    
    const newSQL = beforeCursor + spaceBefore + keyword + spaceAfter + afterCursor;
    setCurrentSQL(newSQL);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = cursorPosition + spaceBefore.length + keyword.length + spaceAfter.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 10);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">SQL Editor</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySQL}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy SQL"
          >
            <Copy size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleSaveSQL}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Save SQL"
          >
            <Save size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleExecuteSQL}
            disabled={!currentSQL.trim() || isExecuting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} />
            {isExecuting ? 'Executing...' : 'Execute'}
          </button>
        </div>
      </div>

      {/* SQL Keywords Tags */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="text-xs text-gray-600 mb-2 font-medium">SQL Keywords:</div>
        <div className="flex flex-wrap gap-2">
          {sqlKeywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => handleKeywordClick(keyword)}
              disabled={isExecuting}
              className="px-2 py-1 text-xs bg-white hover:bg-blue-50 text-gray-700 border border-gray-300 hover:border-blue-300 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor */}
      <div className="relative">
        <textarea
          value={currentSQL}
          onChange={(e) => setCurrentSQL(e.target.value)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          placeholder="Enter your SQL query here...
          
-- Try dragging variables from the right panel
-- Or click SQL keywords above to insert them

SELECT 
  age_group, 
  diagnosis, 
  COUNT(*) as count
FROM patients p 
JOIN diagnoses d ON p.patient_id = d.patient_id 
GROUP BY age_group, diagnosis 
ORDER BY count DESC"
          className="w-full h-64 p-4 font-mono text-sm text-gray-900 bg-gray-50 border-none resize-none focus:outline-none focus:bg-white"
          style={{ fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}
        />
        
        {/* Line numbers (simplified) */}
        <div className="absolute left-0 top-0 p-4 text-gray-400 text-sm font-mono pointer-events-none">
          {currentSQL.split('\n').map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        {queryResult ? (
          <span>✓ Query executed successfully - {queryResult.totalRows} rows returned</span>
        ) : isExecuting ? (
          <span>⏳ Executing query...</span>
        ) : (
          <span>💡 Drag variables from the right panel, click keywords above, or type your SQL query</span>
        )}
      </div>
    </div>
  );
};

export default SQLEditor;