import { Brain, Lightbulb, TrendingUp, Users, Activity } from 'lucide-react';

// Get thinking process for each widget
export const getThinkingProcess = (widgetId: string) => {
  switch (widgetId) {
    case 'condition-distribution':
      return {
        title: "Condition Analysis Process",
        steps: [
          {
            icon: Brain,
            title: "Data Ingestion",
            description: "Extracted patient records from EHR systems",
            detail: "Connected to 3 hospital databases and processed 12,847 patient records with ICD-10 diagnosis codes"
          },
          {
            icon: Users,
            title: "Data Cleaning",
            description: "Standardized and validated medical codes",
            detail: "Removed duplicates, normalized ICD-10 codes, and validated against medical terminology standards"
          },
          {
            icon: TrendingUp,
            title: "Statistical Analysis",
            description: "Calculated prevalence rates and confidence intervals",
            detail: "Applied statistical methods to determine condition frequency with 95% confidence intervals"
          },
          {
            icon: Activity,
            title: "Pattern Recognition",
            description: "Identified clustering of cardiovascular conditions",
            detail: "Machine learning algorithms detected that 3 of top 5 conditions are cardiovascular-related"
          },
          {
            icon: Lightbulb,
            title: "Clinical Correlation",
            description: "Cross-referenced with population demographics",
            detail: "Correlated findings with age distribution (median 44) and lifestyle factors in the region"
          }
        ],
        recommendation: "Implement targeted cardiovascular prevention programs and diabetes screening initiatives for at-risk populations"
      };
    
    case 'monthly-encounters':
      return {
        title: "Encounter Trend Analysis",
        steps: [
          {
            icon: Brain,
            title: "Time Series Collection",
            description: "Aggregated 6 months of encounter data",
            detail: "Collected visit data from January to June across all departments and service lines"
          },
          {
            icon: Activity,
            title: "Seasonal Decomposition",
            description: "Separated trend, seasonal, and irregular components",
            detail: "Applied time series decomposition to identify underlying patterns and anomalies"
          },
          {
            icon: TrendingUp,
            title: "Trend Identification",
            description: "Detected 12% increase from Feb to June",
            detail: "Linear regression analysis showed consistent upward trend with R² = 0.87"
          },
          {
            icon: Users,
            title: "Capacity Analysis",
            description: "Evaluated resource utilization patterns",
            detail: "Analyzed staff scheduling, room utilization, and equipment usage during peak periods"
          },
          {
            icon: Lightbulb,
            title: "Predictive Modeling",
            description: "Forecasted future encounter volumes",
            detail: "ARIMA model predicts 4,850 encounters for July with seasonal adjustment factors"
          }
        ],
        recommendation: "Increase staffing by 15% for summer months and implement dynamic scheduling system for optimal resource allocation"
      };
    
    case 'payer-mix':
      return {
        title: "Insurance Distribution Analysis",
        steps: [
          {
            icon: Brain,
            title: "Payer Data Integration",
            description: "Consolidated insurance information from billing systems",
            detail: "Integrated data from Epic, Cerner, and local billing systems covering all patient encounters"
          },
          {
            icon: Activity,
            title: "Classification Engine",
            description: "Automated payer type categorization",
            detail: "ML classifier achieved 98.5% accuracy in categorizing insurance types using NLP on policy data"
          },
          {
            icon: TrendingUp,
            title: "Market Share Analysis",
            description: "Calculated payer distribution percentages",
            detail: "Medicare 42%, Private 35%, Medicaid 18%, Self-Pay 5% - compared to regional benchmarks"
          },
          {
            icon: Users,
            title: "Demographic Correlation",
            description: "Linked payer types to patient demographics",
            detail: "High Medicare percentage correlates with aging population (35% over 65) in service area"
          },
          {
            icon: Lightbulb,
            title: "Revenue Impact Assessment",
            description: "Analyzed reimbursement rates by payer",
            detail: "Private insurance provides 1.8x higher reimbursement than Medicare, 2.3x higher than Medicaid"
          }
        ],
        recommendation: "Diversify payer mix by targeting younger demographics and explore value-based contracts with Medicare Advantage plans"
      };
    
    case 'key-metrics':
      return {
        title: "Healthcare KPI Synthesis",
        steps: [
          {
            icon: Brain,
            title: "Multi-Source Integration",
            description: "Aggregated data from 15+ hospital systems",
            detail: "Connected EHR, billing, quality, and operational databases using HL7 FHIR standards"
          },
          {
            icon: Activity,
            title: "Quality Metrics Calculation",
            description: "Computed CMS quality measures",
            detail: "Calculated 30-day readmission rates, HCAHPS scores, and core measure compliance"
          },
          {
            icon: TrendingUp,
            title: "Benchmark Comparison",
            description: "Compared against national and regional averages",
            detail: "Readmission rate 8.5% vs national 10.2%, immunization 94% vs target 90%"
          },
          {
            icon: Users,
            title: "Population Health Analysis",
            description: "Analyzed patient population characteristics",
            detail: "12,847 patients with median age 44, chronic disease prevalence 23% below national average"
          },
          {
            icon: Lightbulb,
            title: "Performance Scoring",
            description: "Generated composite quality score",
            detail: "Weighted scoring algorithm considering patient outcomes, safety, and satisfaction metrics"
          }
        ],
        recommendation: "Maintain current excellence in quality metrics while expanding population health management programs"
      };
    
    case 'top-providers':
      return {
        title: "Provider Performance Analysis",
        steps: [
          {
            icon: Brain,
            title: "Provider Data Compilation",
            description: "Collected performance metrics for all physicians",
            detail: "Analyzed patient volume, outcomes, satisfaction scores for 127 active providers"
          },
          {
            icon: Activity,
            title: "Productivity Metrics",
            description: "Calculated RVU and patient encounter rates",
            detail: "Measured relative value units, patient visits per day, and procedure volumes by specialty"
          },
          {
            icon: TrendingUp,
            title: "Quality Scoring",
            description: "Evaluated clinical outcomes and safety metrics",
            detail: "Composite scores based on readmission rates, infection rates, and patient satisfaction"
          },
          {
            icon: Users,
            title: "Specialty Analysis",
            description: "Compared performance within specialty groups",
            detail: "Cardiology leads in patient volume, Pediatrics highest in satisfaction scores"
          },
          {
            icon: Lightbulb,
            title: "Resource Optimization",
            description: "Identified opportunities for efficiency gains",
            detail: "Top performers show 23% higher productivity with maintained quality scores"
          }
        ],
        recommendation: "Implement best practice sharing program and consider expanding high-performing specialties"
      };
    
    case 'population-summary':
      return {
        title: "Population Health Analytics",
        steps: [
          {
            icon: Brain,
            title: "Demographic Profiling",
            description: "Analyzed patient population characteristics",
            detail: "Processed demographic data including age, gender, ethnicity, and socioeconomic factors"
          },
          {
            icon: Activity,
            title: "Health Status Assessment",
            description: "Evaluated chronic disease burden",
            detail: "Identified 8,934 active conditions across patient population using clinical decision support"
          },
          {
            icon: TrendingUp,
            title: "Risk Stratification",
            description: "Categorized patients by health risk levels",
            detail: "Applied predictive analytics to identify high-risk patients requiring care management"
          },
          {
            icon: Users,
            title: "Social Determinants",
            description: "Incorporated social and economic factors",
            detail: "Analyzed zip code data, insurance status, and access barriers affecting health outcomes"
          },
          {
            icon: Lightbulb,
            title: "Intervention Planning",
            description: "Designed targeted health programs",
            detail: "Developed care pathways for diabetes, hypertension, and preventive care initiatives"
          }
        ],
        recommendation: "Launch community health programs targeting social determinants and expand care management for high-risk populations"
      };
    
    case 'clinical-insights':
      return {
        title: "Clinical Intelligence Engine",
        steps: [
          {
            icon: Brain,
            title: "Evidence Synthesis",
            description: "Analyzed clinical literature and guidelines",
            detail: "Processed 2,847 peer-reviewed studies and clinical practice guidelines using NLP"
          },
          {
            icon: Activity,
            title: "Pattern Mining",
            description: "Identified clinical patterns in patient data",
            detail: "Applied machine learning to detect correlations between treatments and outcomes"
          },
          {
            icon: TrendingUp,
            title: "Outcome Prediction",
            description: "Developed predictive models for patient outcomes",
            detail: "Random forest model achieved 89% accuracy in predicting readmission risk"
          },
          {
            icon: Users,
            title: "Clinical Decision Support",
            description: "Generated evidence-based recommendations",
            detail: "Created decision trees for common conditions with confidence scores and evidence levels"
          },
          {
            icon: Lightbulb,
            title: "Quality Improvement",
            description: "Identified opportunities for care enhancement",
            detail: "Highlighted gaps in preventive care and opportunities for protocol optimization"
          }
        ],
        recommendation: "Implement AI-driven clinical decision support system and expand preventive care protocols based on predictive insights"
      };
    
    case 'age-vs-conditions':
      return {
        title: "Age-Condition Correlation Study",
        steps: [
          {
            icon: Brain,
            title: "Cohort Definition",
            description: "Segmented patients by age groups",
            detail: "Created age cohorts: 18-30, 31-45, 46-60, 61-75, 75+ for comparative analysis"
          },
          {
            icon: Activity,
            title: "Comorbidity Mapping",
            description: "Counted concurrent conditions per patient",
            detail: "Applied Charlson Comorbidity Index and Elixhauser methods for condition weighting"
          },
          {
            icon: TrendingUp,
            title: "Correlation Analysis",
            description: "Calculated age-condition relationships",
            detail: "Pearson correlation coefficient of 0.73 between age and condition count (p<0.001)"
          },
          {
            icon: Users,
            title: "Risk Factor Analysis",
            description: "Identified age-specific health risks",
            detail: "Younger patients: mental health, older patients: cardiovascular and metabolic conditions"
          },
          {
            icon: Lightbulb,
            title: "Preventive Strategy",
            description: "Designed age-appropriate interventions",
            detail: "Tailored screening protocols and preventive measures for each age demographic"
          }
        ],
        recommendation: "Implement age-stratified care protocols with targeted screening and prevention programs for each demographic group"
      };
    
    case 'system-status':
      return {
        title: "System Performance Monitoring",
        steps: [
          {
            icon: Brain,
            title: "Infrastructure Monitoring",
            description: "Real-time system health assessment",
            detail: "Monitored 47 servers, 12 databases, and 8 critical applications using automated tools"
          },
          {
            icon: Activity,
            title: "Performance Metrics",
            description: "Collected system performance indicators",
            detail: "Tracked response times, throughput, error rates, and resource utilization across all systems"
          },
          {
            icon: TrendingUp,
            title: "Trend Analysis",
            description: "Analyzed performance patterns over time",
            detail: "Identified peak usage periods and potential bottlenecks using 30-day rolling averages"
          },
          {
            icon: Users,
            title: "User Experience Impact",
            description: "Correlated system performance with user satisfaction",
            detail: "Database response time under 50ms correlates with 95% user satisfaction scores"
          },
          {
            icon: Lightbulb,
            title: "Optimization Recommendations",
            description: "Generated system improvement suggestions",
            detail: "Identified opportunities for caching, load balancing, and database query optimization"
          }
        ],
        recommendation: "Implement predictive monitoring alerts and consider infrastructure scaling for anticipated 20% user growth"
      };
    
    default:
      return {
        title: "Data Analysis Process",
        steps: [
          {
            icon: Brain,
            title: "Data Processing",
            description: "Analyzed healthcare data patterns",
            detail: "Applied machine learning algorithms to identify insights"
          },
          {
            icon: TrendingUp,
            title: "Trend Analysis",
            description: "Identified key trends and patterns",
            detail: "Statistical analysis revealed significant correlations"
          },
          {
            icon: Lightbulb,
            title: "Insight Generation",
            description: "Generated actionable insights",
            detail: "Recommendations based on evidence-based analysis"
          }
        ],
        recommendation: "Implement data-driven improvements based on analysis findings"
      };
  }
}; 