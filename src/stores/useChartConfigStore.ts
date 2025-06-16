import { create } from 'zustand';
import type { Variable } from './useVariablesStore';

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'table';
  title: string;
  xAxis?: Variable;
  yAxis?: Variable;
  groupBy?: Variable;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  theme?: 'light' | 'dark';
  filters?: ChartFilter[];
  sortBy?: 'asc' | 'desc';
  limit?: number;
}

export interface ChartFilter {
  variable: Variable;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
}

interface ChartConfigState {
  currentConfig: ChartConfig;
  savedConfigs: ChartConfig[];
  updateConfig: (updates: Partial<ChartConfig>) => void;
  setXAxis: (variable: Variable) => void;
  setYAxis: (variable: Variable) => void;
  setGroupBy: (variable: Variable) => void;
  addFilter: (filter: ChartFilter) => void;
  removeFilter: (index: number) => void;
  saveConfig: () => void;
  loadConfig: (config: ChartConfig) => void;
  resetConfig: () => void;
}

const defaultConfig: ChartConfig = {
  id: '',
  type: 'bar',
  title: 'New Chart',
  xAxis: undefined,
  yAxis: undefined,
  groupBy: undefined,
  aggregation: undefined,
  theme: undefined,
  filters: [],
  sortBy: 'desc',
  limit: 100,
};

export const useChartConfigStore = create<ChartConfigState>((set, get) => ({
  currentConfig: { ...defaultConfig },
  savedConfigs: [],
  
  updateConfig: (updates) => 
    set((state) => ({
      currentConfig: { ...state.currentConfig, ...updates }
    })),
  
  setXAxis: (variable) => 
    set((state) => ({
      currentConfig: { ...state.currentConfig, xAxis: variable }
    })),
  
  setYAxis: (variable) => 
    set((state) => ({
      currentConfig: { ...state.currentConfig, yAxis: variable }
    })),
  
  setGroupBy: (variable) => 
    set((state) => ({
      currentConfig: { ...state.currentConfig, groupBy: variable }
    })),
  
  addFilter: (filter) => 
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        filters: [...state.currentConfig.filters || [], filter]
      }
    })),
  
  removeFilter: (index) => 
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        filters: state.currentConfig.filters?.filter((_, i) => i !== index) || []
      }
    })),
  
  saveConfig: () => 
    set((state) => {
      const configToSave = { ...state.currentConfig, id: `chart-${Date.now()}` };
      return {
        savedConfigs: [...state.savedConfigs, configToSave],
        currentConfig: configToSave
      };
    }),
  
  loadConfig: (config) => 
    set({ currentConfig: { ...config } }),
  
  resetConfig: () => 
    set({ currentConfig: { ...defaultConfig } }),
})); 