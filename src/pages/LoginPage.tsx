import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { getRoleRoute } from '../constants/roles';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      
      // Obtener el usuario actualizado del store
      const { user } = useAuthStore.getState();
      
      if (user) {
        const route = getRoleRoute(user.roleId);
        navigate(route);
      }
    } catch (err) {
      // Tipar correctamente el error
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Punto de Venta
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          <strong>Usuarios de prueba:</strong>
          <p style={{ margin: '0.5rem 0' }}>👤 Admin: admin@gmail.com / 123456</p>
          <p style={{ margin: '0.5rem 0' }}>💰 Cajero: cashier@gmail.com / 123456</p>
          <p style={{ margin: '0.5rem 0' }}>👨‍🍳 Cocina: cook@gmail.com / 123456</p>
        </div>
      </div>
    </div>
  );
};