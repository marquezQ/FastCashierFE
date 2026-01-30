import { useCashierStore } from '@/store/useCashierStore';
import { OpenRegisterForm } from '@/components/cashier/OpenRegisterForm';
import { ProductCatalog } from '@/components/cashier/ProductCatalog';
import { OrderSummary } from '@/components/cashier/OrderSummary';

export const PedidosView = () => {
    const { isSessionActive } = useCashierStore();

    if (!isSessionActive) {
        return <OpenRegisterForm />;
    }



    return (
        <div className="h-full lg:h-[calc(100vh-6rem)] relative">
            <div className="flex flex-col lg:grid lg:h-full gap-4 lg:grid-cols-[1fr_440px]">
                {/* Left Column: Product Catalog */}
                <div className="h-150 lg:h-full overflow-hidden flex flex-col">
                    <ProductCatalog />
                </div>

                {/* Right Column: Order Summary */}
                <div className="h-auto lg:h-full">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};
