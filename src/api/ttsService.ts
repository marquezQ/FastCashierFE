export const parseOrderNumber = (orderNumber: string): number => {
    // Si viene como ORD-0045, extramos 0045, luego parseamos a int (45)
    const raw = orderNumber.split('-').pop() || orderNumber;
    return parseInt(raw, 10) || 0;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchOrderAudio = async (orderNumber: string): Promise<string> => {
    const numero = parseOrderNumber(orderNumber);
    const response = await fetch(`${API_URL}/tts/pedido/${numero}`);
    
    if (!response.ok) {
        throw new Error(`TTS fetch failed: ${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
