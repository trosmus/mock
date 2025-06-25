import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Position,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useCanvasStore } from '../../state/canvasStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

// Custom styles for futuristic components
const futuristicStyles = `
  
  .futuristic-controls {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid #3b82f6 !important;
    border-radius: 12px !important;
    backdrop-filter: blur(20px) !important;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0, 0, 0, 0.02) !important;
    gap: 5px;
  }
  
  .futuristic-controls button {
    background: rgba(59, 130, 246, 0.08) !important;
    border: 1px solid rgba(59, 130, 246, 0.2) !important;
    color: #3b82f6 !important;
    border-radius: 8px !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .futuristic-controls button:hover {
    background: rgba(59, 130, 246, 0.15) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
    transform: scale(1.02) !important;
    color: #1e40af !important;
  }
  
  .react-flow__minimap {
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0, 0, 0, 0.02) !important;
    overflow: hidden !important;
    border: 1px solid rgba(59, 130, 246, 0.2) !important;
  }
  
  .react-flow__minimap-node {
    border-radius: 50% !important;
  }
  
  .react-flow__attribution {
    background: rgba(255, 255, 255, 0.95) !important;
    color: #3b82f6 !important;
    border: 1px solid rgba(59, 130, 246, 0.2) !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08) !important;
  }
  
  .react-flow__edge-path {
    filter: none !important;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Sample data based on requirements - updated to look like agent-created nodes
const initialNodes: Node[] = [
  // Data Explorer Agent Node
  {
    id: 'data-explorer-1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      id: 'data-explorer-1',
      label: 'Data Explorer',
      description: 'Automatically finds interesting patterns in your data',
      prompt: 'I explore your data to discover patterns, trends, and insights. I show you what\'s working, what\'s not, and create easy-to-read summaries perfect for getting started with any dataset.',
      blockType: 'dataset',
      category: 'dataset',
      isAgent: true,
      combinedBlocks: [
        {
          id: 'patients-dataset',
          name: 'Patients Dataset',
          type: 'dataset',
          description: 'Patient demographics and information'
        },
        {
          id: 'encounters-dataset',
          name: 'Encounters Dataset',
          type: 'dataset',
          description: 'Healthcare visit records'
        },
        {
          id: 'conditions-dataset',
          name: 'Medical Conditions',
          type: 'dataset',
          description: 'Patient diagnosis and condition data'
        }
      ]
    },
  },
  // Chart Maker Agent Node
  {
    id: 'chart-maker-1',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: {
      id: 'chart-maker-1',
      label: 'Chart Maker',
      description: 'Picks the perfect chart for your information',
      prompt: 'I create beautiful visualizations for your data. I automatically pick the best chart type, make professional-looking graphs, and help you build dashboards that make your data look great.',
      blockType: 'visualization',
      category: 'visualization',
      isAgent: true,
      combinedBlocks: [
        {
          id: 'condition-chart',
          name: 'Condition Chart',
          type: 'visualization',
          description: 'Bar chart of common conditions'
        },
        {
          id: 'age-distribution',
          name: 'Age Distribution',
          type: 'visualization',
          description: 'Histogram of patient ages'
        },
        {
          id: 'trend-analysis',
          name: 'Trend Analysis',
          type: 'visualization',
          description: 'Line chart of healthcare trends'
        },
        {
          id: 'demographic-pie',
          name: 'Demographics Pie',
          type: 'visualization',
          description: 'Pie chart of patient demographics'
        }
      ]
    },
  },
  // Ask Your Data Agent Node
  {
    id: 'ask-your-data-1',
    type: 'custom',
    position: { x: 100, y: 350 },
    data: {
      id: 'ask-your-data-1',
      label: 'Ask Your Data',
      description: 'Just type questions in plain English',
      prompt: 'I answer your business questions in plain English. Ask me "How are we doing this quarter?" or "What are our top products?" and I\'ll give you instant answers without any complicated formulas.',
      blockType: 'narrative',
      category: 'narrative',
      isAgent: true,
      combinedBlocks: [
        {
          id: 'count-patients-sql',
          name: 'Count Patients Query',
          type: 'sql',
          description: 'SQL query to count total patients'
        },
        {
          id: 'top-conditions-query',
          name: 'Top Conditions Query',
          type: 'sql',
          description: 'Query most common medical conditions'
        },
        {
          id: 'age-filter',
          name: 'Age Range Filter',
          type: 'filter',
          description: 'Filter patients by age groups'
        },
        {
          id: 'join-tables',
          name: 'Join Tables Query',
          type: 'sql',
          description: 'Join patient and encounter data'
        },
        {
          id: 'aggregate-stats',
          name: 'Aggregate Statistics',
          type: 'sql',
          description: 'Calculate summary statistics'
        }
      ]
    },
  },
  // Report Writer Agent Node
  {
    id: 'report-writer-1',
    type: 'custom',
    position: { x: 400, y: 350 },
    data: {
      id: 'report-writer-1',
      label: 'Report Writer',
      description: 'Generates comprehensive reports',
      prompt: 'I write detailed reports that summarize findings, provide insights, and make recommendations based on data analysis.',
      blockType: 'narrative',
      category: 'narrative',
      isAgent: true,
      combinedBlocks: [
        {
          id: 'clinical-summary',
          name: 'Clinical Summary',
          type: 'narrative',
          description: 'Clinical insights and recommendations'
        },
        {
          id: 'population-report',
          name: 'Population Report',
          type: 'narrative',
          description: 'Demographic analysis summary'
        },
        {
          id: 'quality-metrics',
          name: 'Quality Metrics',
          type: 'narrative',
          description: 'Healthcare quality indicators'
        }
      ]
    },
  }
];

const initialEdges: Edge[] = [
  {
    id: 'patients-encounters',
    source: 'patients-dataset',
    target: 'encounters-dataset',
    type: 'custom',
    data: {
      label: 'has',
      relationship: 'one-to-many',
      transformationBlocks: [
        {
          id: 'join-transform',
          name: 'Inner Join',
          type: 'sql',
          prompt: 'Perform an inner join between patients and encounters tables. Analyze the relationship patterns, identify patients with multiple encounters, and examine care continuity across the joined dataset.'
        },
        {
          id: 'date-filter',
          name: 'Date Range Filter',
          type: 'filter',
          prompt: 'Apply date range filtering to encounters data. Focus on specific time periods for trend analysis, seasonal pattern identification, and temporal cohort studies.'
        }
      ]
    },
    style: {
      stroke: '#3b82f6', // Dataset blue
      strokeWidth: 2,
    },
    animated: false,
  },
  // Commented out to improve performance
  // {
  //   id: 'patients-medications',
  //   source: 'patients-dataset',
  //   target: 'medications-dataset',
  //   type: 'custom',
  //   data: { label: 'prescribed', relationship: 'one-to-many' },
  //   style: {
  //     stroke: '#3b82f6', // Dataset blue
  //     strokeWidth: 2,
  //   },
  //   animated: false,
  // },
  {
    id: 'age-filter-patients',
    source: 'age-range-filter',
    target: 'patients-dataset',
    type: 'custom',
    data: {
      label: 'filters',
      relationship: 'many-to-one',
      transformationBlocks: [
        {
          id: 'age-validation',
          name: 'Age Validation',
          type: 'filter',
          prompt: 'Validate age data quality and apply age-based filtering rules. Identify data anomalies, handle missing birthdates, and ensure age calculations are accurate for downstream analysis.'
        }
      ]
    },
    style: {
      stroke: '#10b981', // Filter green
      strokeWidth: 2,
    },
    animated: false,
  },
  // Commented out to improve performance
  // {
  //   id: 'gender-filter-patients',
  //   source: 'gender-filter',
  //   target: 'patients-dataset',
  //   type: 'custom',
  //   data: { label: 'filters', relationship: 'many-to-one' },
  //   style: {
  //     stroke: '#10b981', // Filter green
  //     strokeWidth: 2,
  //   },
  //   animated: false,
  // },
  {
    id: 'count-patients-query',
    source: 'patients-dataset',
    target: 'count-patients',
    type: 'custom',
    data: {
      label: 'queries',
      relationship: 'one-to-one',
      transformationBlocks: [
        {
          id: 'aggregate-count',
          name: 'COUNT Aggregation',
          type: 'sql',
          prompt: 'Perform COUNT aggregation to calculate total patient numbers. Analyze population sizes across different segments and provide statistical summaries with confidence intervals.'
        },
        {
          id: 'group-by-demographics',
          name: 'Group By Demographics',
          type: 'sql',
          prompt: 'Group patients by demographic characteristics including age, gender, and ethnicity. Identify population segments and analyze health disparities across different demographic groups.'
        },
        {
          id: 'null-handling',
          name: 'NULL Value Handler',
          type: 'filter',
          prompt: 'Handle missing demographic data by implementing appropriate imputation strategies or exclusion rules. Document data quality issues and their impact on analysis results.'
        }
      ]
    },
    style: {
      stroke: '#6366f1', // SQL purple
      strokeWidth: 2,
    },
    animated: false,
  },
  {
    id: 'count-bar-chart',
    source: 'count-patients',
    target: 'bar-chart',
    type: 'custom',
    data: {
      label: 'visualizes',
      relationship: 'one-to-one',
      transformationBlocks: [
        {
          id: 'data-formatting',
          name: 'Chart Data Formatter',
          type: 'visualization',
          prompt: 'Format and prepare data for bar chart visualization. Optimize data structure, handle categorical variables, and ensure proper scaling and labeling for clear visual representation.'
        }
      ]
    },
    style: {
      stroke: '#ec4899', // Visualization pink
      strokeWidth: 2,
    },
    animated: false,
  },
  // Commented out to improve performance
  // {
  //   id: 'encounters-line-chart',
  //   source: 'encounters-dataset',
  //   target: 'line-chart',
  //   type: 'custom',
  //   data: { label: 'visualizes', relationship: 'one-to-one' },
  //   style: {
  //     stroke: '#ec4899', // Visualization pink
  //     strokeWidth: 2,
  //   },
  //   animated: false,
  // },
];

// Dagre layout configuration
const nodeWidth = 200;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 200, ranksep: 250 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: layoutedNodes, edges };
};

// Node types configuration
const nodeTypes = {
  custom: CustomNode,
};

// Edge types configuration
const edgeTypes = {
  custom: CustomEdge,
};

const GraphCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ReactFlowWrapper />
    </ReactFlowProvider>
  );
};

const ReactFlowWrapper: React.FC = () => {
  console.log('🌐 GraphCanvas render');
  const reactFlowInstance = useReactFlow();

  const {
    setSelectedNode,
    addInsight,
    minimizedNodes,
    maximizeNode,
    nodes: storeNodes,
    setNodes: setStoreNodes,
    isDrawerExpanded,
    focusTargetNodeId,
    setFocusTargetNode
  } = useCanvasStore();

  // Apply layout to initial data and combine with store nodes
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    console.log('📐 Layout calculation memoization recalculated');

    // Combine initial nodes with store nodes
    const allNodes = storeNodes.length > 0 ? [
      ...initialNodes,
      ...storeNodes.map(storeNode => ({
        id: storeNode.id,
        type: storeNode.type,
        position: storeNode.position,
        data: storeNode.data
      }))
    ] : initialNodes;

    // Remove duplicates by id
    const uniqueNodes = allNodes.filter((node, index, self) =>
      index === self.findIndex(n => n.id === node.id)
    );

    return getLayoutedElements(uniqueNodes, initialEdges);
  }, [storeNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [, , onEdgesChange] = useEdgesState(layoutedEdges); // Keep edges state but don't use the values

  // Auto-zoom to newly added node from Explorer
  useEffect(() => {
    if (focusTargetNodeId && reactFlowInstance) {
      // Small delay to ensure node is rendered
      const timer = setTimeout(() => {
        try {
          // Select the node
          setSelectedNode(focusTargetNodeId);

          // Check if the node exists in the current nodes
          const targetNode = nodes.find(n => n.id === focusTargetNodeId);
          if (targetNode) {
            // Zoom to the node with animation
            reactFlowInstance.fitView({
              nodes: [{ id: focusTargetNodeId }],
              duration: 800,
              padding: 0.3,
              minZoom: 0.8,
              maxZoom: 1.2,
            });

            console.log(`🎯 Auto-focused on node: ${focusTargetNodeId}`);
          } else {
            console.warn(`⚠️ Target node ${focusTargetNodeId} not found in current nodes`);
          }
        } catch (error) {
          console.error('❌ Error during auto-zoom:', error);
        } finally {
          // Always clear the focus target
          setFocusTargetNode(null);
        }
      }, 500); // Increased delay to ensure node is fully rendered

      return () => clearTimeout(timer);
    }
  }, [focusTargetNodeId, reactFlowInstance, setSelectedNode, setFocusTargetNode, nodes]);

  // Inject styles only once
  useEffect(() => {
    console.log('💉 GraphCanvas styles injection effect');
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = futuristicStyles;
      styleElement.id = 'graph-canvas-styles';

      // Only add if not already present
      if (!document.getElementById('graph-canvas-styles')) {
        document.head.appendChild(styleElement);
      }

      return () => {
        const existingStyle = document.getElementById('graph-canvas-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  // Sync store nodes with local state on mount
  useEffect(() => {
    if (storeNodes.length === 0) {
      // Initialize store with layouted nodes if empty
      setStoreNodes(layoutedNodes.map(node => ({
        id: node.id,
        type: node.type || 'custom',
        position: node.position,
        data: {
          id: node.data.id as string,
          label: node.data.label as string,
          description: node.data.description as string,
          prompt: node.data.prompt as string,
          blockType: node.data.blockType as string,
          category: node.data.category as string,
          combinedBlocks: node.data.combinedBlocks as any[],
          isAgent: node.data.isAgent as boolean
        }
      })));
    }
  }, [storeNodes.length, layoutedNodes, setStoreNodes]);

  // Force re-render when store nodes change (for nodes added from Explorer)
  // const [renderKey, setRenderKey] = React.useState(0);
  // useEffect(() => {
  //   setRenderKey(prev => prev + 1);
  // }, [storeNodes.length]);

  // Update store when local nodes change (position updates, etc.)
  useEffect(() => {
    if (nodes.length > 0) {
      setStoreNodes(nodes.map(node => ({
        id: node.id,
        type: node.type || 'custom',
        position: node.position,
        data: {
          id: node.data.id as string,
          label: node.data.label as string,
          description: node.data.description as string,
          prompt: node.data.prompt as string,
          blockType: node.data.blockType as string,
          category: node.data.category as string,
          combinedBlocks: node.data.combinedBlocks as any[],
          isAgent: node.data.isAgent as boolean
        }
      })));
    }
  }, [nodes, setStoreNodes]);

  // Disabled connection handler to prevent edge creation
  const onConnect = useCallback((_params: Connection) => {
    // Edge creation disabled for simplified user experience
    console.log('🚫 Edge creation disabled for simplified user flow');
    return;
  }, []);

  // Handle node combination
  const handleNodeCombination = useCallback((event: CustomEvent) => {
    console.log('🔄 handleNodeCombination callback fired:', event.detail);
    const { targetNodeId, newBlock } = event.detail;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === targetNodeId) {
          const existingCombined = (node.data.combinedBlocks as any[]) || [];
          const updatedCombinedBlocks = [...existingCombined, newBlock];

          // Check if this is an agent node
          const isAgentNode = node.data.isAgent;
          const baseLabel = isAgentNode
            ? String(node.data.label || '').replace(' Agent', '')
            : String(node.data.label || '');

          return {
            ...node,
            data: {
              ...node.data,
              combinedBlocks: updatedCombinedBlocks,
              label: isAgentNode
                ? `${baseLabel} Agent` // Keep agent designation
                : `${baseLabel} + ${newBlock.name}`, // Original behavior for non-agents
              description: `${node.data.description} | Processing: ${newBlock.description}`,
              nodeStatus: 'unsynced' // Reset to unsynced when modified
            }
          };
        }
        return node;
      })
    );

    // Add insight about the combination
    addInsight({
      content: `Added ${newBlock.name} to ${targetNodeId}. The node needs to be run again to process the new data.`,
      nodeId: targetNodeId
    });
  }, [setNodes, addInsight]);

  // Handle node minimization
  const handleNodeMinimize = useCallback((event: CustomEvent) => {
    console.log('📦 handleNodeMinimize callback fired:', event.detail);
    const { nodeId } = event.detail;

    // Find the node to minimize
    const nodeToMinimize = nodes.find(n => n.id === nodeId);
    if (nodeToMinimize) {
      // Convert ReactFlow node to CanvasNode format and add to store's minimized nodes
      const storeNode = {
        id: nodeToMinimize.id,
        type: nodeToMinimize.type || 'custom',
        position: nodeToMinimize.position,
        data: {
          id: nodeToMinimize.data.id as string,
          label: nodeToMinimize.data.label as string,
          description: nodeToMinimize.data.description as string,
          prompt: nodeToMinimize.data.prompt as string,
          blockType: nodeToMinimize.data.blockType as string,
          category: nodeToMinimize.data.category as string,
          combinedBlocks: nodeToMinimize.data.combinedBlocks as any[]
        }
      };

      // Add to store's minimized nodes directly
      const { minimizedNodes } = useCanvasStore.getState();
      useCanvasStore.setState({
        minimizedNodes: [...minimizedNodes, storeNode]
      });

      // Remove from local ReactFlow nodes
      setNodes((nds) => nds.filter(n => n.id !== nodeId));

      // Add insight about minimization
      addInsight({
        content: `Minimized ${nodeToMinimize.data.label}. You can restore it from the dock at the bottom of the screen.`,
        nodeId: nodeId
      });
    }
  }, [nodes, setNodes, addInsight]);

  // Handle node removal
  const handleNodeRemove = useCallback((event: CustomEvent) => {
    console.log('❌ handleNodeRemove callback fired:', event.detail);
    const { nodeId } = event.detail;

    // Find the node to remove
    const nodeToRemove = nodes.find(n => n.id === nodeId);
    if (nodeToRemove) {
      // Remove from store
      const { removeNode } = useCanvasStore.getState();
      removeNode(nodeId);

      // Remove from local ReactFlow nodes
      setNodes((nds) => nds.filter(n => n.id !== nodeId));

      // Add insight about removal
      addInsight({
        content: `Removed ${nodeToRemove.data.label} from the canvas. This action cannot be undone.`,
        nodeId: nodeId
      });
    }
  }, [nodes, setNodes, addInsight]);

  // Set up event listener for node combination
  useEffect(() => {
    console.log('👂 Setting up node combination event listener');
    const handleCombineEvent = (event: CustomEvent) => {
      handleNodeCombination(event);
    };

    const handleEdgeConfigureEvent = (event: CustomEvent) => {
      console.log('⚙️ Edge configuration event:', event.detail);
      const { edgeId, blockData } = event.detail;

      // Add insight about edge configuration
      addInsight({
        content: `Configured edge ${edgeId} with ${blockData.name}. This adds transformation logic to the data flow between nodes.`,
        edgeId: edgeId
      });

      // Here you could update edge data, show a configuration modal, etc.
      // For now, we'll just log and add an insight
      console.log(`Edge ${edgeId} configured with block:`, blockData);
    };

    const handleMinimizeEvent = (event: CustomEvent) => {
      handleNodeMinimize(event);
    };

    const handleRemoveEvent = (event: CustomEvent) => {
      handleNodeRemove(event);
    };

    window.addEventListener('combineNode', handleCombineEvent as EventListener);
    window.addEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);
    window.addEventListener('minimizeNode', handleMinimizeEvent as EventListener);
    window.addEventListener('removeNode', handleRemoveEvent as EventListener);

    return () => {
      console.log('🧹 Cleaning up event listeners');
      window.removeEventListener('combineNode', handleCombineEvent as EventListener);
      window.removeEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);
      window.removeEventListener('minimizeNode', handleMinimizeEvent as EventListener);
      window.removeEventListener('removeNode', handleRemoveEvent as EventListener);
    };
  }, [handleNodeCombination, handleNodeMinimize, handleNodeRemove, addInsight]);

  // Handle drag over for the canvas
  const handleCanvasDragOver = useCallback((event: React.DragEvent) => {
    console.log('🎯 onDragOver callback fired');
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drop on canvas
  const onDrop = useCallback((event: React.DragEvent) => {
    console.log('📦 onDrop callback fired');
    event.preventDefault();

    try {
      const dropData = JSON.parse(event.dataTransfer.getData('application/json'));

      // Check if it's an agent or a block
      if (dropData.isAgent) {
        // Agents create new nodes on canvas
        console.log('🤖 Dropping agent on canvas:', dropData.name);

        // Get the canvas bounds to calculate relative position
        const canvasElement = event.currentTarget as HTMLElement;
        const canvasBounds = canvasElement.getBoundingClientRect();

        // Calculate position relative to canvas
        const position = {
          x: event.clientX - canvasBounds.left - 100, // Offset to center the node
          y: event.clientY - canvasBounds.top - 40,
        };

        // Create new node from dropped agent
        const newNode = {
          id: `${dropData.id}-${Date.now()}`, // Make unique ID
          type: 'custom' as const,
          position,
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          data: {
            id: `${dropData.id}-${Date.now()}`,
            label: dropData.name.replace(' Agent', ''), // Remove "Agent" from label
            description: dropData.description,
            prompt: dropData.prompt,
            blockType: dropData.type, // Use the agent's category as blockType
            isAgent: true,
            nodeStatus: 'unsynced' // Start as unsynced (grey)
          },
        };

      // Add the new node
      setNodes((nds) => [...nds, newNode]);

        // Add insight about the new agent node
        addInsight({
          content: `Added ${dropData.name} to the canvas. This AI agent is ready to process data files that you drag to it.`,
          nodeId: newNode.id
        });
      } else {
        // Blocks can only be dropped on existing nodes, not on empty canvas
        console.log('📄 Block dropped on empty canvas - not allowed');
        addInsight({
          content: `Blocks can only be dropped on existing agent nodes. First create an agent, then drag blocks to it.`,
        });
      }

    } catch (error) {
      console.error('Failed to parse dropped data:', error);
    }
  }, [setNodes, addInsight]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('🖱️ onNodeClick callback fired for:', node.id);
    console.log('Node clicked:', node.id);
    setSelectedNode(node.id);

    // Add sample insight for node click
    addInsight({
      content: `Selected ${node.data.label}. This entity contains key relationships that could reveal important patterns in your data.`,
      nodeId: node.id
    });
  }, [setSelectedNode, addInsight]);

  // Disabled edge click handler
  const onEdgeClick = useCallback((_event: React.MouseEvent, _edge: Edge) => {
    // Edge interactions disabled for simplified user experience
    console.log('🚫 Edge interactions disabled for simplified user flow');
    return;
  }, []);

  return (
    <div
      className="w-full h-full"
      style={{
        background: `
          linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
      onDragOver={handleCanvasDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={[]} // Hide all edges for simplified user experience
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        attributionPosition="top-right"
        style={{
          background: 'transparent',
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose} // Disable connection handles
        elementsSelectable={true}
        nodesConnectable={false} // Disable node connection handles
        nodesDraggable={true}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        <Controls
          style={{
            right: '20px',
            left: 'auto',
            bottom: '90px',
            transform: 'translateY(-50%)',
            borderRadius: '8px',
            pointerEvents: 'all',
            // backdropFilter: 'blur(10px)',
          }}
          className="futuristic-controls"
        />
        <Background
          variant={BackgroundVariant.Lines}
          gap={50}
          size={2}
          color="blue"
          style={{
            opacity: 0.03,
          }}
        />
      </ReactFlow>

      {/* Dock for Minimized Nodes */}
      {minimizedNodes.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '75px',
            left: isDrawerExpanded ? '320px' : '60px', // Move right when drawer is expanded
            right: '30px',
            display: 'flex',
            gap: '2px',
            padding: '4px 8px 0px 8px',
            background: 'rgba(240, 242, 247, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px 8px 0px 0px',
            border: '1px solid rgba(203, 213, 225, 0.6)',
            borderBottom: 'none',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08), 0 -1px 3px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            width: 'fit-content',
            overflowX: 'auto',
            transition: 'left 0.3s ease-in-out', // Smooth transition for position change
          }}
        >
          {minimizedNodes.map((node) => {
            // Get category config for the node
            const getCategoryConfig = (type: string) => {
              switch (type) {
                case 'dataset':
                  return { icon: 'database', folderColor: '#3b82f6' };
                case 'filter':
                  return { icon: 'filter', folderColor: '#10b981' };
                case 'field':
                  return { icon: 'hash', folderColor: '#f59e0b' };
                case 'sql':
                  return { icon: 'code', folderColor: '#6366f1' };
                case 'visualization':
                  return { icon: 'bar-chart', folderColor: '#ec4899' };
                case 'narrative':
                  return { icon: 'file-text', folderColor: '#22c55e' };
                case 'workflow':
                  return { icon: 'workflow', folderColor: '#ef4444' };
                default:
                  return { icon: 'database', folderColor: '#64748b' };
              }
            };

            const config = getCategoryConfig(String(node.data.blockType || 'default'));

            return (
              <div
                key={node.id}
                onClick={() => {
                  // Restore node to canvas
                  const nodeToRestore = {
                    id: node.id,
                    type: 'custom' as const,
                    position: node.position,
                    targetPosition: Position.Top,
                    sourcePosition: Position.Bottom,
                    data: node.data,
                  };

                  // Add to ReactFlow nodes
                  setNodes((nds) => [...nds, nodeToRestore]);

                  // Remove from minimized in store
                  maximizeNode(node.id);

                  // Add insight about restoration
                  addInsight({
                    content: `Restored ${node.data.label} to the canvas. The directory is now available for interaction.`,
                    nodeId: node.id
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px 12px 16px',
                  borderRadius: '6px 6px 0px 0px',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(203, 213, 225, 0.8)',
                  borderBottom: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px',
                  maxWidth: '200px',
                  position: 'relative',
                  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 -4px 8px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 -2px 4px rgba(0, 0, 0, 0.05)';
                }}
                title={`Click to restore ${node.data.label}`}
              >
                {/* Tab indicator line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: `linear-gradient(90deg, ${config.folderColor} 0%, ${config.folderColor}cc 100%)`,
                    borderRadius: '3px 3px 0px 0px',
                  }}
                />

                {/* Folder icon - smaller for tab */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: `linear-gradient(135deg, ${config.folderColor}15 0%, ${config.folderColor}25 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={config.folderColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                  </svg>
                </div>

                {/* Tab title */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#374151',
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {String(node.data.label || '').replace(' Block', '')}
                  </div>
                </div>

                {/* Close button for tab */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove from minimized nodes
                    const { removeNode } = useCanvasStore.getState();
                    removeNode(node.id);
                  }}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.opacity = '0.6';
                  }}
                  title="Remove from dock"
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
