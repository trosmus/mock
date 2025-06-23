import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Compass, 
  Route, 
  BarChart3, 
  TrendingUp, 
  FileText,
  Users,
  ChevronRight,
  Play
} from 'lucide-react';
import { getNodeIcon } from './utils';

interface PathBuilderViewProps {
  currentBuilderStep: number;
  builderChoices: string[];
  explorationPath: any[];
  stepVisualizations: { [key: number]: any };
  finalAnalysis: any;
  isGeneratingVisualization: boolean;
  isGeneratingFinalAnalysis: boolean;
  onBackToPaths: () => void;
  onBuilderChoice: (choice: string, stepData: any) => void;
  onGenerateVisualization: (stepIndex: number) => void;
  onGenerateFinalAnalysis: () => void;
  onStartBuilder: () => void;
  builderContainerRef: React.RefObject<HTMLDivElement | null>;
}

const PathBuilderView: React.FC<PathBuilderViewProps> = ({
  currentBuilderStep,
  builderChoices,
  explorationPath,
  stepVisualizations,
  finalAnalysis,
  isGeneratingVisualization,
  isGeneratingFinalAnalysis,
  onBackToPaths,
  onBuilderChoice,
  onGenerateVisualization,
  onGenerateFinalAnalysis,
  onStartBuilder,
  builderContainerRef
}) => {
  const getBuilderStepData = (stepIndex: number) => {
    const steps = [
      {
        question: "What type of data would you like to analyze?",
        description: "Choose your primary data source",
        options: [
          { id: 'customers', label: 'Customer Data', description: 'Customer demographics and behavior' },
          { id: 'sales', label: 'Sales & Revenue', description: 'Sales performance and revenue trends' },
          { id: 'operations', label: 'Operations Data', description: 'Process efficiency and operations metrics' },
          { id: 'inventory', label: 'Inventory & Products', description: 'Stock levels and product performance' }
        ]
      },
      {
        question: "How would you like to filter the data?",
        description: "Select your filtering approach",
        options: [
          { id: 'age', label: 'Age Range Filter', description: 'Focus on specific age groups' },
          { id: 'geographic', label: 'Geographic Filter', description: 'Analyze by location/region' },
          { id: 'insurance', label: 'Insurance Type', description: 'Group by insurance coverage' },
          { id: 'condition', label: 'Medical Condition', description: 'Filter by specific diagnoses' }
        ]
      },
      {
        question: "What type of analysis do you want to perform?",
        description: "Choose your analytical approach",
        options: [
          { id: 'trend', label: 'Trend Analysis', description: 'Examine patterns over time' },
          { id: 'comparison', label: 'Comparative Analysis', description: 'Compare different groups' },
          { id: 'distribution', label: 'Distribution Analysis', description: 'Study data spread and frequency' },
          { id: 'correlation', label: 'Correlation Analysis', description: 'Find relationships between variables' }
        ]
      },
      {
        question: "How would you like to visualize the results?",
        description: "Select your preferred visualization",
        options: [
          { id: 'chart', label: 'Charts & Graphs', description: 'Bar charts, line graphs, pie charts' },
          { id: 'heatmap', label: 'Heatmap', description: 'Color-coded intensity visualization' },
          { id: 'geographic', label: 'Geographic Map', description: 'Location-based visualization' },
          { id: 'dashboard', label: 'Interactive Dashboard', description: 'Multi-panel overview' }
        ]
      },
      {
        question: "What insights are you looking for?",
        description: "Define your expected outcomes",
        options: [
          { id: 'patterns', label: 'Pattern Discovery', description: 'Identify hidden trends and patterns' },
          { id: 'predictions', label: 'Predictive Insights', description: 'Forecast future trends' },
          { id: 'benchmarks', label: 'Benchmark Comparisons', description: 'Compare against standards' },
          { id: 'recommendations', label: 'Strategic Recommendations', description: 'Actionable next steps' }
        ]
      }
    ];
    
    return steps[stepIndex] || null;
  };

  const getAlternativesForStep = (stepIndex: number): string[] => {
    const stepData = getBuilderStepData(stepIndex);
    if (!stepData) return [];
    
    // Return the other 3 options that weren't selected
    return stepData.options.slice(1).map(option => option.label);
  };

  const currentStep = getBuilderStepData(currentBuilderStep);
  const isComplete = currentBuilderStep >= 5;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <button
          onClick={onBackToPaths}
          className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Paths
        </button>
        <Compass size={20} className="text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">Build Your Exploration Path</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Step {currentBuilderStep + 1} of 5 • {builderChoices.length} choices made
          </div>
          <div className="flex gap-1">
            {[0,1,2,3,4].map(i => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${i <= currentBuilderStep ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div ref={builderContainerRef} className="flex-1 overflow-y-auto p-6 pb-60">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <AnimatePresence>
              {/* Show completed steps */}
              {explorationPath.map((step, index) => {
                const Icon = getNodeIcon(step.type);
                const isLast = index === explorationPath.length - 1;
                return (
                  <motion.div
                    key={`completed-${index}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
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
                    
                    {/* Completed step card */}
                    <div className="flex gap-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      {/* Step indicator */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-blue-600">
                          <Icon size={20} className="text-white" />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-500">
                            Step {index + 1}
                          </span>
                          <div className="mt-1 text-xs px-2 py-1 rounded-full text-white font-medium bg-blue-600">
                            Completed
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{step.label}</h3>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            Selected
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{step.description}</p>

                        {/* Show the 4 options with selected one highlighted */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Route size={16} />
                            Available Routes at This Step
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {/* Selected route */}
                            <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-500">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full bg-blue-600" />
                                <span className="text-sm font-medium text-gray-900">Selected Path</span>
                              </div>
                              <p className="text-xs text-gray-700">{step.label}</p>
                            </div>

                            {/* Alternative routes for this step */}
                            {getAlternativesForStep(index).map((alt, altIndex) => (
                              <div key={altIndex} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
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
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <BarChart3 size={16} />
                              AI Analysis
                            </h4>
                            {!stepVisualizations[index] && (
                              <button
                                onClick={() => onGenerateVisualization(index)}
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
                          {stepVisualizations[index] && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h5 className="font-semibold text-gray-900 mb-3">{stepVisualizations[index].title}</h5>
                              
                              {stepVisualizations[index].type === 'text' && (
                                <div className="text-sm text-gray-700 whitespace-pre-line">
                                  {stepVisualizations[index].content}
                                </div>
                              )}

                              {stepVisualizations[index].type === 'chart' && (
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-600">Data Distribution Analysis</p>
                                  <div className="space-y-2">
                                    {stepVisualizations[index].data.labels.map((label: string, i: number) => (
                                      <div key={i} className="flex items-center gap-3">
                                        <div className="w-20 text-xs text-gray-600">{label}</div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                          <div 
                                            className="h-4 rounded-full flex items-center justify-end pr-2"
                                            style={{ 
                                              width: `${(stepVisualizations[index].data.values[i] / Math.max(...stepVisualizations[index].data.values)) * 100}%`,
                                              backgroundColor: stepVisualizations[index].data.colors[i]
                                            }}
                                          >
                                            <span className="text-xs text-white font-medium">
                                              {stepVisualizations[index].data.values[i].toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {stepVisualizations[index].type === 'insights' && (
                                <div className="space-y-3">
                                  {stepVisualizations[index].insights.map((insight: any, i: number) => (
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
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Current question step */}
              {!isComplete && currentStep && (
                <motion.div
                  key={`current-${currentBuilderStep}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Connection line from previous step */}
                  {explorationPath.length > 0 && (
                    <>
                      <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-blue-200 to-orange-300" />
                      <div className="absolute left-5 -top-4 w-2 h-2 transform rotate-45 bg-orange-300" />
                    </>
                  )}
                  
                  {/* Current question card */}
                  <div className="flex gap-6 bg-white rounded-xl shadow-lg border-2 border-orange-400 p-6">
                    {/* Step indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-orange-500">
                        <div className="text-white font-bold">{currentBuilderStep + 1}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-medium text-gray-500">
                          Step {currentBuilderStep + 1}
                        </span>
                        <div className="mt-1 text-xs px-2 py-1 rounded-full text-white font-medium bg-orange-500">
                          Current
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentStep.question}</h3>
                        <p className="text-gray-600">{currentStep.description}</p>
                      </div>

                      {/* Options grid */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {currentStep.options.map((option, index) => (
                          <motion.button
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            onClick={() => onBuilderChoice(option.label, {
                              id: option.id,
                              label: option.label,
                              description: option.description,
                              step: currentBuilderStep + 1,
                              type: 'custom'
                            })}
                            className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
                          >
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700">
                              {option.label}
                            </h4>
                            <p className="text-sm text-gray-600 group-hover:text-orange-600">
                              {option.description}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Completion card */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Connection line from last step */}
                  <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-blue-200 to-green-300" />
                  <div className="absolute left-5 -top-4 w-2 h-2 transform rotate-45 bg-green-300" />
                  
                  <div className="flex gap-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-400 p-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-green-600">
                        <Play size={20} className="text-white" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-medium text-gray-500">Complete</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Custom Path is Ready!</h3>
                      <p className="text-gray-600 mb-4">
                        You've built a personalized exploration path with {builderChoices.length} analytical steps.
                      </p>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={onGenerateFinalAnalysis}
                          disabled={isGeneratingFinalAnalysis}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isGeneratingFinalAnalysis ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Generating Analysis...
                            </>
                          ) : (
                            <>
                              <BarChart3 size={16} />
                              Generate Final Analysis
                            </>
                          )}
                        </button>
                        <button
                          onClick={onStartBuilder}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Final Analysis Display */}
              {finalAnalysis && (
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
                          <h3 className="text-xl font-bold">Comprehensive Business Analysis Report</h3>
                          <p className="text-purple-100">Complete insights from your data exploration path</p>
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
                          {finalAnalysis.executiveSummary}
                        </p>
                      </div>

                      {/* Key Findings */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp size={16} />
                          Key Findings
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {finalAnalysis.keyFindings.map((finding: any, index: number) => (
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
                          {finalAnalysis.detailedInsights.map((category: any, index: number) => (
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
                          {finalAnalysis.recommendations.map((rec: any, index: number) => (
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
                            {finalAnalysis.nextSteps.map((step: string, index: number) => (
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
                          onClick={onStartBuilder}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                        >
                          Create New Path
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathBuilderView; 