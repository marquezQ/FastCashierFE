import { useState, useEffect, useCallback } from 'react';
import { audioQueue } from '@/utils/audioQueue';
import { fetchOrderAudio } from '@/api/ttsService';

export const useTtsAudio = () => {
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(audioQueue.isUnlocked);

    useEffect(() => {
        const handleUnlockChange = () => {
            setIsAudioUnlocked(audioQueue.isUnlocked);
        };

        audioQueue.addEventListener('unlockchange', handleUnlockChange);
        
        // Comprobación inicial por si cambió antes de montar o durante
        setIsAudioUnlocked(audioQueue.isUnlocked);

        return () => {
            audioQueue.removeEventListener('unlockchange', handleUnlockChange);
        };
    }, []);

    const unlockAudio = useCallback(async () => {
        await audioQueue.unlock();
    }, []);

    const playOrderAudio = useCallback(async (orderNumber: string) => {
        try {
            const blobUrl = await fetchOrderAudio(orderNumber);
            audioQueue.enqueue(blobUrl);
        } catch (error) {
            console.error('Failed to fetch and schedule audio:', error);
        }
    }, []);

    return {
        isAudioUnlocked,
        unlockAudio,
        playOrderAudio,
    };
};
