export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  x: string;
  y: string;
  groupBy?: string;
  title?: string;
}

export interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text' | 'heading';
  title: string;
  content?: string;
  chartConfig?: ChartConfig;
  dataframeId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface QueryResult {
  columns: string[];
  data: any[][];
  totalRows: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sql?: string;
  chartConfig?: ChartConfig;
  queryResult?: QueryResult;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  tables: Table[];
  lastUpdated: Date;
}

export interface Table {
  name: string;
  columns: Column[];
  rowCount: number;
}

export interface Column {
  name: string;
  type: string;
  description?: string;
}

export interface AgentSuggestion {
  id: string;
  type: 'query' | 'chart' | 'dashboard';
  title: string;
  description: string;
  sql?: string;
  chartConfig?: ChartConfig;
  confidence: number;
} 