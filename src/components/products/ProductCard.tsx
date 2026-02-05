import { Pencil, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/types/products';
import { getProductImageUrl, formatPrice } from '@/utils/product.utils';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export const ProductCard = ({
  product,
  onEdit,
}: ProductCardProps) => {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm gap-0 py-0">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={getProductImageUrl(product)}
            alt={`Imagen de ${product.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop') {
                target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop';
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
            <ImageOff className="size-12 stroke-[1.5]" />
            <span className="text-xs font-bold uppercase tracking-widest">Sin imagen</span>
          </div>
        )}
        {!product.isActive && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Inactivo
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1">
            {product.name}
          </h3>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs ${product.isActive
                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
              }`}
          >
            {product.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Código</p>
            <p className="font-mono text-sm font-medium">{product.code}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Precio</p>
            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 bg-muted/30 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onEdit?.(product)}
          aria-label={`Editar producto ${product.name}`}
        >
          <Pencil className="size-4 mr-2" aria-hidden="true" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
};
