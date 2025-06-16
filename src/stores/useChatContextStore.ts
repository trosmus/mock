import { create } from 'zustand';
import type { Variable } from './useVariablesStore';
import type { ChartConfig } from './useChartConfigStore';

export interface ChatContext {
  source: 'sql' | 'chart' | 'widget' | 'manual';
  sql?: string;
  chartConfig?: ChartConfig;
  variables?: Variable[];
  description?: string;
  timestamp: Date;
}

interface ChatContextState {
  contexts: ChatContext[];
  currentContext: ChatContext | null;
  addContext: (context: Omit<ChatContext, 'timestamp'>) => void;
  setCurrentContext: (context: ChatContext | null) => void;
  clearContexts: () => void;
}

export const useChatContextStore = create<ChatContextState>((set) => ({
  contexts: [],
  currentContext: null,
  
  addContext: (contextData) => {
    const context: ChatContext = {
      ...contextData,
      timestamp: new Date()
    };
    
    set((state) => ({
      contexts: [context, ...state.contexts.slice(0, 9)], // Keep last 10
      currentContext: context
    }));
  },
  
  setCurrentContext: (context) => set({ currentContext: context }),
  
  clearContexts: () => set({ contexts: [], currentContext: null }),
})); 