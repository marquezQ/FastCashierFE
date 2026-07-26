import { ProductCatalog } from '@/components/cashier/ProductCatalog';
import { OrderSummary } from '@/components/cashier/OrderSummary';
import { MobilePedidosView } from '@/components/cashier/mobile/MobilePedidosView';
import { useIsMobile } from '@/hooks/useIsMobile';

export const PedidosView = () => {
    const isMobile = useIsMobile();

    // Mobile: fully optimized view with FAB + bottom drawer cart
    if (isMobile) return <MobilePedidosView />;

    // Desktop/Tablet: existing side-by-side layout (unchanged)
    return (
        <div className="h-full md:h-[calc(100vh-6rem)] relative">
            <div className="flex flex-col md:grid md:h-full gap-4 md:grid-cols-[1fr_400px]">
                {/* Left Column: Product Catalog */}
                <div className="@container/catalog h-150 md:h-full overflow-hidden flex flex-col">
                    <ProductCatalog />
                </div>

                {/* Right Column: Order Summary */}
                <div className="h-auto md:h-full">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};
