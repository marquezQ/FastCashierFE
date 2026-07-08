import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schemas/auth.schema';
import { useChangePassword } from '@/hooks/useChangePassword';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordViewProps {
  role: 'ADMIN' | 'CASHIER' | 'KITCHEN';
}

export const ChangePasswordView = ({ role }: ChangePasswordViewProps) => {
  const changePassword = useChangePassword();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      // Éxito: el backend invalida el JWT al cambiar la contraseña.
      // Hacemos logout limpio y redirigimos al login.
      toast.success('Contraseña actualizada. Por favor inicia sesión con tu nueva contraseña.', {
        duration: 4000,
      });
      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // El interceptor de Axios maneja los 401 (JWT expirado) automáticamente.
      // Aquí solo manejamos errores de negocio: 422 (contraseña incorrecta), 400 (validación).
      const apiMessage = error?.response?.data?.message;
      const rawMessage = Array.isArray(apiMessage)
        ? apiMessage.join(', ')
        : apiMessage || error?.message || 'Error al cambiar la contraseña';

      let userFriendlyMessage = rawMessage;
      if (rawMessage.toLowerCase().includes('current password is incorrect')) {
        userFriendlyMessage = 'La contraseña actual es incorrecta.';
      } else if (rawMessage.toLowerCase().includes('must be longer than or equal to 6')) {
        userFriendlyMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
      }

      toast.error(userFriendlyMessage);
    }
  };

  const theme = {
    ADMIN: {
      h1: 'admin-h1',
      subtitle: 'admin-subtitle',
      label: 'admin-label-sm',
      btnClass: 'bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-ring',
      cardBorder: 'border-border/40',
    },
    CASHIER: {
      h1: 'cashier-h1',
      subtitle: 'cashier-subtitle',
      label: 'cashier-label-sm',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500/50',
      cardBorder: 'border-emerald-500/20 dark:border-emerald-500/10',
    },
    KITCHEN: {
      h1: 'text-3xl md:text-4xl font-black text-orange-600 dark:text-orange-400 tracking-tight',
      subtitle: 'text-muted-foreground font-medium mt-1 text-sm md:text-base',
      label: 'text-[10px] font-black uppercase text-orange-500/70 tracking-widest',
      btnClass: 'bg-orange-600 hover:bg-orange-700 text-white focus-visible:ring-orange-500/50',
      cardBorder: 'border-orange-500/20 dark:border-orange-500/10',
    },
  }[role];

  return (
    <div className="space-y-6 max-w-lg mx-auto py-8">
      <div>
        <h1 className={theme.h1}>Cambiar Contraseña</h1>
        <p className={theme.subtitle}>
          Actualiza tu contraseña para mantener tu cuenta segura
        </p>
      </div>

      <Card className={cn('shadow-card rounded-2xl', theme.cardBorder)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <KeyRound className="size-5 text-muted-foreground" />
            Actualizar Credenciales
          </CardTitle>
          <CardDescription>
            Introduce tu contraseña actual y define tu nueva contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Contraseña Actual */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme.label}>Contraseña Actual</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        disabled={changePassword.isPending}
                        Icon={Lock}
                        iconPosition="left"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nueva Contraseña */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme.label}>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        disabled={changePassword.isPending}
                        Icon={Lock}
                        iconPosition="left"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar Nueva Contraseña */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme.label}>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        className="h-11"
                        disabled={changePassword.isPending}
                        Icon={Lock}
                        iconPosition="left"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botones */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={changePassword.isPending}
                  className={cn(
                    'h-11 px-8 rounded-lg transition-all active:scale-95 font-semibold',
                    theme.btnClass
                  )}
                >
                  {changePassword.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Cambiar contraseña'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
