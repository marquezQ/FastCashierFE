import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/products';
import { getProductImageUrl, formatPrice } from '@/utils/product.utils';

interface CashierProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export const CashierProductCard = ({
    product,
    onAdd,
}: CashierProductCardProps) => {
    return (
        <Card
            onClick={() => onAdd(product)}
            className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-0 shadow-sm gap-0 py-0 cursor-pointer hover:ring-2 hover:ring-(--cashier-sidebar-primary)/50"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                    src={getProductImageUrl(product)}
                    alt={`Imagen de ${product.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Fallback to a placeholder if image fails
                        if (target.src !== 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop') {
                            target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop';
                        }
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <span className="text-white font-medium flex items-center gap-2">
                        <Plus className="h-5 w-5" /> Agregar
                    </span>
                </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-4 gap-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground/90 group-hover:text-(--cashier-sidebar-primary) transition-colors">
                        {product.name}
                    </h3>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                    {product.description}
                </p>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-(--cashier-sidebar-primary)">
                        {formatPrice(product.price)}
                    </span>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-(--cashier-sidebar-primary)/10 text-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary) hover:text-white"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
