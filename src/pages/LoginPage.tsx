import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { getRoleRoute } from '@/constants/roles';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';
import { handleLoginError } from '@/utils/error-handlers';

import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(data);
      const { user } = useAuthStore.getState();
      
      if (user) {
        toast.success('Inicio de sesión exitoso', {
          description: `Bienvenido, ${user.fullName}`,
        });
        navigate(getRoleRoute(user.roleId));
      }
    } catch (error) {
      const errorMessage = handleLoginError(error);
      toast.error('Error de autenticación', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout>
      <LoginForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </LoginLayout>
  );
};