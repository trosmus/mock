import { create } from 'zustand';

interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    id?: string;
    label: string;
    description?: string;
    prompt?: string;
    blockType?: string;
    category?: string;
    combinedBlocks?: any[];
    isAgent?: boolean;
  };
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
    relationship?: string;
  };
}

interface Insight {
  id: string;
  timestamp: number;
  content: string;
  nodeId?: string;
  edgeId?: string;
}

interface CanvasState {
  // Node and Edge data
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  
  // Selection and Focus
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  focusedPath: string[];
  
  // AI Insights
  insights: Insight[];
  currentInsight: string | null;
  
  // Modal state
  previewModalNodeId: string | null;
  
  // Minimized nodes
  minimizedNodes: CanvasNode[];
  
  // UI State
  isDrawerExpanded: boolean;
  
  // Actions
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  setFocusedPath: (path: string[]) => void;
  addInsight: (insight: Omit<Insight, 'id' | 'timestamp'>) => void;
  setCurrentInsight: (insight: string | null) => void;
  clearSelection: () => void;
  
  // Modal actions
  openPreviewModal: (nodeId: string) => void;
  closePreviewModal: () => void;
  
  // Node management
  minimizeNode: (nodeId: string) => void;
  maximizeNode: (nodeId: string) => void;
  removeNode: (nodeId: string) => void;
  
  // UI actions
  setDrawerExpanded: (expanded: boolean) => void;
  
  // Data management
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  focusedPath: [],
  insights: [],
  currentInsight: null,
  previewModalNodeId: null,
  minimizedNodes: [],
  isDrawerExpanded: false,

  // Actions
  setSelectedNode: (nodeId) => set({ 
    selectedNodeId: nodeId,
    selectedEdgeId: null // Clear edge selection when selecting node
  }),
  
  setSelectedEdge: (edgeId) => set({ 
    selectedEdgeId: edgeId,
    selectedNodeId: null // Clear node selection when selecting edge
  }),
  
  setFocusedPath: (path) => set({ focusedPath: path }),
  
  addInsight: (insight) => set((state) => ({
    insights: [
      ...state.insights,
      {
        ...insight,
        id: Date.now().toString(),
        timestamp: Date.now()
      }
    ]
  })),
  
  setCurrentInsight: (insight) => set({ currentInsight: insight }),
  
  clearSelection: () => set({
    selectedNodeId: null,
    selectedEdgeId: null,
    focusedPath: []
  }),
  
  openPreviewModal: (nodeId) => {
    console.log('🏪 Store openPreviewModal called with nodeId:', nodeId);
    set({ previewModalNodeId: nodeId });
    console.log('🏪 Store state after setting:', get().previewModalNodeId);
  },
  
  closePreviewModal: () => set({ 
    previewModalNodeId: null 
  }),
  
  minimizeNode: (nodeId) => set((state) => {
    const nodeToMinimize = state.nodes.find(n => n.id === nodeId);
    if (!nodeToMinimize) return state;
    
    return {
      nodes: state.nodes.filter(n => n.id !== nodeId),
      minimizedNodes: [...state.minimizedNodes, nodeToMinimize]
    };
  }),
  
  maximizeNode: (nodeId) => set((state) => {
    const nodeToRestore = state.minimizedNodes.find(n => n.id === nodeId);
    if (!nodeToRestore) return state;
    
    return {
      nodes: [...state.nodes, nodeToRestore],
      minimizedNodes: state.minimizedNodes.filter(n => n.id !== nodeId)
    };
  }),
  
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== nodeId),
    edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
  })),
  
  setDrawerExpanded: (expanded) => set({ isDrawerExpanded: expanded }),
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges })
}));

export type { CanvasNode, CanvasEdge, Insight }; 