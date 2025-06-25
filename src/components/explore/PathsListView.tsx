import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Route, 
  Play, 
  Monitor,
  TrendingUp,
  BarChart3,
  Users,
  Calculator
} from 'lucide-react';
import DataInsightsSummary from '../DataInsightsSummary';

interface PathsListViewProps {
  explorationPaths: any[];
  onSelectPath: (path: any) => void;
  onStartBuilder: () => void;
  onShowMap: () => void;
  onShowMapWithPath: (path: any) => void;
  onAddPathToDesktop: (path: any) => void;
}

const PathsListView: React.FC<PathsListViewProps> = ({
  explorationPaths,
  onSelectPath,
  onStartBuilder,
  onShowMap,
  onShowMapWithPath,
  onAddPathToDesktop
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  // Check if we need scroll arrows
  useEffect(() => {
    const checkScrollNeeded = () => {
      if (carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, [explorationPaths]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleContinueToExploration = () => {
    // Scroll to the guided workflows section
    const guidedSection = document.getElementById('guided-workflows-section');
    if (guidedSection) {
      guidedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white shadow-sm">
        <Compass size={20} className="text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">Explore</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Discover insights in your healthcare data
          </div>
          <button
            onClick={onShowMap}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Compass size={16} />
            <span>Knowledge Map</span>
          </button>
        </div>
      </header>

      {/* Data Insights Summary - First Section */}
      <div className="mb-0">
        <DataInsightsSummary onContinue={handleContinueToExploration} />
      </div>

      {/* Guided Workflows Section */}
      <div id="guided-workflows-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-100 rounded-full opacity-30 blur-3xl"></div>

        <div className="pb-10 pt-12">
          <div className="max-w-7xl mx-auto mb-8">
            {/* Simple Introduction Text */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to explore your healthcare data?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Ask our AI anything about your data to get instant insights, or browse through our guided analysis paths 
                  designed specifically for healthcare datasets.
                </p>
              </motion.div>
            </div>

            {/* AI Prompt Section */}
            <div id="ai-prompt-section" className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play size={24} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ask AI About Your Data</h3>
                    <p className="text-gray-700">
                      Get instant analysis by asking specific questions about your healthcare data
                    </p>
                  </div>

                  {/* AI Prompt Input */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <textarea
                          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          rows={6}
                          placeholder="Ask me anything about your healthcare data... 

Examples:
• What are the cost trends for patients over 65?
• Which conditions have the highest claim rejection rates?
• Show me medication utilization patterns by age group"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2">
                          <Play size={18} />
                          Analyze
                        </button>
                        <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm">
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Example Prompts */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Popular questions for healthcare data:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-gray-300 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200">
                        Cost analysis by condition
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-gray-300 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200">
                        Provider performance comparison
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-gray-300 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200">
                        Seasonal utilization patterns
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-gray-300 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all duration-200">
                        Claim rejection analysis
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Simple Introduction Text for Guided Paths */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Or follow a guided analysis path
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  These pre-built workflows are designed to answer specific business questions about your healthcare data, 
                  taking you step-by-step through proven analytical approaches.
                </p>
              </motion.div>
            </div>

            {/* Guided Paths Section - Only show when relevant */}
            <div id="guided-paths-section" className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Available Analysis Paths</h3>
                <div className="flex items-center gap-2">
                  {showArrows && (
                    <button
                      onClick={scrollLeft}
                      className="p-2 rounded-full bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-110 shadow-md"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                  )}
                  {showArrows && (
                    <button
                      onClick={scrollRight}
                      className="p-2 rounded-full bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-110 shadow-md"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {explorationPaths.map((path, index) => {
                    const Icon = path.icon;
                    return (
                      <motion.div
                        key={path.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        onClick={() => onSelectPath(path)}
                      >
                        {/* Header */}
                        <div 
                          className="p-6 text-white relative overflow-hidden group-hover:brightness-110 transition-all duration-300"
                          style={{ backgroundColor: path.color }}
                        >
                          <div className="relative z-10">
                            <Icon size={40} className="mb-4 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                            <h4 className="text-xl font-bold mb-2">{path.title}</h4>
                            <p className="text-sm opacity-90 font-medium">
                              {path.steps.length} steps • Guided workflow
                            </p>
                          </div>
                          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                            <Icon size={100} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Question */}
                          <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Research Question:</h5>
                            <p className="text-sm text-gray-700 italic">"{path.question}"</p>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{path.description}</p>

                          {/* Steps preview */}
                          <div className="mb-4">
                            <h6 className="font-medium text-gray-900 mb-2 text-sm">Key Steps:</h6>
                            <div className="space-y-1">
                              {path.steps.slice(0, 3).map((step: any, stepIndex: number) => (
                                <div key={step.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <div 
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                                    style={{ backgroundColor: path.color }}
                                  >
                                    {stepIndex + 1}
                                  </div>
                                  <span className="truncate">{step.label}</span>
                                </div>
                              ))}
                              {path.steps.length > 3 && (
                                <div className="text-xs text-gray-500 ml-6">
                                  +{path.steps.length - 3} more steps...
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectPath(path);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 group/btn hover:scale-[1.02] font-medium shadow-md hover:shadow-lg"
                            >
                              <Play size={16} />
                              Follow Path
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowMapWithPath(path);
                              }}
                              className="px-4 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium hover:scale-[1.02] flex items-center justify-center shadow-sm hover:shadow-md group/btn"
                              title="View this path on the knowledge map"
                            >
                              <Compass size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddPathToDesktop(path);
                              }}
                              className="px-4 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-lg hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium hover:scale-[1.02] flex items-center justify-center shadow-sm hover:shadow-md group/btn"
                              title="Add this path to desktop"
                            >
                              <Monitor size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Add more paths placeholder */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: explorationPaths.length * 0.1 }}
                    className="flex-shrink-0 w-80 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden hover:border-gray-400 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 hover:bg-gray-100"
                    onClick={onStartBuilder}
                  >
                    <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-300 transition-all duration-300 group-hover:scale-110">
                        <Compass size={24} className="text-gray-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Create Custom Path</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Build your own data exploration journey with our interactive path builder
                      </p>
                      <div className="text-sm text-gray-400">
                        Click to start building
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathsListView; 