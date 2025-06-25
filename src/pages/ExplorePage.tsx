import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import components
import DataUploadOnboarding from '../components/DataUploadOnboarding.tsx';
import PathsListView from '../components/explore/PathsListView';
import GuidedPathView from '../components/explore/GuidedPathView';
import PathBuilderView from '../components/explore/PathBuilderView';
import KnowledgeMapView from '../components/explore/KnowledgeMapView';

// Import data
import { explorationPaths } from '../components/explore/data';
import { 
  getMockPrePopulatedAnalysis,
  generateMockAnalysis,
  generateMockFinalAnalysis,
  generateMockGuidedAnalysis
} from '../components/explore/mockData';

// Import canvas store for adding nodes
import { useCanvasStore } from '../state/canvasStore';
import { useAppStore } from '../stores/useAppStore';

interface ExplorePageProps {}

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addNode } = useCanvasStore();
  const { datasets } = useAppStore();
  
  // Check if user has uploaded data (using localStorage to persist across sessions)
  const [hasUploadedData, setHasUploadedData] = useState<boolean>(() => {
    // For testing: always show onboarding
    return false;
    // return localStorage.getItem('hasUploadedData') === 'true' || datasets.length > 0;
  });

  // Existing explore page states
  const [viewMode, setViewMode] = useState<'map' | 'paths' | 'path' | 'builder'>('paths');
  const [explorationPath, setExplorationPath] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<typeof explorationPaths[0] | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentBuilderStep, setCurrentBuilderStep] = useState<number>(0);
  const [builderChoices, setBuilderChoices] = useState<string[]>([]);
  const [stepVisualizations, setStepVisualizations] = useState<{[key: number]: any}>({});
  const [isGeneratingVisualization, setIsGeneratingVisualization] = useState<boolean>(false);
  const builderContainerRef = useRef<HTMLDivElement>(null);
  const [finalAnalysis, setFinalAnalysis] = useState<any>(null);
  const [isGeneratingFinalAnalysis, setIsGeneratingFinalAnalysis] = useState<boolean>(false);
  const [guidedStepVisualizations, setGuidedStepVisualizations] = useState<{[key: number]: any}>({});
  const [guidedFinalAnalysis, setGuidedFinalAnalysis] = useState<any>(null);
  const [pathToHighlight, setPathToHighlight] = useState<typeof explorationPaths[0] | null>(null);

  const handleOnboardingComplete = () => {
    setHasUploadedData(true);
  };

  // Reset to paths view when navigating to explore page
  useEffect(() => {
    if (hasUploadedData) {
    setViewMode('paths');
    setSelectedPath(null);
    setExplorationPath([]);
    setGuidedFinalAnalysis(null);
    setGuidedStepVisualizations({});
    setFinalAnalysis(null);
    setStepVisualizations({});
    setPathToHighlight(null);
    setCurrentBuilderStep(0);
    setBuilderChoices([]);
    setSelectedNodeId(null);
    }
  }, [location.pathname, hasUploadedData]);

  // Show data upload onboarding if no data has been uploaded
  if (!hasUploadedData) {
    return <DataUploadOnboarding onComplete={handleOnboardingComplete} />;
  }

  // Navigation handlers
  const handleBackToPaths = () => {
    setViewMode('paths');
    setSelectedPath(null);
    setExplorationPath([]);
    setGuidedFinalAnalysis(null);
    setGuidedStepVisualizations({});
    setPathToHighlight(null);
  };

  const handleExplorePath = () => {
    setViewMode('path');
  };

  const handleSelectPath = (path: typeof explorationPaths[0]) => {
    // Clear any previous state first
    setGuidedFinalAnalysis(null);
    setGuidedStepVisualizations({});
    setFinalAnalysis(null);
    setStepVisualizations({});
    setPathToHighlight(null);
    
    setSelectedPath(path);
    setExplorationPath(path.steps);
    setViewMode('path');
    
    // Immediately set the final analysis for guided paths (pre-populated)
    const pathSteps = path.steps.map(step => step.label).join(' → ');
    
    let prePopulatedAnalysis;
    
    if (path.id === 'demographics-utilization') {
      prePopulatedAnalysis = getMockPrePopulatedAnalysis('demographics-utilization', pathSteps);
    } else if (path.id === 'medication-patterns') {
      prePopulatedAnalysis = getMockPrePopulatedAnalysis('medication-patterns', pathSteps);
    }
    
    if (prePopulatedAnalysis) {
      setGuidedFinalAnalysis(prePopulatedAnalysis);
    }
  };

  const handleShowPaths = () => {
    setViewMode('paths');
    setSelectedPath(null);
    setExplorationPath([]);
    setGuidedFinalAnalysis(null);
    setGuidedStepVisualizations({});
    setFinalAnalysis(null);
    setStepVisualizations({});
    setPathToHighlight(null);
  };

  const handleStartBuilder = () => {
    setViewMode('builder');
    setCurrentBuilderStep(0);
    setBuilderChoices([]);
    setExplorationPath([]);
    setStepVisualizations({});
    
    // Clear guided path state
    setSelectedPath(null);
    setGuidedFinalAnalysis(null);
    setGuidedStepVisualizations({});
    setFinalAnalysis(null);
    setPathToHighlight(null);
  };

  const handleShowMap = () => {
    setViewMode('map');
    setPathToHighlight(null);
  };

  const handleShowMapWithPath = (path: typeof explorationPaths[0]) => {
    setPathToHighlight(path);
    setExplorationPath(path.steps);
    
    // Map exploration path step IDs to mind map node IDs
    const getLastNodeId = (pathId: string) => {
      if (pathId === 'demographics-utilization') {
        return 'utilization-narrative'; // Last node in demographics path
      } else if (pathId === 'medication-patterns') {
        return 'pharma-insights'; // Last node in medication path
      } else if (pathId === 'clinical-outcomes') {
        return 'clinical-insights'; // Last node in clinical outcomes path
      }
      return null;
    };
    
    const lastNodeId = getLastNodeId(path.id);
    if (lastNodeId) {
      setSelectedNodeId(lastNodeId);
    }
    
    setViewMode('map');
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  // Builder handlers
  const handleBuilderChoice = (choice: string, stepData: any) => {
    const newChoices = [...builderChoices, choice];
    const newPath = [...explorationPath, stepData];
    
    setBuilderChoices(newChoices);
    setExplorationPath(newPath);
    setCurrentBuilderStep(prev => prev + 1);
    
    // Scroll down to show the new step after a short delay
    setTimeout(() => {
      if (builderContainerRef.current) {
        const container = builderContainerRef.current;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        
        // Scroll to show the newly added step (scroll down by approximately one step height)
        const targetScrollTop = Math.min(container.scrollTop + 400, maxScrollTop);
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Analysis generation handlers
  const generateVisualization = async (stepIndex: number) => {
    setIsGeneratingVisualization(true);
    
    // Simulate AI analysis generation
    const currentPath = explorationPath.slice(0, stepIndex + 1);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = generateMockAnalysis(currentPath, stepIndex);
    
    setStepVisualizations(prev => ({
      ...prev,
      [stepIndex]: mockAnalysis
    }));
    
    setIsGeneratingVisualization(false);
  };

  const generateFinalAnalysis = async () => {
    setIsGeneratingFinalAnalysis(true);
    
    // Simulate comprehensive AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const comprehensiveAnalysis = generateMockFinalAnalysis(explorationPath, builderChoices);
    
    setFinalAnalysis(comprehensiveAnalysis);
    setIsGeneratingFinalAnalysis(false);
  };

  const generateGuidedVisualization = async (stepIndex: number) => {
    setIsGeneratingVisualization(true);
    
    // Simulate AI analysis generation for guided path
    const currentStep = selectedPath?.steps[stepIndex];
    if (!currentStep) return;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = generateMockGuidedAnalysis(stepIndex, currentStep);
    
    setGuidedStepVisualizations(prev => ({
      ...prev,
      [stepIndex]: mockAnalysis
    }));
    
    setIsGeneratingVisualization(false);
  };

  // Function to convert exploration steps to canvas blocks
  const convertStepsToBlocks = (steps: any[]) => {
    return steps.map(step => ({
      id: step.id,
      name: step.label,
      description: step.description || `${step.label} from exploration path`,
      prompt: step.prompt || `Analyze ${step.label} data and provide insights`,
      type: step.type || 'dataset'
    }));
  };

  // Handle adding path to desktop
  const handleAddPathToDesktop = (path: typeof explorationPaths[0]) => {
    // Convert path steps to blocks
    const combinedBlocks = convertStepsToBlocks(path.steps);
    
    // Create a unique node ID
    const nodeId = `data-explorer-${path.id}-${Date.now()}`;
    
    // Create a Data Explorer agent node with the path data
    const newNode = {
      id: nodeId,
      type: 'custom',
      position: { x: 200, y: 200 }, // Default position
      data: {
        id: nodeId,
        label: `Data Explorer: ${path.title}`,
        description: `Exploration path: ${path.description}`,
        prompt: `I've completed the ${path.title} exploration path. This analysis includes: ${path.steps.map(s => s.label).join(', ')}. The path answers: "${path.question}"`,
        blockType: 'dataset', // Always use dataset for the main node
        category: 'dataset',
        isAgent: true,
        combinedBlocks: combinedBlocks,
        explorationPath: path,
        explorationSteps: path.steps
      }
    };

    // Add the node to canvas
    addNode(newNode);
    
    // Set focus target for auto-zoom and selection
    const { setFocusTargetNode, addInsight } = useCanvasStore.getState();
    setFocusTargetNode(nodeId);
    
    // Add success insight
    addInsight({
      content: `✅ Successfully added "${path.title}" exploration path to desktop. The node contains ${path.steps.length} analytical steps ready for workflow building.`,
      nodeId: nodeId
    });
    
    // Show success message
    console.log(`✅ Path "${path.title}" added to desktop successfully!`);
    
    // Navigate to canvas
    navigate('/canvas');
  };

  // Render the appropriate view based on current mode
  if (viewMode === 'paths') {
    return (
      <PathsListView
        explorationPaths={explorationPaths}
        onSelectPath={handleSelectPath}
        onStartBuilder={handleStartBuilder}
        onShowMap={handleShowMap}
        onShowMapWithPath={handleShowMapWithPath}
        onAddPathToDesktop={handleAddPathToDesktop}
      />
    );
  }

  if (viewMode === 'path') {
    return (
      <GuidedPathView
        selectedPath={selectedPath}
        explorationPath={explorationPath}
        guidedStepVisualizations={guidedStepVisualizations}
        guidedFinalAnalysis={guidedFinalAnalysis}
        isGeneratingVisualization={isGeneratingVisualization}
        onBackToPaths={handleBackToPaths}
        onGenerateGuidedVisualization={generateGuidedVisualization}
        onShowMapWithPath={handleShowMapWithPath}
        onAddPathToDesktop={handleAddPathToDesktop}
      />
    );
  }

  if (viewMode === 'builder') {
    return (
      <PathBuilderView
        currentBuilderStep={currentBuilderStep}
        builderChoices={builderChoices}
        explorationPath={explorationPath}
        stepVisualizations={stepVisualizations}
        finalAnalysis={finalAnalysis}
        isGeneratingVisualization={isGeneratingVisualization}
        isGeneratingFinalAnalysis={isGeneratingFinalAnalysis}
        onBackToPaths={handleBackToPaths}
        onBuilderChoice={handleBuilderChoice}
        onGenerateVisualization={generateVisualization}
        onGenerateFinalAnalysis={generateFinalAnalysis}
        onStartBuilder={handleStartBuilder}
        builderContainerRef={builderContainerRef}
      />
    );
  }

  if (viewMode === 'map') {
    return (
      <KnowledgeMapView
        explorationPaths={explorationPaths}
        explorationPath={explorationPath}
        selectedNodeId={selectedNodeId}
        onShowPaths={handleShowPaths}
        onSelectPath={handleSelectPath}
        onExplorePath={handleExplorePath}
        onNodeSelect={handleNodeSelect}
        pathToHighlight={pathToHighlight}
        onShowMapWithPath={handleShowMapWithPath}
        onShowMap={handleShowMap}
        onAddPathToDesktop={handleAddPathToDesktop}
      />
    );
  }

  return null;
};

export default ExplorePage; 