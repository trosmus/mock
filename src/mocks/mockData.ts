import type { Dataset, QueryResult, AgentSuggestion, ChatMessage, Widget } from '../types/index';

export const mockDatasets: Dataset[] = [
  {
    id: 'healthcare-db',
    name: 'Healthcare Analytics',
    description: 'Patient records, diagnoses, and treatment outcomes',
    tables: [
      {
        name: 'patients',
        columns: [
          { name: 'patient_id', type: 'INTEGER', description: 'Unique patient identifier' },
          { name: 'age_group', type: 'VARCHAR', description: 'Age group (18-30, 31-50, 51+)' },
          { name: 'gender', type: 'VARCHAR', description: 'Patient gender' },
          { name: 'admission_date', type: 'DATE', description: 'Date of admission' },
        ],
        rowCount: 12543
      },
      {
        name: 'diagnoses',
        columns: [
          { name: 'diagnosis_id', type: 'INTEGER', description: 'Unique diagnosis identifier' },
          { name: 'patient_id', type: 'INTEGER', description: 'Patient foreign key' },
          { name: 'diagnosis', type: 'VARCHAR', description: 'Primary diagnosis' },
          { name: 'severity', type: 'VARCHAR', description: 'Condition severity (Mild, Moderate, Severe)' },
        ],
        rowCount: 8234
      }
    ],
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'sales-db',
    name: 'Sales Performance',
    description: 'Revenue, transactions, and customer data',
    tables: [
      {
        name: 'transactions',
        columns: [
          { name: 'transaction_id', type: 'INTEGER', description: 'Unique transaction ID' },
          { name: 'customer_id', type: 'INTEGER', description: 'Customer identifier' },
          { name: 'amount', type: 'DECIMAL', description: 'Transaction amount' },
          { name: 'date', type: 'DATE', description: 'Transaction date' },
          { name: 'product_category', type: 'VARCHAR', description: 'Product category' },
        ],
        rowCount: 45632
      }
    ],
    lastUpdated: new Date('2024-01-20')
  }
];

export const mockQueryResults: { [key: string]: QueryResult } = {
  'top-diagnoses': {
    columns: ['age_group', 'diagnosis', 'count'],
    data: [
      ['18-30', 'Hypertension', 245],
      ['31-50', 'Diabetes', 189],
      ['51+', 'Heart Disease', 156],
      ['18-30', 'Anxiety', 134],
      ['31-50', 'Hypertension', 123],
      ['51+', 'Arthritis', 98]
    ],
    totalRows: 6
  },
  'sales-by-category': {
    columns: ['product_category', 'total_revenue', 'avg_transaction'],
    data: [
      ['Electronics', 125000, 450.25],
      ['Clothing', 89000, 85.50],
      ['Home & Garden', 67000, 120.75],
      ['Books', 23000, 32.40]
    ],
    totalRows: 4
  },
  'patient-demographics': {
    columns: ['age_group', 'gender', 'count', 'avg_stay_days'],
    data: [
      ['18-30', 'Male', 1234, 3.2],
      ['18-30', 'Female', 1456, 2.8],
      ['31-50', 'Male', 2345, 4.1],
      ['31-50', 'Female', 2567, 3.9],
      ['51+', 'Male', 1876, 5.3],
      ['51+', 'Female', 2134, 4.7]
    ],
    totalRows: 6
  },
  'severity-distribution': {
    columns: ['severity', 'count', 'percentage'],
    data: [
      ['Mild', 3456, 42.0],
      ['Moderate', 3124, 38.0],
      ['Severe', 1654, 20.0]
    ],
    totalRows: 3
  },
  'monthly-admissions': {
    columns: ['month', 'admissions', 'readmissions'],
    data: [
      ['Jan', 456, 34],
      ['Feb', 423, 28],
      ['Mar', 489, 41],
      ['Apr', 512, 38],
      ['May', 534, 45],
      ['Jun', 498, 36],
      ['Jul', 467, 32],
      ['Aug', 445, 29],
      ['Sep', 478, 37],
      ['Oct', 501, 42],
      ['Nov', 489, 39],
      ['Dec', 456, 33]
    ],
    totalRows: 12
  },
  'diagnosis-table': {
    columns: ['patient_id', 'diagnosis', 'severity', 'admission_date', 'age_group'],
    data: [
      [1001, 'Hypertension', 'Moderate', '2024-01-15', '31-50'],
      [1002, 'Diabetes', 'Mild', '2024-01-16', '51+'],
      [1003, 'Heart Disease', 'Severe', '2024-01-17', '51+'],
      [1004, 'Anxiety', 'Mild', '2024-01-18', '18-30'],
      [1005, 'Arthritis', 'Moderate', '2024-01-19', '51+'],
      [1006, 'Hypertension', 'Severe', '2024-01-20', '31-50'],
      [1007, 'Diabetes', 'Moderate', '2024-01-21', '31-50'],
      [1008, 'Anxiety', 'Mild', '2024-01-22', '18-30'],
      [1009, 'Heart Disease', 'Severe', '2024-01-23', '51+'],
      [1010, 'Arthritis', 'Mild', '2024-01-24', '51+']
    ],
    totalRows: 10
  }
};

export const mockAgentSuggestions: AgentSuggestion[] = [
  {
    id: 'suggestion-1',
    type: 'query',
    title: 'Top Diagnoses by Age Group',
    description: 'Analyze the most common diagnoses across different age groups',
    sql: 'SELECT age_group, diagnosis, COUNT(*) as count FROM patients p JOIN diagnoses d ON p.patient_id = d.patient_id GROUP BY age_group, diagnosis ORDER BY count DESC LIMIT 10',
    chartConfig: {
      type: 'bar',
      x: 'age_group',
      y: 'count',
      groupBy: 'diagnosis',
      title: 'Top Diagnoses by Age Group'
    },
    confidence: 0.92
  },
  {
    id: 'suggestion-2',
    type: 'chart',
    title: 'Revenue Trends Over Time',
    description: 'Monthly revenue trends with seasonal patterns',
    sql: 'SELECT DATE_TRUNC(\'month\', date) as month, SUM(amount) as revenue FROM transactions GROUP BY month ORDER BY month',
    chartConfig: {
      type: 'line',
      x: 'month',
      y: 'revenue',
      title: 'Monthly Revenue Trends'
    },
    confidence: 0.88
  },
  {
    id: 'suggestion-3',
    type: 'dashboard',
    title: 'Healthcare Overview Dashboard',
    description: 'Comprehensive view of patient demographics and diagnoses',
    confidence: 0.85
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    type: 'user',
    content: 'Show me the top 10 diagnoses by age group',
    timestamp: new Date()
  },
  {
    id: 'msg-2',
    type: 'assistant',
    content: 'I\'ll analyze the top diagnoses by age group. Based on the metadata, I can see we have patient and diagnosis tables that we can join to get this information.',
    timestamp: new Date(),
    sql: 'SELECT age_group, diagnosis, COUNT(*) as count FROM patients p JOIN diagnoses d ON p.patient_id = d.patient_id GROUP BY age_group, diagnosis ORDER BY count DESC LIMIT 10',
    chartConfig: {
      type: 'bar',
      x: 'age_group',
      y: 'count',
      groupBy: 'diagnosis',
      title: 'Top Diagnoses by Age Group'
    },
    queryResult: mockQueryResults['top-diagnoses']
  }
];

export const mockWidgets: Widget[] = [
  // Top row - Main chart and metrics
  {
    id: 'widget-1',
    type: 'chart',
    title: 'Top Diagnoses by Age',
    chartConfig: {
      type: 'bar',
      x: 'age_group',
      y: 'count',
      groupBy: 'diagnosis',
      title: 'Top Diagnoses by Age Group'
    },
    dataframeId: 'top-diagnoses',
    x: 0,
    y: 0,
    w: 6,
    h: 4
  },
  {
    id: 'widget-2',
    type: 'metric',
    title: 'Total Patients',
    dataframeId: 'patient-count',
    x: 6,
    y: 0,
    w: 3,
    h: 2
  },
  {
    id: 'widget-7',
    type: 'metric',
    title: 'Average Revenue',
    dataframeId: 'avg-revenue',
    x: 9,
    y: 0,
    w: 3,
    h: 2
  },
  
  // Second row - Header and text
  {
    id: 'widget-4',
    type: 'heading',
    title: 'Healthcare Analytics',
    content: 'Patient Health Overview',
    dataframeId: 'none',
    x: 6,
    y: 2,
    w: 6,
    h: 1
  },
  {
    id: 'widget-5',
    type: 'text',
    title: 'Key Insights',
    content: 'Our analysis shows that hypertension is the leading diagnosis across age groups. The 31-50 age group shows the highest diversity in conditions, while the 51+ group has more severe chronic conditions.',
    dataframeId: 'none',
    x: 6,
    y: 3,
    w: 6,
    h: 2
  },
  
  // Third row - Charts
  {
    id: 'widget-3',
    type: 'chart',
    title: 'Revenue by Category',
    chartConfig: {
      type: 'pie',
      x: 'product_category',
      y: 'total_revenue',
      title: 'Revenue Distribution'
    },
    dataframeId: 'sales-by-category',
    x: 0,
    y: 4,
    w: 4,
    h: 4
  },
  {
    id: 'widget-6',
    type: 'chart',
    title: 'Monthly Admissions',
    chartConfig: {
      type: 'line',
      x: 'month',
      y: 'admissions',
      title: 'Patient Admissions Trend'
    },
    dataframeId: 'monthly-admissions',
    x: 4,
    y: 5,
    w: 4,
    h: 3
  },
  {
    id: 'widget-8',
    type: 'chart',
    title: 'Severity Distribution',
    chartConfig: {
      type: 'pie',
      x: 'severity',
      y: 'count',
      title: 'Diagnosis Severity Breakdown'
    },
    dataframeId: 'severity-data',
    x: 8,
    y: 5,
    w: 4,
    h: 3
  }
];

// Mock AI agent responses
export const mockAgentResponse = (prompt: string): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('diagnos') && lowerPrompt.includes('age')) {
        resolve({
          id: `msg-${Date.now()}`,
          type: 'assistant',
          content: 'I\'ve analyzed the healthcare data and found the top diagnoses by age group. The query shows interesting patterns - hypertension is most common in younger adults, while heart disease dominates the 51+ age group.',
          timestamp: new Date(),
          sql: 'SELECT age_group, diagnosis, COUNT(*) as count FROM patients p JOIN diagnoses d ON p.patient_id = d.patient_id GROUP BY age_group, diagnosis ORDER BY count DESC LIMIT 10',
          chartConfig: {
            type: 'bar',
            x: 'age_group',
            y: 'count',
            groupBy: 'diagnosis',
            title: 'Top Diagnoses by Age Group'
          },
          queryResult: mockQueryResults['top-diagnoses']
        });
      } else if (lowerPrompt.includes('sales') || lowerPrompt.includes('revenue')) {
        resolve({
          id: `msg-${Date.now()}`,
          type: 'assistant',
          content: 'Here\'s the sales analysis by product category. Electronics leads in total revenue, though clothing has the highest transaction volume.',
          timestamp: new Date(),
          sql: 'SELECT product_category, SUM(amount) as total_revenue, AVG(amount) as avg_transaction FROM transactions GROUP BY product_category ORDER BY total_revenue DESC',
          chartConfig: {
            type: 'bar',
            x: 'product_category',
            y: 'total_revenue',
            title: 'Revenue by Product Category'
          },
          queryResult: mockQueryResults['sales-by-category']
        });
      } else {
        resolve({
          id: `msg-${Date.now()}`,
          type: 'assistant',
          content: 'I can help you analyze your data! Based on the available metadata, I can assist with queries about patient demographics, diagnoses, sales data, and more. What specific analysis would you like to see?',
          timestamp: new Date()
        });
      }
    }, 1500);
  });
}; 