import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard'
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F4F4FC', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
            <Route path="/patients" element={<div>Patients Directory Placeholder</div>} />
            <Route path="/settings" element={<div>Settings Placeholder</div>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;