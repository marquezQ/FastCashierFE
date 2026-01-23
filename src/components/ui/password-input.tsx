import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.ComponentProps<'input'> {
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  Icon?: React.ComponentType<{ className?: string }>;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showIcon = true, iconPosition = 'left', Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = showPassword ? 'text' : 'password';
    const hasLeftIcon = showIcon && iconPosition === 'left' && Icon;
    const hasRightIcon = showIcon && iconPosition === 'right' && Icon;

    return (
      <div className="relative group">
        {hasLeftIcon && (
          <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10" />
        )}
        <Input
          type={inputType}
          className={cn(
            hasLeftIcon && 'pl-9',
            'pr-10', // Espacio para el botón de ojo siempre
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-0 top-0 h-full px-3 hover:bg-transparent',
            'text-muted-foreground hover:text-foreground',
            'focus-visible:ring-0 focus-visible:ring-offset-0'
          )}
          onClick={togglePasswordVisibility}
          disabled={props.disabled}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
