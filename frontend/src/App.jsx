import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import AdminDashboard from './pages/AdminDashboard';
import StoreFront from './pages/StoreFront';
import CartPage from './pages/CartPage';
import InvoicePage from './pages/InvoicePage';
import MyOrdersPage from './pages/MyOrdersPage';
import { CartProvider } from './context/CartContext';

// Redirects to login when not signed in, or when the user lacks the required role
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><StoreFront /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
