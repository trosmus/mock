import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DataInsightsSummaryProps {
  onContinue: () => void;
}

export const DataInsightsSummary: React.FC<DataInsightsSummaryProps> = ({ onContinue }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(0);

  // Multiple data variants to simulate different insights
  const insightVariants = [
    {
      totalClaims: 15847,
      dateRange: { start: "2024-01-01", end: "2024-12-31" },
      costsByCategory: { treatment: 2850000, medication: 1250000, rehabilitation: 450000 },
      topDiagnoses: ["Hypertension", "Diabetes Type 2", "Depression", "Arthritis"],
      claimStatuses: { approved: 14203, rejected: 1644 },
      insurer: "HealthCare Plus",
      keyInsight: "Treatment costs dominate your healthcare spending"
    },
    {
      totalClaims: 16234,
      dateRange: { start: "2024-01-01", end: "2024-12-31" },
      costsByCategory: { treatment: 2650000, medication: 1450000, rehabilitation: 380000 },
      topDiagnoses: ["Diabetes Type 2", "Hypertension", "Chronic Pain", "Asthma"],
      claimStatuses: { approved: 14891, rejected: 1343 },
      insurer: "HealthCare Plus",
      keyInsight: "Medication costs show significant seasonal variation"
    },
    {
      totalClaims: 15623,
      dateRange: { start: "2024-01-01", end: "2024-12-31" },
      costsByCategory: { treatment: 2750000, medication: 1180000, rehabilitation: 520000 },
      topDiagnoses: ["Hypertension", "Arthritis", "Depression", "Heart Disease"],
      claimStatuses: { approved: 14156, rejected: 1467 },
      insurer: "HealthCare Plus",
      keyInsight: "Rehabilitation services usage increased 15% this quarter"
    }
  ];

  const insights = insightVariants[currentVariant];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Cycle to next variant
    setCurrentVariant((prev) => (prev + 1) % insightVariants.length);
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCosts = insights.costsByCategory.treatment + insights.costsByCategory.medication + insights.costsByCategory.rehabilitation;
  const approvalRate = ((insights.claimStatuses.approved / insights.totalClaims) * 100).toFixed(1);

  return (
    <div className="bg-white relative overflow-hidden py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50/50"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent transform -skew-y-6"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-100 to-transparent transform skew-y-6"></div>
      </div>
      
      <div className="relative z-10 px-8">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Your Healthcare Data Overview
                  </h1>
                  <p className="text-lg text-gray-600">
                    Key insights from your {insights.insurer} data
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw 
                      size={16} 
                      className={`${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    <span>{isRefreshing ? 'Refreshing...' : 'New Insights'}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content with Visualization */}
            <motion.div
              key={currentVariant} // This will trigger re-animation when variant changes
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className=" rounded-3xl max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                  {/* Text Content */}
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Your healthcare portfolio contains <strong className="text-blue-600">{insights.totalClaims.toLocaleString()} claims</strong> from {insights.insurer} 
                      spanning the 2024 period, representing a comprehensive view of your healthcare journey.
                    </p>
                    
                    <p>
                      Total healthcare expenditure reaches <strong className="text-green-600">{formatCurrency(totalCosts)}</strong>, with treatment 
                      costs accounting for the majority. Your claims maintain a strong <strong className="text-purple-600">{approvalRate}% approval rate</strong>, 
                      indicating good alignment with coverage policies.
                    </p>
                    
                    <p>
                      The data reveals patterns across key health areas: <strong className="text-orange-600">{insights.topDiagnoses.slice(0, 2).join(', ')}</strong> 
                      appear most frequently, followed by {insights.topDiagnoses.slice(2).join(' and ')}.
                    </p>
                    
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <p className="text-blue-800 font-medium text-sm">
                        <strong>Key insight:</strong> {insights.keyInsight}. Dive into cost trends, provider comparisons, seasonal patterns, 
                        and personalized recommendations based on your healthcare data.
                      </p>
                    </div>
                  </div>

                  {/* Visualization Panel */}
                  <div className="space-y-4">
                    {/* Claims Overview */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Claims Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Total Claims</span>
                          <span className="font-bold text-blue-600 text-sm">{insights.totalClaims.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: `${approvalRate}%`}}></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">Approved: {insights.claimStatuses.approved.toLocaleString()}</span>
                          <span className="text-red-500">Rejected: {insights.claimStatuses.rejected.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Cost Distribution</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-sm">Treatment</span>
                            <span className="text-xs font-medium">{formatCurrency(insights.costsByCategory.treatment)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${(insights.costsByCategory.treatment / totalCosts) * 100}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-sm">Medication</span>
                            <span className="text-xs font-medium">{formatCurrency(insights.costsByCategory.medication)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(insights.costsByCategory.medication / totalCosts) * 100}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-sm">Rehabilitation</span>
                            <span className="text-xs font-medium">{formatCurrency(insights.costsByCategory.rehabilitation)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-purple-500 h-1.5 rounded-full" style={{width: `${(insights.costsByCategory.rehabilitation / totalCosts) * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Diagnoses */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3">Top Conditions</h3>
                      <div className="space-y-1.5">
                        {insights.topDiagnoses.map((diagnosis, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-orange-500' : 
                              index === 1 ? 'bg-orange-400' : 
                              index === 2 ? 'bg-orange-300' : 'bg-orange-200'
                            }`}></div>
                            <span className="text-gray-700 text-xs font-medium">{diagnosis}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DataInsightsSummary;