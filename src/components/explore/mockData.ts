// Mock data for exploration path analyses

export const getMockPrePopulatedAnalysis = (pathId: string, pathSteps: string) => {
  if (pathId === 'demographics-utilization') {
    return {
      pathSummary: pathSteps,
      executiveSummary: `The Demographics & Utilization exploration path "${pathSteps}" provides comprehensive insights into patient population structure and healthcare utilization patterns. This guided analysis reveals critical patterns for strategic healthcare planning and resource optimization.`,
      keyFindings: [
        {
          title: "Population Coverage",
          value: "12,847 patients",
          trend: "Complete",
          description: "Full demographic representation across all age groups and genders"
        },
        {
          title: "Utilization Insight",
          value: "5,200/month",
          trend: "+12%",
          description: "Average monthly encounters with clear seasonal variation patterns"
        },
        {
          title: "Demographic Balance",
          value: "52% / 48%",
          trend: "Optimal",
          description: "Gender distribution shows balanced representation for analysis"
        },
        {
          title: "Analysis Reliability",
          value: "96%",
          trend: "Excellent",
          description: "High statistical confidence across all analytical dimensions"
        }
      ],
      detailedInsights: [
        {
          category: "Population Demographics",
          insights: [
            "Elderly patients (65+) represent 18% of population but drive 45% of healthcare encounters",
            "Gender distribution shows balanced representation with 52% female, 48% male",
            "Population pyramid reveals aging trend with expanding 50+ age cohorts",
            "Median patient age of 44 years indicates mature population requiring comprehensive care"
          ]
        },
        {
          category: "Healthcare Utilization",
          insights: [
            "Clear seasonal pattern with Q1 spike due to flu season and winter health issues",
            "Average 5,200 encounters per month with 15% seasonal variation",
            "Female patients show 20% higher preventive care engagement rates",
            "Chronic care needs driving increased utilization in older demographics"
          ]
        },
        {
          category: "Strategic Implications",
          insights: [
            "Population aging trend requires enhanced chronic disease management protocols",
            "Seasonal staffing adjustments needed for Q4/Q1 high-utilization periods",
            "Preventive care programs show strong correlation with better outcomes",
            "Gender-specific health programs could optimize care delivery effectiveness"
          ]
        }
      ],
      recommendations: [
        {
          priority: "High",
          title: "Enhance Chronic Disease Management",
          description: "Develop specialized programs for the growing 65+ population segment",
          timeline: "3-6 months",
          impact: "High"
        },
        {
          priority: "High", 
          title: "Implement Seasonal Resource Planning",
          description: "Adjust staffing and capacity based on identified seasonal patterns",
          timeline: "1-3 months",
          impact: "Medium"
        },
        {
          priority: "Medium",
          title: "Expand Preventive Care Initiatives",
          description: "Leverage higher female engagement to improve overall population health",
          timeline: "6-12 months",
          impact: "High"
        }
      ],
      nextSteps: [
        "Validate findings with clinical leadership and department heads",
        "Develop implementation timeline for high-priority recommendations",
        "Establish monitoring KPIs for demographic and utilization trends",
        "Create quarterly review process for ongoing optimization"
      ]
    };
  } else if (pathId === 'medication-patterns') {
    return {
      pathSummary: pathSteps,
      executiveSummary: `The Medication Patterns & Safety exploration path "${pathSteps}" provides comprehensive insights into pharmaceutical prescribing patterns, drug interactions, and safety optimization opportunities. This analysis reveals critical patterns for improving medication management and patient safety protocols.`,
      keyFindings: [
        {
          title: "Prescription Volume",
          value: "127,340 prescriptions",
          trend: "Complete",
          description: "Comprehensive medication data across 8,943 unique pharmaceutical products"
        },
        {
          title: "Interaction Risk",
          value: "312 high-severity",
          trend: "Critical",
          description: "High-severity drug interactions identified requiring immediate attention"
        },
        {
          title: "Polypharmacy Rate",
          value: "23% patients",
          trend: "Concerning",
          description: "Nearly quarter of patients on 5+ medications with elevated risk profiles"
        },
        {
          title: "Safety Optimization",
          value: "1,247 opportunities",
          trend: "Actionable",
          description: "AI-identified optimization opportunities for safer prescribing practices"
        }
      ],
      detailedInsights: [
        {
          category: "Prescription Patterns",
          insights: [
            "Cardiovascular medications represent 23% of all prescriptions, indicating high prevalence of heart conditions",
            "CNS medications account for 18% of prescriptions, suggesting significant mental health treatment needs",
            "Top 10 medications concentrate 34% of prescription volume, showing clear therapeutic priorities",
            "Seasonal antibiotic prescribing peaks 28% in winter months, correlating with respiratory infections"
          ]
        },
        {
          category: "Safety & Interactions",
          insights: [
            "2,847 potential drug interactions identified across patient population",
            "Polypharmacy patients (5+ drugs) show 3.2x higher adverse event rates",
            "High-severity interactions concentrated in elderly patients (65+) taking multiple chronic medications",
            "Drug-drug interactions most common in cardiovascular and psychiatric medication combinations"
          ]
        },
        {
          category: "Optimization Opportunities",
          insights: [
            "1,247 dose adjustment opportunities identified through AI analysis",
            "Safer therapeutic alternatives available for 18% of high-risk prescriptions",
            "Generic substitution potential could reduce costs by 23% without compromising efficacy",
            "Medication adherence monitoring could improve outcomes for 2,340 patients"
          ]
        }
      ],
      recommendations: [
        {
          priority: "High",
          title: "Implement Drug Interaction Screening",
          description: "Deploy automated screening system for high-severity drug interactions",
          timeline: "2-4 months",
          impact: "High"
        },
        {
          priority: "High",
          title: "Establish Polypharmacy Management Protocol",
          description: "Create specialized review process for patients on 5+ medications",
          timeline: "1-3 months",
          impact: "High"
        },
        {
          priority: "Medium",
          title: "Optimize Seasonal Prescribing",
          description: "Develop guidelines for appropriate seasonal antibiotic prescribing",
          timeline: "3-6 months",
          impact: "Medium"
        }
      ],
      nextSteps: [
        "Validate drug interaction findings with clinical pharmacists",
        "Develop implementation plan for automated screening systems",
        "Create polypharmacy patient identification and monitoring protocols",
        "Establish medication safety KPIs and quarterly review processes"
      ]
    };
  }
  
  return null;
};

export const generateMockAnalysis = (path: any[], stepIndex: number) => {
  const analysisTypes = [
    {
      type: 'text',
      title: 'AI Analysis Summary',
      content: `Based on your exploration path focusing on "${path[0]?.label}", here are key insights:\n\n• Population analysis shows significant demographic variations\n• Current filtering approach will yield approximately 12,847 patient records\n• Recommended next steps include temporal analysis and outcome correlation\n• Data quality score: 94% (excellent for analysis)`
    },
    {
      type: 'chart',
      title: 'Preliminary Data Distribution',
      chartType: 'bar',
      data: {
        labels: ['Age 18-30', 'Age 31-45', 'Age 46-60', 'Age 61+'],
        values: [2840, 3920, 3450, 2637],
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      }
    },
    {
      type: 'insights',
      title: 'Pattern Recognition',
      insights: [
        { icon: 'TrendingUp', text: 'Seasonal patterns detected in the selected data subset', confidence: 85 },
        { icon: 'Users', text: 'Gender distribution shows 52% female, 48% male', confidence: 92 },
        { icon: 'Calendar', text: 'Peak utilization occurs in Q1 and Q4', confidence: 78 },
        { icon: 'Heart', text: 'Chronic conditions prevalent in 34% of cohort', confidence: 89 }
      ]
    }
  ];
  
  return analysisTypes[stepIndex % 3];
};

export const generateMockFinalAnalysis = (explorationPath: any[], _builderChoices: string[]) => {
  const pathSummary = explorationPath.map(step => step.label).join(' → ');
  
  return {
    pathSummary,
    executiveSummary: `Your exploration path "${pathSummary}" represents a comprehensive analytical approach focusing on ${explorationPath[0]?.label.toLowerCase()}. This methodology will yield actionable insights for healthcare decision-making.`,
    keyFindings: [
      {
        title: "Data Coverage",
        value: "12,847 patients",
        trend: "+15%",
        description: "Comprehensive dataset with excellent coverage across all demographic segments"
      },
      {
        title: "Analysis Confidence",
        value: "94%",
        trend: "High",
        description: "Statistical significance achieved across all selected analytical dimensions"
      },
      {
        title: "Actionable Insights",
        value: "23 insights",
        trend: "+8",
        description: "Key findings that can directly inform strategic healthcare decisions"
      },
      {
        title: "Predicted Impact",
        value: "18% improvement",
        trend: "Positive",
        description: "Expected improvement in healthcare outcomes based on recommended actions"
      }
    ],
    detailedInsights: [
      {
        category: "Population Analysis",
        insights: [
          "Elderly patients (65+) represent 18% of population but account for 45% of healthcare encounters",
          "Gender distribution shows balanced representation with slight female majority (52%)",
          "Seasonal patterns indicate 25% increase in utilization during Q1 and Q4"
        ]
      },
      {
        category: "Utilization Patterns",
        insights: [
          "Preventive care engagement correlates strongly with better long-term outcomes",
          "Emergency department usage peaks during winter months (December-February)",
          "Chronic disease management drives 67% of total healthcare utilization"
        ]
      },
      {
        category: "Strategic Opportunities",
        insights: [
          "Targeted preventive care programs could reduce emergency visits by 22%",
          "Seasonal staffing adjustments recommended for Q4 and Q1 periods",
          "Chronic disease management protocols show potential for cost reduction"
        ]
      }
    ],
    recommendations: [
      {
        priority: "High",
        title: "Implement Predictive Analytics Dashboard",
        description: "Deploy real-time analytics to monitor utilization patterns and predict demand",
        timeline: "3-6 months",
        impact: "High"
      },
      {
        priority: "Medium",
        title: "Enhance Preventive Care Programs",
        description: "Expand preventive care initiatives targeting high-risk demographics",
        timeline: "6-12 months", 
        impact: "Medium"
      },
      {
        priority: "High",
        title: "Optimize Resource Allocation",
        description: "Adjust staffing and resource allocation based on seasonal patterns",
        timeline: "1-3 months",
        impact: "High"
      }
    ],
    nextSteps: [
      "Review and validate findings with clinical stakeholders",
      "Develop implementation roadmap for high-priority recommendations",
      "Establish KPIs and monitoring framework",
      "Schedule quarterly reviews to track progress"
    ]
  };
};

export const generateMockGuidedAnalysis = (stepIndex: number, step: any) => {
  const guidedAnalysisTypes = [
    {
      type: 'text',
      title: 'Demographics Analysis',
      content: `Step ${stepIndex + 1} Analysis - ${step.label}:\n\n• ${step.insight}\n• Data processing reveals significant demographic patterns\n• Current analysis scope: 12,847 patient records\n• Statistical confidence: 96% (excellent reliability)\n• Recommended progression: Continue to age-based filtering for deeper insights`
    },
    {
      type: 'chart',
      title: `${step.label} - Data Visualization`,
      chartType: 'bar',
      data: {
        labels: ['18-30', '31-45', '46-60', '61-75', '75+'],
        values: [2840, 3920, 3450, 2137, 500],
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }
    },
    {
      type: 'insights',
      title: `${step.label} - Key Patterns`,
      insights: [
        { icon: 'TrendingUp', text: step.insight, confidence: 92 },
        { icon: 'Users', text: 'Current filter maintains representative sample distribution', confidence: 88 },
        { icon: 'BarChart3', text: 'Data quality remains high across all demographic segments', confidence: 95 },
        { icon: 'Calendar', text: 'Temporal patterns consistent with national healthcare trends', confidence: 83 }
      ]
    }
  ];
  
  return guidedAnalysisTypes[stepIndex % 3];
}; 