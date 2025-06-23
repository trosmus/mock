import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Route, Compass, Play, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';

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

  // Check if scrolling is needed
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
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <Route size={20} className="text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">Data Exploration Paths</h1>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onShowMap}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Compass size={16} />
            Knowledge Map
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-10 pt-24">
        <div className="max-w-7xl mx-auto mb-8">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Discover Business Insights</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow these guided exploration paths to uncover patterns and insights in your company data. 
              Each path answers a specific business question through a structured analytical journey.
            </p>
          </div>

          {/* Start New Exploration - Featured Section */}
          <div className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden cursor-pointer group max-w-4xl mx-auto hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              onClick={onStartBuilder}
            >
              <div className="p-8 text-white relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-300">
                    <Compass size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Start New Exploration</h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Create your own analytical path by exploring the interactive data map
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                    <Route size={16} />
                    <span>Interactive • Customizable • Decision Tree</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Compass size={120} className="text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Guided Paths Carousel */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Guided Data Analysis Paths</h3>
              <div className="flex items-center gap-2">
                {showArrows && (
                  <button
                    onClick={scrollLeft}
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                )}
                {showArrows && (
                  <button
                    onClick={scrollRight}
                    className="p-2 rounded-full bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-110"
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
                      className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1"
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
                              // Navigate to map with this path highlighted and last node selected
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

          {/* About the Explore Page */}
          <div className="mb-24">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">What is the Data Explorer?</h3>
                  <p className="text-lg text-gray-700">
                    A comprehensive platform designed to make business data analysis accessible through guided exploration and interactive visualization.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Guided Analysis */}
                  <div className="text-center group hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors duration-300">
                      <Route size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Guided Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Follow structured pathways that answer specific business questions through step-by-step analytical workflows.
                    </p>
                  </div>

                  {/* Interactive Exploration */}
                  <div className="text-center group hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-700 transition-colors duration-300">
                      <Compass size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Interactive Exploration</h4>
                    <p className="text-sm text-gray-600">
                      Navigate the data map to understand relationships and discover alternative analytical approaches at each decision point.
                    </p>
                  </div>

                  {/* AI-Powered Insights */}
                  <div className="text-center group hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors duration-300">
                      <Play size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
                    <p className="text-sm text-gray-600">
                      Generate automated visualizations and narrative insights that transform raw business data into actionable intelligence.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-indigo-200">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 cursor-default">Business Analysts</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200 cursor-default">Operations Teams</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200 cursor-default">Department Managers</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors duration-200 cursor-default">Small Business Owners</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-200 cursor-default">Decision Makers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional features */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-all duration-200 cursor-default hover:scale-105">
              <Compass size={16} />
              Explore the data map to understand business relationships
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathsListView; 