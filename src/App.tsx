import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (to be implemented)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import RiskDetection from './pages/RiskDetection';
import Timeline from './pages/Timeline';
import Records from './pages/Records';
import SOS from './pages/SOS';
import Pharmacy from './pages/Pharmacy';
import Scanner from './pages/Scanner';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/chatbot" element={
                <ProtectedRoute><Chatbot /></ProtectedRoute>
              } />
              <Route path="/risk-detection" element={
                <ProtectedRoute><RiskDetection /></ProtectedRoute>
              } />
              <Route path="/timeline" element={
                <ProtectedRoute><Timeline /></ProtectedRoute>
              } />
              <Route path="/records" element={
                <ProtectedRoute><Records /></ProtectedRoute>
              } />
              <Route path="/sos" element={
                <ProtectedRoute><SOS /></ProtectedRoute>
              } />
              <Route path="/pharmacy" element={
                <ProtectedRoute><Pharmacy /></ProtectedRoute>
              } />
              <Route path="/scanner" element={
                <ProtectedRoute><Scanner /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
              <p>© 2026 SwasthyaSetu (स्वास्थ्यसेतु). Bridging You to Better Health.</p>
              <p className="mt-2">⚠️ This is not a medical diagnosis platform. Please consult a doctor for medical advice.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  </AuthProvider>
  );
}
