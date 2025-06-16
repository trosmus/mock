import React from 'react';
import { Brain, Lightbulb, TrendingUp, Database, ArrowRight, Clock } from 'lucide-react';
import { useCanvasStore } from '../../state/canvasStore';

const AIContextPanel: React.FC = () => {
  const { 
    selectedNodeId, 
    selectedEdgeId, 
    insights, 
    currentInsight,
    setCurrentInsight 
  } = useCanvasStore();

  const selectedNode = selectedNodeId;
  const selectedEdge = selectedEdgeId;

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">AI Context</h2>
      </div>

      {/* Selection Info */}
      <div className="p-4 border-b border-gray-100">
        {selectedNode && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Database className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">Selected Entity</div>
              <div className="text-sm text-blue-700 capitalize">{selectedNode}</div>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <ArrowRight className="w-4 h-4 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">Selected Connection</div>
              <div className="text-sm text-purple-700">{selectedEdge}</div>
            </div>
          </div>
        )}

        {!selectedNode && !selectedEdge && (
          <div className="text-center p-6 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Click on a node or edge to see AI insights</p>
          </div>
        )}
      </div>

      {/* AI Suggestions Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Quick Insights */}
          {(selectedNode || selectedEdge) && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="font-medium text-green-900">Quick Insights</h3>
              </div>
              
              {selectedNode && (
                <div className="space-y-2 text-sm text-green-800">
                  <p>• Explore relationships from this entity</p>
                  <p>• Identify key patterns and correlations</p>
                  <p>• Generate data quality reports</p>
                  <p>• Create focused dashboards</p>
                </div>
              )}

              {selectedEdge && (
                <div className="space-y-2 text-sm text-green-800">
                  <p>• Analyze relationship strength</p>
                  <p>• Identify data flow patterns</p>
                  <p>• Suggest join optimizations</p>
                  <p>• Generate relationship reports</p>
                </div>
              )}
            </div>
          )}

          {/* Insight History */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Insights
            </h3>
            
            {insights.length === 0 ? (
              <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-sm">No insights generated yet</p>
                <p className="text-xs mt-1">Start exploring the graph to generate insights</p>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.slice(-5).reverse().map((insight) => (
                  <div 
                    key={insight.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setCurrentInsight(insight.content)}
                  >
                    <div className="text-sm text-gray-800 mb-1">
                      {insight.content}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>{formatTimestamp(insight.timestamp)}</span>
                      {insight.nodeId && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Node: {insight.nodeId}
                        </span>
                      )}
                      {insight.edgeId && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Edge: {insight.edgeId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Actions */}
          {(selectedNode || selectedEdge) && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Suggested Actions
              </h3>
              
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm bg-white rounded border border-yellow-200 hover:bg-yellow-50 transition-colors">
                  🔍 Generate Data Profile
                </button>
                <button className="w-full text-left p-2 text-sm bg-white rounded border border-yellow-200 hover:bg-yellow-50 transition-colors">
                  📊 Create Visualization
                </button>
                <button className="w-full text-left p-2 text-sm bg-white rounded border border-yellow-200 hover:bg-yellow-50 transition-colors">
                  🧠 Run AI Analysis
                </button>
                <button className="w-full text-left p-2 text-sm bg-white rounded border border-yellow-200 hover:bg-yellow-50 transition-colors">
                  📋 Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          💡 Future: Real-time AI analysis and recommendations
        </div>
      </div>
    </div>
  );
};

export default AIContextPanel; 