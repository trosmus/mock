import { create } from 'zustand';

export interface SavedDocument {
  id: string;
  title: string;
  type: 'dashboard' | 'query' | 'chart' | 'analysis';
  description?: string;
  content: any; // The actual saved content (widgets, SQL, chart config, etc.)
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

interface SavedDocumentsState {
  documents: SavedDocument[];
  isExpanded: boolean;
  addDocument: (document: Omit<SavedDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<SavedDocument>) => void;
  removeDocument: (id: string) => void;
  getDocumentsByType: (type: SavedDocument['type']) => SavedDocument[];
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

export const useSavedDocumentsStore = create<SavedDocumentsState>((set, get) => ({
  documents: [
    // Mock data
    {
      id: 'doc-1',
      title: 'Healthcare Dashboard',
      type: 'dashboard',
      description: 'Patient demographics and diagnosis analysis',
      content: { widgets: [], layout: 'grid' },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['healthcare', 'patients']
    },
    {
      id: 'doc-2',
      title: 'Top Diagnoses Query',
      type: 'query',
      description: 'SQL query for most common diagnoses by age group',
      content: { sql: 'SELECT age_group, diagnosis, COUNT(*) FROM...' },
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      tags: ['sql', 'diagnoses']
    },
    {
      id: 'doc-3',
      title: 'Revenue Trends Chart',
      type: 'chart',
      description: 'Monthly revenue analysis with trend lines',
      content: { chartConfig: { type: 'line', x: 'month', y: 'revenue' } },
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      tags: ['revenue', 'trends']
    },
    {
      id: 'doc-4',
      title: 'Patient Flow Analysis',
      type: 'analysis',
      description: 'Chat conversation about patient admission patterns',
      content: { messages: [], insights: [] },
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      tags: ['analysis', 'patients', 'flow']
    }
  ],
  isExpanded: false,

  addDocument: (documentData) => {
    const document: SavedDocument = {
      ...documentData,
      id: `doc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      documents: [document, ...state.documents]
    }));
  },

  updateDocument: (id, updates) => {
    set((state) => ({
      documents: state.documents.map(doc => 
        doc.id === id 
          ? { ...doc, ...updates, updatedAt: new Date() }
          : doc
      )
    }));
  },

  removeDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter(doc => doc.id !== id)
    }));
  },

  getDocumentsByType: (type) => {
    return get().documents.filter(doc => doc.type === type);
  },

  toggleExpanded: () => {
    set((state) => ({ isExpanded: !state.isExpanded }));
  },

  setExpanded: (expanded) => {
    set({ isExpanded: expanded });
  }
})); 