import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/products';
import type { CashierSession } from '../types/cashierSession';
import type { OrderItem } from '../types/order';

interface CashierState {
    // Session State (Synchronized with Backend)
    currentSession: CashierSession | null;
    isSessionActive: boolean;

    // Cart State (Frontend Only)
    orderItems: OrderItem[];

    // Actions
    /**
     * Updates the local session state. 
     * Usually called by React Query hooks after a successful API call.
     */
    setSession: (session: CashierSession | null) => void;

    // Legacy support or utility actions
    openSession: (session: CashierSession) => void;
    closeSession: () => void;

    // Cart Actions
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, delta: number) => void;
    clearCart: () => void;
}

export const useCashierStore = create<CashierState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            isSessionActive: false,
            orderItems: [],

            setSession: (session) => set({
                currentSession: session,
                isSessionActive: !!session && session.status === 'OPEN',
            }),

            openSession: (session) => set({
                currentSession: session,
                isSessionActive: true,
            }),

            closeSession: () => set({
                currentSession: null,
                isSessionActive: false,
                orderItems: [], // Clear cart on session close
            }),

            addItem: (product) => {
                const { orderItems } = get();
                const existingItem = orderItems.find(item => item.idProduct === product.idProduct);

                if (existingItem) {
                    set({
                        orderItems: orderItems.map(item =>
                            item.idProduct === product.idProduct
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        orderItems: [...orderItems, { ...product, quantity: 1 }],
                    });
                }
            },

            removeItem: (productId) => set({
                orderItems: get().orderItems.filter(item => item.idProduct !== productId),
            }),

            updateQuantity: (productId, delta) => {
                set({
                    orderItems: get().orderItems.map(item =>
                        item.idProduct === productId
                            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                            : item
                    ).filter(item => item.quantity > 0),
                });
            },

            clearCart: () => set({ orderItems: [] }),
        }),
        {
            name: 'cashier-storage',
            // Only persist session-related data and cart if needed
            partialize: (state) => ({
                currentSession: state.currentSession,
                isSessionActive: state.isSessionActive,
                orderItems: state.orderItems,
            }),
        }
    )
);
