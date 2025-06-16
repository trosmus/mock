import React from 'react';
import { Download, BarChart3, Table as TableIcon } from 'lucide-react';
import type { QueryResult } from '../types/index';
import UseForQuickAnalysisButton from './UseForQuickAnalysisButton';

interface ResultsTableProps {
  result: QueryResult;
  onCreateChart?: () => void;
  className?: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ result, onCreateChart, className = '' }) => {
  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      result.columns.join(','),
      ...result.data.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pastel-green to-green-100 rounded-xl">
            <TableIcon size={20} className="text-green-800" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Query Results</h3>
            <p className="text-sm text-gray-500">{result.totalRows} rows returned</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <UseForQuickAnalysisButton 
            context="Query Results"
            size="sm"
          />
          {onCreateChart && (
            <button
              onClick={onCreateChart}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-soft transition-all duration-200 text-sm"
            >
              <BarChart3 size={16} />
              Turn into Chart
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download CSV"
          >
            <Download size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {result.columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {result.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {typeof cell === 'number' ? (
                      // Format numbers nicely
                      cell.toLocaleString()
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {result.data.length} of {result.totalRows} rows</span>
          <span>{result.columns.length} columns</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable; 