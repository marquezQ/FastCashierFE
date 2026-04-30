import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { DisplayData, TransitionType, DisplayProduct } from '@/types/display';
import { DisplayProductCard } from './DisplayProductCard';
import { SlideProgressBar } from './SlideProgressBar';

// ============================================
// CARRUSEL DE PRODUCTOS — Vista TV
// Diseño premium: fondo negro/naranja, cards verticales
// ============================================

interface ProductCarouselProps {
  data: DisplayData;
}

// ========================================
// Variantes de animación por tipo
// ========================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const fadeVariants = {
  enter: {
    opacity: 0,
    scale: 0.96,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
  },
};

const zoomVariants = {
  enter: {
    opacity: 0,
    scale: 0.8,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.1,
  },
};

const getVariants = (type: TransitionType) => {
  switch (type) {
    case 'slide':
      return slideVariants;
    case 'fade':
      return fadeVariants;
    case 'zoom':
      return zoomVariants;
    default:
      return slideVariants;
  }
};

const getTransition = (type: TransitionType): import('motion/react').Transition => {
  switch (type) {
    case 'slide':
      return { type: 'tween', duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] };
    case 'fade':
      return { duration: 0.8, ease: 'easeInOut' };
    case 'zoom':
      return { duration: 0.7, ease: [0.16, 1, 0.3, 1] };
    default:
      return { duration: 0.6 };
  }
};

// ========================================
// Componente principal
// ========================================

export const ProductCarousel = ({ data }: ProductCarouselProps) => {
  const { config, products, categoryName } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Agrupar productos en slides
  const slides = useMemo(() => {
    const result: DisplayProduct[][] = [];
    for (let i = 0; i < products.length; i += config.productsPerSlide) {
      result.push(products.slice(i, i + config.productsPerSlide));
    }
    return result;
  }, [products, config.productsPerSlide]);

  const totalSlides = slides.length;

  // Auto-rotación
  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(goToNext, config.rotationInterval * 1000);
    return () => clearInterval(timer);
  }, [goToNext, config.rotationInterval, totalSlides]);

  const variants = getVariants(config.transitionType);
  const transition = getTransition(config.transitionType);
  const currentSlide = slides[activeIndex] ?? [];
  const productsInSlide = currentSlide.length;

  // Stagger para cards individuales dentro del zoom
  const cardStagger = config.transitionType === 'zoom' ? 0.08 : 0;

  // Dynamic gap based on product count
  const getGap = () => {
    if (productsInSlide <= 2) return 'gap-12 lg:gap-16';
    if (productsInSlide <= 4) return 'gap-6 lg:gap-8';
    return 'gap-4';
  };

  // Dynamic padding based on product count to ensure cards are wide
  const getPadding = () => {
    if (productsInSlide === 1) return 'px-[20vw]';
    if (productsInSlide === 2) return 'px-[10vw]';
    if (productsInSlide <= 4) return 'px-[4vw]';
    return 'px-[2vw]';
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0e]">
      {/* ========== Fondo Negro/Naranja Premium ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(234,88,12,0.15),transparent_60%)]" />
        {/* Orb izquierdo naranja */}
        <div className="absolute -top-[15%] -left-[8%] h-[60vh] w-[60vh] rounded-full bg-orange-600/15 blur-[120px]" />
        {/* Orb derecho ámbar */}
        <div className="absolute -bottom-[15%] -right-[8%] h-[60vh] w-[60vh] rounded-full bg-amber-500/10 blur-[120px]" />
        {/* Glow central sutil */}
        <div className="absolute top-1/2 left-1/2 h-[40vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/4 blur-[100px]" />
      </div>

      {/* ========== Header ========== */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-12 shrink-0 h-[10vh] min-h-16">
        {/* Nombre de la pantalla */}
        <h1 className="text-2xl lg:text-3xl font-black tracking-widest text-orange-500 uppercase">
          {config.name}
        </h1>

        {/* Categoría */}
        <h2 className="text-xl lg:text-2xl font-black tracking-widest text-white/40 uppercase">
          {categoryName}
        </h2>
      </header>

      {/* ========== Línea separadora ========== */}
      <div className="relative z-10 mx-8 lg:mx-12">
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* ========== Área del carrusel ========== */}
      <main className="relative z-10 flex-1 flex items-center justify-center overflow-hidden py-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition as any}
            className={`w-full h-full flex items-stretch ${getPadding()}`}
          >
            <div
              className={`grid w-full h-full items-stretch justify-items-center mx-auto ${getGap()}`}
              style={{
                gridTemplateColumns: `repeat(${productsInSlide}, 1fr)`,
                maxWidth: '100%',
              }}
            >
              {currentSlide.map((product, i) => (
                <motion.div
                  key={product.idProduct}
                  className="flex min-w-0 w-full h-full justify-center"
                  initial={
                    config.transitionType === 'zoom'
                      ? { opacity: 0, scale: 0.8, y: 30 }
                      : undefined
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: cardStagger * i,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  } as any}
                >
                  <DisplayProductCard
                    product={product}
                    showPrice={config.showPrices}
                    showDescription={config.showDescriptions}
                    totalInSlide={productsInSlide}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ========== Footer con progress bar ========== */}
      {totalSlides > 1 && (
        <footer className="relative z-10 px-8 lg:px-12 h-[8vh] min-h-12 max-h-20 flex items-center shrink-0">
          <SlideProgressBar
            totalSlides={totalSlides}
            activeIndex={activeIndex}
            duration={config.rotationInterval}
            isPaused={false}
          />
        </footer>
      )}
    </div>
  );
};
