/**
 * Utility for Web Speech API Synthesis
 */

/**
 * Intelligent voice selection for Spanish female voices
 */
const getBestSpanishVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) return null;

    // Spanish language codes (Priorizando LATAM sobre España)
    const spanishCodes = ['es-MX', 'es-CO', 'es-AR', 'es-PE', 'es-CL', 'es-US', 'es-ES', 'es'];

    // Priority names for female voices (Basado en tu lista REAL de Edge)
    const femalePriorityNames = [
        //'Salome',         // Colombia (Natural)
        'Dalia',          // Mexico (Natural)
        'Camila',         // Peru (Natural)
        'Paola',          // Venezuela (Natural)
        'Valentina',      // Uruguay (Natural)
        'Ramona',         // Dominican Republic (Natural)
        'Margarita',      // Panama (Natural)
        'Paloma',         // US (Natural - Latino)
        'Ximena',         // Colombia
        'Laura',          // Colombia
        'Sofia',          // Bolivia (Natural)
        'Karina',         // Puerto Rico (Natural)
        'Lorena',         // El Salvador (Natural)
        'Google español', // Chrome Android
        'Elvira',         // España (Natural - Fallback)
    ];

    const spanishVoices = voices.filter(v =>
        spanishCodes.some(code => v.lang.toLowerCase().includes(code.toLowerCase()))
    );

    if (spanishVoices.length === 0) return null;

    // 1. Try to find a high-quality female voice from the list
    for (const name of femalePriorityNames) {
        const voice = spanishVoices.find(v =>
            v.name.toLowerCase().includes(name.toLowerCase())
        );
        if (voice) return voice;
    }

    // 2. Heuristic: Look for voices with a "v" or "a" at the end of the name
    const likelyFemale = spanishVoices.find(v => v.name.toLowerCase().endsWith('a'));
    if (likelyFemale) return likelyFemale;

    return spanishVoices[0];
};

export const speakOrderReady = (orderNumber: string, customerName?: string) => {
    if (!('speechSynthesis' in window)) return;

    // QUITAMOS cancel() para que los mensajes se encolen y no se corten
    // window.speechSynthesis.cancel(); 

    const rawId = orderNumber.split('-').pop() || orderNumber;
    const cleanId = parseInt(rawId, 10).toString() || rawId;

    const text = `Pedido número    ${cleanId} ${customerName ? 'para ' + customerName : ''} porfavor.`;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestSpanishVoice();

    if (voice) {
        utterance.voice = voice;
        // Solo dejamos el log importante y limpio
        console.log(`%c[AUDIO]: #${cleanId} - ${voice.name}`, 'color: #10b981; font-weight: bold;');
    }

    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 2.0; // El máximo permitido por navegadores es 2.0 para evitar errores

    window.speechSynthesis.speak(utterance);
};


if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded/changed. Total available:', voices.length);
    };
}
