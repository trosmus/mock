import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Route, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  FileText,
  Users,
  ChevronRight,
  Compass,
  Monitor
} from 'lucide-react';
import { getNodeIcon, getNodeColor, getAlternativesForStep } from './utils';

interface GuidedPathViewProps {
  selectedPath: any;
  explorationPath: any[];
  guidedStepVisualizations: { [key: number]: any };
  guidedFinalAnalysis: any;
  isGeneratingVisualization: boolean;
  onBackToPaths: () => void;
  onGenerateGuidedVisualization: (stepIndex: number) => void;
  onShowMapWithPath: (path: any) => void;
  onAddPathToDesktop: (path: any) => void;
}

const GuidedPathView: React.FC<GuidedPathViewProps> = ({
  selectedPath,
  explorationPath,
  guidedStepVisualizations,
  guidedFinalAnalysis,
  isGeneratingVisualization,
  onBackToPaths,
  onGenerateGuidedVisualization,
  onShowMapWithPath,
  onAddPathToDesktop
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white shadow-sm">
        <button
          onClick={onBackToPaths}
          className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Paths
        </button>
        <Route size={20} className="text-gray-600" />
        {selectedPath && (
          <>
            <div className="flex items-center gap-2">
              <selectedPath.icon size={20} style={{ color: selectedPath.color }} />
              <h1 className="text-xl font-bold text-gray-800">{selectedPath.title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {explorationPath.length} steps • {selectedPath.question.length > 50 ? 'Complex' : 'Simple'} analysis
              </div>
              <button
                onClick={() => onShowMapWithPath(selectedPath)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                title="View this path on the knowledge map"
              >
                <Compass size={16} />
                View on Map
              </button>
              <button
                onClick={() => onAddPathToDesktop(selectedPath)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                title="Add this path to desktop"
              >
                <Monitor size={16} />
                Add to Desktop
              </button>
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: selectedPath.color }}
              >
                {selectedPath.id.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
            </div>
          </>
        )}
        {!selectedPath && (
          <h1 className="text-xl font-bold text-gray-800">Exploration Path</h1>
        )}
      </header>

      {/* Path Timeline */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {explorationPath.length === 0 ? (
            <div className="text-center py-16">
              <Route size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data analysis path yet</h3>
              <p className="text-gray-600 mb-6">
                Go back to the paths view and select a predefined analysis path
              </p>
              <button
                onClick={onBackToPaths}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Route size={16} />
                Browse Analysis Paths
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {explorationPath.map((step, index) => {
                  const Icon = getNodeIcon(step.type);
                  const isLast = index === explorationPath.length - 1;
                  return (
                    <motion.div
                      key={`${step.id}-${index}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Connection line */}
                      {!isLast && (
                        <div className="absolute left-6 top-20 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-blue-200" />
                      )}
                      
                      {/* Flow arrow */}
                      {!isLast && (
                        <div className="absolute left-5 top-24 w-2 h-2 transform rotate-45 bg-blue-300" />
                      )}
                      
                      {/* Step card */}
                      <div className="flex gap-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                        {/* Step indicator */}
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                            style={{ backgroundColor: selectedPath?.color || getNodeColor(step.type) }}
                          >
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-medium text-gray-500">
                              Step {index + 1}
                            </span>
                            <div 
                              className="mt-1 text-xs px-2 py-1 rounded-full text-white font-medium"
                              style={{ backgroundColor: getNodeColor(step.type) }}
                            >
                              {step.type}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{step.label}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} />
                              ~{Math.floor(Math.random() * 5) + 2} min
                            </div>
                          </div>
                          
                          {step.description && (
                            <p className="text-gray-600 mb-4">{step.description}</p>
                          )}

                          {/* Decision Routes - Show 4 options at each step */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Route size={16} />
                              Available Routes at This Step
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {/* Selected route */}
                              <div 
                                className="p-3 rounded-lg border-2 bg-blue-50"
                                style={{ 
                                  borderColor: selectedPath?.color || '#3b82f6',
                                  backgroundColor: `${selectedPath?.color || '#3b82f6'}10`
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: selectedPath?.color || '#3b82f6' }}
                                  />
                                  <span className="text-sm font-medium text-gray-900">Selected Path</span>
                                </div>
                                <p className="text-xs text-gray-700">{step.label}</p>
                              </div>

                              {/* Alternative routes */}
                              {getAlternativesForStep(index, step).map((alt, altIndex) => (
                                <div 
                                  key={altIndex}
                                  className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">Alternative {altIndex + 1}</span>
                                  </div>
                                  <p className="text-xs text-gray-600">{alt}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* AI Visualization Section */}
                          <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <BarChart3 size={16} />
                                AI Analysis
                              </h4>
                              {!guidedStepVisualizations[index] && (
                                <button
                                  onClick={() => onGenerateGuidedVisualization(index)}
                                  disabled={isGeneratingVisualization}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {isGeneratingVisualization ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp size={14} />
                                      Generate Analysis
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Display visualization if available */}
                            {guidedStepVisualizations[index] && (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h5 className="font-semibold text-gray-900 mb-3">{guidedStepVisualizations[index].title}</h5>
                                
                                {guidedStepVisualizations[index].type === 'text' && (
                                  <div className="text-sm text-gray-700 whitespace-pre-line">
                                    {guidedStepVisualizations[index].content}
                                  </div>
                                )}

                                {guidedStepVisualizations[index].type === 'chart' && (
                                  <div className="space-y-3">
                                    <p className="text-sm text-gray-600">Data Distribution Analysis</p>
                                    <div className="space-y-2">
                                      {guidedStepVisualizations[index].data.labels.map((label: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                          <div className="w-20 text-xs text-gray-600">{label}</div>
                                          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                            <div 
                                              className="h-4 rounded-full flex items-center justify-end pr-2"
                                              style={{ 
                                                width: `${(guidedStepVisualizations[index].data.values[i] / Math.max(...guidedStepVisualizations[index].data.values)) * 100}%`,
                                                backgroundColor: guidedStepVisualizations[index].data.colors[i]
                                              }}
                                            >
                                              <span className="text-xs text-white font-medium">
                                                {guidedStepVisualizations[index].data.values[i].toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {guidedStepVisualizations[index].type === 'insights' && (
                                  <div className="space-y-3">
                                    {guidedStepVisualizations[index].insights.map((insight: any, i: number) => (
                                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <TrendingUp size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-800">{insight.text}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div className="text-xs text-gray-500">Confidence:</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                              <div 
                                                className="h-2 bg-green-500 rounded-full"
                                                style={{ width: `${insight.confidence}%` }}
                                              />
                                            </div>
                                            <div className="text-xs font-medium text-gray-700">{insight.confidence}%</div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {step.insight && (
                            <div 
                              className="border-l-4 pl-4 py-2 mb-4"
                              style={{ 
                                borderColor: selectedPath?.color || getNodeColor(step.type),
                                backgroundColor: `${selectedPath?.color || getNodeColor(step.type)}10`
                              }}
                            >
                              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                <TrendingUp size={16} />
                                Key Insight
                              </h4>
                              <p className="text-gray-800 text-sm">{step.insight}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Final Analysis Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: explorationPath.length * 0.1 }}
                className="relative"
              >
                {/* Connection line from last step */}
                {explorationPath.length > 0 && (
                  <>
                    <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-blue-200 to-green-300" />
                    <div className="absolute left-5 -top-4 w-2 h-2 transform rotate-45 bg-green-300" />
                  </>
                )}
                
                <div className="flex gap-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-400 p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-green-600">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-gray-500">Final</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Exploration Complete</h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive analysis of your complete data exploration journey is ready.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Final Analysis Display */}
              {guidedFinalAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Connection line */}
                  <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-green-300 to-purple-300" />
                  <div className="absolute left-5 -top-4 w-2 h-2 transform rotate-45 bg-purple-300" />
                  
                  <div className="bg-white rounded-xl shadow-xl border-2 border-purple-400 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {selectedPath?.id === 'medication-patterns' 
                              ? 'Business Process & Operations Analysis Report'
                              : 'Customer Demographics & Usage Analysis Report'
                            }
                          </h3>
                          <p className="text-purple-100">Complete insights from guided analysis</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Executive Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Executive Summary
                        </h4>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          {guidedFinalAnalysis.executiveSummary}
                        </p>
                      </div>

                      {/* Key Findings */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp size={16} />
                          Key Findings
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {guidedFinalAnalysis.keyFindings.map((finding: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{finding.title}</h5>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  {finding.trend}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-blue-600 mb-1">{finding.value}</div>
                              <p className="text-sm text-gray-600">{finding.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Insights */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users size={16} />
                          Detailed Insights
                        </h4>
                        <div className="space-y-4">
                          {guidedFinalAnalysis.detailedInsights.map((category: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <h5 className="font-medium text-gray-900 mb-3">{category.category}</h5>
                              <ul className="space-y-2">
                                {category.insights.map((insight: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Route size={16} />
                          Strategic Recommendations
                        </h4>
                        <div className="space-y-3">
                          {guidedFinalAnalysis.recommendations.map((rec: any, index: number) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{rec.title}</h5>
                                <div className="flex gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {rec.priority} Priority
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {rec.timeline}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ChevronRight size={16} />
                          Next Steps
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <ul className="space-y-2">
                            {guidedFinalAnalysis.nextSteps.map((step: string, index: number) => (
                              <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={onBackToPaths}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
                        >
                          <Route size={16} />
                          Explore Other Paths
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidedPathView; 