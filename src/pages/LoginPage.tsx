import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useLogin } from '@/hooks/useLogin';
import { getRoleRoute } from '@/constants/roles';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';
import { handleLoginError } from '@/utils/error-handlers';

import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending: isLoading } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const auth = await login(data);

      toast.success('Inicio de sesión exitoso', {
        description: `Bienvenido, ${auth.user.fullName}`,
      });
      navigate(getRoleRoute(auth.user.roleId), { replace: true });
    } catch (error) {
      const errorMessage = handleLoginError(error);
      toast.error('Error de autenticación', {
        description: errorMessage,
        duration: 5000,
      });
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