import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, User, Mail, Phone, Shield } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { updateUserSchema, type UpdateUserFormValues } from '@/schemas/auth.schema';
import { ROLES } from '@/constants/roles';
import { getRoleNameInSpanish } from '@/utils/role.utils';
import type { UserWithRole } from '@/types/auth';

interface EditUserFormProps {
  user: UserWithRole;
  onSubmit: (data: UpdateUserFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const EditUserForm = ({ user, onSubmit, isLoading, onCancel }: EditUserFormProps) => {
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      roleId: user.roleId,
      isActive: user.isActive,
    },
  });

  // Actualizar valores cuando cambie el usuario
  useEffect(() => {
    form.reset({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      roleId: user.roleId,
      isActive: user.isActive,
    });
  }, [user, form]);

  const handleSubmit = async (data: UpdateUserFormValues) => {
    // Filtrar solo los campos que realmente cambiaron
    const cleanedData: UpdateUserFormValues = {};
    
    if (data.fullName !== undefined && data.fullName.trim() !== '' && data.fullName !== user.fullName) {
      cleanedData.fullName = data.fullName.trim();
    }
    if (data.email !== undefined && data.email.trim() !== '' && data.email !== user.email) {
      cleanedData.email = data.email.trim();
    }
    if (data.phone !== undefined) {
      const phoneValue = data.phone.trim();
      if (phoneValue !== (user.phone || '')) {
        cleanedData.phone = phoneValue || undefined;
      }
    }
    if (data.roleId !== undefined && data.roleId !== user.roleId) {
      cleanedData.roleId = data.roleId;
    }
    if (data.isActive !== undefined && data.isActive !== user.isActive) {
      cleanedData.isActive = data.isActive;
    }

    // Si no hay cambios, mostrar mensaje
    if (Object.keys(cleanedData).length === 0) {
      return;
    }

    await onSubmit(cleanedData);
  };

  // Preparar opciones de roles para el select
  const roleOptions = Object.values(ROLES).map((role) => ({
    id: role.id,
    name: getRoleNameInSpanish(role.name),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Nombre Completo */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Ej: Juan Pérez"
                    className="pl-9 h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="pl-9 h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="tel"
                    placeholder="Ej: 70000001"
                    className="pl-9 h-11"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rol */}
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? field.value.toString() : ''}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Selecciona un rol" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado Activo/Inactivo */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Estado del Usuario</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'El usuario puede acceder al sistema' : 'El usuario no puede acceder al sistema'}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
