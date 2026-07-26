import { Plus, ImageOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Product } from '@/types/products';
import { getProductImageUrl, formatPrice } from '@/utils/product.utils';

interface MobileProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

/**
 * Ultra-compact product card optimized for mobile grids (2-col).
 * No description — only image, name, and price for maximum density.
 * Entire card is tap-to-add with tactile feedback.
 */
export const MobileProductCard = ({ product, onAdd }: MobileProductCardProps) => {
    return (
        <Card
            onClick={() => onAdd(product)}
            className="group relative flex flex-col overflow-hidden cursor-pointer gap-0 py-0
                       border border-border/40 shadow-sm rounded-xl
                       transition-all duration-200 active:scale-95
                       hover:shadow-md hover:ring-2 hover:ring-(--cashier-sidebar-primary)/40"
        >
            {/* Product Image — square aspect for compactness */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
                {product.imageUrl ? (
                    <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

                {/* Tap overlay */}
                <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors duration-150 flex items-center justify-center">
                    <div className="opacity-0 group-active:opacity-100 transition-opacity duration-150">
                        <Plus className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                </div>
            </div>

            {/* Product Info — Name + Price only */}
            <div className="flex flex-col gap-1 p-2.5">
                <h3 className="font-bold text-sm leading-tight line-clamp-2 text-foreground/90">
                    {product.name}
                </h3>
                <span className="text-sm font-bold tabular-nums text-(--cashier-sidebar-primary)">
                    {formatPrice(product.price)}
                </span>
            </div>
        </Card>
    );
};
