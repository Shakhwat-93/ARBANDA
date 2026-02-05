import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import ComingSoon from './components/admin/ComingSoon';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Registration from './pages/customer/Registration';
import Login from './pages/customer/Login';
import Profile from './pages/customer/Profile';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import CustomerProtectedRoute from './components/customer/CustomerProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#261a13',
            color: '#fdf0e1',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid #b08d74',
          },
          success: {
            iconTheme: {
              primary: '#b08d74',
              secondary: '#261a13',
            },
          },
        }}
      />
      <Routes>
        {/* Customer Facing Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />

        {/* Customer Auth */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/profile" element={
          <MainLayout>
            <CustomerProtectedRoute>
              <Profile />
            </CustomerProtectedRoute>
          </MainLayout>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute>
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        {/* Placeholder Routes */}
        <Route path="/admin/analytics" element={<ProtectedRoute><ComingSoon title="Analytics Coming Soon" /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute><ComingSoon title="Inventory Coming Soon" /></ProtectedRoute>} />
        <Route path="/admin/coupons" element={<ProtectedRoute><ComingSoon title="Coupons & Discounts" /></ProtectedRoute>} />
        <Route path="/admin/integrations" element={<ProtectedRoute><ComingSoon title="Payments Configuration" /></ProtectedRoute>} />
        <Route path="/admin/shipping" element={<ProtectedRoute><ComingSoon title="Shipping Settings" /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
