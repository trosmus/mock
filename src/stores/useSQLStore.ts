import { create } from 'zustand';
import type { QueryResult } from '../types/index';
import { mockQueryResults } from '../mocks/mockData';

interface SQLState {
  currentSQL: string;
  queryResult: QueryResult | null;
  isExecuting: boolean;
  executionHistory: SQLExecution[];
  setCurrentSQL: (sql: string) => void;
  executeSQL: () => Promise<void>;
  addToHistory: (execution: SQLExecution) => void;
  clearHistory: () => void;
}

export interface SQLExecution {
  id: string;
  sql: string;
  timestamp: Date;
  result?: QueryResult;
  error?: string;
}

export const useSQLStore = create<SQLState>((set, get) => ({
  currentSQL: '',
  queryResult: null,
  isExecuting: false,
  executionHistory: [],
  
  setCurrentSQL: (sql) => set({ currentSQL: sql }),
  
  executeSQL: async () => {
    const { currentSQL } = get();
    if (!currentSQL.trim()) return;
    
    set({ isExecuting: true });
    
    // Simulate SQL execution with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        let result: QueryResult;
        
        // Simple logic to determine which mock result to return based on SQL content
        if (currentSQL.toLowerCase().includes('diagnos') || currentSQL.toLowerCase().includes('age')) {
          result = mockQueryResults['top-diagnoses'];
        } else if (currentSQL.toLowerCase().includes('sales') || currentSQL.toLowerCase().includes('revenue')) {
          result = mockQueryResults['sales-by-category'];
        } else {
          // Default result
          result = mockQueryResults['top-diagnoses'];
        }
        
        const execution: SQLExecution = {
          id: `exec-${Date.now()}`,
          sql: currentSQL,
          timestamp: new Date(),
          result
        };
        
        set({ 
          queryResult: result, 
          isExecuting: false 
        });
        
        get().addToHistory(execution);
        resolve();
      }, 1500);
    });
  },
  
  addToHistory: (execution) => 
    set((state) => ({
      executionHistory: [execution, ...state.executionHistory.slice(0, 9)] // Keep last 10
    })),
  
  clearHistory: () => set({ executionHistory: [] }),
})); 