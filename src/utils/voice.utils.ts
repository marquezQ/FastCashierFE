/**
 * Utility for Web Speech API Synthesis
 */

/**
 * Intelligent voice selection for Spanish female voices
 */
const getBestSpanishVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        return null;
    }

    // Diagnostic: Log all available voices so the user can see them in F12
    console.log('--- DIAGNÓSTICO DE VOCES DISPONIBLES ---');
    console.table(voices.map(v => ({ name: v.name, lang: v.lang, default: v.default })));

    // Spanish language codes
    const spanishCodes = ['es-ES', 'es-MX', 'es-US', 'es-AR', 'es-CL', 'es-CO', 'es-PE', 'es'];

    // Priority names for female voices (Amigables)
    const femalePriorityNames = [
        'Google español', // Chrome/Android (Muy buena)
        'Google Spanish', // Chrome/Android
        'Helena',         // Windows
        'Sabrina',        // Windows
        'Microsoft Maria', // Windows
        'Monica',         // Linux/macOS
        'Mónica',         // Linux (con acento)
        'Victoria',       // macOS
        'Lucia',          // iOS
        'Lucía',          // iOS
        'Paulina',        // iOS
        'Marisol',        // iOS
        'Zira'            // Windows
    ];

    const spanishVoices = voices.filter(v =>
        spanishCodes.some(code => v.lang.toLowerCase().includes(code.toLowerCase()))
    );

    if (spanishVoices.length === 0) {
        console.warn('No se encontraron voces en Español. Usando la del sistema.');
        return null;
    }

    // 1. Try to find a high-quality female voice from the list
    for (const name of femalePriorityNames) {
        const voice = spanishVoices.find(v =>
            v.name.toLowerCase().includes(name.toLowerCase())
        );
        if (voice) return voice;
    }

    // 2. Heuristic: Look for voices with a "v" or "a" at the end of the name 
    // often used for female voices in some Linux distros
    const likelyFemale = spanishVoices.find(v => v.name.toLowerCase().endsWith('a'));
    if (likelyFemale) return likelyFemale;

    // 3. Last fallback: return the first Spanish voice available
    return spanishVoices[0];
};

export const speakOrderReady = (orderNumber: string, customerName?: string) => {
    if (!('speechSynthesis' in window)) {
        console.error('Web Speech API no disponible en este navegador.');
        return;
    }

    window.speechSynthesis.cancel();

    // Transform "00001" into "1" for natural speech
    const rawId = orderNumber.split('-').pop() || orderNumber;
    const cleanId = parseInt(rawId, 10).toString() || rawId;

    const text = `Pedido ${cleanId} ${customerName ? 'para ' + customerName : ''}, por favor.`;

    const utterance = new SpeechSynthesisUtterance(text);

    const voice = getBestSpanishVoice();
    if (voice) {
        utterance.voice = voice;
        console.log(`%c[Voz Seleccionada]: ${voice.name}`, 'color: #10b981; font-weight: bold;');
    }

    utterance.lang = 'es-ES';
    utterance.rate = 0.8; // Reducido para mayor claridad en Firefox y entornos ruidosos
    utterance.pitch = 1.1; // Tono más agudo para sonar más femenino

    window.speechSynthesis.speak(utterance);
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded/changed. Total available:', voices.length);
    };
}
