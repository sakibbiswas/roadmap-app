
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/Home' ;
import RoadmapPage from '../pages/RoadmapPage'; // where RoadmapList is shown

const AppRoutes = () => {
  return (
    <Routes>

    
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/roadmaps" element={<RoadmapPage />} />
      {/* Add other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

