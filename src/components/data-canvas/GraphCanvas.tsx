import React, { useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Position,
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
`;

// Sample data based on requirements - updated to reflect drawer blocks
const initialNodes: Node[] = [
  // Dataset Blocks
  {
    id: 'patients-dataset',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      id: 'patients-dataset',
      label: 'Patients Dataset Block',
      description: 'Represents the patients.csv table (demographics)',
      prompt: 'Load and analyze the patients dataset. Examine demographic patterns, age distributions, gender ratios, and identify any data quality issues. Provide insights on population characteristics and suggest potential cohorts for analysis.',
      blockType: 'dataset'
    },
  },
  {
    id: 'encounters-dataset',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      id: 'encounters-dataset',
      label: 'Encounters Dataset Block',
      description: 'Represents the encounters.csv table (healthcare visits)',
      prompt: 'Analyze healthcare encounters data to understand visit patterns, encounter types, seasonal trends, and utilization rates. Identify high-frequency patients and examine care continuity patterns.',
      blockType: 'dataset'
    },
  },
  // Commented out to improve performance
  // {
  //   id: 'medications-dataset',
  //   type: 'custom',
  //   position: { x: 0, y: 0 },
  //   data: {
  //     id: 'medications-dataset',
  //     label: 'Medications Dataset Block',
  //     description: 'Represents the medications.csv table (prescriptions)',
  //     prompt: 'Examine prescription patterns, medication adherence, drug interactions, and therapeutic classes. Identify polypharmacy cases and analyze prescribing trends across different patient populations.',
  //     blockType: 'dataset'
  //   },
  // },
  // Filter Blocks
  {
    id: 'age-range-filter',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      id: 'age-range-filter',
      label: 'Age Range Filter',
      description: 'Filter patients by age (e.g., 18–65)',
      prompt: 'Apply age-based filtering to focus analysis on specific age cohorts (e.g., 18-65 working age, 65+ elderly, pediatric populations). Analyze how health outcomes and utilization patterns vary across age groups.',
      blockType: 'filter'
    },
  },
  // Commented out to improve performance
  // {
  //   id: 'gender-filter',
  //   type: 'custom',
  //   position: { x: 0, y: 0 },
  //   data: {
  //     id: 'gender-filter',
  //     label: 'Gender Filter',
  //     description: 'Filter by gender (male, female, other)',
  //     prompt: 'Filter data by gender to examine gender-specific health patterns, condition prevalence differences, and care utilization disparities between male, female, and other gender categories.',
  //     blockType: 'filter'
  //   },
  // },
  // SQL/Query Blocks
  {
    id: 'count-patients',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      id: 'count-patients',
      label: 'Count Patients Block',
      description: 'SQL: SELECT COUNT(*) FROM patients',
      prompt: 'Calculate total patient counts and analyze population size metrics. Break down counts by key demographics, enrollment periods, and active vs inactive patients. Provide statistical summaries and growth trends.',
      blockType: 'sql'
    },
  },
  // Visualization Blocks
  {
    id: 'bar-chart',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      id: 'bar-chart',
      label: 'Bar Chart Block',
      description: 'Top 10 most common conditions',
      prompt: 'Create a bar chart visualization showing the top 10 most common medical conditions. Analyze prevalence rates, compare across demographics, and highlight significant patterns or outliers in the data.',
      blockType: 'visualization'
    },
  }
  // Commented out to improve performance
  // {
  //   id: 'line-chart',
  //   type: 'custom',
  //   position: { x: 0, y: 0 },
  //   data: {
  //     id: 'line-chart',
  //     label: 'Line Chart Block',
  //     description: 'Monthly encounter volume over time',
  //     prompt: 'Generate a line chart showing monthly encounter volume trends over time. Identify seasonal patterns, growth trends, and any anomalies. Correlate with external factors like flu seasons or policy changes.',
  //     blockType: 'visualization'
  //   },
  // },
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
  console.log('🌐 GraphCanvas render');

  const {
    setSelectedNode,
    setSelectedEdge,
    addInsight
  } = useCanvasStore();

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

  // Apply layout to initial data
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    console.log('📐 Layout calculation memoization recalculated');
    return getLayoutedElements(initialNodes, initialEdges);
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback((params: Connection) => {
    console.log('🔗 onConnect callback fired:', params);
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Handle node combination
  const handleNodeCombination = useCallback((event: CustomEvent) => {
    console.log('🔄 handleNodeCombination callback fired:', event.detail);
    const { targetNodeId, newBlock } = event.detail;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === targetNodeId) {
          const existingCombined = (node.data.combinedBlocks as any[]) || [];
          const updatedCombinedBlocks = [...existingCombined, newBlock];

          return {
            ...node,
            data: {
              ...node.data,
              combinedBlocks: updatedCombinedBlocks,
              label: `${node.data.label} + ${newBlock.name}`, // Keep full block name
              description: `Combined: ${node.data.description} + ${newBlock.description}`
            }
          };
        }
        return node;
      })
    );

    // Add insight about the combination
    addInsight({
      content: `Combined ${newBlock.name} with existing node. This creates a more complex workflow component that can handle multiple operations.`,
      nodeId: targetNodeId
    });
  }, [setNodes, addInsight]);

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

    window.addEventListener('combineNode', handleCombineEvent as EventListener);
    window.addEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);

    return () => {
      console.log('🧹 Cleaning up event listeners');
      window.removeEventListener('combineNode', handleCombineEvent as EventListener);
      window.removeEventListener('configureEdge', handleEdgeConfigureEvent as EventListener);
    };
  }, [handleNodeCombination, addInsight]);

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
      const blockData = JSON.parse(event.dataTransfer.getData('application/json'));

      // Get the canvas bounds to calculate relative position
      const canvasElement = event.currentTarget as HTMLElement;
      const canvasBounds = canvasElement.getBoundingClientRect();

      // Calculate position relative to canvas
      const position = {
        x: event.clientX - canvasBounds.left - 100, // Offset to center the node
        y: event.clientY - canvasBounds.top - 40,
      };

      // Create new node from dropped block
      const newNode = {
        id: `${blockData.id}-${Date.now()}`, // Make unique ID
        type: 'custom' as const,
        position,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        data: {
          id: `${blockData.id}-${Date.now()}`,
          label: blockData.name, // Keep full block name
          description: blockData.description,
          prompt: blockData.prompt,
          blockType: blockData.type
        },
      };

      // Add the new node
      setNodes((nds) => [...nds, newNode]);

      // Add insight about the new node
      addInsight({
        content: `Added ${blockData.name} to the canvas. This ${blockData.type} block can be connected to other nodes to build your data workflow.`,
        nodeId: newNode.id
      });

    } catch (error) {
      console.error('Failed to parse dropped block:', error);
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

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('🖱️ onEdgeClick callback fired for:', edge.id);
    console.log('Edge clicked:', edge.id);
    setSelectedEdge(edge.id);

    // Add sample insight for edge click
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    addInsight({
      content: `Analyzing relationship between ${sourceNode?.data.label} and ${targetNode?.data.label}. This connection shows ${edge.data?.relationship || 'a key relationship'} that could be explored further for insights.`,
      edgeId: edge.id
    });
  }, [setSelectedEdge, addInsight, nodes]);

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
        edges={edges}
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
      >
        <Controls
          style={{
            right: '20px',
            left: 'auto',
            bottom: '50px',
            transform: 'translateY(-50%)',
            borderRadius: '8px',
            pointerEvents: 'all',
            // backdropFilter: 'blur(10px)',
          }}
          className="futuristic-controls"
        />
        {/*<MiniMap*/}
        {/*  nodeColor={(node) => {*/}
        {/*    const blockType = String(node.data?.blockType || 'default');*/}
        {/*    if (selectedNodeId === node.id) {*/}
        {/*      // Return darker version of category color when selected*/}
        {/*      switch (blockType) {*/}
        {/*        case 'dataset': return '#1e40af';*/}
        {/*        case 'filter': return '#047857';*/}
        {/*        case 'field': return '#d97706';*/}
        {/*        case 'sql': return '#4338ca';*/}
        {/*        case 'visualization': return '#be185d';*/}
        {/*        case 'narrative': return '#15803d';*/}
        {/*        case 'workflow': return '#dc2626';*/}
        {/*        default: return '#1e40af';*/}
        {/*      }*/}
        {/*    }*/}
        {/*    // Return main category color when not selected*/}
        {/*    switch (blockType) {*/}
        {/*      case 'dataset': return '#3b82f6';*/}
        {/*      case 'filter': return '#10b981';*/}
        {/*      case 'field': return '#f59e0b';*/}
        {/*      case 'sql': return '#6366f1';*/}
        {/*      case 'visualization': return '#ec4899';*/}
        {/*      case 'narrative': return '#22c55e';*/}
        {/*      case 'workflow': return '#ef4444';*/}
        {/*      default: return '#64748b';*/}
        {/*    }*/}
        {/*  }}*/}
        {/*  nodeStrokeColor={(node) => {*/}
        {/*    const blockType = String(node.data?.blockType || 'default');*/}
        {/*    // Always use darker stroke for definition*/}
        {/*    switch (blockType) {*/}
        {/*      case 'dataset': return '#1e40af';*/}
        {/*      case 'filter': return '#047857';*/}
        {/*      case 'field': return '#d97706';*/}
        {/*      case 'sql': return '#4338ca';*/}
        {/*      case 'visualization': return '#be185d';*/}
        {/*      case 'narrative': return '#15803d';*/}
        {/*      case 'workflow': return '#dc2626';*/}
        {/*      default: return '#475569';*/}
        {/*    }*/}
        {/*  }}*/}
        {/*  nodeStrokeWidth={2}*/}
        {/*  maskColor="rgba(241, 245, 249, 0.85)"*/}
        {/*  position="top-right"*/}
        {/*  pannable*/}
        {/*  style={{*/}
        {/*    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',*/}
        {/*    border: '3px solid #3b82f6',*/}
        {/*    borderRadius: '12px',*/}
        {/*    backdropFilter: 'blur(15px)',*/}
        {/*    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2), 0 4px 15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',*/}
        {/*    transform: 'scale(1.5)',*/}
        {/*    transformOrigin: 'top right',*/}
        {/*    outline: '2px solid rgba(59, 130, 246, 0.6)',*/}
        {/*    outlineOffset: '3px',*/}
        {/*  }}*/}
        {/*/>*/}
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
    </div>
  );
};

export default GraphCanvas;
