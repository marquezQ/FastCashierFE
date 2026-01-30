import { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useActiveProducts } from '@/hooks/useActiveProducts';
import { CashierProductCard } from '@/components/products/CashierProductCard';
import { useCashierStore } from '@/store/useCashierStore';


export const ProductCatalog = () => {
    const { data: categories, isLoading, error } = useActiveProducts();
    const { addItem } = useCashierStore();
    const [activeTab, setActiveTab] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Set initial tab
    useEffect(() => {
        if (categories && categories.length > 0 && !activeTab) {
            setActiveTab(categories[0].idCategory.toString());
        }
    }, [categories, activeTab]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--cashier-sidebar-primary)"></div>
                    <p className="text-muted-foreground">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <p className="text-destructive text-lg">Error al cargar los productos</p>
                    <Button onClick={() => window.location.reload()}>Reintentar</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-auto w-full">
                <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                    <div className="overflow-x-auto pb-2 shrink-0 max-w-[70%] scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                        <TabsList className="h-9 p-1 bg-muted/50 inline-flex justify-start w-max">
                            {categories?.map((category) => (
                                <TabsTrigger
                                    key={category.idCategory}
                                    value={category.idCategory.toString()}
                                    className="px-3 whitespace-nowrap text-xs gap-2 data-[state=active]:bg-(--cashier-sidebar-primary)! data-[state=active]:text-(--cashier-sidebar-primary-foreground)!"
                                >
                                    <Package className="h-3.5 w-3.5" />
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="relative flex-1 min-w-50">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar..."
                            className="pl-8 h-9 bg-background text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-2">
                    {categories?.map((category) => (
                        <TabsContent key={category.idCategory} value={category.idCategory.toString()} className="mt-0 h-full">
                            {category.products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <Package className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No hay productos en esta categoría</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {category.products
                                        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((product) => (
                                            <CashierProductCard
                                                key={product.idProduct}
                                                product={product}
                                                onAdd={(p) => addItem(p)}
                                            />
                                        ))}
                                    {searchTerm && category.products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                        <div className="col-span-full py-12 text-center text-muted-foreground">
                                            No se encontraron productos que coincidan con "{searchTerm}" en esta categoría
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
};
