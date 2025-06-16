import { create } from 'zustand';

interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
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
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges })
}));

export type { CanvasNode, CanvasEdge, Insight }; 