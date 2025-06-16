import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PanelLeft, Database, Filter, Hash, Code, BarChart3, FileText, Workflow, TrendingUp } from 'lucide-react';

interface Block {
  id: string;
  name: string;
  description: string;
  prompt: string;
  type: string;
}

interface BlockCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  blocks: Block[];
}

interface DataSeries {
  id: string;
  name: string;
  data: any[];
  chartType: string;
  sourceWidget: string;
}

interface BlocksDrawerProps {
  dataSeries: DataSeries[];
}

const blockCategories: BlockCategory[] = [
  {
    id: 'data-series',
    name: 'Data Series',
    icon: <TrendingUp className="w-4 h-4" />,
    blocks: [
      { id: 'time-series-encounters', name: 'Time Series Encounters Block', description: 'Monthly encounter counts over time', prompt: 'Create time series analysis of encounter volumes over time. Identify seasonal patterns, trends, and anomalies in healthcare utilization. Analyze the impact of external factors on care access.', type: 'data-series' },
      { id: 'time-series-medications', name: 'Time Series Medications Block', description: 'Medication prescription trends over time', prompt: 'Analyze medication prescribing trends over time using time series methods. Identify seasonal patterns, drug adoption curves, and the impact of clinical guidelines on prescribing behavior.', type: 'data-series' },
    ]
  },
  {
    id: 'dataset',
    name: 'Dataset Blocks',
    icon: <Database className="w-4 h-4" />,
    blocks: [
      { id: 'patients-dataset', name: 'Patients Dataset Block', description: 'Represents the patients.csv table (demographics)', prompt: 'Load and analyze the patients dataset. Examine demographic patterns, age distributions, gender ratios, and identify any data quality issues. Provide insights on population characteristics and suggest potential cohorts for analysis.', type: 'dataset' },
      { id: 'encounters-dataset', name: 'Encounters Dataset Block', description: 'Represents the encounters.csv table (healthcare visits)', prompt: 'Analyze healthcare encounters data to understand visit patterns, encounter types, seasonal trends, and utilization rates. Identify high-frequency patients and examine care continuity patterns.', type: 'dataset' },
      { id: 'medications-dataset', name: 'Medications Dataset Block', description: 'Represents the medications.csv table (prescriptions)', prompt: 'Examine prescription patterns, medication adherence, drug interactions, and therapeutic classes. Identify polypharmacy cases and analyze prescribing trends across different patient populations.', type: 'dataset' },
      { id: 'conditions-dataset', name: 'Conditions Dataset Block', description: 'Represents the conditions.csv table (diagnoses)', prompt: 'Analyze medical conditions and diagnoses data. Examine disease prevalence, comorbidity patterns, and chronic disease management. Identify high-risk patient populations and condition-specific trends.', type: 'dataset' },
      { id: 'procedures-dataset', name: 'Procedures Dataset Block', description: 'Represents the procedures.csv table (clinical procedures)', prompt: 'Evaluate clinical procedures data to understand treatment patterns, procedure volumes, and outcomes. Analyze cost-effectiveness and identify opportunities for care optimization.', type: 'dataset' },
      { id: 'immunizations-dataset', name: 'Immunizations Dataset Block', description: 'Represents the immunizations.csv table (vaccinations)', prompt: 'Assess vaccination coverage, immunization schedules, and public health compliance. Identify gaps in coverage and analyze vaccination trends across different populations.', type: 'dataset' },
      { id: 'providers-dataset', name: 'Providers Dataset Block', description: 'Represents the providers.csv table (clinicians)', prompt: 'Analyze healthcare provider data including specialties, patient loads, and practice patterns. Examine provider network adequacy and identify care access issues.', type: 'dataset' },
      { id: 'claims-dataset', name: 'Claims Dataset Block', description: 'Represents the claims.csv table (billing and insurance claims)', prompt: 'Examine billing and insurance claims data to understand healthcare costs, utilization patterns, and financial trends. Identify high-cost cases and analyze payment patterns.', type: 'dataset' },
    ]
  },
  {
    id: 'filter',
    name: 'Filter Blocks',
    icon: <Filter className="w-4 h-4" />,
    blocks: [
      { id: 'age-range-filter', name: 'Age Range Filter', description: 'Filter patients by age (e.g., 18–65)', prompt: 'Apply age-based filtering to focus analysis on specific age cohorts (e.g., 18-65 working age, 65+ elderly, pediatric populations). Analyze how health outcomes and utilization patterns vary across age groups.', type: 'filter' },
      { id: 'gender-filter', name: 'Gender Filter', description: 'Filter by gender (male, female, other)', prompt: 'Filter data by gender to examine gender-specific health patterns, condition prevalence differences, and care utilization disparities between male, female, and other gender categories.', type: 'filter' },
      { id: 'condition-code-filter', name: 'Condition Code Filter', description: 'Filter conditions by SNOMED-CT or ICD-10 code', prompt: 'Filter medical conditions using SNOMED-CT or ICD-10 codes. Focus analysis on specific disease categories, chronic conditions, or acute care episodes for targeted health insights.', type: 'filter' },
      { id: 'encounter-date-filter', name: 'Encounter Date Filter', description: 'Filter encounters by start or stop date', prompt: 'Apply temporal filtering to healthcare encounters. Analyze seasonal patterns, pandemic impacts, or specific time periods to understand care delivery trends and utilization changes.', type: 'filter' },
      { id: 'medication-class-filter', name: 'Medication Class Filter', description: 'Filter medications by ATC or RxNorm class (e.g., antihypertensives)', prompt: 'Filter medications by therapeutic class (ATC codes) or drug categories. Analyze prescribing patterns for specific conditions like antihypertensives, diabetes medications, or mental health drugs.', type: 'filter' },
      { id: 'provider-specialty-filter', name: 'Provider Specialty Filter', description: 'Filter providers by specialty (e.g., cardiology)', prompt: 'Filter healthcare providers by medical specialty to analyze specialty-specific care patterns, referral networks, and subspecialty utilization across different patient populations.', type: 'filter' },
      { id: 'insurance-type-filter', name: 'Insurance Type Filter', description: 'Filter claims by payer type (private, public)', prompt: 'Filter claims and encounters by insurance type (Medicare, Medicaid, private, uninsured). Analyze access disparities, cost differences, and care patterns across payer types.', type: 'filter' },
      { id: 'region-location-filter', name: 'Region/Location Filter', description: 'Filter patients or providers by geographic region or address', prompt: 'Apply geographic filtering to analyze regional health disparities, rural vs urban care access, and location-based health outcomes. Identify underserved areas and care deserts.', type: 'filter' },
    ]
  },
  {
    id: 'field',
    name: 'Item or Field Blocks',
    icon: <Hash className="w-4 h-4" />,
    blocks: [
      { id: 'patient-age-field', name: 'Patient Age Field', description: 'Extract calculated age from birthdate', prompt: 'Extract and calculate patient ages from birthdate data. Analyze age distributions, identify age-related health patterns, and create age-based cohorts for targeted analysis.', type: 'field' },
      { id: 'encounter-type-field', name: 'Encounter Type Field', description: 'Select type of encounter (inpatient, outpatient, emergency)', prompt: 'Analyze encounter types (inpatient, outpatient, emergency, telehealth). Examine utilization patterns, care settings preferences, and access patterns across different populations.', type: 'field' },
      { id: 'medication-name-field', name: 'Medication Name Field', description: 'Select medication name or description', prompt: 'Extract and analyze medication names and descriptions. Identify most prescribed drugs, therapeutic patterns, and medication utilization trends across patient populations.', type: 'field' },
      { id: 'diagnosis-description-field', name: 'Diagnosis Description Field', description: 'Select condition/diagnosis description', prompt: 'Analyze diagnosis descriptions and condition narratives. Extract key medical terms, identify disease patterns, and examine diagnostic coding accuracy and completeness.', type: 'field' },
      { id: 'procedure-code-field', name: 'Procedure Code Field', description: 'Select procedure code (e.g., CPT)', prompt: 'Examine procedure codes (CPT, HCPCS) to understand treatment patterns, surgical volumes, and procedural trends. Analyze cost-effectiveness and outcome correlations.', type: 'field' },
      { id: 'immunization-date-field', name: 'Immunization Date Field', description: 'Select immunization administration date', prompt: 'Analyze immunization dates and vaccination schedules. Assess compliance with recommended timelines, identify coverage gaps, and examine seasonal vaccination patterns.', type: 'field' },
      { id: 'provider-id-field', name: 'Provider ID Field', description: 'Select provider unique identifier', prompt: 'Examine provider identifiers to analyze care networks, referral patterns, and provider-patient relationships. Identify high-volume providers and care coordination patterns.', type: 'field' },
      { id: 'claim-amount-field', name: 'Claim Amount Field', description: 'Select total claim amount from claims', prompt: 'Analyze claim amounts and healthcare costs. Identify high-cost cases, examine cost drivers, and analyze financial trends across different services and populations.', type: 'field' },
    ]
  },
  {
    id: 'sql',
    name: 'SQL/Query Blocks',
    icon: <Code className="w-4 h-4" />,
    blocks: [
      { id: 'count-patients', name: 'Count Patients Block', description: 'SQL: SELECT COUNT(*) FROM patients', prompt: 'Calculate total patient counts and analyze population size metrics. Break down counts by key demographics, enrollment periods, and active vs inactive patients. Provide statistical summaries and growth trends.', type: 'sql' },
      { id: 'average-age', name: 'Average Age Block', description: 'SQL: SELECT AVG(age) FROM patients', prompt: 'Calculate average patient age and analyze age-related statistics. Examine age distributions across different conditions, treatments, and outcomes to identify age-related health patterns.', type: 'sql' },
      { id: 'diagnoses-per-patient', name: 'Diagnoses per Patient Block', description: 'SQL: SELECT patient, COUNT(*) FROM conditions GROUP BY patient', prompt: 'Analyze the number of diagnoses per patient to understand disease burden, comorbidity patterns, and complexity of care. Identify patients with multiple chronic conditions.', type: 'sql' },
      { id: 'medication-adherence', name: 'Medication Adherence Block', description: 'SQL: Calculate proportion of days covered for chronic meds', prompt: 'Calculate medication adherence rates using proportion of days covered (PDC) metrics. Analyze adherence patterns for chronic medications and identify factors affecting compliance.', type: 'sql' },
      { id: 'encounters-per-year', name: 'Encounters per Year Block', description: 'SQL: SELECT YEAR(date), COUNT(*) FROM encounters GROUP BY YEAR(date)', prompt: 'Analyze annual encounter volumes and healthcare utilization trends. Identify seasonal patterns, growth trends, and factors influencing healthcare access and usage.', type: 'sql' },
      { id: 'readmission-rate', name: 'Readmission Rate Block', description: 'SQL: Identify patients with multiple inpatient encounters within 30 days', prompt: 'Calculate 30-day readmission rates and analyze factors contributing to hospital readmissions. Identify high-risk patients and opportunities for care improvement.', type: 'sql' },
      { id: 'top-conditions', name: 'Top Conditions Block', description: 'SQL: SELECT description, COUNT(*) FROM conditions GROUP BY description ORDER BY COUNT(*) DESC', prompt: 'Identify the most common medical conditions and analyze disease prevalence patterns. Examine condition trends, demographic variations, and public health implications.', type: 'sql' },
      { id: 'cost-by-condition', name: 'Cost by Condition Block', description: 'SQL: Join claims and conditions to sum costs by diagnosis', prompt: 'Analyze healthcare costs by medical condition to identify high-cost diseases and cost drivers. Examine cost-effectiveness of treatments and financial impact of chronic conditions.', type: 'sql' },
    ]
  },
  {
    id: 'visualization',
    name: 'Visualization Blocks',
    icon: <BarChart3 className="w-4 h-4" />,
    blocks: [
      { id: 'population-pyramid', name: 'Population Pyramid Chart Block', description: 'Age and gender distribution of patients', prompt: 'Create a population pyramid visualization showing age and gender distribution. Analyze demographic structure, identify population imbalances, and examine age-gender health patterns.', type: 'visualization' },
      { id: 'bar-chart', name: 'Bar Chart Block', description: 'Top 10 most common conditions', prompt: 'Create a bar chart visualization showing the top 10 most common medical conditions. Analyze prevalence rates, compare across demographics, and highlight significant patterns or outliers in the data.', type: 'visualization' },
      { id: 'line-chart', name: 'Line Chart Block', description: 'Monthly encounter volume over time', prompt: 'Generate a line chart showing monthly encounter volume trends over time. Identify seasonal patterns, growth trends, and any anomalies. Correlate with external factors like flu seasons or policy changes.', type: 'visualization' },
      { id: 'pie-chart', name: 'Pie Chart Block', description: 'Insurance payer mix', prompt: 'Create a pie chart visualization of insurance payer mix and coverage distribution. Analyze market share, access patterns, and financial implications across different payer types.', type: 'visualization' },
      { id: 'box-plot', name: 'Box Plot Block', description: 'Distribution of claim amounts', prompt: 'Generate box plots to show distribution of claim amounts and identify outliers. Analyze cost variations, detect unusual billing patterns, and examine financial data distributions.', type: 'visualization' },
      { id: 'scatter-plot', name: 'Scatter Plot Block', description: 'Age vs. number of conditions per patient', prompt: 'Create scatter plots to examine relationships between age and number of conditions per patient. Identify correlations, outliers, and patterns in multimorbidity across age groups.', type: 'visualization' },
      { id: 'choropleth-map', name: 'Choropleth Map Block', description: 'Patient or provider density by region', prompt: 'Generate geographic visualizations showing patient or provider density by region. Analyze geographic health disparities, access patterns, and regional care distribution.', type: 'visualization' },
      { id: 'heatmap', name: 'Heatmap Block', description: 'Medication use by condition', prompt: 'Create heatmap visualizations showing medication use patterns by medical condition. Identify prescribing trends, drug-condition associations, and therapeutic patterns.', type: 'visualization' },
    ]
  },
  {
    id: 'narrative',
    name: 'Narrative/Insight Blocks',
    icon: <FileText className="w-4 h-4" />,
    blocks: [
      { id: 'demographic-summary', name: 'Demographic Summary Block', description: 'The median patient age is 44, with 53% female and 47% male', prompt: 'Generate comprehensive demographic analysis and summary insights. Examine population characteristics, identify key trends, and provide actionable insights about patient demographics and health patterns.', type: 'narrative' },
      { id: 'condition-prevalence', name: 'Condition Prevalence Insight Block', description: 'Hypertension is present in 22% of the population', prompt: 'Analyze condition prevalence rates and generate insights about disease burden in the population. Compare with national benchmarks and identify public health priorities.', type: 'narrative' },
      { id: 'medication-utilization', name: 'Medication Utilization Insight Block', description: 'Statins are the most commonly prescribed medication class', prompt: 'Examine medication utilization patterns and generate insights about prescribing trends, therapeutic choices, and medication management across different patient populations.', type: 'narrative' },
      { id: 'healthcare-utilization', name: 'Healthcare Utilization Narrative Block', description: 'Outpatient visits account for 68% of all encounters', prompt: 'Analyze healthcare utilization patterns and generate narrative insights about care access, service usage, and healthcare delivery efficiency across different settings.', type: 'narrative' },
      { id: 'immunization-coverage', name: 'Immunization Coverage Insight Block', description: 'Childhood immunization rates exceed 90%', prompt: 'Assess immunization coverage rates and generate public health insights about vaccination compliance, coverage gaps, and opportunities for improvement.', type: 'narrative' },
      { id: 'provider-workload', name: 'Provider Workload Narrative Block', description: 'Primary care providers see an average of 120 patients per month', prompt: 'Analyze provider workload and capacity metrics. Generate insights about provider utilization, patient panel sizes, and opportunities for workforce optimization.', type: 'narrative' },
      { id: 'cost-analysis', name: 'Cost Analysis Insight Block', description: 'Average claim amount for inpatient stays is $8,500', prompt: 'Examine healthcare cost patterns and generate financial insights about cost drivers, high-cost cases, and opportunities for cost management and efficiency improvements.', type: 'narrative' },
      { id: 'readmission-narrative', name: 'Readmission Rate Narrative Block', description: '30-day readmission rate for heart failure is 15%', prompt: 'Analyze readmission patterns and generate insights about care quality, patient outcomes, and opportunities for reducing preventable readmissions.', type: 'narrative' },
    ]
  },
  {
    id: 'workflow',
    name: 'Workflow/Logic Blocks',
    icon: <Workflow className="w-4 h-4" />,
    blocks: [
      { id: 'if-age-elderly', name: 'If Age > 65 Then Flag as Elderly Block', description: 'Conditional logic for cohort segmentation', prompt: 'Apply conditional logic to identify elderly patients (age > 65) and analyze geriatric care patterns, age-related health risks, and specialized care needs for older adults.', type: 'workflow' },
      { id: 'if-diabetes-cohort', name: 'If Condition = Diabetes Then Include in Cohort Block', description: 'Build diabetes patient cohort', prompt: 'Create diabetes patient cohorts using conditional logic. Analyze diabetes management, complications, and care patterns specific to diabetic patients.', type: 'workflow' },
      { id: 'if-inpatient-los', name: 'If Encounter Type = Inpatient Then Calculate LOS Block', description: 'Compute length of stay for each admission', prompt: 'Apply conditional logic to calculate length of stay for inpatient encounters. Analyze factors affecting hospital stays and identify opportunities for care optimization.', type: 'workflow' },
      { id: 'if-polypharmacy', name: 'If Medication Count > 5 Then Flag Polypharmacy Block', description: 'Identify patients with polypharmacy', prompt: 'Identify patients with polypharmacy (>5 medications) using conditional logic. Analyze medication interactions, adherence challenges, and clinical complexity.', type: 'workflow' },
      { id: 'if-high-cost', name: 'If Claim Amount > $10,000 Then Flag High Cost Block', description: 'Highlight expensive cases', prompt: 'Flag high-cost cases using conditional logic to identify expensive healthcare episodes. Analyze cost drivers and opportunities for cost management.', type: 'workflow' },
      { id: 'if-immunization-missing', name: 'If Immunization Missing Then Flag for Follow-up Block', description: 'Identify patients overdue for vaccines', prompt: 'Use conditional logic to identify patients with missing immunizations. Generate follow-up recommendations and analyze vaccination coverage gaps.', type: 'workflow' },
      { id: 'if-cardiology', name: 'If Provider Specialty = Cardiology Then Include Block', description: 'Filter for cardiology-related analysis', prompt: 'Filter for cardiology-related care using conditional logic. Analyze cardiovascular care patterns, specialist utilization, and cardiac health outcomes.', type: 'workflow' },
      { id: 'if-readmission', name: 'If Readmission Within 30 Days Then Flag Block', description: 'Identify potential quality of care issues', prompt: 'Identify 30-day readmissions using conditional logic. Analyze readmission patterns, quality indicators, and opportunities for care improvement.', type: 'workflow' },
    ]
  },
];

const BlocksDrawer: React.FC<BlocksDrawerProps> = ({ dataSeries }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Auto-expand data series category when new series are added
  useEffect(() => {
    if (dataSeries.length > 0) {
      setExpandedCategories(prev => new Set([...prev, 'data-series']));
    }
  }, [dataSeries.length]);

  // Convert data series to blocks
  const dataSeriesBlocks: Block[] = dataSeries.map(series => ({
    id: series.id,
    name: `${series.name} (${series.chartType})`,
    description: `Data series from ${series.sourceWidget}`,
    prompt: `Data series from ${series.sourceWidget}: ${series.name}`,
    type: 'data-series'
  }));

  // Update the blockCategories to use dynamic data series
  const blockCategoriesWithSeries: BlockCategory[] = [
    ...blockCategories.slice(1), // All categories except the placeholder data-series
    {
      id: 'data-series',
      name: 'Data Series',
      icon: <TrendingUp className="w-4 h-4" />,
      blocks: dataSeriesBlocks
    }
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (event: React.DragEvent, block: Block) => {
    event.dataTransfer.setData('application/json', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'copy';
  };

  if (!isExpanded) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-3 hover:bg-gray-50 transition-colors border-none outline-none focus:outline-none"
          title="Expand Drawer"
        >
          <PanelLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
            Drawer
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PanelLeft size={16} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900 text-sm">Drawer</h3>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 transition-colors border-none outline-none focus:outline-none"
            title="Collapse Panel"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {blockCategoriesWithSeries.map((category) => (
          <div key={category.id} className="border-b border-gray-100">
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full p-3 flex items-center justify-between transition-colors border-none outline-none focus:outline-none ${
                expandedCategories.has(category.id) 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                {category.icon}
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
              <ChevronRight 
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedCategories.has(category.id) ? 'rotate-90' : ''
                }`} 
              />
            </button>

            {expandedCategories.has(category.id) && (
              <div className="pb-2">
                {category.blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block)}
                    className="mx-3 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 hover:border-blue-300 transition-colors"
                  >
                    <div className="text-xs font-medium text-gray-800 mb-1">
                      {block.name}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {block.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {blockCategoriesWithSeries.reduce((total, cat) => total + cat.blocks.length, 0)} blocks available
        </p>
      </div>
    </div>
  );
};

export default BlocksDrawer; 