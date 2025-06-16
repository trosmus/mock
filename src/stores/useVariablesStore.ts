import { create } from 'zustand';

export interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description?: string;
  tableName: string;
  isKey?: boolean;
  isForeignKey?: boolean;
  relatedTable?: string;
}

interface VariablesState {
  variables: Variable[];
  isExpanded: boolean;
  selectedVariables: Variable[];
  setVariables: (variables: Variable[]) => void;
  toggleExpanded: () => void;
  addSelectedVariable: (variable: Variable) => void;
  removeSelectedVariable: (variableId: string) => void;
  clearSelectedVariables: () => void;
}

// Mock metadata variables from DataHub
const mockVariables: Variable[] = [
  // Patients table
  { id: 'patients.patient_id', name: 'patient_id', type: 'number', tableName: 'patients', description: 'Unique patient identifier', isKey: true },
  { id: 'patients.age_group', name: 'age_group', type: 'string', tableName: 'patients', description: 'Age group (18-30, 31-50, 51+)' },
  { id: 'patients.gender', name: 'gender', type: 'string', tableName: 'patients', description: 'Patient gender' },
  { id: 'patients.admission_date', name: 'admission_date', type: 'date', tableName: 'patients', description: 'Date of admission' },
  
  // Diagnoses table
  { id: 'diagnoses.diagnosis_id', name: 'diagnosis_id', type: 'number', tableName: 'diagnoses', description: 'Unique diagnosis identifier', isKey: true },
  { id: 'diagnoses.patient_id', name: 'patient_id', type: 'number', tableName: 'diagnoses', description: 'Patient foreign key', isForeignKey: true, relatedTable: 'patients' },
  { id: 'diagnoses.diagnosis', name: 'diagnosis', type: 'string', tableName: 'diagnoses', description: 'Primary diagnosis' },
  { id: 'diagnoses.severity', name: 'severity', type: 'string', tableName: 'diagnoses', description: 'Condition severity (Mild, Moderate, Severe)' },
  
  // Transactions table
  { id: 'transactions.transaction_id', name: 'transaction_id', type: 'number', tableName: 'transactions', description: 'Unique transaction ID', isKey: true },
  { id: 'transactions.customer_id', name: 'customer_id', type: 'number', tableName: 'transactions', description: 'Customer identifier' },
  { id: 'transactions.amount', name: 'amount', type: 'number', tableName: 'transactions', description: 'Transaction amount' },
  { id: 'transactions.date', name: 'date', type: 'date', tableName: 'transactions', description: 'Transaction date' },
  { id: 'transactions.product_category', name: 'product_category', type: 'string', tableName: 'transactions', description: 'Product category' },
];

export const useVariablesStore = create<VariablesState>((set) => ({
  variables: mockVariables,
  isExpanded: false,
  selectedVariables: [],
  
  setVariables: (variables) => set({ variables }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  addSelectedVariable: (variable) => 
    set((state) => ({ 
      selectedVariables: [...state.selectedVariables.filter(v => v.id !== variable.id), variable] 
    })),
  removeSelectedVariable: (variableId) => 
    set((state) => ({ 
      selectedVariables: state.selectedVariables.filter(v => v.id !== variableId) 
    })),
  clearSelectedVariables: () => set({ selectedVariables: [] }),
})); 