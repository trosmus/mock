import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardsPage from './pages/DashboardsPage';
import SQLPage from './pages/SQLPage';
import ChatPage from './pages/ChatPage';
import VisualizationBuilderPage from './pages/ChartBuilderPage';
import AdminPage from './pages/AdminPage';
import CanvasPage from './pages/CanvasPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboards" replace />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/sql" element={<SQLPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chart-builder" element={<VisualizationBuilderPage />} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
