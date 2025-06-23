import { Users, Pill, Activity } from 'lucide-react';

// Define the exploration paths
export const explorationPaths = [
  {
    id: 'demographics-utilization',
    title: 'Demographics & Utilization Path',
    icon: Users,
    question: 'Jak wygląda struktura populacji pacjentów i jak często korzystają z opieki medycznej?',
    description: 'Analyze patient population structure and healthcare utilization patterns',
    color: '#3b82f6',
    steps: [
      {
        id: 'patient-demographics-query',
        label: 'Patient Demographics Query',
        type: 'sql',
        description: 'Query patient demographics data to understand population structure',
        insight: 'Population of 12,847 patients with median age of 44 years, 52% female'
      },
      {
        id: 'age-range-filter', 
        label: 'Age Range Filter',
        type: 'filter',
        description: 'Filter patients by age cohorts for demographic analysis',
        insight: 'Elderly patients (65+) represent 18% but drive 45% of encounters'
      },
      {
        id: 'gender-filter',
        label: 'Gender Filter', 
        type: 'filter',
        description: 'Apply gender-based filtering for comparative analysis',
        insight: 'Female patients show 20% higher preventive care engagement'
      },
      {
        id: 'population-pyramid-chart',
        label: 'Population Pyramid Chart Block',
        type: 'visualization',
        description: 'Visualize age and gender distribution as population pyramid',
        insight: 'Population aging trend visible with expanding 50+ cohorts'
      },
      {
        id: 'monthly-encounters-query',
        label: 'Monthly Encounters Query',
        type: 'sql', 
        description: 'Query monthly encounter patterns to analyze utilization',
        insight: 'Average 5,200 encounters per month with seasonal variation'
      },
      {
        id: 'line-chart-block',
        label: 'Line Chart Block',
        type: 'visualization',
        description: 'Display monthly encounter trends over time',
        insight: 'Clear seasonal pattern with Q1 spike due to flu season'
      },
      {
        id: 'healthcare-utilization-narrative',
        label: 'Healthcare Utilization Narrative Block',
        type: 'narrative',
        description: 'Generate insights about healthcare utilization patterns',
        insight: 'Population shows aging trend with increased chronic care needs'
      }
    ]
  },
  {
    id: 'medication-patterns',
    title: 'Medication Patterns & Safety Path',
    icon: Pill,
    question: 'Jakie są wzorce przepisywania leków i jak można zoptymalizować bezpieczeństwo farmakoterapii?',
    description: 'Analyze medication prescription patterns, drug interactions, and pharmaceutical safety trends',
    color: '#10b981',
    steps: [
      {
        id: 'medication-dataset-query',
        label: 'Medication Dataset Query',
        type: 'sql',
        description: 'Query comprehensive medication prescription data across all patients',
        insight: '127,340 prescriptions analyzed across 8,943 unique medications with 94% data completeness'
      },
      {
        id: 'drug-class-filter',
        label: 'Drug Class Filter',
        type: 'filter',
        description: 'Filter medications by therapeutic drug classes and categories',
        insight: 'Cardiovascular drugs (23%) and CNS medications (18%) dominate prescriptions'
      },
      {
        id: 'prescription-frequency-analysis',
        label: 'Prescription Frequency Analysis',
        type: 'sql',
        description: 'Analyze prescription frequency patterns and dosing trends',
        insight: 'Top 10 medications account for 34% of all prescriptions, indicating concentration'
      },
      {
        id: 'drug-interaction-matrix',
        label: 'Drug Interaction Matrix',
        type: 'visualization',
        description: 'Create interaction matrix showing potential drug-drug interactions',
        insight: '2,847 potential interactions identified, 312 classified as high-severity'
      },
      {
        id: 'temporal-prescribing-trends',
        label: 'Temporal Prescribing Trends',
        type: 'sql',
        description: 'Query temporal patterns in medication prescribing over time',
        insight: 'Seasonal trends show 28% increase in antibiotic prescriptions during winter months'
      },
      {
        id: 'safety-heatmap-visualization',
        label: 'Safety Heatmap Visualization',
        type: 'visualization',
        description: 'Generate heatmap of medication safety events and adverse reactions',
        insight: 'Polypharmacy patients (5+ medications) show 3.2x higher adverse event rates'
      },
      {
        id: 'pharmaceutical-insights-narrative',
        label: 'Pharmaceutical Safety Insights',
        type: 'narrative',
        description: 'Generate comprehensive insights about medication safety and optimization opportunities',
        insight: 'AI-identified 1,247 optimization opportunities including dose adjustments and safer alternatives'
      }
    ]
  },
  {
    id: 'clinical-outcomes',
    title: 'Clinical Outcomes & Quality Path',
    icon: Activity,
    question: 'How are our clinical outcomes performing and where are the biggest quality improvement opportunities?',
    description: 'Analyze clinical outcomes, quality metrics, and identify improvement opportunities across care pathways',
    color: '#ef4444',
    steps: [
      {
        id: 'outcomes-overview-query',
        label: 'Clinical Outcomes Overview Query',
        type: 'sql',
        description: 'Query comprehensive clinical outcomes data including mortality, readmissions, and complications',
        insight: '30-day readmission rate of 8.2% with mortality rate of 1.4%, both below national averages'
      },
      {
        id: 'condition-filter',
        label: 'Medical Condition Filter',
        type: 'filter',
        description: 'Filter by different medical conditions and diagnostic categories for focused analysis',
        insight: 'Cardiovascular conditions (34%) show best outcomes, respiratory conditions need improvement'
      },
      {
        id: 'quality-metrics-analysis',
        label: 'Quality Metrics Analysis',
        type: 'sql',
        description: 'Analyze quality indicators across different care pathways and provider types',
        insight: 'Preventive care metrics exceed targets by 15%, chronic care management at 87% compliance'
      },
      {
        id: 'outcomes-trends-chart',
        label: 'Clinical Outcomes Trends Chart',
        type: 'visualization',
        description: 'Visualize clinical outcome trends and quality improvements over time',
        insight: 'Steady improvement in outcomes over 18 months with 12% reduction in complications'
      },
      {
        id: 'risk-stratification-query',
        label: 'Risk Stratification Query',
        type: 'sql',
        description: 'Query patient risk factors and stratify by clinical complexity and comorbidities',
        insight: 'High-risk patients (15%) account for 48% of adverse events and 62% of costs'
      },
      {
        id: 'quality-dashboard',
        label: 'Quality Performance Dashboard',
        type: 'visualization',
        description: 'Create comprehensive dashboard showing quality KPIs and outcome metrics',
        insight: 'Overall quality score 4.2/5 with excellent infection control (99.1%) and patient safety'
      },
      {
        id: 'clinical-insights',
        label: 'Clinical Quality Insights',
        type: 'narrative',
        description: 'Generate strategic insights for improving clinical outcomes and quality metrics',
        insight: 'Focus on high-risk patient protocols and chronic care management to improve outcomes by 18%'
      }
    ]
  }
];

// Mind map data showing the demographics exploration path with workflow steps + alternative options
export const mindMapData = [
  // Central starting point
  { 
    id: 'patients-dataset', 
    label: 'Patients\nDataset', 
    type: 'hub',
    description: 'Central healthcare data hub - starting point for all analysis paths'
  },
  
  // Demographics & Utilization Path (Path 1) - Blue theme - SELECTED PATH
  { 
    id: 'demographics-query', 
    label: 'Patient Demographics\nQuery', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 1,
    selected: true,
    description: 'Query patient demographics data to understand population structure'
  },
  { 
    id: 'age-filter', 
    label: 'Age Range\nFilter', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 2,
    selected: true,
    description: 'Filter patients by age cohorts for demographic analysis'
  },
  { 
    id: 'gender-filter', 
    label: 'Gender\nFilter', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 3,
    selected: true,
    description: 'Apply gender-based filtering for comparative analysis'
  },
  { 
    id: 'population-pyramid', 
    label: 'Population Pyramid\nChart', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 4,
    selected: true,
    description: 'Visualize age and gender distribution as population pyramid'
  },
  { 
    id: 'encounters-query', 
    label: 'Monthly Encounters\nQuery', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 5,
    selected: true,
    description: 'Query monthly encounter patterns to analyze utilization'
  },
  { 
    id: 'line-chart', 
    label: 'Line Chart\nBlock', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 6,
    selected: true,
    description: 'Display monthly encounter trends over time'
  },
  { 
    id: 'utilization-narrative', 
    label: 'Healthcare Utilization\nNarrative', 
    type: 'path1',
    pathId: 'demographics-utilization',
    step: 7,
    selected: true,
    description: 'Generate insights about healthcare utilization patterns'
  },

  // Medications Path (Path 2) - Green theme
  { 
    id: 'medications-dataset', 
    label: 'Medications\nDataset', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 1,
    description: 'Central medication data hub - comprehensive prescription database'
  },
  { 
    id: 'medication-query', 
    label: 'Medication Dataset\nQuery', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 2,
    description: 'Query comprehensive medication prescription data across all patients'
  },
  { 
    id: 'drug-class-filter', 
    label: 'Drug Class\nFilter', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 3,
    description: 'Filter medications by therapeutic drug classes and categories'
  },
  { 
    id: 'prescription-analysis', 
    label: 'Prescription Frequency\nAnalysis', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 4,
    description: 'Analyze prescription frequency patterns and dosing trends'
  },
  { 
    id: 'interaction-matrix', 
    label: 'Drug Interaction\nMatrix', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 5,
    description: 'Create interaction matrix showing potential drug-drug interactions'
  },
  { 
    id: 'temporal-trends', 
    label: 'Temporal Prescribing\nTrends', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 6,
    description: 'Query temporal patterns in medication prescribing over time'
  },
  { 
    id: 'safety-heatmap', 
    label: 'Safety Heatmap\nVisualization', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 7,
    description: 'Generate heatmap of medication safety events and adverse reactions'
  },
  { 
    id: 'pharma-insights', 
    label: 'Pharmaceutical Safety\nInsights', 
    type: 'path2',
    pathId: 'medication-patterns',
    step: 8,
    description: 'Generate comprehensive insights about medication safety and optimization'
  },

  // Clinical Outcomes Path (Path 3) - Red theme - Goes LEFT from Patients Dataset
  { 
    id: 'outcomes-overview', 
    label: 'Clinical Outcomes\nOverview Query', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 1,
    description: 'Query comprehensive clinical outcomes including mortality, readmissions, and complications'
  },
  { 
    id: 'condition-filter', 
    label: 'Medical Condition\nFilter', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 2,
    description: 'Filter by different medical conditions and diagnostic categories'
  },
  { 
    id: 'quality-analysis', 
    label: 'Quality Metrics\nAnalysis', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 3,
    description: 'Analyze quality indicators across different care pathways and provider types'
  },
  { 
    id: 'outcomes-chart', 
    label: 'Clinical Outcomes\nTrends Chart', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 4,
    description: 'Visualize clinical outcome trends and quality improvements over time'
  },
  { 
    id: 'risk-stratification', 
    label: 'Risk Stratification\nQuery', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 5,
    description: 'Query patient risk factors and stratify by clinical complexity'
  },
  { 
    id: 'quality-dashboard', 
    label: 'Quality Performance\nDashboard', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 6,
    description: 'Create comprehensive dashboard showing quality KPIs and outcome metrics'
  },
  { 
    id: 'clinical-insights', 
    label: 'Clinical Quality\nInsights', 
    type: 'path3',
    pathId: 'clinical-outcomes',
    step: 7,
    description: 'Generate strategic insights for improving clinical outcomes and quality'
  },

  // ALTERNATIVE OPTIONS - Starting from patients-dataset (Step 0 alternatives)
  { 
    id: 'alt-outcomes-analysis', 
    label: 'Patient Outcomes\nAnalysis', 
    type: 'alternative',
    step: 1,
    parentId: 'patients-dataset',
    description: 'Alternative: Analyze patient health outcomes and recovery rates'
  },
  { 
    id: 'alt-condition-analysis', 
    label: 'Condition\nAnalysis', 
    type: 'alternative',
    step: 1,
    parentId: 'patients-dataset',
    description: 'Alternative: Analyze medical condition prevalence'
  },

  // ALTERNATIVE OPTIONS for Demographics Path (Step 1 alternatives)
  { 
    id: 'alt-demo-geographic', 
    label: 'Geographic\nDistribution Query', 
    type: 'alternative',
    step: 2,
    parentId: 'demographics-query',
    description: 'Alternative: Analyze patient distribution by geographic regions'
  },
  { 
    id: 'alt-demo-insurance', 
    label: 'Insurance Type\nAnalysis', 
    type: 'alternative',
    step: 2,
    parentId: 'demographics-query',
    description: 'Alternative: Examine patient insurance coverage patterns'
  },
  { 
    id: 'alt-demo-socioeconomic', 
    label: 'Socioeconomic\nFactors', 
    type: 'alternative',
    step: 2,
    parentId: 'demographics-query',
    description: 'Alternative: Study socioeconomic determinants of health'
  },

  // ALTERNATIVE OPTIONS for Age Filter (Step 2 alternatives)
  { 
    id: 'alt-age-cohort', 
    label: 'Age Cohort\nAnalysis', 
    type: 'alternative',
    step: 3,
    parentId: 'age-filter',
    description: 'Alternative: Analyze generational cohorts and health patterns'
  },
  { 
    id: 'alt-age-distribution', 
    label: 'Age Distribution\nHistogram', 
    type: 'alternative',
    step: 3,
    parentId: 'age-filter',
    description: 'Alternative: Create detailed age distribution visualization'
  },
  { 
    id: 'alt-age-comorbidity', 
    label: 'Age-Related\nComorbidity', 
    type: 'alternative',
    step: 3,
    parentId: 'age-filter',
    description: 'Alternative: Study age-related disease patterns'
  },

  // ALTERNATIVE OPTIONS for Gender Filter (Step 3 alternatives)
  { 
    id: 'alt-gender-outcomes', 
    label: 'Gender-Based\nOutcomes', 
    type: 'alternative',
    step: 4,
    parentId: 'gender-filter',
    description: 'Alternative: Analyze health outcomes by gender'
  },
  { 
    id: 'alt-gender-screening', 
    label: 'Gender-Specific\nScreening', 
    type: 'alternative',
    step: 4,
    parentId: 'gender-filter',
    description: 'Alternative: Study gender-specific screening patterns'
  },
  { 
    id: 'alt-gender-utilization', 
    label: 'Gender Utilization\nPatterns', 
    type: 'alternative',
    step: 4,
    parentId: 'gender-filter',
    description: 'Alternative: Compare healthcare utilization by gender'
  },

  // ALTERNATIVE OPTIONS for Population Pyramid (Step 4 alternatives)
  { 
    id: 'alt-pyramid-treemap', 
    label: 'Population\nTreemap', 
    type: 'alternative',
    step: 5,
    parentId: 'population-pyramid',
    description: 'Alternative: Visualize population as interactive treemap'
  },
  { 
    id: 'alt-pyramid-sunburst', 
    label: 'Demographic\nSunburst Chart', 
    type: 'alternative',
    step: 5,
    parentId: 'population-pyramid',
    description: 'Alternative: Create multi-dimensional demographic sunburst'
  },
  { 
    id: 'alt-pyramid-heatmap', 
    label: 'Demographic\nHeatmap', 
    type: 'alternative',
    step: 5,
    parentId: 'population-pyramid',
    description: 'Alternative: Generate demographic density heatmap'
  },

  // ALTERNATIVE OPTIONS for Encounters Query (Step 5 alternatives)
  { 
    id: 'alt-encounters-seasonal', 
    label: 'Seasonal\nEncounter Patterns', 
    type: 'alternative',
    step: 6,
    parentId: 'encounters-query',
    description: 'Alternative: Analyze seasonal healthcare utilization patterns'
  },
  { 
    id: 'alt-encounters-provider', 
    label: 'Provider-Based\nEncounter Analysis', 
    type: 'alternative',
    step: 6,
    parentId: 'encounters-query',
    description: 'Alternative: Study encounters by healthcare provider type'
  },
  { 
    id: 'alt-encounters-complexity', 
    label: 'Encounter\nComplexity Analysis', 
    type: 'alternative',
    step: 6,
    parentId: 'encounters-query',
    description: 'Alternative: Analyze encounter complexity and resource usage'
  },

  // ALTERNATIVE OPTIONS for Line Chart (Step 6 alternatives)
  { 
    id: 'alt-chart-area', 
    label: 'Area Chart\nVisualization', 
    type: 'alternative',
    step: 7,
    parentId: 'line-chart',
    description: 'Alternative: Display trends as stacked area chart'
  },
  { 
    id: 'alt-chart-scatter', 
    label: 'Scatter Plot\nAnalysis', 
    type: 'alternative',
    step: 7,
    parentId: 'line-chart',
    description: 'Alternative: Create scatter plot for correlation analysis'
  },
  { 
    id: 'alt-chart-boxplot', 
    label: 'Box Plot\nDistribution', 
    type: 'alternative',
    step: 7,
    parentId: 'line-chart',
    description: 'Alternative: Show distribution patterns with box plots'
  },

  // ALTERNATIVE OPTIONS for Utilization Narrative (Step 7 alternatives)
  { 
    id: 'alt-narrative-predictive', 
    label: 'Predictive\nUtilization Model', 
    type: 'alternative',
    step: 8,
    parentId: 'utilization-narrative',
    description: 'Alternative: Build predictive models for future utilization'
  },
  { 
    id: 'alt-narrative-cost', 
    label: 'Cost Analysis\nNarrative', 
    type: 'alternative',
    step: 8,
    parentId: 'utilization-narrative',
    description: 'Alternative: Generate cost-focused utilization insights'
  },
  { 
    id: 'alt-narrative-quality', 
    label: 'Quality Metrics\nAnalysis', 
    type: 'alternative',
    step: 8,
    parentId: 'utilization-narrative',
    description: 'Alternative: Analyze quality metrics and patient satisfaction'
  },

  // ALTERNATIVE OPTIONS for Medication Path - Starting from medications-dataset (Step 0 alternatives)
  { 
    id: 'alt-med-outcomes', 
    label: 'Medication\nOutcomes Analysis', 
    type: 'alternative',
    step: 1,
    parentId: 'medications-dataset',
    description: 'Alternative: Analyze medication effectiveness and patient outcomes'
  },
  { 
    id: 'alt-med-cost', 
    label: 'Medication\nCost Analysis', 
    type: 'alternative',
    step: 1,
    parentId: 'medications-dataset',
    description: 'Alternative: Study medication costs and financial impact'
  },
  { 
    id: 'alt-med-adherence', 
    label: 'Medication\nAdherence Study', 
    type: 'alternative',
    step: 1,
    parentId: 'medications-dataset',
    description: 'Alternative: Analyze patient medication compliance patterns'
  },

  // ALTERNATIVE OPTIONS for Medication Query (Step 1 alternatives)
  { 
    id: 'alt-medquery-provider', 
    label: 'Provider-Based\nPrescription Query', 
    type: 'alternative',
    step: 2,
    parentId: 'medication-query',
    description: 'Alternative: Analyze prescriptions by healthcare provider type'
  },
  { 
    id: 'alt-medquery-generic', 
    label: 'Generic vs Brand\nAnalysis', 
    type: 'alternative',
    step: 2,
    parentId: 'medication-query',
    description: 'Alternative: Compare generic and brand medication usage'
  },
  { 
    id: 'alt-medquery-dosage', 
    label: 'Dosage Pattern\nAnalysis', 
    type: 'alternative',
    step: 2,
    parentId: 'medication-query',
    description: 'Alternative: Study medication dosage and strength patterns'
  },

  // ALTERNATIVE OPTIONS for Drug Class Filter (Step 2 alternatives)
  { 
    id: 'alt-drugclass-therapeutic', 
    label: 'Therapeutic Area\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'drug-class-filter',
    description: 'Alternative: Filter by therapeutic areas (cardiology, psychiatry, etc.)'
  },
  { 
    id: 'alt-drugclass-mechanism', 
    label: 'Mechanism of Action\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'drug-class-filter',
    description: 'Alternative: Group medications by mechanism of action'
  },
  { 
    id: 'alt-drugclass-route', 
    label: 'Administration Route\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'drug-class-filter',
    description: 'Alternative: Filter by administration route (oral, IV, topical)'
  },

  // ALTERNATIVE OPTIONS for Prescription Analysis (Step 3 alternatives)
  { 
    id: 'alt-prescription-polypharmacy', 
    label: 'Polypharmacy\nAnalysis', 
    type: 'alternative',
    step: 4,
    parentId: 'prescription-analysis',
    description: 'Alternative: Analyze patients with multiple medications'
  },
  { 
    id: 'alt-prescription-duration', 
    label: 'Prescription Duration\nAnalysis', 
    type: 'alternative',
    step: 4,
    parentId: 'prescription-analysis',
    description: 'Alternative: Study prescription length and refill patterns'
  },
  { 
    id: 'alt-prescription-switching', 
    label: 'Medication Switching\nPatterns', 
    type: 'alternative',
    step: 4,
    parentId: 'prescription-analysis',
    description: 'Alternative: Analyze medication switching and discontinuation'
  },

  // ALTERNATIVE OPTIONS for Interaction Matrix (Step 4 alternatives)
  { 
    id: 'alt-interaction-severity', 
    label: 'Interaction Severity\nAnalysis', 
    type: 'alternative',
    step: 5,
    parentId: 'interaction-matrix',
    description: 'Alternative: Classify interactions by severity levels'
  },
  { 
    id: 'alt-interaction-clinical', 
    label: 'Clinical Impact\nAssessment', 
    type: 'alternative',
    step: 5,
    parentId: 'interaction-matrix',
    description: 'Alternative: Assess real-world clinical impact of interactions'
  },
  { 
    id: 'alt-interaction-contraindication', 
    label: 'Contraindication\nAnalysis', 
    type: 'alternative',
    step: 5,
    parentId: 'interaction-matrix',
    description: 'Alternative: Identify medication contraindications and warnings'
  },

  // ALTERNATIVE OPTIONS for Temporal Trends (Step 5 alternatives)
  { 
    id: 'alt-temporal-epidemic', 
    label: 'Epidemic Response\nPrescribing', 
    type: 'alternative',
    step: 6,
    parentId: 'temporal-trends',
    description: 'Alternative: Analyze prescribing changes during health crises'
  },
  { 
    id: 'alt-temporal-formulary', 
    label: 'Formulary Change\nImpact', 
    type: 'alternative',
    step: 6,
    parentId: 'temporal-trends',
    description: 'Alternative: Study impact of formulary and policy changes'
  },
  { 
    id: 'alt-temporal-lifecycle', 
    label: 'Drug Lifecycle\nAnalysis', 
    type: 'alternative',
    step: 6,
    parentId: 'temporal-trends',
    description: 'Alternative: Track drug adoption and decline patterns'
  },

  // ALTERNATIVE OPTIONS for Safety Heatmap (Step 6 alternatives)
  { 
    id: 'alt-safety-ade', 
    label: 'Adverse Drug Event\nMapping', 
    type: 'alternative',
    step: 7,
    parentId: 'safety-heatmap',
    description: 'Alternative: Map adverse drug events by patient demographics'
  },
  { 
    id: 'alt-safety-monitoring', 
    label: 'Safety Monitoring\nDashboard', 
    type: 'alternative',
    step: 7,
    parentId: 'safety-heatmap',
    description: 'Alternative: Create real-time safety monitoring visualization'
  },
  { 
    id: 'alt-safety-risk', 
    label: 'Risk Stratification\nHeatmap', 
    type: 'alternative',
    step: 7,
    parentId: 'safety-heatmap',
    description: 'Alternative: Stratify patients by medication safety risk levels'
  },

  // ALTERNATIVE OPTIONS for Pharma Insights (Step 7 alternatives)
  { 
    id: 'alt-pharma-optimization', 
    label: 'Therapy Optimization\nRecommendations', 
    type: 'alternative',
    step: 8,
    parentId: 'pharma-insights',
    description: 'Alternative: Generate personalized therapy optimization suggestions'
  },
  { 
    id: 'alt-pharma-policy', 
    label: 'Policy Impact\nAnalysis', 
    type: 'alternative',
    step: 8,
    parentId: 'pharma-insights',
    description: 'Alternative: Analyze impact of pharmaceutical policies'
  },
  { 
    id: 'alt-pharma-population', 
    label: 'Population Health\nPharmacy Insights', 
    type: 'alternative',
    step: 8,
    parentId: 'pharma-insights',
    description: 'Alternative: Generate population-level pharmaceutical insights'
  },

  // ALTERNATIVE OPTIONS for Clinical Outcomes Path - Starting from outcomes-overview (Step 1 alternatives)
  { 
    id: 'alt-outcomes-mortality', 
    label: 'Mortality Rate\nAnalysis', 
    type: 'alternative',
    step: 2,
    parentId: 'outcomes-overview',
    description: 'Alternative: Focus specifically on mortality rates and trends'
  },
  { 
    id: 'alt-outcomes-readmission', 
    label: 'Readmission\nPrevention Study', 
    type: 'alternative',
    step: 2,
    parentId: 'outcomes-overview',
    description: 'Alternative: Study readmission patterns and prevention strategies'
  },
  { 
    id: 'alt-outcomes-complications', 
    label: 'Complication\nRisk Analysis', 
    type: 'alternative',
    step: 2,
    parentId: 'outcomes-overview',
    description: 'Alternative: Analyze complication rates and risk mitigation'
  },

  // ALTERNATIVE OPTIONS for Condition Filter (Step 2 alternatives)
  { 
    id: 'alt-condition-chronic', 
    label: 'Chronic Disease\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'condition-filter',
    description: 'Alternative: Focus on chronic disease management outcomes'
  },
  { 
    id: 'alt-condition-acute', 
    label: 'Acute Care\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'condition-filter',
    description: 'Alternative: Analyze acute care episode outcomes'
  },
  { 
    id: 'alt-condition-surgical', 
    label: 'Surgical Procedure\nFilter', 
    type: 'alternative',
    step: 3,
    parentId: 'condition-filter',
    description: 'Alternative: Filter by surgical procedures and outcomes'
  },

  // ALTERNATIVE OPTIONS for Quality Analysis (Step 3 alternatives)
  { 
    id: 'alt-quality-safety', 
    label: 'Patient Safety\nMetrics', 
    type: 'alternative',
    step: 4,
    parentId: 'quality-analysis',
    description: 'Alternative: Focus on patient safety indicators and events'
  },
  { 
    id: 'alt-quality-satisfaction', 
    label: 'Patient Satisfaction\nAnalysis', 
    type: 'alternative',
    step: 4,
    parentId: 'quality-analysis',
    description: 'Alternative: Analyze patient satisfaction and experience scores'
  },
  { 
    id: 'alt-quality-efficiency', 
    label: 'Care Efficiency\nMetrics', 
    type: 'alternative',
    step: 4,
    parentId: 'quality-analysis',
    description: 'Alternative: Study care delivery efficiency and timeliness'
  },

  // ALTERNATIVE OPTIONS for Outcomes Chart (Step 4 alternatives)
  { 
    id: 'alt-chart-heatmap', 
    label: 'Outcomes\nHeatmap', 
    type: 'alternative',
    step: 5,
    parentId: 'outcomes-chart',
    description: 'Alternative: Create heatmap visualization of outcomes by department'
  },
  { 
    id: 'alt-chart-benchmark', 
    label: 'Benchmark\nComparison Chart', 
    type: 'alternative',
    step: 5,
    parentId: 'outcomes-chart',
    description: 'Alternative: Compare outcomes against national benchmarks'
  },
  { 
    id: 'alt-chart-funnel', 
    label: 'Care Pathway\nFunnel Chart', 
    type: 'alternative',
    step: 5,
    parentId: 'outcomes-chart',
    description: 'Alternative: Visualize patient flow through care pathways'
  },

  // ALTERNATIVE OPTIONS for Risk Stratification (Step 5 alternatives)
  { 
    id: 'alt-risk-comorbidity', 
    label: 'Comorbidity\nRisk Model', 
    type: 'alternative',
    step: 6,
    parentId: 'risk-stratification',
    description: 'Alternative: Build risk models based on comorbidity patterns'
  },
  { 
    id: 'alt-risk-predictive', 
    label: 'Predictive Risk\nScoring', 
    type: 'alternative',
    step: 6,
    parentId: 'risk-stratification',
    description: 'Alternative: Develop predictive risk scores for interventions'
  },
  { 
    id: 'alt-risk-social', 
    label: 'Social Determinants\nRisk Analysis', 
    type: 'alternative',
    step: 6,
    parentId: 'risk-stratification',
    description: 'Alternative: Analyze social determinants impact on outcomes'
  },

  // ALTERNATIVE OPTIONS for Quality Dashboard (Step 6 alternatives)
  { 
    id: 'alt-dashboard-realtime', 
    label: 'Real-time Quality\nMonitoring', 
    type: 'alternative',
    step: 7,
    parentId: 'quality-dashboard',
    description: 'Alternative: Create real-time quality monitoring dashboard'
  },
  { 
    id: 'alt-dashboard-executive', 
    label: 'Executive Quality\nSummary', 
    type: 'alternative',
    step: 7,
    parentId: 'quality-dashboard',
    description: 'Alternative: Build executive-level quality summary dashboard'
  },
  { 
    id: 'alt-dashboard-departmental', 
    label: 'Department Quality\nScorecard', 
    type: 'alternative',
    step: 7,
    parentId: 'quality-dashboard',
    description: 'Alternative: Create department-specific quality scorecards'
  },

  // ALTERNATIVE OPTIONS for Clinical Insights (Step 7 alternatives)
  { 
    id: 'alt-insights-improvement', 
    label: 'Quality Improvement\nRecommendations', 
    type: 'alternative',
    step: 8,
    parentId: 'clinical-insights',
    description: 'Alternative: Generate targeted quality improvement action plans'
  },
  { 
    id: 'alt-insights-benchmarking', 
    label: 'Competitive\nBenchmarking Analysis', 
    type: 'alternative',
    step: 8,
    parentId: 'clinical-insights',
    description: 'Alternative: Compare performance against peer organizations'
  },
  { 
    id: 'alt-insights-roi', 
    label: 'Quality Investment\nROI Analysis', 
    type: 'alternative',
    step: 8,
    parentId: 'clinical-insights',
    description: 'Alternative: Calculate ROI of quality improvement initiatives'
  },

  // Continue with more alternative options...
  // (Additional alternatives would be added here for completeness)
];

// Connections showing the demographics workflow path + alternative options
export const mindMapConnections = [
  // Demographics & Utilization Path (starting from patients-dataset)
  { source: 'patients-dataset', target: 'demographics-query', pathId: 'demographics-utilization' },
  { source: 'demographics-query', target: 'age-filter', pathId: 'demographics-utilization' },
  { source: 'age-filter', target: 'gender-filter', pathId: 'demographics-utilization' },
  { source: 'gender-filter', target: 'population-pyramid', pathId: 'demographics-utilization' },
  { source: 'population-pyramid', target: 'encounters-query', pathId: 'demographics-utilization' },
  { source: 'encounters-query', target: 'line-chart', pathId: 'demographics-utilization' },
  { source: 'line-chart', target: 'utilization-narrative', pathId: 'demographics-utilization' },

  // Medications Path (starting from medications-dataset)
  { source: 'medications-dataset', target: 'medication-query', pathId: 'medication-patterns' },
  { source: 'medication-query', target: 'drug-class-filter', pathId: 'medication-patterns' },
  { source: 'drug-class-filter', target: 'prescription-analysis', pathId: 'medication-patterns' },
  { source: 'prescription-analysis', target: 'interaction-matrix', pathId: 'medication-patterns' },
  { source: 'interaction-matrix', target: 'temporal-trends', pathId: 'medication-patterns' },
  { source: 'temporal-trends', target: 'safety-heatmap', pathId: 'medication-patterns' },
  { source: 'safety-heatmap', target: 'pharma-insights', pathId: 'medication-patterns' },

  // ALTERNATIVE CONNECTIONS - showing the "roads not taken"
  // From patients-dataset
  { source: 'patients-dataset', target: 'alt-outcomes-analysis', pathId: 'alternative' },
  { source: 'patients-dataset', target: 'alt-condition-analysis', pathId: 'alternative' },

  // From demographics-query
  { source: 'demographics-query', target: 'alt-demo-geographic', pathId: 'alternative' },
  { source: 'demographics-query', target: 'alt-demo-insurance', pathId: 'alternative' },
  { source: 'demographics-query', target: 'alt-demo-socioeconomic', pathId: 'alternative' },

  // From age-filter
  { source: 'age-filter', target: 'alt-age-cohort', pathId: 'alternative' },
  { source: 'age-filter', target: 'alt-age-distribution', pathId: 'alternative' },
  { source: 'age-filter', target: 'alt-age-comorbidity', pathId: 'alternative' },

  // From gender-filter  
  { source: 'gender-filter', target: 'alt-gender-outcomes', pathId: 'alternative' },
  { source: 'gender-filter', target: 'alt-gender-screening', pathId: 'alternative' },
  { source: 'gender-filter', target: 'alt-gender-utilization', pathId: 'alternative' },

  // From population-pyramid
  { source: 'population-pyramid', target: 'alt-pyramid-treemap', pathId: 'alternative' },
  { source: 'population-pyramid', target: 'alt-pyramid-sunburst', pathId: 'alternative' },
  { source: 'population-pyramid', target: 'alt-pyramid-heatmap', pathId: 'alternative' },

  // From encounters-query
  { source: 'encounters-query', target: 'alt-encounters-seasonal', pathId: 'alternative' },
  { source: 'encounters-query', target: 'alt-encounters-provider', pathId: 'alternative' },
  { source: 'encounters-query', target: 'alt-encounters-complexity', pathId: 'alternative' },

  // From line-chart
  { source: 'line-chart', target: 'alt-chart-area', pathId: 'alternative' },
  { source: 'line-chart', target: 'alt-chart-scatter', pathId: 'alternative' },
  { source: 'line-chart', target: 'alt-chart-boxplot', pathId: 'alternative' },

  // From utilization-narrative
  { source: 'utilization-narrative', target: 'alt-narrative-predictive', pathId: 'alternative' },
  { source: 'utilization-narrative', target: 'alt-narrative-cost', pathId: 'alternative' },
  { source: 'utilization-narrative', target: 'alt-narrative-quality', pathId: 'alternative' },

  // MEDICATION PATH ALTERNATIVE CONNECTIONS
  // From medications-dataset
  { source: 'medications-dataset', target: 'alt-med-outcomes', pathId: 'alternative' },
  { source: 'medications-dataset', target: 'alt-med-cost', pathId: 'alternative' },
  { source: 'medications-dataset', target: 'alt-med-adherence', pathId: 'alternative' },

  // From medication-query
  { source: 'medication-query', target: 'alt-medquery-provider', pathId: 'alternative' },
  { source: 'medication-query', target: 'alt-medquery-generic', pathId: 'alternative' },
  { source: 'medication-query', target: 'alt-medquery-dosage', pathId: 'alternative' },

  // From drug-class-filter
  { source: 'drug-class-filter', target: 'alt-drugclass-therapeutic', pathId: 'alternative' },
  { source: 'drug-class-filter', target: 'alt-drugclass-mechanism', pathId: 'alternative' },
  { source: 'drug-class-filter', target: 'alt-drugclass-route', pathId: 'alternative' },

  // From prescription-analysis
  { source: 'prescription-analysis', target: 'alt-prescription-polypharmacy', pathId: 'alternative' },
  { source: 'prescription-analysis', target: 'alt-prescription-duration', pathId: 'alternative' },
  { source: 'prescription-analysis', target: 'alt-prescription-switching', pathId: 'alternative' },

  // From interaction-matrix
  { source: 'interaction-matrix', target: 'alt-interaction-severity', pathId: 'alternative' },
  { source: 'interaction-matrix', target: 'alt-interaction-clinical', pathId: 'alternative' },
  { source: 'interaction-matrix', target: 'alt-interaction-contraindication', pathId: 'alternative' },

  // From temporal-trends
  { source: 'temporal-trends', target: 'alt-temporal-epidemic', pathId: 'alternative' },
  { source: 'temporal-trends', target: 'alt-temporal-formulary', pathId: 'alternative' },
  { source: 'temporal-trends', target: 'alt-temporal-lifecycle', pathId: 'alternative' },

  // From safety-heatmap
  { source: 'safety-heatmap', target: 'alt-safety-ade', pathId: 'alternative' },
  { source: 'safety-heatmap', target: 'alt-safety-monitoring', pathId: 'alternative' },
  { source: 'safety-heatmap', target: 'alt-safety-risk', pathId: 'alternative' },

  // From pharma-insights
  { source: 'pharma-insights', target: 'alt-pharma-optimization', pathId: 'alternative' },
  { source: 'pharma-insights', target: 'alt-pharma-policy', pathId: 'alternative' },
  { source: 'pharma-insights', target: 'alt-pharma-population', pathId: 'alternative' },

  // Additional alternative connections would be added here...

  // Clinical Outcomes Path (starting from patients-dataset, going LEFT)
  { source: 'patients-dataset', target: 'outcomes-overview', pathId: 'clinical-outcomes' },
  { source: 'outcomes-overview', target: 'condition-filter', pathId: 'clinical-outcomes' },
  { source: 'condition-filter', target: 'quality-analysis', pathId: 'clinical-outcomes' },
  { source: 'quality-analysis', target: 'outcomes-chart', pathId: 'clinical-outcomes' },
  { source: 'outcomes-chart', target: 'risk-stratification', pathId: 'clinical-outcomes' },
  { source: 'risk-stratification', target: 'quality-dashboard', pathId: 'clinical-outcomes' },
  { source: 'quality-dashboard', target: 'clinical-insights', pathId: 'clinical-outcomes' },

  // ALTERNATIVE CONNECTIONS - showing the "roads not taken"
  // From patients-dataset
  { source: 'patients-dataset', target: 'alt-outcomes-analysis', pathId: 'alternative' },
  { source: 'patients-dataset', target: 'alt-condition-analysis', pathId: 'alternative' },

  // CLINICAL OUTCOMES PATH ALTERNATIVE CONNECTIONS
  // From outcomes-overview
  { source: 'outcomes-overview', target: 'alt-outcomes-mortality', pathId: 'alternative' },
  { source: 'outcomes-overview', target: 'alt-outcomes-readmission', pathId: 'alternative' },
  { source: 'outcomes-overview', target: 'alt-outcomes-complications', pathId: 'alternative' },

  // From condition-filter
  { source: 'condition-filter', target: 'alt-condition-chronic', pathId: 'alternative' },
  { source: 'condition-filter', target: 'alt-condition-acute', pathId: 'alternative' },
  { source: 'condition-filter', target: 'alt-condition-surgical', pathId: 'alternative' },

  // From quality-analysis
  { source: 'quality-analysis', target: 'alt-quality-safety', pathId: 'alternative' },
  { source: 'quality-analysis', target: 'alt-quality-satisfaction', pathId: 'alternative' },
  { source: 'quality-analysis', target: 'alt-quality-efficiency', pathId: 'alternative' },

  // From outcomes-chart
  { source: 'outcomes-chart', target: 'alt-chart-heatmap', pathId: 'alternative' },
  { source: 'outcomes-chart', target: 'alt-chart-benchmark', pathId: 'alternative' },
  { source: 'outcomes-chart', target: 'alt-chart-funnel', pathId: 'alternative' },

  // From risk-stratification
  { source: 'risk-stratification', target: 'alt-risk-comorbidity', pathId: 'alternative' },
  { source: 'risk-stratification', target: 'alt-risk-predictive', pathId: 'alternative' },
  { source: 'risk-stratification', target: 'alt-risk-social', pathId: 'alternative' },

  // From quality-dashboard
  { source: 'quality-dashboard', target: 'alt-dashboard-realtime', pathId: 'alternative' },
  { source: 'quality-dashboard', target: 'alt-dashboard-executive', pathId: 'alternative' },
  { source: 'quality-dashboard', target: 'alt-dashboard-departmental', pathId: 'alternative' },

  // From clinical-insights
  { source: 'clinical-insights', target: 'alt-insights-improvement', pathId: 'alternative' },
  { source: 'clinical-insights', target: 'alt-insights-benchmarking', pathId: 'alternative' },
  { source: 'clinical-insights', target: 'alt-insights-roi', pathId: 'alternative' },
]; 