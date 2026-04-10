class AudioQueueManager extends EventTarget {
    private queue: string[] = [];
    private isPlaying = false;
    private _isUnlocked = false;

    get isUnlocked() {
        return this._isUnlocked;
    }

    async unlock(): Promise<void> {
        if (this._isUnlocked) return;

        try {
            // Reproducir un audio silencioso corto para desbloquear las restricciones de autoplay
            const audio = new Audio();
            // Tiny 1-sample minimal valid WAV file
            audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            
            await audio.play();
            
            this._isUnlocked = true;
            this.dispatchEvent(new Event('unlockchange'));
        } catch (error) {
            console.error('Failed to unlock audio:', error);
            // Even if it fails (e.g. because of improper interaction), we don't crash
        }
    }

    enqueue(blobUrl: string): void {
        this.queue.push(blobUrl);
        if (!this.isPlaying) {
            this.processQueue();
        }
    }

    private async processQueue(): Promise<void> {
        if (this.queue.length === 0) {
            this.isPlaying = false;
            return;
        }

        this.isPlaying = true;
        const currentAudioUrl = this.queue.shift();

        if (!currentAudioUrl) {
            this.processQueue();
            return;
        }

        try {
            const audio = new Audio(currentAudioUrl);
            
            await new Promise<void>((resolve, reject) => {
                audio.onended = () => resolve();
                audio.onerror = (e) => reject(e);
                audio.play().catch(reject);
            });
            
        } catch (error) {
            console.error('Error playing audio from queue:', error);
        } finally {
            // Siempre revocamos la URL para liberar memoria
            URL.revokeObjectURL(currentAudioUrl);
            // Continuamos con el siguiente en la cola independientemente de errores
            this.processQueue();
        }
    }
}

export const audioQueue = new AudioQueueManager();
