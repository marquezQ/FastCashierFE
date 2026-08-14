import { Pencil, ImageOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/products';
import { getProductImageUrl, formatPrice } from '@/utils/product.utils';

interface MobileProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
}

/**
 * Compact admin product card optimized for mobile grids (2-col).
 * Shows only image, name, price, status and an explicit edit button
 * for maximum density. Editing is triggered only via the button.
 */
export const MobileProductCard = ({ product, onEdit }: MobileProductCardProps) => {
    return (
        <Card
            className="relative flex flex-col overflow-hidden gap-0 py-0
                       border border-border/40 shadow-sm rounded-xl
                       transition-all duration-200"
        >
            {/* Product Image — square aspect for compactness */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
                {product.imageUrl ? (
                    <img
                        src={getProductImageUrl(product)}
                        alt={`Imagen de ${product.name}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop') {
                                target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop';
                            }
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/30 gap-1">
                        <ImageOff className="size-6 stroke-[1.5]" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Sin imagen</span>
                    </div>
                )}

                {/* Status badge — top-right corner */}
                {!product.isActive && (
                    <Badge
                        variant="destructive"
                        className="absolute top-1.5 right-1.5 text-[10px] px-2 py-0.5 shadow-sm"
                    >
                        Inactivo
                    </Badge>
                )}
            </div>

            {/* Product Info — Name + Price only */}
            <div className="flex flex-1 flex-col gap-1 p-2.5">
                <h3 className="font-bold text-sm leading-tight line-clamp-2 text-foreground/90">
                    {product.name}
                </h3>
                <span className="text-sm font-bold tabular-nums text-primary">
                    {formatPrice(product.price)}
                </span>
            </div>

            {/* Edit action — explicit button */}
            <div className="px-2.5 pb-2.5">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 h-9 active:scale-95"
                    onClick={() => onEdit?.(product)}
                    aria-label={`Editar producto ${product.name}`}
                >
                    <Pencil className="size-3.5" />
                    Editar
                </Button>
            </div>
        </Card>
    );
};