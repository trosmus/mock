import { create } from 'zustand';
import type { ChatMessage, Widget, QueryResult, AgentSuggestion, Dataset } from '../types/index';
import { mockDatasets, mockAgentSuggestions, mockWidgets, mockChatMessages } from '../mocks/mockData';

interface AppState {
  // Chat state
  chatMessages: ChatMessage[];
  isLoading: boolean;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  
  // SQL state
  currentSQL: string;
  queryResult: QueryResult | null;
  setCurrentSQL: (sql: string) => void;
  setQueryResult: (result: QueryResult | null) => void;
  
  // Dashboard/Widgets state
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  setWidgets: (widgets: Widget[]) => void;
  
  // Agent suggestions
  agentSuggestions: AgentSuggestion[];
  setAgentSuggestions: (suggestions: AgentSuggestion[]) => void;
  
  // Datasets
  datasets: Dataset[];
  setDatasets: (datasets: Dataset[]) => void;
  
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  chatMessages: mockChatMessages,
  isLoading: false,
  currentSQL: '',
  queryResult: null,
  widgets: mockWidgets,
  agentSuggestions: mockAgentSuggestions,
  datasets: mockDatasets,
  activeTab: 'dashboards',
  sidebarOpen: true,
  
  // Chat actions
  addChatMessage: (message) => 
    set((state) => ({ 
      chatMessages: [...state.chatMessages, message] 
    })),
  
  setChatMessages: (messages) => 
    set({ chatMessages: messages }),
  
  setLoading: (loading) => 
    set({ isLoading: loading }),
  
  // SQL actions
  setCurrentSQL: (sql) => 
    set({ currentSQL: sql }),
  
  setQueryResult: (result) => 
    set({ queryResult: result }),
  
  // Widget actions
  addWidget: (widget) => 
    set((state) => ({ 
      widgets: [...state.widgets, widget] 
    })),
  
  updateWidget: (id, updates) => 
    set((state) => ({
      widgets: state.widgets.map(w => 
        w.id === id ? { ...w, ...updates } : w
      )
    })),
  
  removeWidget: (id) => 
    set((state) => ({
      widgets: state.widgets.filter(w => w.id !== id)
    })),
  
  setWidgets: (widgets) => 
    set({ widgets }),
  
  // Agent suggestions actions
  setAgentSuggestions: (suggestions) => 
    set({ agentSuggestions: suggestions }),
  
  // Datasets actions
  setDatasets: (datasets) => 
    set({ datasets }),
  
  // UI actions
  setActiveTab: (tab) => 
    set({ activeTab: tab }),
    
  setSidebarOpen: (open) => 
    set({ sidebarOpen: open }),
})); 