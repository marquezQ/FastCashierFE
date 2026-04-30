import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { CashierPage } from './pages/CashierPage';
import { KitchenPage } from './pages/KitchenPage';
import { DisplayPage } from './pages/DisplayPage';
import { getRoleRoute } from './constants/roles';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================ */}
        {/* RUTA PÚBLICA: LOGIN */}
        {/* ============================================ */}
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

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS: ADMIN */}
        {/* ============================================ */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/*" element={<AdminPage />} />

        </Route>

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS: CASHIER */}
        {/* ============================================ */}
        <Route element={<ProtectedRoute allowedRoles={['CASHIER']} />}>
          <Route path="/cashier/*" element={<CashierPage />} />
        </Route>

        {/* ============================================ */}
        {/* RUTAS PROTEGIDAS: KITCHEN */}
        {/* ============================================ */}
        <Route element={<ProtectedRoute allowedRoles={['KITCHEN']} />}>
          <Route path="/kitchen/*" element={<KitchenPage />} />

        </Route>

        {/* ============================================ */}
        {/* RUTA RAÍZ: REDIRIGIR SEGÚN ESTADO */}
        {/* ============================================ */}
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

        {/* ============================================ */}
        {/* RUTA PÚBLICA: DISPLAY PARA TV */}
        {/* ============================================ */}
        <Route path="/display/:token" element={<DisplayPage />} />

        {/* ============================================ */}
        {/* 404: CUALQUIER OTRA RUTA */}
        {/* ============================================ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;