import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Levels from './pages/Levels';
import Stations from './pages/Stations';
import Attendance from './pages/Attendance';
import ManpowerRequirement from './pages/ManpowerRequirement';
import BufferManpower from './pages/BufferManpower';
import Attrition from './pages/Attrition';
import Reports from './pages/Reports';
import SkillMatrix from './pages/SkillMatrix';
import Training from './pages/Training';
import ActionPlan from './pages/ActionPlan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="levels" element={<Levels />} />
          <Route path="stations" element={<Stations />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="manpower" element={<ManpowerRequirement />} />
          <Route path="buffer" element={<BufferManpower />} />
          <Route path="attrition" element={<Attrition />} />
          <Route path="reports" element={<Reports />} />
          <Route path="skill-matrix" element={<SkillMatrix />} />
          <Route path="training" element={<Training />} />
          <Route path="action-plans" element={<ActionPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
