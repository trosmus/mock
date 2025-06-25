import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Upload, 
  BarChart3, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  FileJson,
  FileText
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface DataUploadOnboardingProps {
  onComplete: () => void;
}

const DataUploadOnboarding: React.FC<DataUploadOnboardingProps> = ({ onComplete }) => {
  const { datasets, setDatasets } = useAppStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const processFile = async (file: File) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Create new dataset and add to store
    const newDataset = {
      id: `dataset-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      description: `Uploaded dataset: ${file.name}`,
      tables: [{
        name: 'main_table',
        columns: [
          { name: 'patient_id', type: 'INTEGER', description: 'Patient identifier' },
          { name: 'age', type: 'INTEGER', description: 'Patient age' },
          { name: 'gender', type: 'VARCHAR', description: 'Patient gender' },
          { name: 'diagnosis', type: 'VARCHAR', description: 'Primary diagnosis' },
          { name: 'admission_date', type: 'DATE', description: 'Hospital admission date' },
          { name: 'discharge_date', type: 'DATE', description: 'Hospital discharge date' },
          { name: 'payer_type', type: 'VARCHAR', description: 'Insurance payer type' },
          { name: 'total_charges', type: 'DECIMAL', description: 'Total medical charges' },
          { name: 'department', type: 'VARCHAR', description: 'Medical department' },
          { name: 'length_of_stay', type: 'INTEGER', description: 'Days in hospital' },
          { name: 'readmission_30d', type: 'BOOLEAN', description: '30-day readmission flag' },
          { name: 'satisfaction_score', type: 'DECIMAL', description: 'Patient satisfaction score' }
        ],
        rowCount: 15847
      }],
      lastUpdated: new Date()
    };
    
    setDatasets([...datasets, newDataset]);
    localStorage.setItem('hasUploadedData', 'true');
  };

  // File upload handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);
    
    try {
      await processFile(file);
      setUploadSuccess(true);
      
      // Redirect to main explore page after a brief success message
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipUpload = () => {
    localStorage.setItem('hasUploadedData', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            {/* Informational Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Database size={24} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Data Explorer
                </h1>
              </div>
              <div className="relative">
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Upload your dataset to discover insights, explore patterns, and generate AI-powered analysis.
                </p>
              </div>
            </div>

            {uploadError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4"
              >
                <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
                <span className="text-red-700 font-medium">{uploadError}</span>
              </motion.div>
            )}

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4"
              >
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                <span className="text-green-700 font-medium">File uploaded successfully! Redirecting to explore...</span>
              </motion.div>
            )}

            <div
              className={`relative overflow-hidden border-2 border-dashed rounded-3xl text-center transition-all duration-500 min-h-[380px] flex flex-col items-center justify-center group backdrop-blur-sm ${
                isDragOver
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-blue-25 to-purple-50 scale-[1.02] shadow-2xl shadow-blue-500/20'
                  : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 hover:shadow-xl hover:shadow-blue-500/10'
              } ${isProcessing || uploadSuccess ? 'pointer-events-none opacity-70' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-60"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-xl"></div>
              
              <input
                type="file"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                disabled={isProcessing || uploadSuccess}
              />
              
              {uploadSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center relative z-20"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-2xl border-4 border-white/50">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">Upload Complete!</h3>
                  <p className="text-gray-600 text-lg">Taking you to the explore page...</p>
                </motion.div>
              ) : isProcessing ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center relative z-20"
                >
                  <div className="w-28 h-28 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-8 shadow-lg"></div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-4">Processing File...</h3>
                  <p className="text-gray-600 text-lg">Analyzing your data structure and content</p>
                  <div className="mt-4 flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center px-8 relative z-20"
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mt-8 mb-12 transition-all duration-500 relative ${
                    isDragOver 
                      ? 'bg-gradient-to-br from-blue-200 to-blue-300 shadow-2xl shadow-blue-500/30 scale-110' 
                      : 'bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:scale-110'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <Upload size={48} className={`transition-all duration-500 relative z-10 ${
                      isDragOver ? 'text-blue-700 scale-110' : 'text-gray-600 group-hover:text-blue-600 group-hover:scale-110'
                    }`} />
                    {!isDragOver && (
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300/30 group-hover:border-blue-400/50 transition-colors duration-300"></div>
                    )}
                  </div>
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-6">
                      <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        {isDragOver ? '✨ Drop your file here' : 'Choose a file to upload'}
                      </span>
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <p className="text-sm font-medium">Or click anywhere in this area to browse files</p>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Skip option */}
            {!isProcessing && !uploadSuccess && (
              <div className="mt-10 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkipUpload}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-blue-600 font-medium transition-all duration-200 rounded-xl hover:bg-blue-50/50"
                >
                  <span className="relative z-10">Skip upload and explore with sample data</span>
                  <BarChart3 size={16} className="group-hover:text-blue-500 transition-colors duration-200" />
                  <div className="absolute inset-0 border border-gray-200 rounded-xl group-hover:border-blue-300 transition-colors duration-200"></div>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataUploadOnboarding;