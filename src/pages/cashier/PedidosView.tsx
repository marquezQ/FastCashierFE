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
