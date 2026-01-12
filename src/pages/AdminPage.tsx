import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>🔧 Panel Administrador</h1>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <p><strong>Usuario:</strong> {user?.fullName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Rol:</strong> Administrador</p>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>

        <div style={{ marginTop: '2rem', color: '#666' }}>
          <h3>Módulos disponibles:</h3>
          <ul>
            <li>✅ Gestión de usuarios</li>
            <li>✅ Gestión de productos</li>
            <li>✅ Ver todas las órdenes</li>
            <li>✅ Gestión de turnos</li>
            <li>✅ Reportes y estadísticas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};