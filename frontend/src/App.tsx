import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

// Auth Pages (full-page, no navbar)
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAuthorsPage } from './pages/admin/AdminAuthorsPage';
import { AdminPublishersPage } from './pages/admin/AdminPublishersPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPurchaseReceiptsPage } from './pages/admin/AdminPurchaseReceiptsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* ── Auth Routes (full-page split layout, no Navbar/Footer) ── */}
              <Route element={<AuthLayout />}>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* ── Customer Routes inside MainLayout (Navbar + Footer) ── */}
              <Route element={<MainLayout />}>
                <Route path="/"          element={<HomePage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/cart"      element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ── Admin Routes inside AdminLayout ── */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index         element={<AdminDashboardPage />} />
                <Route path="books"            element={<AdminBooksPage />} />
                <Route path="categories"       element={<AdminCategoriesPage />} />
                <Route path="authors"          element={<AdminAuthorsPage />} />
                <Route path="publishers"       element={<AdminPublishersPage />} />
                <Route path="orders"           element={<AdminOrdersPage />} />
                <Route path="purchase-receipts" element={<AdminPurchaseReceiptsPage />} />
                <Route path="inventory"        element={<AdminInventoryPage />} />
                <Route path="customers"        element={<AdminCustomersPage />} />
              </Route>

              {/* ── Catch-all ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
