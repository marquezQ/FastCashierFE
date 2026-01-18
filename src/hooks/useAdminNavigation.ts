import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    handleNavigate,
    handleLogout,
  };
};