// Function to provide demo data for each chart
export const getDemoDataForChart = (widgetId: string) => {
  switch (widgetId) {
    case 'condition-distribution':
      return {
        columns: ['condition', 'patient_count'],
        data: [
          ['Hypertension', 2840],
          ['Diabetes Type 2', 1950],
          ['Hyperlipidemia', 1680],
          ['Asthma', 1240],
          ['Depression', 890]
        ],
        totalRows: 5
      };
    
    case 'monthly-encounters':
      return {
        columns: ['month', 'encounter_count'],
        data: [
          ['Jan', 4200],
          ['Feb', 3800],
          ['Mar', 4100],
          ['Apr', 4500],
          ['May', 4300],
          ['Jun', 4700]
        ],
        totalRows: 6
      };
    
    case 'payer-mix':
      return {
        columns: ['payer_type', 'percentage'],
        data: [
          ['Medicare', 42],
          ['Private Insurance', 35],
          ['Medicaid', 18],
          ['Self-Pay', 5]
        ],
        totalRows: 4
      };
    
    case 'age-vs-conditions':
      return {
        columns: ['age', 'condition_count'],
        data: [
          [28, 1],
          [34, 2],
          [41, 3],
          [52, 4],
          [38, 2],
          [67, 6],
          [45, 3],
          [59, 5],
          [33, 1],
          [72, 7]
        ],
        totalRows: 10
      };
    
    default:
      return {
        columns: ['x', 'y'],
        data: [['Sample', 100]],
        totalRows: 1
      };
  }
}; 