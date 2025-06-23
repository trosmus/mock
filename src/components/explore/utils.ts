import { 
  Database, 
  Filter, 
  Hash, 
  Code, 
  BarChart3, 
  FileText, 
  Workflow,
  TrendingUp,
  Compass
} from 'lucide-react';

// Get icon for node type
export const getNodeIcon = (type: string) => {
  switch (type) {
    case 'hub': return Compass;
    case 'dataset': return Database;
    case 'filter': return Filter;
    case 'field': return Hash;
    case 'sql': return Code;
    case 'visualization': return BarChart3;
    case 'narrative': return FileText;
    case 'workflow': return Workflow;
    case 'data-series': return TrendingUp;
    default: return Database;
  }
};

// Get color for node type
export const getNodeColor = (type: string) => {
  switch (type) {
    case 'hub': return '#1e40af';
    case 'category': return '#4f46e5';
    case 'dataset': return '#3b82f6';
    case 'filter': return '#10b981';
    case 'field': return '#f59e0b';
    case 'sql': return '#6366f1';
    case 'visualization': return '#ec4899';
    case 'narrative': return '#22c55e';
    case 'workflow': return '#ef4444';
    case 'data-series': return '#0ea5e9';
    default: return '#64748b';
  }
};

// Get alternative routes for each step
export const getAlternativesForStep = (stepIndex: number, step: any): string[] => {
  // Check if this is a medication path step based on the step ID or other indicators
  const isMedicationPath = step.id?.includes('medication') || step.id?.includes('drug') || step.id?.includes('prescription') || step.id?.includes('pharma');
  
  if (isMedicationPath) {
    // Medication path alternatives
    switch (stepIndex) {
      case 0: // Medication Dataset Query
        return [
          'Adverse Events Database Query',
          'Pharmacy Claims Analysis',
          'Clinical Trials Data Query'
        ];
      case 1: // Drug Class Filter
        return [
          'Therapeutic Area Filter',
          'Route of Administration Filter',
          'Prescription Frequency Filter'
        ];
      case 2: // Prescription Frequency Analysis
        return [
          'Dosage Pattern Analysis',
          'Treatment Duration Analysis',
          'Prescriber Behavior Analysis'
        ];
      case 3: // Drug Interaction Matrix
        return [
          'Contraindication Matrix',
          'Allergy Cross-Reference',
          'Side Effect Correlation Map'
        ];
      case 4: // Temporal Prescribing Trends
        return [
          'Geographic Prescribing Patterns',
          'Age-Based Prescribing Trends',
          'Seasonal Disease Correlation'
        ];
      case 5: // Safety Heatmap Visualization
        return [
          'Risk Stratification Dashboard',
          'Adverse Event Timeline',
          'Population Safety Metrics'
        ];
      case 6: // Pharmaceutical Safety Insights
        return [
          'Cost-Effectiveness Analysis',
          'Therapeutic Outcome Report',
          'Regulatory Compliance Summary'
        ];
      default:
        return [
          'Alternative Medication Analysis A',
          'Alternative Medication Analysis B',
          'Alternative Medication Analysis C'
        ];
    }
  } else {
    // Demographics path alternatives (existing logic)
    switch (stepIndex) {
      case 0: // Patient Demographics Query
        return [
          'Geographic Distribution Query',
          'Insurance Type Analysis', 
          'Socioeconomic Factors'
        ];
      case 1: // Age Range Filter
        return [
          'Chronic Disease by Age',
          'Emergency Visits by Age',
          'Preventive Care by Age'
        ];
      case 2: // Gender Filter
        return [
          'Gender-Based Health Outcomes',
          'Specialty Care by Gender',
          'Gender-Specific Medications'
        ];
      case 3: // Population Pyramid Chart
        return [
          'Geographic Population Maps',
          'Income-Based Demographics',
          'Education Level Breakdown'
        ];
      case 4: // Monthly Encounters Query
        return [
          'Seasonal Health Patterns',
          'Emergency vs Routine Care',
          'Provider Type Utilization'
        ];
      case 5: // Line Chart Block
        return [
          'Utilization Heatmap',
          'Cost vs Utilization Scatter Plot',
          'Patient Flow Sankey Diagram'
        ];
      case 6: // Healthcare Utilization Narrative
        return [
          'Predictive Modeling Report',
          'Benchmark Comparison Report',
          'Strategic Recommendations'
        ];
      default:
        return [
          'Alternative Analysis A',
          'Alternative Analysis B', 
          'Alternative Analysis C'
        ];
    }
  }
}; 