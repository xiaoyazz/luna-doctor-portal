// src/App.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";


// ======================================================
// Logged-in Doctor Portal
// ======================================================

function DoctorPortal({
  onLogout,
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed sidebar */}
      <Sidebar
        onLogout={onLogout}
      />

      {/* Main content */}
      <main className="flex-1 ml-64">
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/patient/:id"
            element={<PatientDetail />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}


// ======================================================
// Main App
// ======================================================

function App() {
  const [user, setUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);


  // ====================================================
  // Listen for Firebase login / logout
  // ====================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);
          setAuthLoading(false);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);


  // ====================================================
  // Logout
  // ====================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };


  // ====================================================
  // Wait for Firebase to check saved login session
  // ====================================================

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Loading...
        </p>
      </div>
    );
  }


  // ====================================================
  // Routes
  // ====================================================

  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login />
            )
          }
        />


        {/* Protected Doctor Portal */}
        <Route
          path="/*"
          element={
            user ? (
              <DoctorPortal
                onLogout={
                  handleLogout
                }
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;