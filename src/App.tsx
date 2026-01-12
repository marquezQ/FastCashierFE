import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { CashierPage } from './pages/CashierPage';
import { KitchenPage } from './pages/KitchenPage';
import { getRoleRoute } from './constants/roles';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated && user ? (
              <Navigate to={getRoleRoute(user.roleId)} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Cashier */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={['CASHIER']}>
              <CashierPage />
            </ProtectedRoute>
          }
        />

        {/* Kitchen */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allowedRoles={['KITCHEN']}>
              <KitchenPage />
            </ProtectedRoute>
          }
        />

        {/* Root */}
        <Route
          path="/"
          element={
            isAuthenticated && user ? (
              <Navigate to={getRoleRoute(user.roleId)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;