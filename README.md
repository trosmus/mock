# DataAgent - AI-Powered Data Exploration Platform

A modern, interactive web application for data exploration using an AI agent that operates on metadata without direct access to raw data. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Functionality
- **AI-Powered Chat Interface**: Natural language queries for data exploration
- **SQL Sandbox**: Interactive SQL editor with real-time execution
- **Dynamic Visualizations**: ECharts-powered charts with multiple types (bar, line, pie)
- **Drag & Drop Dashboards**: Resizable and repositionable widgets
- **Cross-Tab Integration**: Seamless flow between chat, SQL, and visualizations

### User Interface
- **Modern Pastel Design**: Soft shadows, rounded corners, gradient backgrounds
- **Responsive Layout**: Collapsible sidebar with smooth transitions
- **Interactive Components**: Hover effects, loading states, smooth animations
- **Four Main Tabs**: Workspaces, SQL Sandbox, Quick Analysis, Admin Panel

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dataagent

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom pastel theme
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: ECharts + echarts-for-react
- **Layout**: react-grid-layout for dashboard widgets
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout with navigation
│   ├── ChatPanel.tsx    # AI chat interface
│   ├── SQLEditor.tsx    # SQL code editor
│   ├── ChartPreview.tsx # Chart visualization component
│   ├── WidgetCard.tsx   # Dashboard widget component
│   └── ...
├── pages/               # Route-based page components
│   ├── DashboardsPage.tsx
│   ├── SQLPage.tsx
│   ├── ChatPage.tsx
│   └── AdminPage.tsx
├── stores/              # Zustand state management
│   └── useAppStore.ts
├── mocks/               # Mock data and AI responses
│   └── mockData.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── main.tsx            # Application entry point
```

## 📱 Pages & Features

### 1. Workspaces (`/dashboards`)
- **Drag & Drop Grid**: Powered by react-grid-layout
- **Widget Management**: Add, remove, resize widgets
- **Edit/View Modes**: Toggle between editing and viewing
- **AI Suggestions Panel**: Pre-computed analysis recommendations

### 2. SQL Sandbox (`/sql`)
- **SQL Editor**: Multi-line editor with syntax highlighting
- **Query Execution**: Mock data simulation with realistic delays
- **Results Table**: Sortable, downloadable query results
- **Chart Generation**: Auto-generate charts from query results
- **Chat Integration**: Toggle sidebar for AI assistance

### 3. Quick Analysis (`/chat`)
- **Natural Language Interface**: Chat with AI about data
- **Rich Message Types**: Support for SQL blocks, chart previews
- **Interactive Elements**: Copy SQL, run queries, create charts
- **Suggestion Cards**: AI-generated analysis ideas

### 4. Admin Panel (`/admin`)
- **Dataset Management**: View and manage data sources
- **Chat History**: Full conversation logs
- **System Logs**: Application activity monitoring
- **Usage Statistics**: Real-time metrics and stats

## 🎨 Design System

### Color Palette
```css
--pastel-blue: #E6F3FF
--pastel-purple: #F0E6FF
--pastel-pink: #FFE6F3
--pastel-green: #E6FFE6
--pastel-yellow: #FFF9E6
--pastel-orange: #FFE6D9
```

### Components
- **Soft Shadows**: `shadow-soft` and `shadow-soft-lg`
- **Rounded Corners**: Consistent `rounded-2xl` usage
- **Gradients**: Multi-color pastel gradients for visual appeal
- **Hover Effects**: Scale and shadow transitions

## 🔄 User Flow

### Typical Analysis Workflow

1. **Start with Natural Language**
   - User asks: "Show top 10 diagnoses by age group"
   - AI analyzes metadata and generates SQL + chart config

2. **Review Generated SQL**
   - SQL appears in editor with full context
   - User can modify query as needed

3. **Execute and Visualize**
   - Query runs against mock data
   - Results appear in table format
   - Chart preview generated automatically

4. **Create Dashboard Widget**
   - "Add to Workspace" saves chart as widget
   - Widget appears on dashboard with drag/resize capability

### Cross-Tab Integration

- **💬 Use for Quick Analysis**: Universal button that sends context to chat
- **Fluid Navigation**: Easy movement between tabs with preserved state
- **Shared State**: Zustand ensures data persistence across routes

## 🤖 AI Agent Features

### Metadata-Based Analysis
- **Schema Understanding**: Analyzes table structures and relationships
- **Smart Suggestions**: Pre-computed analysis based on data patterns
- **Query Generation**: Creates optimized SQL from natural language
- **Chart Recommendations**: Suggests appropriate visualization types

### Mock Intelligence
```typescript
// Example AI response structure
{
  sql: "SELECT age_group, diagnosis, COUNT(*) as count...",
  chartConfig: {
    type: 'bar',
    x: 'age_group',
    y: 'count',
    groupBy: 'diagnosis'
  },
  explanation: "Analysis of top diagnoses by age group..."
}
```

## 🎯 Key Components

### ChartPreview
- **Multiple Chart Types**: Bar, line, pie charts
- **Dynamic Data Mapping**: Automatic column detection
- **ECharts Integration**: Professional visualization library
- **Responsive Design**: Adapts to container size

### WidgetCard
- **Visual Variety**: Gradient backgrounds, icon indicators
- **Interactive Actions**: Hover reveals controls
- **Grid Integration**: Works seamlessly with react-grid-layout
- **Context Actions**: Quick analysis button integration

### ChatPanel
- **Rich Messages**: Support for text, SQL, charts
- **Real-time Simulation**: Loading states and response delays
- **Action Buttons**: Copy, run, chart creation
- **Auto-scroll**: Smooth scrolling to new messages

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Pages**: Add to `src/pages/` and update routing
3. **State Management**: Extend `useAppStore.ts`
4. **Mock Data**: Update `mockData.ts` for new scenarios

### Customization

- **Themes**: Modify Tailwind config for color schemes
- **Charts**: Extend ChartPreview for new visualization types
- **Layout**: Adjust grid settings in DashboardsPage
- **AI Responses**: Enhance mockAgentResponse logic

## 📊 Mock Data Structure

### Datasets
```typescript
{
  id: 'healthcare-db',
  name: 'Healthcare Analytics',
  tables: [
    {
      name: 'patients',
      columns: [
        { name: 'patient_id', type: 'INTEGER' },
        { name: 'age_group', type: 'VARCHAR' }
      ],
      rowCount: 12543
    }
  ]
}
```

### Query Results
```typescript
{
  columns: ['age_group', 'diagnosis', 'count'],
  data: [
    ['18-30', 'Hypertension', 245],
    ['31-50', 'Diabetes', 189]
  ],
  totalRows: 6
}
```

## 🔮 Future Enhancements

- **Real Backend Integration**: Replace mocks with actual APIs
- **Advanced Visualizations**: More chart types and customization
- **Collaboration Features**: Share dashboards and analyses
- **Export Capabilities**: PDF/PNG export for reports
- **Advanced SQL**: Syntax highlighting and autocomplete
- **User Management**: Authentication and permissions

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using modern web technologies for the future of data exploration.
# mock
