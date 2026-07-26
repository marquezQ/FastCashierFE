import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useActiveProducts } from '@/hooks/useActiveProducts';
import { MobileProductCard } from './MobileProductCard';
import { useCashierStore } from '@/store/useCashierStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Mobile-optimized product catalog with:
 * - Full-width horizontal scrollable category chips
 * - Full-width search bar
 * - 2-column compact product grid
 * - Extra bottom padding to clear the FAB
 */
export const MobileProductCatalog = () => {
    const { data: categories, isLoading, error } = useActiveProducts();
    const { addItem } = useCashierStore();
    const [selectedTab, setSelectedTab] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Derive active tab instead of using useEffect to avoid cascading renders
    const activeTab = selectedTab || (categories && categories.length > 0 ? categories[0].idCategory.toString() : '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--cashier-sidebar-primary)" />
                    <p className="cashier-subtitle text-sm">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <p className="text-destructive text-base">Error al cargar los productos</p>
                    <Button onClick={() => window.location.reload()} size="sm">Reintentar</Button>
                </div>
            </div>
        );
    }

    const activeCategory = categories?.find(c => c.idCategory.toString() === activeTab);
    const filteredProducts = activeCategory?.products.filter(p =>
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Category Chips — Full-width horizontal scroll */}
            <div className="shrink-0 px-1 pt-1 pb-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories?.map((category) => (
                        <button
                            key={category.idCategory}
                            onClick={() => setSelectedTab(category.idCategory.toString())}
                            className={cn(
                                'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
                                'border transition-all duration-200 active:scale-95 whitespace-nowrap',
                                activeTab === category.idCategory.toString()
                                    ? 'bg-(--cashier-sidebar-primary) text-(--cashier-sidebar-primary-foreground) border-(--cashier-sidebar-primary) shadow-md shadow-(--cashier-sidebar-primary)/20'
                                    : 'bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted'
                            )}
                        >
                            <Package className="h-3 w-3" />
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar — Full width */}
            <div className="shrink-0 px-2 pb-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar producto..."
                        className="pl-8 h-9 bg-background text-sm rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Grid — 2 columns, scrollable */}
            <div className="flex-1 overflow-y-auto px-2 pb-24">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Package className="h-10 w-10 mb-3 opacity-20" />
                        <p className="text-sm">
                            {searchTerm
                                ? `No se encontraron productos para "${searchTerm}"`
                                : 'No hay productos en esta categoría'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        {filteredProducts.map((product) => (
                            <MobileProductCard
                                key={product.idProduct}
                                product={product}
                                onAdd={addItem}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
