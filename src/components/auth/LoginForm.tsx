import type { UseFormReturn } from 'react-hook-form';
import { Loader2, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import type { LoginFormValues } from '@/schemas/auth.schema';

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
}

const QUICK_ACCESS_USERS = [
  { email: 'admin@gmail.com', label: 'A', color: 'blue', title: 'Admin' },
  { email: 'cashier@gmail.com', label: 'C', color: 'emerald', title: 'Cajero' },
  { email: 'cook@gmail.com', label: 'K', color: 'orange', title: 'Cocina' },
] as const;

export const LoginForm = ({ form, onSubmit, isLoading }: LoginFormProps) => {
  const handleQuickAccess = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', '123456');
  };

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center">
      {/* Header */}
      <div className="space-y-2 mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight">Iniciar Sesión</h2>
        <p className="text-sm text-muted-foreground">
          Accede a tu panel de control
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="ejemplo@correo.com"
                      className="pl-9 h-11 bg-secondary/10 border-border/60 focus:bg-background transition-all"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    className="h-11 bg-secondary/10 border-border/60 focus:bg-background transition-all"
                    disabled={isLoading}
                    Icon={Lock}
                    iconPosition="left"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 font-semibold text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar al Sistema'
            )}
          </Button>
        </form>
      </Form>

      {/* Quick Access — solo visible en modo demo */}
      {import.meta.env.VITE_APP_MODE === 'demo' && (
        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-[10px] text-center text-muted-foreground mb-4 uppercase tracking-widest font-medium">
            Accesos Rápidos (Demo)
          </p>
          <div className="flex gap-2 justify-center">
            {QUICK_ACCESS_USERS.map((user) => (
              <button
                key={user.email}
                type="button"
                className={`w-8 h-8 rounded-full bg-${user.color}-100 dark:bg-${user.color}-900/40 text-${user.color}-600 dark:text-${user.color}-400 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
                title={`${user.title}: ${user.email}`}
                onClick={() => handleQuickAccess(user.email)}
                disabled={isLoading}
              >
                <span className="text-[10px] font-bold">{user.label}</span>
            </button>
            ))}
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            Pass: <span className="font-mono font-bold">123456</span>
          </p>
        </div>
      )}
    </div>
  );
};