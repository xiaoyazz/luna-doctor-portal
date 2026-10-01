// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import Settings from "./pages/Settings";

function App() {
  const handleLogout = () => {
    // TODO: wire this up to your auth (Firebase, etc.)
    // For now you can just console.log or redirect.
    console.log("Logout clicked");
  };

  return (
    <Router>
      {/* App shell */}
      <div className="flex min-h-screen bg-slate-50">
        {/* Fixed sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main content area (shifted right by sidebar width) */}
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient/:id" element={<PatientDetail />} />
            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
