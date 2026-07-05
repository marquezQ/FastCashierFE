import { Printer } from 'lucide-react';
import { useCashierStore } from '@/store/useCashierStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const TicketWidthToggle = () => {
    const { ticketWidth, setTicketWidth } = useCashierStore();

    const handleToggle = () => {
        const nextWidth = ticketWidth === '80MM' ? '56MM' : '80MM';
        setTicketWidth(nextWidth);
        toast.info(`Formato de ticket cambiado a ${nextWidth === '80MM' ? '80mm' : '56mm'}`, {
            duration: 2000
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            className="h-9 px-2.5 gap-2 border-border/40 hover:bg-accent rounded-xl transition-all shadow-sm active:scale-95 flex items-center shrink-0"
            aria-label={`Cambiar formato de impresión. Actual: ${ticketWidth === '80MM' ? '80mm' : '56mm'}`}
        >
            <Printer className="h-5 w-5 text-muted-foreground" />
            <Badge 
                variant="secondary" 
                className={`text-sm font-bold px-2 py-0.5 rounded-lg transition-colors ${
                    ticketWidth === '80MM' 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
            >
                {ticketWidth === '80MM' ? '80mm' : '56mm'}
            </Badge>
        </Button>
    );
};
