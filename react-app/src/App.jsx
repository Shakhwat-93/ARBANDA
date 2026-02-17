import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import CustomerProtectedRoute from './components/customer/CustomerProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));
const AdminShopHero = lazy(() => import('./pages/admin/AdminShopHero'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const ComingSoon = lazy(() => import('./components/admin/ComingSoon'));
const Registration = lazy(() => import('./pages/customer/Registration'));
const Login = lazy(() => import('./pages/customer/Login'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const ForgotPassword = lazy(() => import('./pages/customer/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/customer/ResetPassword'));

function App() {
  return (
    <CurrencyProvider>
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
        <Suspense fallback={
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf0e1' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #fff0e5', borderTop: '3px solid #b08d74', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        }>
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
            <Route path="/admin/hero" element={
              <ProtectedRoute>
                <AdminHero />
              </ProtectedRoute>
            } />
            <Route path="/admin/shop-hero" element={
              <ProtectedRoute>
                <AdminShopHero />
              </ProtectedRoute>
            } />
            {/* Placeholder Routes */}
            <Route path="/admin/analytics" element={<ProtectedRoute><ComingSoon title="Analytics Coming Soon" /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute><ComingSoon title="Inventory Coming Soon" /></ProtectedRoute>} />
            <Route path="/admin/coupons" element={<ProtectedRoute><AdminCoupons /></ProtectedRoute>} />
            <Route path="/admin/integrations" element={<ProtectedRoute><ComingSoon title="Payments Configuration" /></ProtectedRoute>} />
            <Route path="/admin/shipping" element={<ProtectedRoute><ComingSoon title="Shipping Settings" /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
