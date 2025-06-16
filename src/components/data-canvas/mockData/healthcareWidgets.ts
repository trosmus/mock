import type { Widget } from '../../../types/index';

// Sample widgets that would be generated from node calculations
export const getHealthcareWidgets = (): Widget[] => [
  // Multi-metrics grid widget (replaces 3 separate metrics)
  {
    id: 'key-metrics',
    type: 'text',
    title: 'Healthcare Metrics',
    content: '', // Not used for this special widget
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },
  
  // Chart widgets with proper configurations
  {
    id: 'condition-distribution',
    type: 'chart',
    title: 'Top Conditions',
    chartConfig: {
      type: 'bar',
      x: 'condition',
      y: 'patient_count',
      title: 'Most Common Conditions'
    },
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },
  {
    id: 'monthly-encounters',
    type: 'chart',
    title: 'Monthly Encounters',
    chartConfig: {
      type: 'line',
      x: 'month',
      y: 'encounter_count',
      title: 'Patient Encounters Over Time'
    },
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },
  {
    id: 'payer-mix',
    type: 'chart',
    title: 'Insurance Payer Mix',
    chartConfig: {
      type: 'pie',
      x: 'payer_type',
      y: 'percentage',
      title: 'Insurance Distribution'
    },
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },

  // Table widget with sample data
  {
    id: 'top-providers',
    type: 'table',
    title: 'Top Providers',
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },

  // Text widgets with markdown-style content
  {
    id: 'population-summary',
    type: 'text',
    title: 'Population Health Summary',
    content: `**Patient Demographics** 👥

• **Total Patients:** 12,847 active records
• **Median Age:** 44 years (range: 18-89)
• **Gender Distribution:** 53% Female, 47% Male
• **Active Conditions:** 8,934 documented diagnoses
• **Geographic Coverage:** 15 counties, 3 states
• **Insurance Coverage:** 95% insured, 5% uninsured

**Key Population Characteristics:**
• **Chronic Disease Prevalence:** 23% below national average
• **Preventive Care Compliance:** 87% up-to-date
• **Emergency Department Utilization:** 2.3 visits per patient/year
• **Primary Care Access:** Average 14 days to appointment

**Risk Stratification:**
🔴 High Risk: 1,284 patients (10%)
🟡 Medium Risk: 3,854 patients (30%)
🟢 Low Risk: 7,709 patients (60%)

*Data refreshed: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*`,
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 2
  },
  {
    id: 'clinical-insights',
    type: 'text',
    title: 'Clinical Insights',
    content: `**🏥 Key Healthcare Findings & Recommendations**

**Top Clinical Priorities:**
🔹 **Hypertension Management:** Leading condition (22% prevalence)
   - 2,840 patients currently managed
   - 89% achieving target BP <140/90
   - Recommend expanded home monitoring program

🔹 **Diabetes Prevention:** Type 2 diabetes (15% prevalence)
   - 1,950 active diabetic patients
   - HbA1c control: 78% at target <7%
   - Pre-diabetes screening identified 892 at-risk patients

🔹 **Cardiovascular Health:** Integrated approach needed
   - Hyperlipidemia affects 1,680 patients (13%)
   - Statin therapy compliance: 82%
   - Cardiac events reduced 34% vs. prior year

**Quality Metrics Performance:**
✅ **Readmission Rate:** 8.5% (vs. national 10.2%)
✅ **Immunization Coverage:** 94% compliance (target: 90%)
✅ **Patient Satisfaction:** 4.2/5.0 HCAHPS score
✅ **Medication Adherence:** 91% for chronic conditions

**Operational Excellence:**
• **Care Coordination:** 96% of patients have assigned care teams
• **Telehealth Adoption:** 67% of eligible visits conducted remotely
• **Clinical Decision Support:** AI-assisted diagnosis in 78% of cases
• **Population Health Management:** Risk-based care for 100% of patients

**Strategic Recommendations:**
1. Expand diabetes prevention programs in high-risk zip codes
2. Implement AI-powered early warning systems for sepsis
3. Enhance mental health integration (depression screening: 89%)
4. Develop specialty care access in underserved areas

*Clinical Quality Score: 4.2/5.0 | Last Updated: ${new Date().toLocaleDateString()}*`,
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 2
  },

  // Additional widgets to complete 9-item grid
  {
    id: 'age-vs-conditions',
    type: 'chart',
    title: 'Age vs Condition Count',
    chartConfig: {
      type: 'scatter',
      x: 'age',
      y: 'condition_count',
      title: 'Patient Age vs Comorbidities'
    },
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 3
  },
  {
    id: 'system-status',
    type: 'text',
    title: 'EHR System Status',
    content: `**🟢 System Status: Operational**

**Real-Time Performance Metrics:**
• **Database Response Time:** 45ms (target: <100ms)
• **Active Concurrent Users:** 127 healthcare providers
• **Data Synchronization:** Current (last sync: 2 min ago)
• **Backup Status:** Complete (daily at 2:00 AM)
• **System Uptime:** 99.97% (30-day average)

**Infrastructure Health:**
🟢 **Primary Database:** Operational (CPU: 23%, Memory: 67%)
🟢 **Application Servers:** 3/3 online, load balanced
🟢 **Network Connectivity:** Stable (latency: 12ms)
🟢 **Security Systems:** All firewalls active, no threats detected
🟢 **Integration APIs:** HL7 FHIR endpoints responding normally

**Recent System Activity:**
• **Patient Records Updated:** 1,247 in last 24 hours
• **Lab Results Processed:** 892 new results integrated
• **Prescription Orders:** 456 e-prescriptions sent
• **Clinical Alerts Generated:** 23 critical, 67 informational
• **Audit Log Entries:** 12,847 access events recorded

**Scheduled Maintenance:**
📅 **Next Maintenance Window:** Sunday 2:00-4:00 AM EST
🔧 **Planned Updates:** Security patches, performance optimization
⚠️ **Expected Downtime:** <30 minutes
📧 **Notifications:** All users notified 48 hours in advance

**Support & Monitoring:**
• **Help Desk Tickets:** 3 open (avg resolution: 2.4 hours)
• **System Monitoring:** 24/7 NOC coverage
• **Disaster Recovery:** RTO: 4 hours, RPO: 15 minutes
• **Compliance Status:** HIPAA, SOC 2 Type II certified

**Last System Check:** ${new Date().toLocaleTimeString()} | **Next Check:** ${new Date(Date.now() + 5*60000).toLocaleTimeString()}`,
    dataframeId: 'healthcare-results',
    x: 0, y: 0, w: 4, h: 2
  }
]; 