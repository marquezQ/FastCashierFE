import type { DisplayProduct } from '@/types/display';
import { getProductImageUrl, formatPrice } from '@/utils/product.utils';
import { UtensilsCrossed } from 'lucide-react';

// ============================================
// CARD DE PRODUCTO — Vista TV
// Layout: Image (top) → Name → Price → Description
// Inspirado en diseño de menú digital premium
// ============================================

interface DisplayProductCardProps {
  product: DisplayProduct;
  showPrice: boolean;
  showDescription: boolean;
  totalInSlide: number;
}

export const DisplayProductCard = ({
  product,
  showPrice,
  showDescription,
  totalInSlide,
}: DisplayProductCardProps) => {
  const imageUrl = getProductImageUrl(product);

  // Sizing scale based on how many products share the slide
  const isSingle = totalInSlide === 1;
  const isCompact = totalInSlide >= 5;

  return (
    <div className="group relative flex flex-col h-full w-full transition-transform duration-700 hover:scale-[1.02]">
      {/* ========== Image Section ========== */}
      <div
        className="relative overflow-hidden shrink-0 w-full rounded-3xl"
        style={{
          height: isSingle ? '65%' : isCompact ? '50%' : '60%',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 ease-[cubic-bezier(0.16,1,0.3,1)]"
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/2">
            <UtensilsCrossed
              className="text-white/6"
              style={{
                width: isCompact ? '3rem' : '5rem',
                height: isCompact ? '3rem' : '5rem',
              }}
            />
          </div>
        )}

        {/* Bottom gradient fade into card bg */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0a0a0e] via-[#0a0a0e]/60 to-transparent" />
      </div>

      {/* ========== Content Section ========== */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4 pb-4 pt-2 min-h-0 gap-1">
        {/* Product Name */}
        <h3
          className="font-black uppercase tracking-wide text-white leading-tight w-full"
          style={{
            fontSize: isSingle
              ? 'clamp(1.5rem, 3vw, 2.5rem)'
              : isCompact
                ? 'clamp(0.75rem, 1.2vw, 1rem)'
                : 'clamp(0.875rem, 1.6vw, 1.5rem)',
          }}
        >
          {product.name}
        </h3>

        {/* Price */}
        {showPrice && (
          <p
            className="font-black tabular-nums tracking-tight text-orange-500 leading-none"
            style={{
              fontSize: isSingle
                ? 'clamp(2.5rem, 5vw, 4.5rem)'
                : isCompact
                  ? 'clamp(1.25rem, 2vw, 1.75rem)'
                  : 'clamp(1.5rem, 3vw, 2.75rem)',
            }}
          >
            {formatPrice(product.price)}
          </p>
        )}

        {/* Description */}
        {showDescription && product.description && (
          <p
            className="uppercase text-white/35 font-medium leading-snug w-full line-clamp-2"
            style={{
              fontSize: isSingle
                ? 'clamp(0.75rem, 1.2vw, 1.1rem)'
                : isCompact
                  ? 'clamp(0.5rem, 0.7vw, 0.65rem)'
                  : 'clamp(0.55rem, 0.9vw, 0.85rem)',
            }}
          >
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
};
