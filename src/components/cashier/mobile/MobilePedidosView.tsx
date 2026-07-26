import { useState } from 'react';
import { MobileProductCatalog } from './MobileProductCatalog';
import { MobileCartFAB } from './MobileCartFAB';
import { MobileCartSheet } from './MobileCartSheet';

/**
 * Mobile-optimized pedidos view wrapper.
 * Orchestrates the full-screen product catalog, the floating cart FAB,
 * and the bottom-drawer cart sheet.
 */
export const MobilePedidosView = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
            {/* Full-screen product catalog */}
            <MobileProductCatalog />

            {/* Floating cart button — always visible */}
            <MobileCartFAB onClick={() => setIsCartOpen(true)} />

            {/* Bottom drawer cart with checkout */}
            <MobileCartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
};
