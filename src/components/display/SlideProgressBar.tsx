import { cn } from '@/lib/utils';

// ============================================
// BARRA DE PROGRESO — Timing del slide
// Tema naranja/ámbar
// ============================================

interface SlideProgressBarProps {
  totalSlides: number;
  activeIndex: number;
  duration: number; // en segundos
  isPaused: boolean;
}

export const SlideProgressBar = ({
  totalSlides,
  activeIndex,
  duration,
  isPaused,
}: SlideProgressBarProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      {/* Progress bar */}
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          key={activeIndex}
          className={cn(
            'h-full rounded-full bg-linear-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(234,88,12,0.5)]',
            isPaused ? 'animate-none' : 'animate-progress'
          )}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: 'linear',
          }}
        />
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-300',
              i === activeIndex
                ? 'h-2.5 w-8 bg-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.6)]'
                : 'h-2 w-2 bg-white/15'
            )}
          />
        ))}
      </div>
    </div>
  );
};
