import { useState } from 'react';
import { Calculator, AlertCircle, Calendar, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/store/authStore';
import { useCashierSession } from '@/hooks/useCashierSession';
import { toast } from 'sonner';

export const OpenRegisterForm = () => {
    const { user } = useAuthStore();
    const { openSession, isOpening } = useCashierSession();
    const [initialCash, setInitialCash] = useState('');
    const [observations, setObservations] = useState('');

    // Set default date formatted for display
    const currentDateDisplay = new Date().toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!initialCash || isNaN(Number(initialCash)) || Number(initialCash) < 0) {
            toast.error('Por favor ingrese un monto inicial válido');
            return;
        }

        if (!user?.idUser) {
            toast.error('Sesión de usuario no válida');
            return;
        }

        try {
            await openSession({
                userId: user.idUser,
                openingDate: new Date().toISOString(),
                initialAmount: Number(initialCash),
                observations: observations.trim() || undefined
            });
        } catch (error) {
            // Error handling is managed by the hook (toast)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                        <Calculator className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-inter">Apertura de Caja</CardTitle>
                    <CardDescription>Inicie su turno de trabajo de forma segura</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Info Box */}
                        <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm border border-border/50">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center text-muted-foreground">
                                    <User className="h-4 w-4 mr-2 text-primary/70" /> Cajero
                                </span>
                                <span className="font-semibold">{user?.fullName || 'Usuario'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2 text-primary/70" /> Fecha y Hora
                                </span>
                                <span className="font-semibold">{currentDateDisplay}</span>
                            </div>
                        </div>

                        {/* Initial Cash Input */}
                        <div className="space-y-2">
                            <Label htmlFor="initialCash" className="text-sm font-semibold">Monto Inicial en Efectivo</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">$</span>
                                <Input
                                    id="initialCash"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="pl-9 h-14 text-xl font-bold bg-muted/30 focus-visible:ring-primary/30"
                                    value={initialCash}
                                    onChange={(e) => setInitialCash(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Dinero físico disponible al momento de abrir</p>
                        </div>

                        {/* Observations Input */}
                        <div className="space-y-2">
                            <Label htmlFor="observations" className="text-sm font-semibold">Observaciones (Opcional)</Label>
                            <Input
                                id="observations"
                                placeholder="Ej: Cambio en monedas, turno mañana..."
                                className="h-11 bg-muted/30"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                            />
                        </div>

                        {/* Warning Box */}
                        <Alert className="bg-primary/5 border-primary/20 rounded-xl">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-bold text-sm">Verificación requerida:</AlertTitle>
                            <AlertDescription className="text-muted-foreground text-xs mt-1">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Cuente cuidadosamente el efectivo inicial</li>
                                    <li>Cualquier diferencia será registrada al cierre</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 flex gap-2 items-center justify-center transition-all active:scale-[0.98]"
                            disabled={isOpening}
                        >
                            {isOpening ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Abriendo Caja...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-5 w-5" />
                                    Abrir Caja y Comenzar
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
