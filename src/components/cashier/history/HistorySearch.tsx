import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface HistorySearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const HistorySearch = ({ value, onChange }: HistorySearchProps) => {
    return (
        <Card className="border-green-100 dark:border-green-900 shadow-sm mx-2">
            <CardContent className="p-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                    <Input
                        placeholder="Buscar por # de pedido o cliente..."
                        className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
