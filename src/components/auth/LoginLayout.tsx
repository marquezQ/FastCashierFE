import { Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      {/* Header */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Store className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            FastCashier
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Sistema Profesional de Punto de Venta
        </p>
      </div>

      {/* Card Container */}
      <Card className="w-full max-w-4xl shadow-2xl border-0 overflow-hidden rounded-2xl py-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Image Side */}
            <div className="relative hidden md:flex bg-secondary/20 h-full">
              <img
                src="/images/login-pos.png"
                alt="POS System Illustration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Form Side */}
            {children}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground opacity-50">
        &copy; {new Date().getFullYear()} FastCashier System. v1.0.0
      </p>
    </div>
  );
};