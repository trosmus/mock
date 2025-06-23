import { mindMapData } from './data';

// Helper function to calculate circular positioning for alternative nodes
const getCircularPosition = (parentX: number, parentY: number, alternativeIndex: number, totalAlternatives: number, radius: number = 80) => {
  // Calculate evenly distributed angles around the circle
  const angleStep = (360 / totalAlternatives);
  const angle = angleStep * alternativeIndex;
  const radians = (angle * Math.PI) / 180;
  
  return {
    x: parentX + radius * Math.cos(radians),
    y: parentY + radius * Math.sin(radians)
  };
};

// Cytoscape node styles
export const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      'background-color': (ele: any) => {
        const type = ele.data('type');
        if (type === 'hub') return '#1e40af';
        if (type === 'path1') return '#3b82f6'; // Blue theme - Demographics
        if (type === 'path2') return '#10b981'; // Green theme - Medications  
        if (type === 'path3') return '#ef4444'; // Red theme - Clinical Outcomes
        if (type === 'alternative') return '#9ca3af'; // Gray for alternative options
        return '#64748b';
      },
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#ffffff',
      'font-size': (ele: any) => {
        const type = ele.data('type');
        const nodeId = ele.data('id');
        if (type === 'hub') return '14px';
        if (nodeId === 'medications-dataset') return '14px'; // Same font size as hub
        if (type === 'alternative') return '9px'; // Smaller text for alternatives
        return '11px'; // Main path nodes
      },
      'font-weight': 600,
      'text-wrap': 'wrap',
      'text-max-width': (ele: any) => {
        const type = ele.data('type');
        const nodeId = ele.data('id');
        if (type === 'hub') return '120px';
        if (nodeId === 'medications-dataset') return '120px'; // Same text width as hub
        return '100px';
      },
      'width': (ele: any) => {
        const type = ele.data('type');
        const nodeId = ele.data('id');
        if (type === 'hub') return '120px'; // Central hub
        if (nodeId === 'medications-dataset') return '120px'; // Same size as hub
        if (type === 'alternative') return '60px'; // Smaller alternatives
        return '75px'; // Main path nodes
      },
      'height': (ele: any) => {
        const type = ele.data('type');
        const nodeId = ele.data('id');
        if (type === 'hub') return '120px'; // Central hub
        if (nodeId === 'medications-dataset') return '120px'; // Same size as hub
        if (type === 'alternative') return '60px'; // Smaller alternatives
        return '75px'; // Main path nodes
      },
      'shape': 'ellipse',
      'border-width': (ele: any) => {
        const type = ele.data('type');
        const nodeId = ele.data('id');
        if (type === 'hub') return 4; // Thicker border for hub
        if (nodeId === 'medications-dataset') return 4; // Same border width as hub
        return 2;
      },
      'border-color': '#ffffff',
      'text-outline-width': 1,
      'text-outline-color': (ele: any) => {
        const type = ele.data('type');
        if (type === 'hub') return '#1e40af';
        if (type === 'path1') return '#3b82f6';
        if (type === 'path2') return '#10b981';
        if (type === 'path3') return '#ef4444';
        if (type === 'alternative') return '#9ca3af'; // Gray outline for alternatives
        return '#64748b';
      },
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 5,
      'border-color': '#fbbf24',
    }
  },
  {
    selector: 'node.path-highlighted',
    style: {
      'border-width': 5,
      'border-color': '#f59e0b',
      'opacity': 1,
      'z-index': 10,
      'background-color': (ele: any) => {
        const type = ele.data('type');
        // Make highlighted nodes brighter/more saturated
        if (type === 'hub') return '#1d4ed8'; // Brighter blue
        if (type === 'path1') return '#2563eb'; // Brighter blue
        if (type === 'path2') return '#059669'; // Brighter green
        if (type === 'path3') return '#dc2626'; // Brighter red
        return '#64748b';
      }
    }
  },
  {
    selector: 'node.selected.path-highlighted',
    style: {
      'border-width': 6,
      'border-color': '#f59e0b',
      'z-index': 15,
      'background-color': (ele: any) => {
        const type = ele.data('type');
        // Even brighter for selected highlighted nodes
        if (type === 'hub') return '#1e40af';
        if (type === 'path1') return '#1d4ed8';
        if (type === 'path2') return '#047857';
        if (type === 'path3') return '#b91c1c';
        return '#64748b';
      }
    }
  },
  {
    selector: 'node.alternative',
    style: {
      'opacity': 0,
      'events': 'no',
      'display': 'element'
    }
  },
  {
    selector: 'node.alternative.visible',
    style: {
      'opacity': 1,
      'events': 'yes'
    }
  },
  {
    selector: 'edge.alternative-edge',
    style: {
      'opacity': 0,
      'events': 'no',
      'z-index': 1
    }
  },
  {
    selector: 'edge.alternative-edge.visible',
    style: {
      'opacity': 0.8,
      'events': 'yes',
      'z-index': 2
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': (ele: any) => {
        const pathId = ele.data('pathId');
        if (pathId === 'demographics-utilization') return '#3b82f6';
        if (pathId === 'medication-patterns') return '#10b981';
        if (pathId === 'clinical-outcomes') return '#ef4444';
        if (pathId === 'alternative') return '#d1d5db'; // Light gray for alternatives
        return '#94a3b8';
      },
      'target-arrow-color': (ele: any) => {
        const pathId = ele.data('pathId');
        if (pathId === 'demographics-utilization') return '#3b82f6';
        if (pathId === 'medication-patterns') return '#10b981';
        if (pathId === 'clinical-outcomes') return '#ef4444';
        if (pathId === 'alternative') return '#d1d5db'; // Light gray for alternatives
        return '#94a3b8';
      },
      'target-arrow-shape': 'triangle',
      'curve-style': 'straight',
      'opacity': (ele: any) => {
        // Override opacity for alternative edges that don't have visible class
        if (ele.hasClass('alternative-edge') && !ele.hasClass('visible')) {
          return 0;
        }
        return 0.8;
      },
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'line-color': '#fbbf24',
      'target-arrow-color': '#fbbf24',
      'width': 4,
    }
  },
  {
    selector: 'edge.path-highlighted',
    style: {
      'line-color': '#f59e0b',
      'target-arrow-color': '#f59e0b',
      'width': 6,
      'opacity': 1,
      'z-index': 10
    }
  }
];

// Cytoscape layout configuration
export const cytoscapeLayout = {
  name: 'preset',
  fit: false,
  padding: 60,
  animate: false,
  positions: (node: any) => {
    const nodeData = node.data();
    const type = nodeData.type;
    const step = nodeData.step || 0;
    const parentId = nodeData.parentId;
    
    // Main path nodes - zigzag pattern
    if (type === 'hub') {
      return { x: 100, y: 300 }; // Start position
    } else if (type === 'path1') {
      // Demographics path - zigzag pattern
      const isEven = step % 2 === 0;
      const yPosition = isEven ? 250 : 350; // Alternate between upper and lower positions
      return { x: 100 + (step * 200), y: yPosition };
    } else if (type === 'path2') {
      // Medications path - zigzag pattern (offset from demographics)
      const isEven = step % 2 === 0;
      const yPosition = isEven ? 500 : 600; // Lower zigzag pattern
      return { x: 100 + (step * 200), y: yPosition };
    } else if (type === 'path3') {
      // Clinical Outcomes path - zigzag pattern going LEFT from patients dataset
      const isEven = step % 2 === 0;
      const yPosition = isEven ? 250 : 350; // Same Y range as path1 but going LEFT
      return { x: 100 - (step * 200), y: yPosition }; // Negative X direction (LEFT)
    } else if (type === 'alternative') {
      // Position alternatives around their parent nodes in a circular pattern
      if (parentId === 'patients-dataset') {
        // Alternatives from the hub - position them above and below the hub
        const hubAlternatives = ['alt-outcomes-analysis', 'alt-condition-analysis'];
        const alternativeIndex = hubAlternatives.indexOf(nodeData.id);
        
        if (alternativeIndex === 0) {
          // First alternative (alt-outcomes-analysis) goes above the hub
          return { x: 100, y: 200 }; // Above hub (hub is at y: 300)
        } else if (alternativeIndex === 1) {
          // Second alternative (alt-condition-analysis) goes below the hub
          return { x: 100, y: 400 }; // Below hub (hub is at y: 300)
        }
        
        // Fallback to circular positioning if needed
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        return getCircularPosition(100, 300, baseIndex, hubAlternatives.length, 100);
      } else if (parentId === 'demographics-query') {
        // Alternatives from demographics query
        const demoAlternatives = ['alt-demo-geographic', 'alt-demo-insurance', 'alt-demo-socioeconomic'];
        const alternativeIndex = demoAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step1IsEven = 1 % 2 === 0;
        const parentY = step1IsEven ? 250 : 350;
        return getCircularPosition(300, parentY, baseIndex, demoAlternatives.length, 100);
      } else if (parentId === 'age-filter') {
        // Alternatives from age filter
        const ageAlternatives = ['alt-age-cohort', 'alt-age-distribution', 'alt-age-comorbidity'];
        const alternativeIndex = ageAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step2IsEven = 2 % 2 === 0;
        const parentY = step2IsEven ? 250 : 350;
        return getCircularPosition(500, parentY, baseIndex, ageAlternatives.length, 100);
      } else if (parentId === 'gender-filter') {
        // Alternatives from gender filter
        const genderAlternatives = ['alt-gender-outcomes', 'alt-gender-screening', 'alt-gender-utilization'];
        const alternativeIndex = genderAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step3IsEven = 3 % 2 === 0;
        const parentY = step3IsEven ? 250 : 350;
        return getCircularPosition(700, parentY, baseIndex, genderAlternatives.length, 100);
      } else if (parentId === 'population-pyramid') {
        // Alternatives from population pyramid
        const pyramidAlternatives = ['alt-pyramid-treemap', 'alt-pyramid-sunburst', 'alt-pyramid-heatmap'];
        const alternativeIndex = pyramidAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step4IsEven = 4 % 2 === 0;
        const parentY = step4IsEven ? 250 : 350;
        return getCircularPosition(900, parentY, baseIndex, pyramidAlternatives.length, 100);
      } else if (parentId === 'encounters-query') {
        // Alternatives from encounters query
        const encountersAlternatives = ['alt-encounters-seasonal', 'alt-encounters-provider', 'alt-encounters-complexity'];
        const alternativeIndex = encountersAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step5IsEven = 5 % 2 === 0;
        const parentY = step5IsEven ? 250 : 350;
        return getCircularPosition(1100, parentY, baseIndex, encountersAlternatives.length, 100);
      } else if (parentId === 'line-chart') {
        // Alternatives from line chart
        const chartAlternatives = ['alt-chart-area', 'alt-chart-scatter', 'alt-chart-boxplot'];
        const alternativeIndex = chartAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step6IsEven = 6 % 2 === 0;
        const parentY = step6IsEven ? 250 : 350;
        return getCircularPosition(1300, parentY, baseIndex, chartAlternatives.length, 100);
      } else if (parentId === 'utilization-narrative') {
        // Alternatives from utilization narrative
        const narrativeAlternatives = ['alt-narrative-predictive', 'alt-narrative-cost', 'alt-narrative-quality'];
        const alternativeIndex = narrativeAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step7IsEven = 7 % 2 === 0;
        const parentY = step7IsEven ? 250 : 350;
        return getCircularPosition(1500, parentY, baseIndex, narrativeAlternatives.length, 100);
      } else if (parentId === 'medications-dataset') {
        // Alternatives from medications dataset
        const medAlternatives = ['alt-med-outcomes', 'alt-med-cost', 'alt-med-adherence'];
        const alternativeIndex = medAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        // medications-dataset is step 1 of path2, so Y should be 600 (odd step in zigzag)
        return getCircularPosition(300, 600, baseIndex, medAlternatives.length, 120); // Larger radius for starting node
      } else if (parentId === 'medication-query') {
        // Alternatives from medication query
        const medQueryAlternatives = ['alt-medquery-provider', 'alt-medquery-generic', 'alt-medquery-dosage'];
        const alternativeIndex = medQueryAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step2IsEven = 2 % 2 === 0;
        const parentY = step2IsEven ? 500 : 600;
        return getCircularPosition(500, parentY, baseIndex, medQueryAlternatives.length, 100);
      } else if (parentId === 'drug-class-filter') {
        // Alternatives from drug class filter
        const drugClassAlternatives = ['alt-drugclass-therapeutic', 'alt-drugclass-mechanism', 'alt-drugclass-route'];
        const alternativeIndex = drugClassAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step3IsEven = 3 % 2 === 0;
        const parentY = step3IsEven ? 500 : 600;
        return getCircularPosition(700, parentY, baseIndex, drugClassAlternatives.length, 100);
      } else if (parentId === 'prescription-analysis') {
        // Alternatives from prescription analysis
        const prescriptionAlternatives = ['alt-prescription-polypharmacy', 'alt-prescription-duration', 'alt-prescription-switching'];
        const alternativeIndex = prescriptionAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step4IsEven = 4 % 2 === 0;
        const parentY = step4IsEven ? 500 : 600;
        return getCircularPosition(900, parentY, baseIndex, prescriptionAlternatives.length, 100);
      } else if (parentId === 'interaction-matrix') {
        // Alternatives from interaction matrix
        const interactionAlternatives = ['alt-interaction-severity', 'alt-interaction-clinical', 'alt-interaction-contraindication'];
        const alternativeIndex = interactionAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step5IsEven = 5 % 2 === 0;
        const parentY = step5IsEven ? 500 : 600;
        return getCircularPosition(1100, parentY, baseIndex, interactionAlternatives.length, 100);
      } else if (parentId === 'temporal-trends') {
        // Alternatives from temporal trends
        const temporalAlternatives = ['alt-temporal-epidemic', 'alt-temporal-formulary', 'alt-temporal-lifecycle'];
        const alternativeIndex = temporalAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step6IsEven = 6 % 2 === 0;
        const parentY = step6IsEven ? 500 : 600;
        return getCircularPosition(1300, parentY, baseIndex, temporalAlternatives.length, 100);
      } else if (parentId === 'safety-heatmap') {
        // Alternatives from safety heatmap
        const safetyAlternatives = ['alt-safety-ade', 'alt-safety-monitoring', 'alt-safety-risk'];
        const alternativeIndex = safetyAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step7IsEven = 7 % 2 === 0;
        const parentY = step7IsEven ? 500 : 600;
        return getCircularPosition(1500, parentY, baseIndex, safetyAlternatives.length, 100);
      } else if (parentId === 'pharma-insights') {
        // Alternatives from pharma insights
        const pharmaAlternatives = ['alt-pharma-optimization', 'alt-pharma-policy', 'alt-pharma-population'];
        const alternativeIndex = pharmaAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step8IsEven = 8 % 2 === 0;
        const parentY = step8IsEven ? 500 : 600;
        return getCircularPosition(1700, parentY, baseIndex, pharmaAlternatives.length, 100);
      } else if (parentId === 'outcomes-overview') {
        // Alternatives from outcomes overview (step 1 of path3)
        const outcomesAlternatives = ['alt-outcomes-mortality', 'alt-outcomes-readmission', 'alt-outcomes-complications'];
        const alternativeIndex = outcomesAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step1IsEven = 1 % 2 === 0;
        const parentY = step1IsEven ? 250 : 350;
        return getCircularPosition(100 - (1 * 200), parentY, baseIndex, outcomesAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'condition-filter') {
        // Alternatives from condition filter (step 2 of path3)
        const conditionAlternatives = ['alt-condition-chronic', 'alt-condition-acute', 'alt-condition-surgical'];
        const alternativeIndex = conditionAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step2IsEven = 2 % 2 === 0;
        const parentY = step2IsEven ? 250 : 350;
        return getCircularPosition(100 - (2 * 200), parentY, baseIndex, conditionAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'quality-analysis') {
        // Alternatives from quality analysis (step 3 of path3)
        const qualityAlternatives = ['alt-quality-safety', 'alt-quality-satisfaction', 'alt-quality-efficiency'];
        const alternativeIndex = qualityAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step3IsEven = 3 % 2 === 0;
        const parentY = step3IsEven ? 250 : 350;
        return getCircularPosition(100 - (3 * 200), parentY, baseIndex, qualityAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'outcomes-chart') {
        // Alternatives from outcomes chart (step 4 of path3)
        const chartAlternatives = ['alt-chart-heatmap', 'alt-chart-benchmark', 'alt-chart-funnel'];
        const alternativeIndex = chartAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step4IsEven = 4 % 2 === 0;
        const parentY = step4IsEven ? 250 : 350;
        return getCircularPosition(100 - (4 * 200), parentY, baseIndex, chartAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'risk-stratification') {
        // Alternatives from risk stratification (step 5 of path3)
        const riskAlternatives = ['alt-risk-comorbidity', 'alt-risk-predictive', 'alt-risk-social'];
        const alternativeIndex = riskAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step5IsEven = 5 % 2 === 0;
        const parentY = step5IsEven ? 250 : 350;
        return getCircularPosition(100 - (5 * 200), parentY, baseIndex, riskAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'quality-dashboard') {
        // Alternatives from quality dashboard (step 6 of path3)
        const dashboardAlternatives = ['alt-dashboard-realtime', 'alt-dashboard-executive', 'alt-dashboard-departmental'];
        const alternativeIndex = dashboardAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step6IsEven = 6 % 2 === 0;
        const parentY = step6IsEven ? 250 : 350;
        return getCircularPosition(100 - (6 * 200), parentY, baseIndex, dashboardAlternatives.length, 100); // LEFT direction
      } else if (parentId === 'clinical-insights') {
        // Alternatives from clinical insights (step 7 of path3)
        const insightsAlternatives = ['alt-insights-improvement', 'alt-insights-benchmarking', 'alt-insights-roi'];
        const alternativeIndex = insightsAlternatives.indexOf(nodeData.id);
        const baseIndex = alternativeIndex !== -1 ? alternativeIndex : 0;
        const step7IsEven = 7 % 2 === 0;
        const parentY = step7IsEven ? 250 : 350;
        return getCircularPosition(100 - (7 * 200), parentY, baseIndex, insightsAlternatives.length, 100); // LEFT direction
      } else {
        // For other alternative nodes, position them based on their parent's position
        // Find the parent node to get its position
        const parentNodes = mindMapData.filter(n => n.id === parentId);
        if (parentNodes.length > 0) {
          const parentNode = parentNodes[0];
          const parentStep = (parentNode as any).step || 0;
          const parentX = 100 + (parentStep * 200);
          
          // Use circular positioning for generic alternatives too
          return getCircularPosition(parentX, 300, 0, 3, 100);
        }
        // Fallback positioning
        return { x: 200, y: 100 };
      }
    }
    
    // Fallback positioning for any other node types
    return { x: 0, y: 0 };
  }
}; 